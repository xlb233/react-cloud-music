import React from "react";
// 引入./style.js通过styled-components包生成的的全局样式
import {GlobalStyle} from "./style";
// 引入字体样式，同样是styled-components包生成的
import { IconStyle } from "./assets/iconfont/iconfont";

function App() {
  return (
    <div className="App">
      <GlobalStyle></GlobalStyle>
      <IconStyle></IconStyle>
      <i className="iconfont">&#xe62b;</i>
    </div>
  );
}

export default App;
