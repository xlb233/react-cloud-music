// 推荐列表组件，将被推荐组件引用。
import React from 'react';
import {
  ListWrapper,
  ListItem,
  List
} from './style'; // 引入在./style.js中通过styled-component生成的组件(dom)
import LazyLoad from 'react-lazyload'
import { getCount } from "../../api/utils.js"
import { withRouter } from "react-router-dom";
import placeHolder from "../../assets/placeholders/music.png"

function RecommendList (props) {
  const {playlistLength} = props;
  const enterDetail = (id) => {
      props.history.push(`/recommend/${id}`)
  }
  return (
    <ListWrapper>
      <h1 className="title"> 推荐歌单 </h1>
      <List>
        {
          props.recommendList.map ((item, index) => {
            return (
              <ListItem key={item.id} onClick={()=>enterDetail(item.id)}>
                <div className="img_wrapper">
                  <div className="decorate" />
                    {/*LazyLoad标签，用占位图片实现图片懒加载*/}
                    <LazyLoad placeholder={<img width="100%" height="100%" src={placeHolder} alt="music"/>}>
                        {/* 加此参数可以减小请求的图片资源大小 */}
                        <img src={item.picUrl + "?param=300x300"} width="100%" height="100%" alt="music"/>
                    </LazyLoad>
                  <div className="play_count">
                    <i className="iconfont play">&#xe885;</i>
                    {/* 此处getCount函数会定义在src/api/utils中 */}
                    <span className="count">{getCount (item.playCount)}</span>
                  </div>
                </div>
                <div className="desc">{item.name}</div>
              </ListItem>
            )
          })
        }
      </List>
    </ListWrapper>
  )
}

export default React.memo(withRouter(RecommendList))