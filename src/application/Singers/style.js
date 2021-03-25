// better-scroll滚动原理 外部容器宽度/高度要固定，内容宽度要大于容器宽度

import styled from "styled-components";
import style from "../../assets/global-style" // 基础样式

export const NavContainer  = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%; // 设置容器宽度为100%，而列表长度是远大于容器宽度的，这样一来就解决了滚动问题
  padding: 5px;
  overflow: hidden;
`;