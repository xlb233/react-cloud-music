// Home公共组件的入口

import React from 'react';
import { NavLink } from 'react-router-dom'  // 利用 NavLink 组件进行路由跳转
import { renderRoutes } from "react-router-config";
// 引入在./style.js中生成的样式
import { Top, Tab, TabItem } from "./style"
// 引入Player组件
import Player from "../Player";
function Home (props) {
  const { route } = props
  return (
    <div>
      <Top>
        <span className="iconfont menu">&#xe65c;</span>
        <span className="title">Web App</span>
        <span className="iconfont search">&#xe62b;</span>
      </Top>
      <Tab>
        <NavLink to="/recommend" activeClassName="selected"><TabItem><span > 推荐 </span></TabItem></NavLink>
        <NavLink to="/singers" activeClassName="selected"><TabItem><span > 歌手 </span></TabItem></NavLink>
        <NavLink to="/rank" activeClassName="selected"><TabItem><span > 排行榜 </span></TabItem></NavLink>
      </Tab>
      { renderRoutes(route.routes) }
      <Player />
    </div>
  )
}

export default React.memo (Home);