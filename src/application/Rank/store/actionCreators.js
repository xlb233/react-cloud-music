import {CHANGE_RANK_LIST, CHANGE_LOADING} from "./constants";
import {fromJS} from "immutable";
import {getRankListRequest} from "../../../api/request"; // 引入各action类型


const changeRankList = (data) => ({
    type: CHANGE_RANK_LIST,
    data: fromJS(data)
})

const changeLoading = (data) => ({
    type: CHANGE_LOADING,
    data
})

export const getRankList = () => {
    return dispatch => {
        getRankListRequest().then(data=>{
            let list = data && data.list;
            dispatch(changeRankList(list))
            dispatch(changeLoading(false))
        })
    }
}