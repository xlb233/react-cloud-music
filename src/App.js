import React from "react";
// 引入./style.js通过styled-components包生成的的全局样式
import {GlobalStyle} from "./style";
// 引入字体样式，同样是styled-components包生成的
import { IconStyle } from "./assets/iconfont/iconfont";
// 引入路由配置
import routes from "./routes/index";
import { renderRoutes } from 'react-router-config';//renderRoutes 读取路由配置转化为 Route 标签
import { HashRouter } from 'react-router-dom';
// 引入redux的store
import store from "./store/index"
// react-redux提供的根组件
import { Provider } from 'react-redux'

function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <GlobalStyle></GlobalStyle>
        <IconStyle></IconStyle>
        { renderRoutes(routes) }
      </HashRouter>
    </Provider>
  );
}

export default App;
