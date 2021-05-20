import {fromJS} from "immutable";
import {playMode} from "../../../api/constant"
import * as actionTypes from "./constants"
import {findIndex} from "../../../api/utils";

const defaultState = fromJS({
  fullScreen: false, // 是否全屏播放
  playing: false, // 是否播放当前
  sequencePlaylist: [], // 当前顺序播放列表
  playlist: [], // 播放列表
  mode: playMode.sequence, // 默认列表顺序播放 0：顺序播放 1：单曲循环 2：随机播放
  currentIndex: -1, // 当前歌曲在播放列表的索引
  showPlaylist: false, // 是否显示当前播放列表
  currentSong: {},
})

const handleDelete = (state, song) => {
  console.log('delete')
  // 当前索引，因为删除会影响索引，所以使用let
  let currentIndex = state.get('currentIndex');
  const playlist = state.get('playlist');
  const sequencePlayList = state.get('sequencePlaylist')
  // 点击删除的索引
  const toBeDeleted = findIndex(song, playlist.toJS());
  // 在playlist中将其删除
  const newPlaylist = playlist.splice(toBeDeleted, 1)
  // 在sequencePlaylist中将其删除
  const toBeDeletedS = findIndex(song, sequencePlayList.toJS())
  const newSequencePlaylist = sequencePlayList.splice(toBeDeletedS, 1)
  // 判断删除的歌曲与当前歌曲的相对位置
  if (toBeDeleted < currentIndex) {
    currentIndex--
  }
  return state.merge({
    'playlist': newPlaylist,
    'sequencePlaylist': newSequencePlaylist,
    'currentIndex': currentIndex
  })
}

const handleInsertSong = (state, song) => {
  const playlist = JSON.parse(JSON.stringify(state.get('playlist').toJS()));
  const sequenceList = JSON.parse(JSON.stringify(state.get('sequencePlaylist').toJS()));
  let currentIndex = state.get('currentIndex');
  // 查看选中歌曲是否是当前正在播放的歌曲
  let fpIndex = findIndex(song, playlist);
  // 如果是当前歌曲直接不处理
  if (fpIndex === currentIndex && currentIndex !== -1) return state;
  currentIndex++;
  // 把歌放进去，放到当前播放曲目的下一个位置
  playlist.splice(currentIndex, 0, song);
  // 如果列表中已经存在要添加的歌，暂且称它 oldSong
  if (fpIndex > -1) {
    // 如果 oldSong 的索引在目前播放歌曲的索引小，那么删除它，同时当前 index 要减一
    if (currentIndex > fpIndex) {
      playlist.splice(fpIndex, 1);
      currentIndex--;
    } else {
      // 否则直接删掉 oldSong
      playlist.splice(fpIndex + 1, 1);
    }
  }
  // 同理，处理 sequenceList
  let sequenceIndex = findIndex(playlist[currentIndex], sequenceList) + 1;
  let fsIndex = findIndex(song, sequenceList);
  // 插入歌曲
  sequenceList.splice(sequenceIndex, 0, song);
  if (fsIndex > -1) {
    // 跟上面类似的逻辑。如果在前面就删掉，index--; 如果在后面就直接删除
    if (sequenceIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1);
      sequenceIndex--;
    } else {
      sequenceList.splice(fsIndex + 1, 1);
    }
  }
  return state.merge({
    'playlist': fromJS(playlist),
    'sequencePlaylist': fromJS(sequenceList),
    'currentIndex': fromJS(currentIndex),
  });
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_SONG:
      return state.set('currentSong', action.data);
    case actionTypes.SET_FULL_SCREEN:
      return state.set('fullScreen', action.data);
    case actionTypes.SET_PLAYING_STATE:
      return state.set('playingState', action.data);
    case actionTypes.SET_SEQUENCE_PLAYLIST:
      return state.set('sequencePlaylist', action.data);
    case actionTypes.SET_PLAYLIST:
      return state.set('playlist', action.data);
    case actionTypes.SET_PLAY_MODE:
      return state.set('mode', action.data);
    case actionTypes.SET_CURRENT_INDEX:
      return state.set('currentIndex', action.data);
    case actionTypes.SET_SHOW_PLAYLIST:
      return state.set('showPlaylist', action.data);
    case actionTypes.DELETE_SONG:
      return handleDelete(state, action.data)
    case actionTypes.INSERT_TO_CURRENT_PLAYLIST:
      return handleInsertSong(state, action.data);
    case actionTypes.CLEAR_PLAYING_STATE:
      console.log(`状态发生改变的时间${+new Date()}`)
      return state.set('currentSong', fromJS({}));
    default:
      return state;
  }
}
