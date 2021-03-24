import * as actionTypes from './constants' // 从constants中引入actions类型
import {fromJS} from "immutable";  // 这里用到 fromJS 把 JS 数据结构转化成 immutable 数据结构


const defaultState = fromJS({
    bannerList: [],
    recommendList: []
})

// reducer逻辑

export default (state = defaultState, action) => {
    switch (action.type) {
        case actionTypes.CHANGE_BANNER:
            return state.set('bannerList', action.data)
        case actionTypes.CHANGE_RECOMMEND_LIST:
            return state.set('recommendList', action.data)
        default:
            return state
    }
}