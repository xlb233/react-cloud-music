// horizonList横向分类列表组件, 在诸如Singers的页面中会用到

import React, {useEffect, useRef} from "react";
import styled from "styled-components";
import PropTypes from "prop-types"
import Scroll from "../scroll/index"
import style from "../../assets/global-style"

// 由于列表和列表元素基础组件样式较少，直接写在 index.js 中
const List = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  overflow: hidden;

  > span:first-of-type {
    display: block;
    flex: 0 0 auto;
    padding: 5px 0;
    margin-right: 5px;
    color: grey;
    font-size: ${style ["font-size-m"]};
    vertical-align: middle;
  }
`
const ListItem = styled.span`
  flex: 0 0 auto;
  font-size: ${style ["font-size-m"]};
  padding: 5px 8px;
  border-radius: 10px;

  &.selected {
    color: ${style ["theme-color"]};
    border: 1px solid ${style ["theme-color"]};
    opacity: 0.8;
  }
`

function HorizonList(props) {
    const {list, title, styleVal, handleClick} = props // val用于改变样式
    const Category = useRef(null)
    useEffect(() => {
        let categoryDOM = Category.current;
        let tagElems = categoryDOM.querySelectorAll("span");
        let totalWidth = 0;
        Array.from(tagElems).forEach(ele => {
            totalWidth += ele.offsetWidth;
        });
        categoryDOM.style.width = `${totalWidth}px`;
    }, []);
    return (
        <Scroll direction={"horizontal"}>
            <div ref={Category}>
                <List>
                    <span>{title}</span>
                    {
                        list.map((item) => {
                            return (
                                <ListItem
                                    key={item.key}
                                    className={`${styleVal === item.key ? 'selected' : ''}`}
                                    onClick={() => handleClick (item.key)}
                                    >
                                    {item.name}
                                </ListItem>
                            )
                        })
                    }
                </List>
            </div>
        </Scroll>
    )

}

// 对要传入HorizonList的props参数进行校验
HorizonList.propTypes = {
    list: PropTypes.array, // 可选列表
    title: PropTypes.string, // 列表标题
    val: PropTypes.string, // 选中值
    handleClick: PropTypes.func, // 点击事件的回调函数
}
// 这些参数的默认值
HorizonList.defaultProps = {
    list: [],
    title: '',
    val: '',
    handleClick: null
}

export default React.memo(HorizonList)