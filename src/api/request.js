// 向后端api发送请求，

import {axiosInstance} from "./config";

export const getBannerRequest = () => { // 获取banner
    return axiosInstance.get('/banner')
}

export const getRecommendRequest = () => { // 获取推荐信息
    return axiosInstance.get('/personalized')
}

export const getHotSingerListRequest = (count) => {  // 获取当红歌手列表
    return axiosInstance.get(`/top/artists?offset=${count}`)
}

export const getSingerListRequest = (type, area, alpha, offset) => { // 根据选项筛选歌手
    return axiosInstance.get(
        `/artist/list?type=${type}&area=${area}&initial=${alpha.toLowerCase()}&offset=${offset}`
    )
}

export const getRankListRequest = () => {
    return axiosInstance.get('/toplist/detail')
}