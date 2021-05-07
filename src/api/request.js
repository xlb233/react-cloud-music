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

export const getRankListRequest = () => { // 获取排名
    return axiosInstance.get('/toplist/detail');
}

export const getAlbumDetailRequest = id => { // 获取歌单详情
    return axiosInstance.get(`/playlist/detail?id=${id}`);
}

export const getSingerInfoRequest = id => { // 获取歌手详情页面
    return axiosInstance.get(`/artists?id=${id}`);
}

export const getLyricRequest = id => { // 获取歌词
    return axiosInstance.get(`/lyric?id=${id}`);
}