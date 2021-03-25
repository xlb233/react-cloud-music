// 歌手页面组件
import React, {useState} from "react"
import HorizonList from "../../baseUI/horizonList"; //
import {categoryTypes, alphaTypes} from "../../api/constant"
import {NavContainer} from "./style"

function Singers(props) {
    let [category, setCategory] = useState('')
    let [alpha, setAlpha] = useState('')

    // 点击后的事件回调，改变样式为选中状态
    let handleUpdateAlpha = (styleVal) => {
        setAlpha(styleVal)
    }
    let handleUpdateCategory = (styleVal) => {
        setCategory(styleVal)
    }
    return (
        <NavContainer>
            <HorizonList
                list={categoryTypes}
                title={"分类 (默认热门):"}
                handleClick={handleUpdateCategory}
                val={category}
            />
            <HorizonList
                list={alphaTypes}
                title={"首字母:"}
                handleClick={handleUpdateAlpha}
                val={alpha}
            />

        </NavContainer>
    )
}

export default React.memo(Singers);