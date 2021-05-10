import * as actionTypes from "./constants";
import {fromJS} from "immutable";

const defaultState = fromJS({
  freqQueriesList: [], // 热搜
  suggestList: [], // 搜索时的推荐，包含歌手和歌单
  resultList: [], // 结果列表，歌曲
  enterLoading: false
});

export default (state=defaultState, action) => {
  switch (action.type) {
    case actionTypes.SET_ENTER_LOADING:
      return state.set('enterLoading', action.data)
    case actionTypes.SET_FREQ_QUERY:
      return state.set('freqQueriesList', action.data)
    case actionTypes.SET_RESULT_LIST:
      return state.set('resultList', action.data)
    case actionTypes.SET_SUGGEST_LIST:
      return state.set('suggestList', action.data)
    default:
      // 误写return defaultState
      // 是导致点击歌曲后搜索结果消失的原因，当store中的数据改变，会触发根结点的reducer分发事件，而分发的状态是defaultState也就是全为空，导致搜索结果消失
      return state
  }
}