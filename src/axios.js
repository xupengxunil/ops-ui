import axios from "axios";
import { getToken } from './composables/auth';
import { notifyMessage } from './composables/util';
import router from "./router"
import { setToken, removeToken } from './composables/auth'


const service = axios.create({
  baseURL: "/api",
  timeout: 60000,
})

// 添加请求拦截器
service.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = getToken()

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`
  }

  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
service.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response.data;
}, function (error) {
  let response = error.response;
  const status = response.status;
  // 对响应错误做点什么

  if (status === 401) {

    removeToken()

    // localStorage.removeItem('token');
    // 重定向用户到登录页面
    router.push('/login');
  }

  console.log(error)

  notifyMessage(error.response.data.msg || "请求失败", "error")

  return Promise.reject(error);
});


export default service