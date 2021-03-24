// 合并所有组件的reducers
import {combineReducers} from 'redux-immutable'
import {reducer as recommendReducer} from '../application/Recommend/store/index'

export default combineReducers({
    // 之后开发具体功能模块的时候添加 reducer
    // 将各个组件的reducer注册到全局store
    recommend: recommendReducer,
});
    