import React, {useEffect, useState, useRef, useMemo} from "react";
import styled from "styled-components";
import style from "../../assets/global-style";
import {debounce} from "../../api/utils";

const SearchBoxWrapper = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  padding-right: 20px;
  height: 40px;
  background: ${style["theme-color"]};
  .icon-back {
    font-size: 24px;
    color: ${style["font-color-light"]};
  }
  .box {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: ${style["theme-color"]};
    color: ${style["highlight-background-color"]};
    font-size: ${style["font-size-m"]};
    outline: none;
    border: none;
    border-bottom: 1px solid ${style["border-color"]};
    &::placeholder {
      color: ${style["font-color-light"]};
    }
  }
  .icon-delete {
    font-size: 16px;
    color: ${style["background-color"]};
  }
`

export const SearchBox = (props) => {
  const {newQuery} = props; // 从父组件中传来的搜索字符
  const {handleQuery, back} = props; // 具体的查询处理
  const [queryStr, setQueryStr] = useState(''); // 输入框输入
  const queryRef = useRef();
  const isClearDisplay = queryStr ? {display: "block"} : {display: "none"}; // 是否显示清空按钮
  useEffect(()=>{
    queryRef.current.focus(); // 进场时聚焦到输入框
  }, [])

  useEffect(() => {
    handleQueryDebounced(queryStr);
  }, [queryStr])

  useEffect(()=>{
    if (newQuery !== queryStr) { // 若父组件传来的值不等于搜索框手动输入的值，说明是点击热搜
      setQueryStr(newQuery)
    }
  }, [newQuery]);

  const handleChange = (e) => {
    setQueryStr(e.currentTarget.value);
  };

  const handleQueryDebounced = useMemo(() => {
    return debounce(handleQuery, 500);
  }, [handleQuery]);

  const handleClear = () => {
    setQueryStr('');
    queryRef.current.focus();
  };

  return (
    <SearchBoxWrapper>
      <i
        className="iconfont icon-back"
        onClick={() => {
          back()
        }}
      >&#xe655;</i>
      <input
        ref={queryRef}
        className="box"
        placeholder="搜索歌曲、歌手、专辑"
        value={queryStr}
        onChange={handleChange}
      />
      <i
        className="iconfont icon-delete"
        onClick={handleClear}
        style={isClearDisplay}>&#xe600;</i>
    </SearchBoxWrapper>
  )
}