// getCount函数，是一个工具函数，用于给播放量等数字增加单位，将用在推荐列表等多个组件中
export const getCount = (count) => {
    if (count < 0) return;
    if (count < 10000) {
        return count;
    } else if (Math.floor(count / 10000) < 10000) {
        return Math.floor(count / 1000) / 10 + "万";
    } else {
        return Math.floor(count / 10000000) / 10 + "亿";
    }
}

// 防抖函数
export const debounce = (func, delay) => {
    let timer
    return (...args) => {
        if (timer) {
            clearTimeout(timer)
        }
        timer = setTimeout(()=>{
            func.apply(this, args)
            clearTimeout(timer)
        }, delay)
    }
}