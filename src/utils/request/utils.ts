import { RE_LOAD_STATE, RE_LOGIN_STATE, BACK_HOME_STATE, PAGE_LOGIN } from '@/constants';
import axios, { AxiosError, AnyObject, AxiosRequestConfig } from 'axios-miniprogram';
import { transferParams, getCurPageUrl, toErrorPage, getStorage } from '../tools';
import { ACCESS_TOKEN, GREY_APP_ID, COOKIE, APP_ID, LOGIN_URL } from '@/constants/lgoin/index';
import globalConfig, { STORE_APP_ID } from '@/constants/config';
import store from '@/store';
import { APP_NAME } from '@/constants/users';
import { buriedEvent } from '@/utils/buried';

const CancelToken = axios.CancelToken;

const getCancelToken = (config: AxiosRequestConfig) => {
  return new CancelToken(cancel => {
    const actionName = config.url!;
    if (!actionName.includes(LOGIN_URL)) {
      store.dispatch('RequestModule/setCancel', { cancel, actionName });
    }
  });
};

// * 超时标识符
const TIMEOUT_MARK = '网络异常';
// * 取消标识
const ON_CANCEL_MSG = '用户手动取消网络请求';

export const err = (error: AxiosError): Promise<AxiosError> => {
  if (error.message.includes(ON_CANCEL_MSG)) {
    // 用户主动取消不做处理
    return Promise.reject(error);
  }
  // 判断请求异常信息中是否含有 网络异常 字符串
  if (error.message.includes(TIMEOUT_MARK)) {
    toErrorPage(RE_LOAD_STATE, getCurPageUrl());
  } else {
    // 其他异常
    toErrorPage(BACK_HOME_STATE, getCurPageUrl());
  }
  // 穿透错误信息
  return Promise.reject(error);
};

export const getNowConfig = (config: AxiosRequestConfig, token: string): AxiosRequestConfig => {
  config.cancelToken = getCancelToken(config);
  const appId = getStorage(GREY_APP_ID);
  const appName = getStorage(APP_NAME);
  const cookie = `token=${token};app_id=${appId || globalConfig[STORE_APP_ID]};app_name=${appName}`;
  (config.headers as AnyObject)[COOKIE] = cookie; // 让每个请求携带自定义 token 请根据实际情况自行修改
  (config.headers as AnyObject)[APP_ID] = appId || globalConfig[STORE_APP_ID];
  (config.headers as AnyObject)[APP_NAME] = appName || '';
  const time = (new Date().valueOf() / 1000) >>> 0; // 转换为秒

  if (config.params && typeof config.params === 'object') {
    config.params = { ...transferParams(config.params, false), _t: time };
  }

  if (config.data && typeof config.data === 'object') {
    config.data = { ...transferParams(config.data, false), _t: time };
  }
  return config;
};

// * 重新获取token
export const refreshToken = () => {
  return getStorage(ACCESS_TOKEN);
};

/**
 * 等待token回来在获取请求配置
 * @param config 请求配置
 * @param prevTmp 首次请求时间戳
 * @returns 请求配置
 */
export const waitTokenComing = (
  config: AxiosRequestConfig,
  prevTmp = new Date().valueOf()
): AxiosRequestConfig | Promise<AxiosRequestConfig> => {
  const curTmp = new Date().valueOf();
  const token = refreshToken();
  console.info(token, 'token');
  // ? 超时时间100s, 防止宏队列占用导致栈溢出
  const isTimeout = ((curTmp - prevTmp) / 1000) >>> 0 > 100;
  if (token || isTimeout) {
    // * 防止重复进入登录超时逻辑
    const refreshStatus = store.getters['Login/getRefreshStatus'];
    if (isTimeout && !refreshStatus) {
      buriedEvent(PAGE_LOGIN, { msg: '登录超时' });
      // * 防止进入token过期逻辑
      store.commit('Login/SET_REFRESH_STATUS', true);
      // * 超时进入登录过期页面
      toErrorPage(RE_LOGIN_STATE, getCurPageUrl());
      // * 取消请求
      store.commit('RequestModule/CANCEL_ALL');
    }
    return getNowConfig(config, token);
  }
  return new Promise(resolve => {
    // * 此处需要使用宏队列排队, 否则会卡主执行栈, 导致栈溢出
    setTimeout(async () => {
      resolve(await waitTokenComing(config, prevTmp));
    });
  });
};

/**
 * 处理重新登录逻辑, 对退登上锁, 防止连续重登陆, 然后刷新页面, 以宏队列的形式解除任务锁, 防止请求响应后连刷
 * @param data 响应数据
 * @returns 新的响应数据
 */
export const handleReLogin = (data: any) => {
  const refreshStatus = store.getters['Login/getRefreshStatus'];
  if (!refreshStatus) {
    buriedEvent(PAGE_LOGIN, { msg: 'token过期, 重新登录' });
    // * 开始重登陆逻辑, 上锁防止连续重登
    store.commit('Login/SET_REFRESH_STATUS', true);
    // * 取消前面所有请求, 否则全部走入过期逻辑, 平白消耗后端资源, 没有意义
    store.commit('RequestModule/CANCEL_ALL');
    // * 需要请求登录, 并重新发起请求
    store.dispatch('Login/handleLogin').then(() => {
      const url = getCurPageUrl();
      // * 刷一下页面让请求重走
      uni.reLaunch({ url });
      setTimeout(() => {
        store.commit('Login/SET_REFRESH_STATUS', false); // 已登录
      });
    });
  }
  // * 登录过期不提示
  return { ...data, msg: '' };
};
