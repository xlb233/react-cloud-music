import {
  DELETE_SONG,
  SET_CURRENT_INDEX,
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAY_MODE,
  SET_PLAYING_STATE,
  SET_PLAYLIST,
  SET_SEQUENCE_PLAYLIST,
  SET_SHOW_PLAYLIST,
  INSERT_TO_CURRENT_PLAYLIST
} from "./constants"
import {getSongDetailRequest} from '../../../api/request';

import {fromJS} from "immutable";


export const changeCurrentSong = (data) => ({
  type: SET_CURRENT_SONG,
  data: fromJS(data)
});

export const changeFullScreen = (data) => {
  return {
    type: SET_FULL_SCREEN,
    data
  }
};

export const changePlayingState = (data) => {
  return {
    type: SET_PLAYING_STATE,
    data
  }
};

export const changeSequencePlaylist = (data) => ({
  type: SET_SEQUENCE_PLAYLIST,
  data: fromJS(data)
});

export const changePlaylist = (data) => {
  return {
    type: SET_PLAYLIST,
    data: fromJS(data)
  }
};

export const changePlayMode = (data) => ({
  type: SET_PLAY_MODE,
  data
});

export const changeCurrentIndex = (data) => ({
  type: SET_CURRENT_INDEX,
  data
});

export const changeShowPlaylist = (data) => {
  return {
    type: SET_SHOW_PLAYLIST,
    data
  }
};

export const deleteSong = (data) => {
  return {
    type: DELETE_SONG,
    data
  }
}

const insertToCurrentPlaylist = (data) => {
  return {
    type: INSERT_TO_CURRENT_PLAYLIST,
    data
  }
}

export const getSongDetail = (id) => {
  return (dispatch) => {
    getSongDetailRequest(id).then(data => {
      let song = data.songs[0];
      dispatch(insertToCurrentPlaylist(song));
    })
  }
}