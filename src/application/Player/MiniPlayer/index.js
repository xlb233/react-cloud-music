import React, {useRef} from "react";
import {MiniPlayerContainer} from "./style";
import {CSSTransition} from "react-transition-group";
import {getName} from "../../../api/utils";

function MiniPlayer(props) {
  const {song, fullScreen} = props;
  const {toggleFullScreen} = props;
  const miniPlayerContainerRef = useRef()
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
            <img className='play'
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
            <i className="iconfont">&#xe650;</i>
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