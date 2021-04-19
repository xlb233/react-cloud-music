// 路由配置文件，利用 react-router-config 来对路由进行配置。
// 将在../App.js中引入
import React from "react"
import { Redirect } from "react-router-dom"
// Home组件是公共组件
import Home from '../application/Home';
// 推荐、歌手、排名等分别是具体的功能组件
import Recommend from '../application/Recommend';
import Singers from '../application/Singers';
import Singer from  '../application/Singer';
import Rank from '../application/Rank';
import Album from "../application/Album";

export default [
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => (
          <Redirect to={"/recommend"}/>
        )
      },
      {
        path: "/recommend",
        component: Recommend,
        // 子路由
        routes: [
          {
            path: "/recommend/:id",
            component: Album
          }
        ]
      },
      {
        path: "/singers",
        component: Singers,
        key:"singers",
        routes: [
          {
            path: "/singers/:id",
            component: Singer
          }
        ]
      },
      {
        path: "/rank",
        routes: [
          {
            path: "/rank/:id",
            component: Album
          }
        ],
        component: Rank
      }
    ]

  }
]