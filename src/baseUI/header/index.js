import React from "react";
import styled from "styled-components";
import style from '../../assets/global-style'
import PropTypes from 'prop-types'
import MyMarquee from '../myMarquee/index'

const HeaderContainer = styled.div`
  position: fixed;
  padding: 0 10px 5px 10px;
  height: 40px;
  width: 100%;
  z-index: 100;
  display: flex;
  line-height: 40px;
  color: ${style["font-color-light"]};

  .back {
    margin-right: 5px;
    font-size: 20px;
    width: 20px;
  }

  > h1 {
    font-size: ${style["font-size-l"]};
    font-weight: 700;
  }
`
// 使用React.forwardRef函数，接收一个函数作为参数，该函数以props和ref作为两个参数，返回一个组件
// 可以将ref传递给Header组件下面的一个element上
const Header = React.forwardRef((props, ref) => {
  const {handleClick, title, isMarquee, data} = props;
  return (
    <HeaderContainer ref={ref}>
      <i className="iconfont back" onClick={handleClick}>&#xe655;</i>
      {isMarquee ? <MyMarquee text={data}/> : <h1>{title}</h1>}
    </HeaderContainer>
  )
})

Header.defaultProps = {
  handleClick: () => {
  },
  data: "跑马灯",
  title: "标题",
  // 是否有跑马灯效果
  isMarquee: false
}

Header.propTypes = {
  handleClick: PropTypes.func,
  title: PropTypes.string,
  data: PropTypes.string,
  isMarquee: PropTypes.bool,
}

export default React.memo(Header)