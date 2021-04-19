import {CHANGE_ENTER_LOADING, CHANGE_CURRENT_ALBUM} from "./constants";
import {getAlbumDetailRequest} from "../../../api/request";
import {fromJS} from "immutable";

export const changeCurrentAlbum = (data) => {
    return {
        type: CHANGE_CURRENT_ALBUM,
        data: fromJS(data)
    }
}

export const changeEnterLoading = (data) => {
    return {
        type: CHANGE_ENTER_LOADING,
        data: data
    }
}

export const getAlbumList = (id) => {
    return dispatch => {
        getAlbumDetailRequest(id).then(res=>{
            let data = res.playlist;
            dispatch(changeCurrentAlbum(data))
            dispatch(changeEnterLoading(false))
        }).catch(()=>{
            console.log('获取album信息失败')
        })
    }
}