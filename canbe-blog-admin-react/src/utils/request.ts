import axios from "axios";
import { message } from "antd";
import useTokenStore from "@/stores/token";

// 创建axios实例
const request = axios.create({
  // 基本请求路径的抽取
  baseURL: "/api",
  // 这个时间是你每次请求的过期时间，这次请求认为20秒之后这个请求就是失败的
  timeout: 20000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 每次请求时都从store中获取最新的token
    const { token } = useTokenStore.getState();
    // 如果token中有值，在携带
    if (token && token.trim() !== "") {
      config.headers.Authorization = token;
    }
    return config;
  },
  (err) => {
    //如果请求错误
    return Promise.reject(err);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (result) => {
    // 判断业务状态码
    if (result.data.code === 0) {
      // 响应成功，返回数据
      return result.data;
    }
    // 这里提示用户请求失败
    message.error(result.data.message ? result.data.message : "服务异常");
    // 异步操作的状态转化为失败的状态
    return Promise.reject(result.data);
  },
  (err) => {
    // 未登录
    if (err.response?.status === 401) {
      message.error("请先登录");
      // 清除token
      const { removeToken } = useTokenStore.getState();
      removeToken();
      // 跳转到登录页面
      window.location.href = "/login";
    } else {
      message.error("服务异常");
      return Promise.reject(err); //异步的状态转化成失败的状态
    }
  }
);

export default request;
