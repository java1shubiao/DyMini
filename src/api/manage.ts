import axios from '@/utils/request/index';
import { Method, AxiosResponse } from 'axios-miniprogram';
import { transferParams } from '@/utils/tools';

// 平台兼容性测试, axios-miniprogram 仅 get post put delete 为全平台兼容, 和uniapp对比后, 只有get和post为全平台兼容。

// post
export const postAction = <T extends {}>(url: string, parameter?: T): Promise<AxiosResponse> => {
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data: parameter
  });
};

export const postActionBizData = (url: string, parameter?: any, trans?: any): Promise<AxiosResponse> => {
  return axios({
    url: url,
    method: 'post',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    data:
      trans !== 1
        ? {
            bizData: parameter,
            app_id: parameter && parameter.app_id
          }
        : parameter
  }).then(res => {
    res.data = { ...transferParams(res.data as any, false) };
    return res;
  });
};

// post method= {post | get}
export const httpAction = <T extends {}>(method: Method, url: string, parameter?: T): Promise<AxiosResponse> => {
  return axios({
    url: url,
    method: method,
    data: parameter
  });
};

export const reAction = (config: any): Promise<AxiosResponse> => {
  return axios(config);
};

// get
export const getAction = <T extends {}>(url: string, parameter?: T): Promise<AxiosResponse> => {
  return axios({
    url: url,
    method: 'get',
    params: parameter
  });
};

// get
export const getActionBizData = (url: string, parameter?: any, trans?: any): Promise<AxiosResponse> => {
  return axios({
    url: url,
    method: 'get',
    params:
      trans !== 1
        ? {
            bizData: parameter,
            app_id: parameter && parameter.app_id
          }
        : parameter
  }).then(res => {
    res.data = { ...transferParams(res.data as any, false) };
    return res;
  });
};
