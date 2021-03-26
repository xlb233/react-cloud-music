// 歌手页面组件
import React, {useState, useEffect} from "react"
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

function Singers(props) {
    const [styled, setStyled] = useState('') // 存key值，仅用于更新选中样式
    // 剩下三个钩子用于处理筛选更新handleUpdate函数
    const [type, setType] = useState('')
    const [area, setArea] = useState('')
    const [alpha, setAlpha] = useState('')
    // horizonList组件中点击后的事件回调，改变样式为选中状态
    // const handleUpdateAlpha = (styleVal) => {
    //     setAlpha(styleVal)
    // }
    // const handleUpdateType = (styleVal) => {
    //     setType(styleVal)
    // }
    // const handleUpdateArea = (styleVal) => {
    //     setType(styleVal)
    // }
    const {singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount} = props;

    const {getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch} = props;
    // 歌手列表组件
    // 歌手列表的mock 数据
    // const singerList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(item => {
    //     return {
    //         picUrl: "https://p2.music.126.net/uTwOm8AEFFX_BYHvfvFcmQ==/109951164232057952.jpg",
    //         name: "隔壁老樊",
    //         accountId: 277313426,
    //     }
    // });
    useEffect(() => {
        getHotSingerDispatch();
        // eslint-disable-next-line
    }, []);

    let handleUpdateAlpha = (_style, _type, _area, _alpha) => {
        setStyled(_style);
        setAlpha(_alpha)
        if (!_type) {
            if (type) {
                _type = type
            } else {
                _type = "-1"
                setType(_type)
            }
        }
        if (!_area) {
            if (area) {
                _area = area
            } else {
                _area = "-1"
                setArea(_area)
            }
        }
        updateDispatch(_type, _area, _alpha);
    };
    let handleUpdateType = (_style, _type, _area, _alpha) => {
        setStyled(_style)
        setType(_type)
        setArea(_area)
        if (!_alpha) {
            if (alpha) {
                _alpha = alpha
            } else {
                _alpha = "a"
                setAlpha(_alpha)
            }
        }
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
                                    <img src={`${item.picUrl}?param=300x300`} width="100%" height="100%" alt="music"/>
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
                styleVal={styled}
            />
            <HorizonList
                list={alphaTypes}
                title={"首字母:"}
                handleClick={handleUpdateAlpha}
                styleVal={styled}
            />
            {/*在./style.js中定义*/}
            <ListContainer>
                <Scroll
                    pullUpLoading={pullUpLoading}
                    pullDownLoading={pullDownLoading}
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