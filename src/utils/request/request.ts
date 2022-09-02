import axios, { AxiosRequestConfig, AxiosResponse, AxiosBaseInstance, AxiosError } from 'axios-miniprogram';
import { transferParams } from '../tools';
import { TOKEN_REFRESH } from '@/constants/code';
import store from '@/store';
import globalConfig, { BASE_URL } from '@/constants/config';
import { err, getNowConfig, refreshToken, waitTokenComing, handleReLogin } from './utils';
import { LOGIN_URL, LOG_OUT } from '@/constants/lgoin/index';

// const CancelToken = axios.CancelToken;

const service: AxiosBaseInstance = axios.create({
  baseURL: globalConfig[BASE_URL] as string,
  enableHttp2: true,
  enableCache: true,
  enableQuic: true,
  timeout: 100000 // 请求超时时间 100s
});

// 请求拦截
service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = refreshToken();
    if (token || config?.url?.includes?.(LOGIN_URL) || config?.url?.includes?.(LOG_OUT)) {
      return getNowConfig(config, token);
    } else {
      return store.dispatch('Login/handleLogin').then(() => {
        return waitTokenComing(config);
      });
    }
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// 响应拦截
service.interceptors.response.use((response: AxiosResponse<{}>) => {
  // * 标识为已响应
  store.dispatch('RequestModule/response', response.config.url);
  // 获取服务端返回数据
  const data = transferParams(response.data, true);
  // 需要重新登录
  if (data.code === TOKEN_REFRESH) {
    return handleReLogin(data);
  }
  return data;
}, err);

export default service;
