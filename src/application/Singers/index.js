// 歌手页面组件
import React, {useEffect, useContext} from "react"
import HorizonList from "../../baseUI/horizonList"; //
import {categoryTypes, alphaTypes} from "../../api/constant"
import {NavContainer, ListContainer, List, ListItem} from "./style"
import Scroll from "../../baseUI/scroll";
// es6要求引入本地图片时使用<img src={} />的写法
import placeHolder from '../../assets/placeholders/singer.png'
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

import {CHANGE_STYLE_LOWER, CHANGE_STYLE_UPPER, contextSinger, Data} from "./data";
import {CHANGE_TYPE, CHANGE_AREA, CHANGE_ALPHA} from "./data";


// 懒加载
import LazyLoad, {forceCheck} from 'react-lazyload';
// 渲染子级路由
import {renderRoutes} from "react-router-config";
import Loading from "../../baseUI/loading";

function Singers(props) {
  const {data, dispatch} = useContext(contextSinger)
  const {styleUpper, styleLower, type, alpha, area} = data.toJS()
  const {singerList, enterLoading, pullUpLoading, pullDownLoading, pageCount} = props;
  let styled = styleUpper || styleLower // 判断是否已经有选中过
  const {getHotSingerDispatch, updateDispatch, pullDownRefreshDispatch, pullUpRefreshDispatch} = props;
  useEffect(() => {
    if (!singerList.size) {
      if (styled && type && area && alpha) {
        updateDispatch(type, area, alpha);
      } else {
        getHotSingerDispatch();
      }
    }
  });
  const handleUpdateAlpha = (_style, _type, _area, _alpha) => {
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
    dispatch({type: CHANGE_STYLE_LOWER, data: _style})
    dispatch({type: CHANGE_ALPHA, data: _alpha})
    updateDispatch(_type, _area, _alpha);
  };
  const handleUpdateType = (_style, _type, _area, _alpha) => {
    if (!_alpha) {
      if (alpha) {
        dispatch({type: CHANGE_ALPHA, data: alpha})
      } else {
        dispatch({type: CHANGE_ALPHA, data: 'a'})
      }
    }
    _alpha = _alpha || alpha || "a"
    dispatch({type: CHANGE_STYLE_UPPER, data: _style})
    dispatch({type: CHANGE_TYPE, data: _type})
    dispatch({type: CHANGE_AREA, data: _area})
    updateDispatch(_type, _area, _alpha);
  };
  const handlePullUp = () => {
    pullUpRefreshDispatch(type, area, alpha, !styled && type === '-1' && area === '-1' && alpha === 'a', pageCount)
  }
  const handlePullDown = () => {
    pullDownRefreshDispatch(type, area, alpha)
  }
  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`)
  }
  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : [];
    return (
      <List>
        {
          list.map((item, index) => {
            return (
              <ListItem key={item.id} onClick={() => enterDetail(item.id)}>
                <div className="img_wrapper">
                  <LazyLoad placeholder={<img width="100%" height="100%" src={placeHolder}
                                              alt="placeholder"/>}>
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
    <div>
      <Data>
        <NavContainer>
          <HorizonList
            list={categoryTypes}
            title={"分类 (默认热门):"}
            handleClick={handleUpdateType}
            styleVal={styleUpper}
          />
          <HorizonList
            list={alphaTypes}
            title={"首字母:"}
            handleClick={handleUpdateAlpha}
            styleVal={styleLower}
          />
        </NavContainer>
        {/*在./style.js中定义*/}
        <ListContainer>
          <Scroll
            pullUp={handlePullUp}
            pullDown={handlePullDown}
            pullUpLoading={pullUpLoading}
            pullDownLoading={pullDownLoading}
            onScroll={forceCheck}
          >
            {renderSingerList()}
          </Scroll>
          <Loading show={enterLoading}/>
        </ListContainer>
      </Data>
      {renderRoutes(props.route.routes)}
    </div>
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
      dispatch(changePageCount(count + 50));
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
      if (type === '-1' && area === '-1' && alpha === 'a') {
        dispatch(getHotSingers());
      } else {
        dispatch(getSingerList(type, area, alpha));
      }
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Singers));