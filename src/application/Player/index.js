import React, {useEffect, useState, useRef} from "react";
import MiniPlayer from "./MiniPlayer";
import NormalPlayer from "./NormalPlayer";
import Toast from "../../baseUI/toast";
import Playlist from "./Playlist";
import {
  changeCurrentIndex,
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlaylist,
  changePlayMode,
  changeShowPlaylist,
} from './store/actionCreators';
import {connect} from "react-redux";
import {findIndex, getSongUrl, isEmptyObject, shuffle} from "../../api/utils";
import {getLyricRequest} from "../../api/request";
import LyricParser from "../../api/lyric-parser";

function Player(props) {
  const {
    fullScreen,
    playingState,
    currentIndex,
    currentSong: immutableCurrentSong,
    mode,
    playlist: immutablePlaylist,
    sequencePlaylist: immutableSequencePlaylist,
  } = props;
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    changeCurrentIndexDispatch,
    changeCurrentSongDispatch,
    changePlayModeDispatch,
    changePlaylistDispatch,
    toggleShowPlaylistDispatch
  } = props;
  const audioRef = useRef();
  const toastRef = useRef();
  const preSong = useRef({});
  const currentLyric = useRef(''); // 当前整首歌的歌词
  const [currentPlayingLyric, setPlayingLyric] = useState('');
  const currentPlayingLyricIndex = useRef(0) // 当前正在播放的那一句歌词所在下标
  const [currentTime, setCurrentTime] = useState(0) // 已播放时间
  const [duration, setDuration] = useState(0); // 歌曲总时长
  const [modeText, setModeText] = useState("")
  const [songReady, setSongReady] = useState(true) // 判断是否马上播放下一首

  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration; // 已播放/总时长百分比
  const currentSong = immutableCurrentSong.toJS();
  const playlist = immutablePlaylist.toJS();
  playlist.count = 0; // 给playlist加一个count属性，每次切换播放列表时自增，按照playlist.count属性来作为useEffect的dependency
  const sequencePlaylist = immutableSequencePlaylist.toJS();

  const handleLyric = (index, txt) => {
    if(!currentLyric.current)return;
    currentPlayingLyricIndex.current = index;
    setPlayingLyric(txt);
  }

  const getLyric = (id) => {
    let lyric = "";
    // 避免切歌后上一首播放的歌曲歌词还在计时
    if(currentLyric.current) {
      currentLyric.current.stop();
    }
    getLyricRequest(id).then((data) => {
      lyric = data.lrc.lyric;
      if (!lyric) {
        currentLyric.current = '';
        return
      }
      // 解析整首歌词, 存入currentLyric.current变量
      currentLyric.current = new LyricParser(lyric, handleLyric);
      currentLyric.current.play(); // 使用LyricParser类的play方法进行播放
      currentPlayingLyricIndex.current = 0;
      currentLyric.current.seek(0);
    }).catch(() => {
      setSongReady(true);
      audioRef.current.play();
    })
  }
  // 加载播放器
  useEffect(() => {
    if (
      !playlist.length ||
      currentIndex === -1 ||
      !playlist[currentIndex] ||
      playlist[currentIndex].id === preSong.id ||
      !songReady // songReady
    )
      return;
    playlist.count += 1;
    let current = playlist[currentIndex];
    preSong.current = current;
    setSongReady(false);
    changeCurrentSongDispatch(current);//赋值currentSong
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play().then(() => {
        setSongReady(true);
      }).catch(e => {
        alert('歌曲资源有问题，需要会员才能播放');
        setSongReady(true);
        handleNext();
      });
    });
    togglePlayingDispatch(true);//播放状态
    getLyric(current.id); // 播放一首歌只被调用一次
    setCurrentTime(0);//从头开始播放
    setDuration((current.dt / 1000) | 0);//时长
  }, [playlist.count, playlist.length, currentIndex]);

  // 修正删除播放列表后当前歌曲仍在播放的bug
  useEffect(() => {
    (playingState && playlist.length) ? audioRef.current.play() : audioRef.current.pause();
  }, [playingState, playlist.length])

  const clickPlaying = (e, state) => {
    console.log('click playing')
    state ? audioRef.current.play() : audioRef.current.pause(); // 根据当前播放状态确定播放和暂停
    e.stopPropagation(); //阻止事件冒泡到容器上
    togglePlayingDispatch(state);
    if (currentLyric.current) {
      currentLyric.current.togglePlay(currentTime * 1000)
    }
  }

  const updateTime = (e) => {
    setCurrentTime(e.target.currentTime);
  }

  const onProgressChange = curPercent => {
    const newTime = curPercent * duration;
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime; // 改变播放进度
    if (currentLyric.current) {
      currentLyric.current.seek(newTime * 1000);
    }
  };

  // 单曲循环
  const handleSingleCycle = () => {
    audioRef.current.currentTime = 0;
    togglePlayingDispatch(true);
    audioRef.current.play();
  }

  // 播放模式切换
  const handleChangeMode = () => {
    let newMode = (mode + 1) % 3; // 点击左边按钮是一个循环的过程，所以取余
    if (newMode === 0) { // 列表循环模式
      changePlaylistDispatch(sequencePlaylist);
      let index = findIndex(currentSong, sequencePlaylist);
      changeCurrentIndexDispatch(index);
      setModeText("列表循环");
    } else if (newMode === 1) { // 单曲循环模式
      changePlaylistDispatch(sequencePlaylist);
      setModeText("单曲循环");
    } else { // 随机播放
      let newList = shuffle(sequencePlaylist);
      let index = findIndex(currentSong, newList);
      changePlaylistDispatch(newList);
      changeCurrentIndexDispatch(index);
      setModeText("随机播放");
    }
    changePlayModeDispatch(newMode);
    toastRef.current.show();
  }

  // 上一曲
  const handlePrev = () => {
    if (playlist.length === 1) {
      handleSingleCycle();
      return
    }
    let index = currentIndex - 1;
    if (index < 0) index = playlist.length - 1;
    if (!playingState) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
    audioRef.current.play().catch(e => {
      console.log(e)
      handleNext();
    });
  }
  // 下一曲
  const handleNext = () => {
    if (playlist.length === 1) {
      handleSingleCycle();
      return
    }
    let index = currentIndex + 1;
    if (index === playlist.length) index = 0;
    if (!playingState) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
    audioRef.current.play().catch(e => {
      console.log(e)
    });
  }

  // 播放完毕后的操作
  const handleEnd = () => {
    if (mode === 1) {
      handleSingleCycle();
    } else {
      handleNext();
    }
  }
  return (
    <div>
      {
        isEmptyObject(currentSong) ? null :
          <MiniPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playing={playingState}
            percent={percent}
            clickPlaying={clickPlaying}
            toggleFullScreen={toggleFullScreenDispatch}
            toggleShowPlaylist={toggleShowPlaylistDispatch}
          />
      }
      {
        isEmptyObject(currentSong) ? null :
          <NormalPlayer
            song={currentSong}
            fullScreen={fullScreen}
            playing={playingState}
            duration={duration} // 总时长
            currentTime={currentTime} // 已播放
            percent={percent} // 已播放百分比
            clickPlaying={clickPlaying}
            toggleFullScreen={toggleFullScreenDispatch}
            onProgressChange={onProgressChange}
            mode={mode}
            handlePrev={handlePrev}
            handleNext={handleNext}
            handleChangeMode={handleChangeMode}
            toggleShowPlaylist={toggleShowPlaylistDispatch}
            currentLyric={currentLyric.current}
            currentPlayingLyric={currentPlayingLyric}
            currentPlayingLyricIndex={currentPlayingLyricIndex.current}
          />
      }
      <audio
        ref={audioRef}
        onTimeUpdate={updateTime}
        onEnded={handleEnd}
      />
      <Playlist/>
      <Toast text={modeText} ref={toastRef}/>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    fullScreen: state.getIn(['player', 'fullScreen']),
    currentIndex: state.getIn(['player', 'currentIndex']),
    currentSong: state.getIn(['player', 'currentSong']),
    playingState: state.getIn(['player', 'playingState']),
    playlist: state.getIn(['player', 'playlist']),
    mode: state.getIn(['player', 'mode']),
    sequencePlaylist: state.getIn(['player', 'sequencePlaylist']),
    showPlaylist: state.getIn(['player', 'showPlaylist'])
  }
}

const mapDispatchToProps = dispatch => {
  return {
    togglePlayingDispatch(data) {
      dispatch(changePlayingState(data))
    },
    toggleFullScreenDispatch(data) {
      dispatch(changeFullScreen(data))
    },
    toggleShowPlaylistDispatch(data) {
      console.log(data)
      dispatch(changeShowPlaylist(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeCurrentSongDispatch(data) {
      dispatch(changeCurrentSong(data))
    },
    changePlayModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
    changePlaylistDispatch(data) {
      dispatch(changePlaylist(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))