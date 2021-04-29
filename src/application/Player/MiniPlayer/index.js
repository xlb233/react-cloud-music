import React, {useRef} from "react";
import {MiniPlayerContainer} from "./style";
import {CSSTransition} from "react-transition-group";
import {getName} from "../../../api/utils";
import ProgressCircle from "../../../baseUI/progressCircle";

function MiniPlayer(props) {
  const {song, fullScreen, playing, percent} = props;
  const {clickPlaying, toggleFullScreen} = props;
  const miniPlayerContainerRef = useRef()
  // const percent = 0.2;
  return (
    <CSSTransition
      classNames="mini"
      in={!fullScreen}
      timeout={400}
      onEnter={() => {
        miniPlayerContainerRef.current.style.display = "flex";
      }}
      onExited={() => {
        miniPlayerContainerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerContainerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="img_wrapper">
            <img className={`play ${playing ? "" : "pause"}`}
                 src={song.al.picUrl}
                 height='40'
                 width='40'
                 alt="MusicCover"
            />
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="trackName">{song.name}</div>
          <div className="artistName">{getName(song.ar)}</div>
        </div>
        <div className="control_wrapper">
          <div className="modeControl">
            <ProgressCircle radius={32} percent={percent}>
              {
                playing ?
                  <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe650;</i>
                    :
                  <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe61e;</i>
              }
            </ProgressCircle>
          </div>
          <div className="listControl">
            <i className="iconfont">&#xe640;</i>
          </div>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  )
}

export default React.memo(MiniPlayer)