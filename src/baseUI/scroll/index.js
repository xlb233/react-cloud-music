// scroll是一个滚动条插件，很多地方都需要用，所以将其放在baseUI目录下。

import BScroll from 'better-scroll'
import styled from 'styled-components'
import {useState, useRef, useEffect, useImperativeHandle} from 'react'
import PropTypes from "prop-types"
import {forwardRef} from 'react' // 函数组件无法使用React.createRef(), 所以引入forwardRef进行包裹

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`

const Scroll = forwardRef((props, ref) => {
    // 组件逻辑
    const [bScroll, setBScroll] = useState(null) // 设置state
    const scrollContainerRef = useRef() // 设置外部组件使用时的ref
    const {direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom} = props
    const {pullUp, pullDown, onScroll} = props

    // 在组件加载后或刷新后，对scroll方法做一些操作
    useEffect(() => { // 类似componentDidMount和componentDidUpdate
        const scroll = new BScroll(scrollContainerRef.current, { // 实例化scroll插件
            scrollX: direction === 'horizontal',
            scrollY: direction === 'vertical',
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        })
        setBScroll(scroll)
        return () => { // useEffect返回的是在销毁时需要调用的方法
            setBScroll(null) // 把state中的scroll参数置为null
        }
    }, [])

    useEffect(() => { // 重新加载时刷新滚动条插件
        if (refresh && bScroll) {
            bScroll.refresh()
        }
    })

    useEffect(() => { // 绑定滚动事件
        if (!bScroll || !onScroll) return;
        bScroll.on('scroll', (scroll) => {
            onScroll(scroll);
        })
        return () => {
            bScroll.off('scroll');
        }
    }, [onScroll, bScroll]);

    useEffect(() => { // 上拉到底判断
        if (!bScroll || !pullUp) return;
        bScroll.on('scrollEnd', () => {
            // 判断是否滑动到了底部
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUp();
            }
        });
        return () => {
            bScroll.off('scrollEnd');
        }
    }, [pullUp, bScroll])

    useEffect(() => { // 下拉刷新判断，
        if (!bScroll || !pullDown) return;
        bScroll.on('touchEnd', (pos) => {
            // 判断用户的下拉动作
            if (pos.y > 50) {
                pullDown();
            }
        });
        return () => {
            bScroll.off('touchEnd');
        }
    }, [pullDown, bScroll]);

    useImperativeHandle(ref, () => ({
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));

    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
        </ScrollContainer>
    )
})

// Scroll组件需要接收的参数，校验
Scroll.propTypes = {
    direction: PropTypes.oneOf(['vertical', 'horizontal']), // 滚动方向，垂直水平
    refresh: PropTypes.bool, // 是否刷新
    click: PropTypes.bool, // 是否支持点击
    onScroll: PropTypes.func, // 页面滚动时触发的回调函数
    pullUp: PropTypes.func, // 上拉加载逻辑
    pullDown: PropTypes.func, // 下拉加载逻辑
    pullUpLoading: PropTypes.bool,// 是否显示上拉 loading 动画
    pullDownLoading: PropTypes.bool,// 是否显示下拉 loading 动画
    bounceTop: PropTypes.bool,// 是否支持向上吸顶
    bounceBottom: PropTypes.bool// 是否支持向下吸底
}

// Scroll组件需要接受的参数，默认值
Scroll.defaultProps = {
    direction: 'vertical',
    refresh: true,
    click: true,
    onScroll: null,
    pullUp: null,
    pullDown: null,
    pullUpLoading: false,
    pullDownLoading: false,
    bounceTop: true,
    bounceBottom: true
}

export default Scroll
