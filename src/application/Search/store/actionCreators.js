import {
  SET_SUGGEST_LIST,
  SET_RESULT_LIST,
  SET_FREQ_QUERY,
  SET_ENTER_LOADING
} from "./constants";
import {fromJS} from "immutable";
import {
  getFreqSearchRequest,
  getSuggestListRequest,
  getResultSongsListRequest
} from "../../../api/request";

const changeFreqQuery = (data) => {
  return {
    type: SET_FREQ_QUERY,
    data: fromJS(data)
  }
}

const changeSuggestList = (data) => {
  return {
    type: SET_SUGGEST_LIST,
    data: fromJS(data)
  }
}

const changeResultList = (data) => {
  return {
    type: SET_RESULT_LIST,
    data: fromJS(data)
  }
}

export const changeEnterLoading = (data) => {
  return {
    type: SET_ENTER_LOADING,
    data
  }
};

export const getFreqQueriesList = () => {
  return dispatch => {
    getFreqSearchRequest().then(data => {
      // 拿到关键词列表
      let list = data.result.hots;
      dispatch(changeFreqQuery(list));
    })
  }
};

export const getSuggestList = (query) => {
  return dispatch => {
    getSuggestListRequest(query).then(data => {
      if (!data) return;
      let res = data.result || [];
      dispatch(changeSuggestList(res));
    })
    getResultSongsListRequest(query).then(data => {
      if (!data) return;
      let res = data.result.songs || [];
      dispatch(changeResultList(res));
      dispatch(changeEnterLoading(false));// 关闭 loading
    })
  }
};

