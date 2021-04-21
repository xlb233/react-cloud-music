import {fromJS} from "immutable";
import {playMode} from "../../../api/constant"
import * as actionTypes from "./constants"

const defaultState = fromJS({
  fullScreen: false, // 是否全屏播放
  playing: false, // 是否播放当前
  sequencePlaylist: [], // 当前顺序播放列表
  playlist: [], // 播放列表
  mode: playMode.sequence, // 默认列表顺序播放
  currentIndex: -1, // 当前歌曲在播放列表的索引
  showPlaylist: false, // 是否显示当前播放列表
  currentSong: {},
})

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set ('currentSong', action.data);
    case actionTypes.SET_FULL_SCREEN:
      return state.set ('fullScreen', action.data);
    case actionTypes.SET_PLAYING_STATE:
      return state.set ('playingState', action.data);
    case actionTypes.SET_SEQUENCE_PLAYLIST:
      return state.set ('sequencePlaylist', action.data);
    case actionTypes.SET_PLAYLIST:
      return state.set ('playlist', action.data);
    case actionTypes.SET_PLAY_MODE:
      return state.set ('playMode', action.data);
    case actionTypes.SET_CURRENT_INDEX:
      return state.set ('currentIndex', action.data);
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set ('showPlaylist', action.data);
    default:
      return state;
  }
}
