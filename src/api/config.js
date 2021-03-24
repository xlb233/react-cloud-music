// axios配置
import axios from "axios";

export const baseUrl = "http://localhost:4000" // 本地起的网抑云api服务器url

// axios实例和拦截器配置
const axiosInstance = axios.create({
    baseURL: baseUrl
})

axiosInstance.interceptors.response.use(
    res => res.data,
    error => console.log(error, "something goes run with your network")
)

export {axiosInstance}