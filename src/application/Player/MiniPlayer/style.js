import styled, {keyframes} from "styled-components";
import style from "../../../assets/global-style"

// 旋转动画，由于缩小版和完整版都会用到，所以提取出来
export const rotate = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
`

export const MiniPlayerContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1000;
  width: 100%;
  height: 60px;
  background: ${style["highlight-background-color"]};
  display: flex;
  align-items: center;

  &.mini-enter {
    transform: translate3d(0, 100%, 0);
  }

  &.mini-enter-active {
    transform: translate3d(0, 0, 0);
    transition: all 0.4s;
  }

  &.mini-exit-active {
    transform: translate3d(0, 100%, 0);
    transition: all .4s
  }

  .icon {
    width: 40px;
    height: 40px;
    flex: 0 0 40px;
    padding: 0 10px 0 20px;

    .img_wrapper {
      width: 100%;
      height: 100%;

      > img {
        border-radius: 50%;

        &.play {
          animation: ${rotate} 10s linear infinite;

          &.pause {
            animation-play-state: paused;
          }
        }
      }
    }
  }

  .desc_wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    line-height: 20px;
    flex: 1;
    overflow: hidden;

    .trackName {
      margin-bottom: 2px;
      font-size: ${style['font-size-m']};
      color: ${style['font-color-desc']};
      ${style.noWrap()}
    }

    .artistName {
      font-size: ${style['font-size-s']};
      color: ${style['font-color-desc-v2']};
      ${style.noWrap()}
    }
  }

  .control_wrapper {
    display: flex;
    align-items: center;

    > div {
      padding: 0 6px;
    }

    .iconfont {
      font-size: 30px;
      color: ${style["theme-color"]};
    }


    .icon-mini {
      font-size: 16px;
      position: absolute;
      top: 8px;
      left: 8px;

      &.icon-play {
        left: 9px;
      }
    }

    .listControl {

    }
  }
`
