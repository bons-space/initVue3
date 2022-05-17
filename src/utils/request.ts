import axios from 'axios'; // 引入axios
import { getToken } from '@/utils/auth';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API as string,
  timeout: 20000,
});

// http request 拦截器
service.interceptors.request.use(
  (config) => {
    // 全局添加 token
    if (getToken()) {
      (config.headers as any).token = getToken()
    }
    return config;
  },
  (error) => {
    console.error(error);
    return Promise.reject(error);
  },
);

// http response 拦截器
service.interceptors.response.use(
  (response) => response, // 全部返回了
  (error) => {
    // 网络超时
    if (error.message && error.message.includes('timeout')) {
      console.error('请求超时');
      return error.message;
    }
    if (error.response && error.response.status && error.response.status === 500) {
      // 没有权限
      console.error('接口异常');
      return error;
    }
    return error;
  },
);

export default service;
