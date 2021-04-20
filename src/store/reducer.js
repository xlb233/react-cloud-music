// 合并所有组件的reducers
import {combineReducers} from 'redux-immutable'
import {reducer as recommendReducer} from '../application/Recommend/store/index'
import {reducer as singerReducer} from '../application/Singers/store/index'
import {reducer as rankReducer} from '../application/Rank/store/index'
import {reducer as albumReducer} from '../application/Album/store/index'
import {reducer as singerInfoReducer} from '../application/Singer/store/index'
export default combineReducers({
    // 之后开发具体功能模块的时候添加 reducer
    // 将各个组件的reducer注册到全局store
    recommend: recommendReducer, // recommend组件
    singers: singerReducer,
    rank: rankReducer,
    album: albumReducer,
    singerInfo: singerInfoReducer,
});
