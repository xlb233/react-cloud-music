import {
  SET_CURRENT_INDEX,
  SET_CURRENT_SONG,
  SET_FULL_SCREEN,
  SET_PLAY_MODE,
  SET_PLAYING_STATE,
  SET_PLAYLIST,
  SET_SEQUENCE_PLAYLIST,
  SET_SHOW_PLAYLIST
} from "./constants"

import {fromJS} from "immutable";


export const changeCurrentSong = (data) => ({
  type: SET_CURRENT_SONG,
  data: fromJS(data)
});

export const changeFullScreen = (data) => ({
  type: SET_FULL_SCREEN,
  data
});

export const changePlayingState = (data) => ({
  type: SET_PLAYING_STATE,
  data
});

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

export const changeShowPlaylist = (data) => ({
  type: SET_SHOW_PLAYLIST,
  data
});
