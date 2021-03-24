// 推荐页面组件

import React from 'react';
import Slider from "../../components/slider" // 引入banner轮播组件
import RecommendList from "../../components/list" // 引入推荐列表组件
import Scroll from '../../baseUI/scroll/index'; // 引入better-scroll插件
import { Content } from "./style";


function Recommend (props) {
  // banner轮播mock数据
  const bannerList = [1,2,3,4].map( item => {
    return  { imageUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg", key: item }
  })
  // 推荐列表轮播mock数据
  const recommendList = [1,2,3,4,5,6,7,8,9,10].map(item => {
    return {
      id: 1,
      picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
      playCount: 17171122,
      name: "朴树、许巍、李健、郑钧、老狼、赵雷",
      key: item
    }
  })
  return (
    <Content>
      <Scroll  className="list">
        <div>
          <Slider bannerList={bannerList} />
          <RecommendList recommendList={recommendList} />
        </div>
      </Scroll>
    </Content>
  )
}

export default React.memo (Recommend);