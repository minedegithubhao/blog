import axios from "axios";
import { message } from "antd";
import store from "@/stores/index";
import { removeToken } from "@/stores/reducers/token";

// 创建axios实例
const instance = axios.create({
  // 基本请求路径的抽取
  baseURL: "/api",
  // 这个时间是你每次请求的过期时间，这次请求认为20秒之后这个请求就是失败的
  timeout: 20000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做什么
    const token = store.getState().tokenStore.token;
    // 如果token中有值，在携带
    if (token) {
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
instance.interceptors.response.use(
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
    console.log("err", err);
    // 未登录
    if (err.response?.status === 401) {
      message.error("请先登录");
      // 清除token
      store.dispatch(removeToken());
      // 跳转到登录页面
      window.location.href = "/login";
    } else {
      message.error("服务异常");
      return Promise.reject(err); //异步的状态转化成失败的状态
    }
  }
);

export default instance;
