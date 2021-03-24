// 推荐页面组件

import React, {useEffect} from 'react';
import {connect} from "react-redux";
import * as actionTypes from './store/actionCreaters'
import Slider from "../../components/slider" // 引入banner轮播组件
import RecommendList from "../../components/list" // 引入推荐列表组件
import Scroll from '../../baseUI/scroll/index'; // 引入better-scroll插件
import {Content} from "./style";


function Recommend(props) {
    // // banner轮播mock数据
    // const bannerList = [1, 2, 3, 4].map(item => {
    //     return {imageUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg", key: item}
    // })
    // // 推荐列表轮播mock数据
    // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
    //     return {
    //         id: 1,
    //         picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
    //         playCount: 17171122,
    //         name: "朴树、许巍、李健、郑钧、老狼、赵雷",
    //         key: item
    //     }
    // })
    const {bannerList, recommendList} = props;

    const {getBannerDataDispatch, getRecommendListDataDispatch} = props;

    useEffect(() => {
        getBannerDataDispatch();
        getRecommendListDataDispatch();
        //eslint-disable-next-line
    }, []);

    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];

    return (
        <Content>
            <Scroll className="list">
                <div>
                    <Slider bannerList={bannerListJS}/>
                    <RecommendList recommendList={recommendListJS}/>
                </div>
            </Scroll>
        </Content>
    )
}

const mapStateToProps = (state) => ({ // 映射全局state到recommend组件的props上
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
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
