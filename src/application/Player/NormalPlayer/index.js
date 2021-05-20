import React, {useRef, useEffect, useState} from "react";
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  CdWrapper,
  Operators,
  LyricContainer,
  LyricWrapper
} from "./style";

import {formatPlayTime, getName} from "../../../api/utils";
import {CSSTransition} from "react-transition-group";
import animations from "create-keyframe-animation";
import {prefixStyle} from "../../../api/utils";
import ProgressBar from "../../../baseUI/progressBar";
import {playMode} from "../../../api/constant";
import Scroll from "../../../baseUI/scroll"; // 用于滚动歌词

// 计算miniPlayer扩大到normalPlayer时专辑封面发生偏移的辅助函数
const _getPosAndScale = () => {
  const targetWidth = 40;
  const paddingLeft = 40;
  const paddingBottom = 30;
  const paddingTop = 80;
  const width = window.innerWidth * 0.8;
  const scale = targetWidth / width;
  // 两个圆心的横坐标距离和纵坐标距离
  const x = -(window.innerWidth / 2 - paddingLeft);
  const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
  return {
    x,
    y,
    scale
  };
};

function NormalPlayer(props) {
  const {
    song,
    fullScreen,
    playing,
    duration,
    currentTime,
    percent,
    mode,
    currentLyric,
    currentPlayingLyric,
    currentPlayingLyricIndex
  } = props;
  const {
    toggleFullScreen,
    clickPlaying,
    onProgressChange,
    handlePrev,
    handleNext,
    handleChangeMode,
    toggleShowPlaylist
  } = props;
  const normalPlayerContainerRef = useRef();
  const normalPlayerCdRef = useRef();
  const [lyricDisplayState, setLyricDisplayState] = useState(''); // 控制显示专辑封面还是歌词

  const lyricScrollRef = useRef('');
  const lyricLineRefs = useRef([]);
  const transform = prefixStyle("transform");

  useEffect(() => {
    if (!lyricScrollRef.current) return;
    let bScroll = lyricScrollRef.current.getBScroll();
    if (bScroll && currentPlayingLyricIndex > 5) {
      // 保持当前歌词在第 5 条的位置
      let lineEl = lyricLineRefs.current[currentPlayingLyricIndex - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      // 当前歌词行数 <=5, 直接滚动到最顶端
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentPlayingLyricIndex]);
  // 启用帧动画
  const enter = () => {
    normalPlayerContainerRef.current.style.display = "flex";
    const {x, y, scale} = _getPosAndScale();// 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
    let animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`
      }
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear"
      }
    });
    animations.runAnimation(normalPlayerCdRef.current, "move");
  };

  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = normalPlayerCdRef.current;
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = "";
  };

  const leave = () => {
    if (!normalPlayerCdRef.current) return;
    const cdWrapperDom = normalPlayerCdRef.current;
    cdWrapperDom.style.transition = "all 0.4s";
    const {x, y, scale} = _getPosAndScale();
    cdWrapperDom.style[transform] = `translate3d (${x} px, ${y} px, 0) scale (${scale})`;
  };

  const afterLeave = () => {
    if (!normalPlayerCdRef.current) return;
    const cdWrapperDom = normalPlayerCdRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    // 一定要注意现在要把 normalPlayer 这个 DOM 给隐藏掉，因为 CSSTransition 的工作只是把动画执行一遍
    // 不置为 none 的话全屏播放器页面还是存在
    normalPlayerContainerRef.current.style.display = "none";
  };

  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe625;";
    } else if (mode === playMode.loop) {
      content = "&#xe653;";
    } else {
      content = "&#xe61b;";
    }
    return content;
  }

  const toggleLyricDisplayState = () => {
    if (lyricDisplayState !== 'lyric') {
      setLyricDisplayState("lyric");
    } else {
      setLyricDisplayState("cd");
    }
  }

  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerContainerRef}>
        <div className="background">
          <img
            src={song.al.picUrl + '?param=300x300'}
            width="100%"
            height="100%"
            alt={song.name}
          />
        </div>
        <div className="background layer"/>
        <Top className="top">
          <div
            className="back"
            onClick={() => toggleFullScreen(false)}
          >
            <i className="iconfont icon-back">&#xe662;</i>
          </div>
          <div className="desc">
            <h1 className="title">{song.name}</h1>
            <h1 className="subtitle">{getName(song.ar)}</h1>
          </div>
        </Top>
        <Middle onClick={toggleLyricDisplayState}>
          <CSSTransition
            timeout={400}
            classNames='fade'
            in={lyricDisplayState === 'cd'}
          >
            <CdWrapper
              ref={normalPlayerCdRef}
              style={
                {
                  visibility:
                    lyricDisplayState !== "lyric"
                      ? "visible"
                      : "hidden"
                }
              }
            >
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : 'pause'}`}
                  src={song.al.picUrl + "?param=400x400"}
                  alt="cd"
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CdWrapper>
          </CSSTransition>

          <CSSTransition
            timeout={400}
            classNames='fade'
            in={lyricDisplayState === 'lyric'}
          >
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper
                  style={
                    {
                      visibility:
                        lyricDisplayState === 'lyric'
                          ? "visible"
                          : "hidden"
                    }
                  }
                  className="lyric_wrapper"
                >
                  {
                    currentLyric
                      ? currentLyric.lines.map((item, index) => {
                        // 拿到每一行歌词的 DOM 对象，后面滚动歌词需要！
                        lyricLineRefs.current[index] = React.createRef();
                        return (
                          <p
                            className={`text ${
                              currentPlayingLyricIndex === index ? "current" : ""
                            }`}
                            key={item + index}
                            ref={lyricLineRefs.current[index]}
                          >
                            {item.txt}
                          </p>
                        );
                      })
                      : <p className="text pure"> 纯音乐，请欣赏。</p>}

                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>

        </Middle>
        <Bottom className="bottom">
          <ProgressBar
            time_l={formatPlayTime(currentTime)}
            time_r={formatPlayTime(duration)}
            percent={percent}
            percentChange={onProgressChange}
          />
          <Operators>
            <div className="icon i-left" onClick={handleChangeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{__html: getPlayMode()}}
              />
            </div>
            <div className="icon i-left" onClick={() => {
              handlePrev()
            }
            }>
              <i className="iconfont">&#xe6e1;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={e => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{__html: playing ? "&#xe723;" : "&#xe731;"}}
              />
            </div>
            <div className="icon i-right" onClick={() => {
              handleNext()
            }
            }>
              <i className="iconfont">&#xe718;</i>
            </div>
            <div
              className="icon i-right"
              onClick={() => toggleShowPlaylist(true)}
            >
              <i className="iconfont">&#xe640;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(NormalPlayer);

