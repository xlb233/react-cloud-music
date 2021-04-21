import styled from "styled-components";
import style from "../../../assets/global-style";
import {rotate} from "../MiniPlayer/style";

export const NormalPlayerContainer = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: ${style["background-color"]};

  &.normal-enter,
  &.normal-exit-done {
    .top {
      transform: translate3d(0, -100px, 0);
    }

    .bottom {
      transform: translate3d(0, 100px, 0);
    }
  }

  &.normal-enter-active,
  &.normal-exit-active {
    .top,
    .bottom {
      transform: translate3d(0, 0, 0);
      transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
    }

    opacity: 1;
    transition: all 0.4s;
  }

  &.normal-exit-active {
    opacity: 0;
  }

  .background {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);

    &.layer {
      background: rgb(46, 48, 48);
      opacity: 0.3;
      filter: none;
    }
  }
`

export const Top = styled.div`
  position: absolute;
  width: 100%;
  height: 8%;
  z-index: 50;
  display: flex;
  border-bottom: 1px solid rgba(228, 228, 228, 0.1);
  padding-bottom: 5px;
  align-items: center;

  .back {
    flex: 1;
    display: flex;
    align-items: center;

    .iconfont {
      display: block;
      padding: 9px;
      font-size: 24px;
      color: ${style["font-color-desc"]};
      font-weight: bold;
      transform: rotate(90deg);
    }
  }

  .desc {
    flex: 7;
    display: flex;
    flex-direction: column;
    margin-top: 10px;

    .title {
      line-height: 25px;
      font-size: ${style["font-size-l"]};
      color: ${style["font-color-desc"]};
      ${style.noWrap()};
    }

    .subtitle {
      line-height: 20px;
      font-size: ${style["font-size-m"]};
      color: ${style["font-color-desc-v2"]};
      ${style.noWrap()};
    }
  }
`

export const Middle = styled.div`
  position: fixed;
  width: 100%;
  top: 80px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  overflow: hidden;
`

export const CdWrapper = styled.div`
  position: absolute;
  margin: auto;
  top: 10%;
  left: 0;
  right: 0;
  width: 80%;
  box-sizing: border-box;
  height: 80vw;

  .cd {
    width: 100%;
    height: 100%;
    border-radius: 50%;

    .image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid rgba(255, 255, 255, 0.1);
    }

    .play {
      animation: ${rotate} 20s linear infinite;

      &.pause {
        animation-play-state: paused;
      }
    }
  }
}
`

export const Bottom = styled.div`
  position: absolute;
  bottom: 50px;
  width: 100%;
`
export const Operators = styled.div`
  display: flex;
  align-items: center;

  .icon {
    font-weight: 300;
    flex: 1;
    color: ${style["font-color-desc"]};

    &.disable {
      color: ${style["theme-color-shadow"]};
    }

    i {
      font-weight: 300;
      font-size: 30px;
    }
  }

  .i-left {
    text-align: right;
  }

  .i-center {
    padding: 0 20px;
    text-align: center;

    i {
      font-size: 40px;
    }
  }

  .i-right {
    text-align: left;
  }

  .icon-favorite {
    color: ${style["theme-color"]};
  }
`;