/* 点击SongsList中的歌曲，触发的音符陨落动画组件 */
import React, {forwardRef, useRef, useImperativeHandle, useEffect} from "react";
import styled from "styled-components";
import style from "../../assets/global-style";
import {prefixStyle} from "../../api/utils";

const Container = styled.div`
  .icon_wrapper {
    position: fixed;
    z-index: 1000;
    margin-top: -10px;
    margin-left: -10px;
    color: ${style["theme-color"]};
    font-size: 14px;
    display: none;
    transition: transform 1s cubic-bezier(.62,-0.1,.86,.57);
    transform: translate3d(0, 0, 0);
    >div {
      transition: transform 1s;
    }
  }
`

const MusicNote = forwardRef((props, ref) => {
  const iconsRef = useRef('');
  const ICON_NUMBERS = 3; // 最多同时存在3个音符
  const transform = prefixStyle("transform");

  // 原生 DOM 操作，返回一个 DOM 节点对象
  const createNode = (txt) => {
    const template = `<div class='icon_wrapper'>${txt}</div>`;
    let tempNode = document.createElement('div');
    tempNode.innerHTML = template;
    return tempNode.firstChild;
  }

  useEffect(() => {
    for (let i = 0; i < ICON_NUMBERS; i++) {
      let node = createNode(`<div class="iconfont">&#xe642;</div>`);
      iconsRef.current.appendChild(node);
      let domArr = [...iconsRef.current.children];
      domArr.forEach(item => {
        item.running = false;
        // 动画结束后的事件。
        item.addEventListener('transitionend', function () {
          this.style['display'] = 'none';
          this.style[transform] = `translate3d(0, 0, 0)`;
          this.running = false;
          let icon = this.querySelector('div');
          icon.style[transform] = `translate3d(0, 0, 0)`;
        }, false);
      });
    }
  }, []);

  const startAnimation = ({x, y}) => {
    for (let i = 0; i < ICON_NUMBERS; i++) {
      let domArray = [...iconsRef.current.children];
      let item = domArray[i]
      // 选择一个空闲的元素来开始动画
      if (item.running === false) {
        item.style.left = x + "px";
        item.style.top = y + "px";
        item.style.display = "inline-block";

        // 用setTimeout触发页面回流，使得item可以正常显示
        setTimeout(() => {
          item.running = true;
          item.style[transform] = `translate3d(0, 750px, 0)`; // 向下掉落750px
          let icon = item.querySelector("div");
          icon.style[transform] = `translate3d(-40px, 0, 0)`; // 向左飘动40px
        }, 20);
        break;
      }
    }
  };
  // 外界调用的 ref 方法
  useImperativeHandle(ref, () => ({
    startAnimation
  }));
  return (
    <Container ref={iconsRef}/>
  )
})

export default React.memo(MusicNote);