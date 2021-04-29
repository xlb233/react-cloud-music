import React, {useRef, useState,useEffect} from "react";
import styled from "styled-components";
import style from "../../assets/global-style";
import {prefixStyle} from "../../api/utils";

const ProgressBarWrapper = styled.div`
  margin: 0 auto;
  display: flex;
  height: 30px;
  width: 300px;
  padding: 10px 0;
  align-items: center;

  .bar-inner {
    position: relative;
    flex: 8;
    height: 4px;
    background: rgba(0, 0, 0, .3);

    .progress {
      width: 0;
      height: 100%;
      background: ${style["theme-color"]};
    }

    .progress-btn-wrapper {
      position: absolute;
      top: -6.5px;
      width: 30px;
      height: 30px;

      .progress-btn {
        height: 16px;
        width: 16px;
        box-sizing: border-box;
        border: 3px solid ${style["border-color"]};
        border-radius: 50%;
        background: ${style["theme-color"]};
      }
    }
  }

  .time {
    flex: 0 0 30px;
    color: ${style["font-color-desc"]};
    font-size: ${style["font-size-s"]};
    line-height: 30px;
    padding: 10px 0;
    width: 30px;

    &.time-l {
      text-align: left;
    }

    &.time-r {
      text-align: right;
    }
  }
`

function ProgressBar(props) {

  const {time_l, time_r, percent} = props;
  const {percentChange} = props;
  const transform = prefixStyle('transform');
  const [touch, setTouch] = useState({});
  const progressRef = useRef(),
    progressBtnRef = useRef(),
    progressBarRef = useRef();
  const progressBtnWidth = 8;
  const _offset = (offsetWidth) => {
    progressRef.current.style.width = `${offsetWidth}px`
    progressBtnRef.current.style.transform = `translate3d(${offsetWidth}px, 0, 0)`
  }

  useEffect(() => {
    if(percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBarRef.current.clientWidth - progressBtnWidth;
      const offsetWidth = percent * barWidth;
      progressRef.current.style.width = `${offsetWidth}px`;
      progressBtnRef.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
    }
    // eslint-disable-next-line
  }, [percent]);

  const _changePercent = () => {
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth;
    const curPercent = progressRef.current.clientWidth / barWidth;
    percentChange(curPercent);
  }
  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiated = true;
    startTouch.startX = e.touches[0].pageX;
    startTouch.left = progressRef.current.clientWidth; // 滑动开始时的横坐标
    setTouch(startTouch);
  }

  const progressTouchMove = (e) => {
    if (!touch.initiated) return
    const deltaX = e.touches[0].pageX - touch.startX; // 拖动的距离
    const barWidth = progressBarRef.current.clientWidth - progressBtnWidth;
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth); // 填充颜色，移动btn
    // _changePercent();
  }

  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch)); // 深复制
    endTouch.initiated = false;
    setTouch(endTouch);
    _changePercent();
  }

  const progressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const offsetWidth = Math.min((e.pageX - rect.left), progressBarRef.current.clientWidth - progressBtnWidth)
    _offset(offsetWidth);
    _changePercent();
  };

  return (
    <ProgressBarWrapper>
      <div className="time time-l">{time_l}</div>
      <div className="bar-inner" ref={progressBarRef} onClick={progressClick}>
        <div className="progress" ref={progressRef}/>
        <div
          className="progress-btn-wrapper"
          ref={progressBtnRef}
          onTouchStart={progressTouchStart}
          onTouchMove={progressTouchMove}
          onTouchEnd={progressTouchEnd}
        >
          <div className="progress-btn"/>
        </div>
      </div>
      <div className="time time-r">{time_r}</div>
    </ProgressBarWrapper>
  )
}

export default React.memo(ProgressBar)