// banner轮播组件，将在推荐组件中被引入使用

import React, { useState, useEffect } from 'react' // 引入react钩子
import { SliderContainer } from './style' // 给轮播组件加样式
import Swiper, { Pagination, Autoplay } from 'swiper' // 引入插件，包括分页和自动轮播
import 'swiper/swiper-bundle.css' // 引入插件自带的样式

Swiper.use([Pagination, Autoplay]) // 在swiper插件中安装分页和自动轮播模块

function Slider (props) {
  const [sliderSwiper, setSliderSwiper] = useState (null) // state hook,声明一个叫做sliderSwiper的变量
  const { bannerList } = props // 取出父组件传入的props中的bannerList属性
  useEffect(() => {  // effect hook，类似componentDidMount和componentDidUpdate
    if (bannerList.length && !sliderSwiper){ // 若传入了轮播图列表，且当前还没有实例话轮播插件，就实例一个轮播插件
      let newSlideSwiper = new Swiper(".slider-container", {
        loop: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false
        },
        pagination: {el: '.swiper-pagination'}
      })
      setSliderSwiper(newSlideSwiper)
    }
  }, [bannerList.length, sliderSwiper]) 
  
  return (
    <SliderContainer>
      <div className="before"></div>
      <div className="slider-container">
        <div className="swiper-wrapper">
          {
            bannerList.map (slider => {
              return (
                <div className="swiper-slide" key={slider.imageUrl}>
                  <div className="slider-nav">
                    <img src={slider.imageUrl} width="100%" height="100%" alt="推荐" />
                  </div>
                </div>
              )
            })
          }
        </div>
        <div className="swiper-pagination"></div>
      </div>
    </SliderContainer>
  )
}

export default React.memo(Slider)