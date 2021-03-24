import {axiosInstance} from "./config";

export const getBannerRequest = () => { // 获取banner
    return axiosInstance.get('/banner')
}

export const getRecommendRequest = () => { // 获取推荐信息
    return axiosInstance.get('/personalized')
}
