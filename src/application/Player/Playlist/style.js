import styled from "styled-components";
import style from "../../../assets/global-style";

export const PlaylistWrapper = styled.div`
  // PlaylistWrapper是覆盖整个页面的遮罩层
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 1010;
  background: ${style["background-color-shadow"]};
  // 以下动画控制playlist进入和退出时的透明度
  &.list-fade-enter {
    opacity: 0;
  }
  &.list-fade-enter-active {
    opacity: 1;
    transition: all 0.3s;
  }
  &.list-fade-exit {
    opacity: 1;
  }
  &.list-fade-exit-active {
    opacity: 0;
    transition: all 0.3s;
  }
  .list_wrapper {
    // 真正的播放列表
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    opacity: 1;
    border-radius: 10px 10px 0 0;
    background: ${style["highlight-background-color"]};
    transform: translate3d(0, 0, 0);
  }
  .iconfont {
    margin-right: 10px;
    font-size: ${style["font-size-ll"]};
    color: ${style["theme-color"]};
  }
`
export const ListHeader = styled.div`
  //position: relative;
  padding: 20px 0 10px 20px;
  display: flex;
  align-items: center;
  .title {
    flex: 7;
    font-size: ${style["font-size-m"]};
    color: ${style["font-color-desc"]};
  }
  .iconfont {
    flex: 1;
  }
`

export const ScrollWrapper = styled.div`
  height: 400px;
  overflow: hidden;
`

export const ListContent = styled.div`
  overflow: hidden;
`

export const ListItem = styled.div`
  height: 40px;
  //padding: 0 30px 0 20px;
  overflow: hidden;
  display: flex;
  align-items: center;
  .text {
    position: relative;
    flex: 9;
    display: flex;
    align-items: center;
    >span{
      position: absolute;
      left: 20px;
      ${style.noWrap()}
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc-v2"]};
    }
  }
  .icon-wrapper {
    flex: 1.5;
  }
  .current {
    font-size: 13px;
    display: inline-block;
    position: absolute;
    left: 5px;
  }
`