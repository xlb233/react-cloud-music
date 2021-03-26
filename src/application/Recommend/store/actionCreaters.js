// 具体的action在此处定义
import * as actionTypes from "./constants" // 引入各action类型
import {fromJS} from "immutable";
import {getBannerRequest, getRecommendRequest} from "../../../api/request"; // 引入request,以在数据发生改变时发送请求，获取回复以改变数据

export const changeBannerList = (data) => ({ // banner改变的action
    type: actionTypes.CHANGE_BANNER,
    data: fromJS(data)
});

export const changeRecommendList = (data) => ({ // 推荐列表改变的action
    type: actionTypes.CHANGE_RECOMMEND_LIST,
    data: fromJS(data)
});

export const getBannerList = () => {
    return (dispatch) => {
        getBannerRequest().then(data => {
            dispatch(changeBannerList(data.banners)) // 分发action
        }).catch((e) => {
            console.log("轮播图传输数据错误")
        })
    }
}

export const getRecommendList = () => {
    return (dispatch) => {
        getRecommendRequest().then(data => {
            dispatch(changeRecommendList(data.result)) // 分发action
        }).catch((e) => {
            console.log("推荐歌单传输数据错误")
        })
    }
}