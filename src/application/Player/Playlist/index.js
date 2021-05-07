import React, {useCallback, useRef, useState} from "react";
import {connect} from "react-redux";
import {ListHeader, PlaylistWrapper, ScrollWrapper, ListContent, ListItem} from "./style";
import Scroll from "../../../baseUI/scroll";
import Confirm from "../../../baseUI/Confirm";
import {
  changeShowPlaylist,
  changePlayMode,
  changeCurrentIndex,
  changeCurrentSong,
  changeSequencePlaylist,
  changePlayingState,
  changePlaylist,
  deleteSong
} from "../store/actionCreators";
import {
  prefixStyle,
  getName,
  shuffle,
  findIndex
} from "../../../api/utils";
import {CSSTransition} from "react-transition-group";

function Playlist(props) {
  const {
    showPlaylist,
    currentIndex,
    currentSong: immutableCurrentSong,
    mode,
    playlist: immutablePlaylist,
    sequencePlaylist: immutableSequencePlaylist
  } = props;
  const {
    toggleShowPlaylistDispatch,
    changeModeDispatch,
    changePlaylistDispatch,
    changeCurrentIndexDispatch,
    deleteSongDispatch,
    clearDispatch
  } = props;

  const playlist = immutablePlaylist.toJS();
  const sequencePlaylist = immutableSequencePlaylist.toJS();
  const currentSong = immutableCurrentSong.toJS();

  const [isShow, setIsShow] = useState(false);
  // 是否允许滑动事件生效
  const [canTouch, setCanTouch] = useState(true);

  const playlistRef = useRef();
  const listWrapperRef = useRef();
  const listContentRef = useRef();
  const confirmRef = useRef();
  //touchStart 后记录 y 值
  const startY = useRef(0);
  //touchStart 事件是否已经被触发
  const initialed = useRef(false);
  // 用户下滑的距离
  const distance = useRef(0);


  const transform = prefixStyle("transform");
  const onEnterCB = useCallback(() => {
    setIsShow(true);
    listWrapperRef.current.style[transform] = `translate3d(0,100%,0)`;
  }, [transform]);

  const onEnteringCB = useCallback(() => {
    listWrapperRef.current.style['transition'] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0,0,0)`;
  }, [transform]);

  const onExitCB = useCallback(() => {
    listWrapperRef.current.style["transition"] = "all 0.3s";
    listWrapperRef.current.style[transform] = `translate3d(0,100%,0)`;
  }, [transform]);

  const onExitedCB = useCallback(() => {
    setIsShow(false);
    listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
  }, [transform]);

  const getPlayMode = () => {
    let icon, text;
    if (mode === 0) {
      icon = "&#xe625;";
      text = "顺序播放";
    } else if (mode === 1) {
      icon = "&#xe653;";
      text = "单曲循环";
    } else {
      icon = "&#xe61b;";
      text = "随机播放";
    }
    return [icon, text];
  }

  // 是否为当前播放歌曲, 若是，则返回一个播放icon
  const getCurrentIcon = (item) => {
    const isCurrent = currentSong.id === item.id;
    const className = isCurrent ? "icon-playing" : "";
    const content = isCurrent ? '&#xe6e3;' : '';
    return (
      <i
        className={`current iconfont ${className}`}
        dangerouslySetInnerHTML={{__html: content}}
      />
    )
  }

  // 点击切歌
  const handleChangeCurrentIndex = (index) => {
    if (index === currentIndex) return
    changeCurrentIndexDispatch(index);
  }

  // 删除歌曲
  const handleDeleteSong = (song) => {
    deleteSongDispatch(song);
  }

  // 清空
  const handleShowClear = () => {
    confirmRef.current.show();
  }
  const handleConfirmClear = () => {
    clearDispatch();
  }

  // 切换播放模式
  const handleChangeMode = () => {
    let newMode = (mode + 1) % 3;
    if (newMode === 0) {
      // 顺序模式
      changePlaylistDispatch(sequencePlaylist);
      let index = findIndex(currentSong, sequencePlaylist);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      // 单曲循环
      changePlaylistDispatch(sequencePlaylist);
    } else if (newMode === 2) {
      // 随机播放
      let newList = shuffle(sequencePlaylist);
      let index = findIndex(currentSong, newList);
      changePlaylistDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  // 下滑关闭回调
  const handleTouchStart = (e) => {
    if (!canTouch || initialed.current) return;
    listWrapperRef.current.style["transition"] = "";
    startY.current = e.nativeEvent.touches[0].pageY;// 记录 y 值
    initialed.current = true;
  };
  const handleTouchMove = (e) => {
    if (!canTouch || !initialed.current) return;
    let distance_move = e.nativeEvent.touches[0].pageY - startY.current;
    if (distance_move < 0) return;
    distance.current = distance_move;// 记录下滑距离
    listWrapperRef.current.style.transform = `translate3d(0, ${distance.current}px, 0)`;
  };
  const handleTouchEnd = (e) => {
    initialed.current = false;
    // 这里设置阈值为 150px
    if (distance.current >= 150) {
      // 大于 150px 则关闭 PlayList
      toggleShowPlaylistDispatch(false);
    } else {
      // 否则反弹回去
      listWrapperRef.current.style["transition"] = "all 0.3s";
      listWrapperRef.current.style[transform] = `translate3d(0px, 0px, 0px)`;
    }
  };

  //
  const handleScroll = (pos) => {
    // 只有当内容偏移量为 0 的时候才能下滑关闭 PlayList。否则一边内容在移动，一边列表在移动，出现 bug
    let state = pos.y === 0;
    setCanTouch(state);
  }
  return (
    <CSSTransition
      in={showPlaylist}
      timeout={300}
      classNames="list-fade" // 此className用于给css中的动画指明应用的元素
      onEnter={onEnterCB} // 进入前的准备回调
      onEntering={onEnteringCB} // 进入时的回调
      onExit={onExitCB}
      onExited={onExitedCB}
    >
      <PlaylistWrapper
        style={isShow ? {display: "block"} : {display: "none"}}
        onClick={() => toggleShowPlaylistDispatch(false)}
        ref={playlistRef}
      >
        <div
          className="list_wrapper"
          ref={listWrapperRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <ListHeader>
            {/*显示当前播放模式的图标，点击可以改变播放模式*/}
            <div
              className="icon-wrapper change-mode"
              onClick={(e) => {
                e.stopPropagation();
                handleChangeMode();
              }}
            >
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{__html: getPlayMode()[0]}}
              />
            </div>
            {/* 显示播放模式文字*/}
            <h1 className="title">
              {getPlayMode()[1]}
            </h1>
            {/*移除当前播放列表*/}
            <div className="icon-wrapper delete-all"
                 onClick={(e) => {
                   handleShowClear();
                   e.stopPropagation();
                 }}>
              <i className="iconfont">&#xe63d;</i>
            </div>
          </ListHeader>
          <ScrollWrapper>
            <Scroll
              ref={listContentRef}
              onScroll={pos => handleScroll(pos)}
              bounceTop={false}
            >
              <ListContent>
                {
                  playlist.map((item, index) => {
                    return (
                      <ListItem
                        key={item.id}
                        onClick={(e) => {
                          handleChangeCurrentIndex(index)
                          // 防止点击切歌时ListItem组件的点击事件冒泡到容器上导致列表被关闭
                          e.stopPropagation();
                        }}
                      >
                        {/*歌名*/}
                        <div
                          className="text"
                        >
                          {getCurrentIcon(item)}
                          <span className="music_name">{item.name}</span>
                        </div>
                        {/*喜欢和删除按钮*/}
                        <div className="icon-wrapper">
                          <span className="like">
                            <i className="iconfont">&#xe601;</i>
                          </span>
                          <span className="delete">
                            <i
                              className="iconfont"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSong(item)
                              }}
                            >&#xe63d;</i>
                          </span>
                        </div>
                      </ListItem>
                    )
                  })
                }
              </ListContent>
            </Scroll>
          </ScrollWrapper>
        </div>
        <Confirm
          ref={confirmRef}
          text={"是否删除全部？"}
          cancelBtnText={"取消"}
          confirmBtnText={"确定"}
          handleConfirm={handleConfirmClear}
        />
      </PlaylistWrapper>
    </CSSTransition>
  )
}

const mapStateToProps = ((state) => {
  return {
    showPlaylist: state.getIn(['player', 'showPlaylist']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    currentSong: state.getIn(['player', 'currentSong']),
    playlist: state.getIn(['player', 'playlist']),
    sequencePlaylist: state.getIn(['player', 'sequencePlaylist']),
    mode: state.getIn(['player', 'mode']),
  }
});

const mapDispatchToProps = ((dispatch) => {
  return {
    toggleShowPlaylistDispatch(data) {
      dispatch(changeShowPlaylist(data))
    },
    changeModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    changePlaylistDispatch(data) {
      dispatch(changePlaylist(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    deleteSongDispatch(data) {
      dispatch(deleteSong(data))
    },
    clearDispatch() {
      // 1. 清空两个列表
      dispatch(changePlaylist([]));
      dispatch(changeSequencePlaylist([]));
      // 2. 初始 currentIndex
      dispatch(changeCurrentIndex(-1));
      // 3. 关闭 PlayList 的显示
      dispatch(changeShowPlaylist(false));
      // 4. 将当前歌曲置空
      dispatch(changeCurrentSong({}));
      // 5. 重置播放状态
      dispatch(changePlayingState(false));
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Playlist));