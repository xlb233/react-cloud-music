// 推荐页面组件

import React, {useEffect} from 'react';
import {connect} from "react-redux";
import * as actionTypes from './store/actionCreaters'
import Slider from "../../components/slider" // 引入banner轮播组件
import RecommendList from "../../components/list" // 引入推荐列表组件
import Scroll from '../../baseUI/scroll/index'; // 引入better-scroll插件
import {Content} from "./style";
import {forceCheck} from 'react-lazyload';
import {renderRoutes} from "react-router-config";

function Recommend(props) {
  const {bannerList, recommendList, playlistCount} = props; // playlistCount用来判断当前播放列表中是否有歌曲。
  const {getBannerDataDispatch, getRecommendListDataDispatch} = props;

  useEffect(() => {
    if (!bannerList.length) {
      getBannerDataDispatch();// 若已经有数据，就不再请求，可减少请求次数，提高性能
    }
    if (!recommendList.length) {
      getRecommendListDataDispatch();
    }
    //eslint-disable-next-line
  }, []);

  const bannerListJS = bannerList ? bannerList.toJS() : [];
  const recommendListJS = recommendList ? recommendList.toJS() : [];

  return (
    <Content playlistLength={playlistCount}>
      {renderRoutes(props.route.routes)}
      {/*使用forceCheck函数，实现滑动到哪哪才加载的效果*/}
      <Scroll className="list" onScroll={forceCheck}>
        <div>
          <Slider bannerList={bannerListJS}/>
          <RecommendList
            recommendList={recommendListJS}
            playlistLength={playlistCount}
          />
        </div>
      </Scroll>
    </Content>
  )
}

const mapStateToProps = (state) => ({ // 映射全局state到recommend组件的props上
  bannerList: state.getIn(['recommend', 'bannerList']),
  recommendList: state.getIn(['recommend', 'recommendList']),
  playlistCount: state.getIn(['player', 'playlist']).size,
})

// 映射 dispatch 到 props 上
const mapDispatchToProps = (dispatch) => {
  return {
    getBannerDataDispatch() {
      dispatch(actionTypes.getBannerList());
    },
    getRecommendListDataDispatch() {
      dispatch(actionTypes.getRecommendList());
    },
  }
};


// 将 ui 组件包装成容器组件
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));
