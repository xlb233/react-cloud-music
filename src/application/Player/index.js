import React, {useEffect, useState, useRef, useCallback} from "react";
import MiniPlayer from "./MiniPlayer";
import NormalPlayer from "./NormalPlayer";

import {
  changeCurrentIndex,
  changeCurrentSong,
  changeFullScreen,
  changePlayingState,
  changePlayMode,
  changeShowPlaylist
} from './store/actionCreators';
import {connect} from "react-redux";

function Player(props) {
  // mock数据
  const currentSong = {
    al: {picUrl: "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg"},
    name: "木偶人",
    ar: [{name: "薛之谦"}]
  }
  const {fullScreen} = props;
  const {toggleFullScreenDispatch} = props;
  return (
    <div>
      <MiniPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreenDispatch}
      />
      <NormalPlayer
        song={currentSong}
        fullScreen={fullScreen}
        toggleFullScreen={toggleFullScreenDispatch}
      />
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
    playMode: state.getIn(['player', 'playMode']),
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
      dispatch(changeShowPlaylist(data))
    },
    changeCurrentIndexDispatch(data) {
      dispatch(changeCurrentIndex(data))
    },
    changeCurrentSong(data) {
      dispatch(changeCurrentSong(data))
    },
    changePlayModeDispatch(data) {
      dispatch(changePlayMode(data))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Player))