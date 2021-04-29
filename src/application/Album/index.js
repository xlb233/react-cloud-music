import style from "../../assets/global-style"
import React, {useEffect, useRef, useState, useCallback} from "react";
import {Container, TopDesc, Menu} from "./style";
// react-transition-group是常用第三方动画库
import {CSSTransition} from 'react-transition-group'
// 引入header组件
import Header from "../../baseUI/header";
// 引入SongsList组件
import SongsList from "../SongsList";
// 引入scroll插件
import Scroll from "../../baseUI/scroll";

import {connect} from "react-redux";

import {isEmptyObject} from "../../api/utils"
import {getAlbumList, changeEnterLoading} from "./store/actionCreators";
import Loading from '../../baseUI/loading/index';
import MusicNote from "../../baseUI/musicNote";

function Album(props) {
  const [showStatus, setShowStatus] = useState(true)
  const [title, setTitle] = useState("歌单")
  const [isMarquee, setIsMarquee] = useState(false)
  const headerEL = useRef();   // headerContainer组件的ref
  const musicNoteRef = useRef(); // 音符陨落组件的ref
  const musicNoteAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({x, y});
  };
  const id = props.match.params.id;
  const {currentAlbum: currentAlbumImmutable, enterLoading, playlistCount} = props;
  const {getAlbumDataDispatch} = props;
  useEffect(() => {
    getAlbumDataDispatch(id);
  }, [getAlbumDataDispatch, id]);
  let currentAlbum = currentAlbumImmutable.toJS();

  // 点击后退时执行退出的动画
  const handleBack = useCallback(() => {
    setShowStatus(false)
  }, [])
  // 下拉跑马灯handler
  const handleScroll = useCallback((pos) => {
    let minScrollY = -30;
    let percent = Math.abs(pos.y / minScrollY);
    let headerDom = headerEL.current;
    // 下拉超过30px时
    if (pos.y < minScrollY) {
      headerDom.style.backgroundColor = style["theme-color"];
      headerDom.style.opacity = Math.min(1, (percent - 1) / 2);
      setTitle(currentAlbum.name);
      setIsMarquee(true);
    } else {
      headerDom.style.backgroundColor = "";
      headerDom.style.opacity = 1;
      setTitle("歌单");
      setIsMarquee(false);
    }
  }, [currentAlbum.name])
  const renderTopDesc = () => {
    return (
      <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"/>
        </div>
        <div className="img_wrapper">
          <div className="decorate"/>
          <img
            src={currentAlbum.coverImgUrl}
            alt=""
          />
          <div className="play_count">
            <i className="iconfont play">&#xe885;</i>
            <span
              className="count">{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万 </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt=""/>
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
    )
  }
  const renderMenu = () => {
    return (
      <Menu>
        <div>
          <i className="iconfont">&#xe6ad;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe86f;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe62d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe606;</i>
          更多
        </div>
      </Menu>
    )
  }
  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      // 在退出动画执行结束时跳转路由
      onExited={props.history.goBack}
    >

      <Container playlistLength={playlistCount}>
        <Header
          title={title}
          handleClick={handleBack}
          ref={headerEL}
          isMarquee={isMarquee}
          data={currentAlbum.name}
        />

        {
          !isEmptyObject(currentAlbum)
            ? <Scroll bounceTop={false} onScroll={handleScroll}>
              <div>
                {renderTopDesc()}
                {renderMenu()}
                <SongsList
                  collectCount={currentAlbum.subscribedCount}
                  showCollect={true}
                  songs={currentAlbum.tracks}
                  musicNoteAnimation={musicNoteAnimation}
                />
                <MusicNote ref={musicNoteRef}/>
              </div>
            </Scroll>
            : null
        }
        {enterLoading ? <Loading/> : null}
      </Container>
    </CSSTransition>
  )
}

const mapStateToProps = (state) => {
  return {
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading']),
    playlistCount: state.getIn(['player', 'playlist']).size
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getAlbumDataDispatch(id) {
      dispatch(changeEnterLoading(true));
      dispatch(getAlbumList(id))
    }
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));