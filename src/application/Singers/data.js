// 用hooks模拟redux功能，以在页面发生切换时缓存筛选信息。
// 在app.js中以组件的形式引入
import React, {createContext, useReducer} from 'react';
import { fromJS } from 'immutable';

// context
export const contextSinger = createContext({})

// action类型
export const CHANGE_STYLE_UPPER = 'singers/CHANGE_STYLE_UPPER';
export const CHANGE_STYLE_LOWER = 'singers/CHANGE_STYLE_LOWER';
export const CHANGE_TYPE = 'singers/CHANGE_TYPE';
export const CHANGE_AREA = 'singers/CHANGE_AREA'; // singers是在全局store下对应的state
export const CHANGE_ALPHA = 'singers/CHANGE_ALPHA';

// reducer
const reducer = (state, action) => {
    switch (action.type) {
        case CHANGE_STYLE_UPPER:
            return state.set ('styleUpper', action.data);
        case CHANGE_STYLE_LOWER:
            return state.set ('styleLower', action.data);
        case CHANGE_TYPE:
            return state.set ('type', action.data);
        case CHANGE_AREA:
            return state.set ('area', action.data);
        case CHANGE_ALPHA:
            return state.set ('alpha', action.data);
        default:
            return state;
    }
};

// Provider组件
export const Data = (props) => {
    const [data, dispatch] = useReducer(reducer, fromJS({ // state默认值
        styleUpper: '',
        styleLower: '',
        type: '-1',
        area: '-1',
        alpha: 'a'
    }))
    return (
        <contextSinger.Provider value={{data, dispatch}}>
            {props.children}
        </contextSinger.Provider>
    )
}