// 歌手页面组件
import React, {useState, useEffect, useContext} from "react"
import HorizonList from "../../baseUI/horizonList"; //
import {categoryTypes, alphaTypes} from "../../api/constant"
import {NavContainer, ListContainer, List, ListItem} from "./style"
import Scroll from "../../baseUI/scroll";
//redux相关
import {
    getSingerList,
    getHotSingers,
    refreshMoreSingerList,
    refreshMoreHotSingerList,
    changeEnterLoading,
    changePageCount,
    changePullDownLoading,
    changePullUpLoading
} from "./store/actionCreators";
import {connect} from 'react-redux';

import {contextSinger} from "./data";
import {CHANGE_STYLE, CHANGE_TYPE, CHANGE_AREA, CHANGE_ALPHA} from "./data";


// 懒加载
import LazyLoad, {forceCheck} from 'react-lazyload';

function Singers(props) {
    // const [styled, setStyled] = useState('') // 存key值，仅用于更新选中样式
    // 剩下三个钩子用于处理筛选更新handleUpdate函数
    // const [type, setType] = useState('')
    // const [area, setArea] = useState('')
    // const [alpha, setAlpha] = useState('')

    // useContext钩子实现类似redux的功能
    const {data, dispatch} = useContext(contextSinger)
    const {style, type, alpha, area} = data.toJS()
    console.log(data.toJS())
    const {singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount} = props;

    const {getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch} = props;
    useEffect(() => {
        if (!singerList.size) {
            if (style && type && area && alpha) {
                console.log("有东西")
                updateDispatch(type, area, alpha);
            } else {
                getHotSingerDispatch ();
            }
        }
    }, []);

    let handleUpdateAlpha = (_style, _type, _area, _alpha) => {
        // setStyled(_style);
        // setAlpha(_alpha)
        // if (!_type) {
        //     if (type) {
        //         _type = type
        //     } else {
        //         _type = "-1"
        //         setType(_type)
        //     }
        // }
        // if (!_area) {
        //     if (area) {
        //         _area = area
        //     } else {
        //         _area = "-1"
        //         setArea(_area)
        //     }
        // }

        if (!_type) {
            if (type) {
                dispatch({type: CHANGE_TYPE, data: type})
            } else {
                dispatch({type: CHANGE_TYPE, data: '-1'})
            }
        }
        _type = _type || type || "-1"
        if (!_area) {
            if (area) {
                dispatch({type: CHANGE_AREA, data: area})
            } else {
                dispatch({type: CHANGE_AREA, data: '-1'})
            }
        }
        _area = _area || area || "-1"
        dispatch({type: CHANGE_STYLE, data: _style})
        dispatch({type: CHANGE_ALPHA, data: _alpha})
        updateDispatch(_type, _area, _alpha);
    };
    let handleUpdateType = (_style, _type, _area, _alpha) => {
        // setStyled(_style)
        // setType(_type)
        // setArea(_area)
        // if (!_alpha) {
        //     if (alpha) {
        //         _alpha = alpha
        //     } else {
        //         _alpha = "a"
        //         setAlpha(_alpha)
        //     }
        // }
        if (!_alpha) {
            if (alpha) {
                dispatch({type: CHANGE_ALPHA, data: alpha})
            } else {
                dispatch({type: CHANGE_ALPHA, data: 'a'})
            }
        }
        _alpha = _alpha || alpha || "a"
        dispatch({type: CHANGE_STYLE, data: _style})
        dispatch({type: CHANGE_TYPE, data: _type})
        dispatch({type: CHANGE_AREA, data: _area})
        console.log("this is " + _style + " " + _type +  " " + _area + " " + _alpha)
        updateDispatch(_type, _area, _alpha);
    };

    const renderSingerList = () => {
        const list = singerList ? singerList.toJS() : [];
        return (
            <List>
                {
                    list.map((item) => {
                        return (
                            <ListItem key={item.id}>
                                <div className="img_wrapper">
                                    <LazyLoad placeholder={<img width="100%" height="100%" src={require('./singer.png')}
                                                                alt="music"/>}>
                                        <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%"
                                             alt="music"/>
                                    </LazyLoad>
                                </div>
                                <span className="name">{item.name}</span>
                            </ListItem>
                        )
                    })
                }
            </List>
        )
    }

    return (
        <NavContainer>
            <HorizonList
                list={categoryTypes}
                title={"分类 (默认热门):"}
                handleClick={handleUpdateType}
                styleVal={style}
            />
            <HorizonList
                list={alphaTypes}
                title={"首字母:"}
                handleClick={handleUpdateAlpha}
                styleVal={style}
            />
            {/*在./style.js中定义*/}
            <ListContainer>
                <Scroll
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
                    onScroll={forceCheck}
                >
                    {renderSingerList()}
                </Scroll>
            </ListContainer>
        </NavContainer>
    )
}

const mapStateToProps = (state) => {

    return {
        singerList: state.getIn(['singers', 'singerList']),
        enterLoading: state.getIn(['singers', 'enterLoading']),
        pullUpLoading: state.getIn(['singers', 'pullUpLoading']),
        pullDownLoading: state.getIn(['singers', 'pullDownLoading']),
        pageCount: state.getIn(['singers', 'pageCount'])
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getHotSingerDispatch() {
            dispatch(getHotSingers());
        },
        updateDispatch(type, area, alpha) {
            dispatch(changePageCount(0));//由于改变了分类，所以pageCount清零
            dispatch(changeEnterLoading(true));//loading，现在实现控制逻辑，效果实现放到下一节，后面的loading同理
            // console.log("args been dispatched " + ' ' + type + ' ' + area + " " + alpha )
            dispatch(getSingerList(type, area, alpha));
        },
        // 滑到最底部刷新部分的处理
        pullUpRefreshDispatch(type, area, alpha, hot, count) {
            dispatch(changePullUpLoading(true));
            dispatch(changePageCount(count + 1));
            if (hot) {
                dispatch(refreshMoreHotSingerList());
            } else {
                dispatch(refreshMoreSingerList(type, area, alpha));
            }
        },
        //顶部下拉刷新
        pullDownRefreshDispatch(type, area, alpha) {
            dispatch(changePullDownLoading(true));
            dispatch(changePageCount(0));//属于重新获取数据
            if (type === '' && area === '' && alpha === '') {
                dispatch(getHotSingers());
            } else {
                dispatch(getSingerList(type, area, alpha));
            }
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));