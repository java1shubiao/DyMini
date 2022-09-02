import { AnyObject } from 'axios-miniprogram';
import { DY_SERVER, urlVersion } from '@/constants/domain';
import { IRectTypes } from './type';
import { replaceCDN } from '@xiaoe/js-tools/lib/replaceCDN';
import { switchTabPages, CANNOT_IN_ERROR_PAGE } from '@/constants';
import { getStorage as getStorageSync, setStorage as setStorageSync } from './storage';

// * 统一导出
export const getStorage = getStorageSync;
export const setStorage = setStorageSync;

// * 转换cdn
const replaceAllImg = (html: string, lazyLoad: boolean = false, originCi: Record<string, any> | string = '') => {
  const ci: Record<string, any> | string = originCi || '?imageMogr2/thumbnail/800x>';
  return html.replace(/<img[^>]*>/gi, function(str) {
    const srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i; // eslint-disable-line
    const dataSrc = lazyLoad ? 'data-src' : 'src';
    // 没有 src 属性的 <img></img> 匹配不到 返回 <img src="@/assets/imgs/photo_error.png" />
    const url = str.match(srcReg);

    if (Array.isArray(url) && url.length > 1) {
      const newSrc = replaceCDN(url[1], ci);
      return str.replace(url[0], ''.concat(dataSrc, '="').concat(newSrc, '"'));
    } else {
      return '<img '.concat(
        dataSrc,
        '="https://wechatapppro-1252524126.cdn.xiaoeknow.com/appAKLWLitn7978/image/b_u_5b2225aa46488_oGKN7IvA/ky19qhac05ix.png" />'
      );
    }
  });
};

const isArray = Array.isArray;

const isObject = (target: any) => typeof target === 'object';

// * 非未定义
export const isDef = (target: any) => target !== undefined && target !== null;

// * 下换线转驼峰
export function toHump(name: string) {
  return name.replace(/_(\w)/g, (all, letter) => {
    return letter.toUpperCase();
  });
}
// * 驼峰转换下划线
export function toLine(name: string) {
  if (/^[A-Z]/.test(name)) return name; // * 大写字母开头不做转换
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}

// * 转换请求参数
export const transferParams = (data: AnyObject, isToHump: boolean): any => {
  if (!data) {
    return {};
  }
  if (isArray(data)) {
    // * 处理数组
    return data.map(item => {
      return isObject(item) ? transferParams(item, isToHump) : item;
    });
  }
  return Object.keys(data).reduce((accu, key) => {
    let curValue = (data as AnyObject)[key];
    if (isToHump && typeof curValue === 'string' && curValue.includes('myqcloud.com')) {
      if (!curValue.includes('<img')) {
        if (curValue.includes('[') && curValue.includes(']')) {
          // 说明返回的数组字符串, 需要解开处理, 在转回来
          curValue = JSON.stringify(JSON.parse(curValue).map((item: string) => replaceCDN?.(item, {})));
        } else {
          // * 处理一般字符串
          curValue = replaceCDN?.(curValue, {});
        }
      } else {
        // * 处理富文本
        curValue = replaceAllImg(curValue);
      }
    }
    return Object.assign(accu, {
      [`${!isToHump ? toLine(key) : toHump(key)}`]: isObject(curValue) ? transferParams(curValue, isToHump) : curValue
    });
  }, {});
};

export const getUrl = (url: string, version: string = urlVersion, dy_serve = DY_SERVER): string =>
  `/${dy_serve}${url}/${version}`;

export const showToast = (
  title: string,
  icon: 'none' | 'success' | 'loading' | 'error' = 'none',
  duration: number = 2000
) => {
  uni.showToast({ title, icon: icon, duration });
};

export const hideToast = () => {
  uni.hideToast();
};

// originUrl示例: /xxx/xxx/xxx/xxx?aaa=123&bbb=123&ccc=123
/**
 *
 * @param {string} originUrl 原始url, 包含路径和参数
 * @returns {url: string url的真实路径; params: object 原始url上解析出来的参数}
 */
export const getUrlAndParams = (originUrl: string): { url: string; params: Record<string, any> } => {
  const originUrlArr = originUrl?.split('?');
  const url = originUrlArr[0];
  const params: Record<string, any> = {};
  originUrlArr[1]
    ?.split('&')
    ?.map(item => item?.split('='))
    ?.forEach(item => {
      params[item[0]] = item[1];
    });
  return {
    url,
    params
  };
};

/**
 * 转换url参数从下划线到驼峰
 * @param {string} originUrl - 原始url
 * @returns {string} 新的url
 */
export const getNavigateUrl = (originUrl: string): string => {
  const { url, params } = getUrlAndParams(originUrl);
  const newParams = transferParams(params, true);
  const paramsKeyArr = Object.keys(newParams);
  return paramsKeyArr.reduce((accu: string, key: string, index: number) => {
    const value = newParams[key];
    if (index === paramsKeyArr.length - 1) {
      return `${accu}${key}=${value}`;
    }
    return `${accu}${key}=${value}&`;
  }, `${url}?`);
};

export const isQueryDivision = (url: string) => {
  return url.indexOf('?') !== -1 ? url : `${url}?`;
};

export const splitQuery = (url: string) => {
  if (!url) return -1;
  const querys = url.split('?')[1];
  const current = {
    url: url.split('?')[0]
  };
  const params = querys?.split('&')?.reduce((cur: any, item: any) => {
    const arr = item.split('=');
    const key = arr[0];
    const value = arr[1];
    cur[key] = value;
    return cur;
  }, current);
  return params;
};

/***
 *  合并url参数
 * @
 */
export const mergeUrlQuery = (options: any) => {
  const url = isQueryDivision(options.src);
  return Object.keys(options).reduce((cur, item) => {
    if (item !== 'src') {
      cur += `${item}=${options[item]}`;
    }
    return cur;
  }, url);
};

export const mergeOptions = function(...arg: any[]) {
  console.log(arg);
  const args = arg[0];
  const str = Object.keys(args).length < 2 ? '' : '&';
  return Object.keys(args).reduce((cur: string, item: any) => {
    cur = `${item}=${args[item]}${cur}`;
    return cur;
  }, str);
};

export const mergeDomain = (env: any, appId: string, uri: string = '') => {
  if (uri && uri[0] !== '/') uri = '/' + uri;
  if (env !== 'inside' && env !== 'test') return `https://${appId}.h5.xiaoeknow.com${uri}`;
  return `https://${appId}.h5.${env}.xiaoeknow.com${uri}`;
};

// * 防抖
export const debounce = (fn: any, delay: number = 300) => {
  let timer: any = null;
  return function(...args: any[]) {
    // @ts-ignore
    const vm = this;
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(() => {
      fn.call(vm, ...args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
};

// * 节流
export const throttle = (fn: any, delay: number = 300) => {
  let timer: any = null;
  return function(...args: any[]) {
    // @ts-ignore
    const vm = this;
    if (timer) {
      return false;
    }
    timer = setTimeout(() => {
      fn.call(vm, ...args);
      clearTimeout(timer);
      timer = null;
    }, delay);
  };
};

/**
 * 获取元素信息
 * @param {string} select 元素节点
 * @returns 元素信息
 */
export const getClientRect = (select: string): Promise<IRectTypes> => {
  return new Promise(resolve => {
    uni
      .createSelectorQuery()
      .select(select)
      .boundingClientRect((data: any) => {
        if (data) {
          resolve(data);
        } else {
          resolve({});
        }
      })
      .exec();
  });
};

/**
 * 获取屏幕高度
 * @returns {Promise<number>} 屏幕高度
 */
export const getWindowHeight = (): Promise<number> => {
  return new Promise(resolve => {
    uni.getSystemInfo({
      success: (res: any) => {
        resolve(res.windowHeight || 0);
      }
    });
  });
};

export const getSystemInfo = (): Promise<Record<string, any>> => {
  return new Promise(resolve => {
    uni.getSystemInfo({
      success: (res: any) => {
        resolve(res);
      }
    });
  });
};

/**
 * 跳转到商品详情页
 * @param spuId 商品的spuId
 * @param appId 商品所在的店铺Id
 */
export const toGoodsDetail = (spuId: string, appId: string) => {
  uni.navigateTo({
    url: `/pages-main-affiliate/pages/goodsDetail/index?spu_id=${spuId}&app_id=${appId}&course_id=${spuId}`
  });
};

/**
 * 获取当前页面的完整url
 * @returns {string} url 完整的页面url(包含参数版本)
 */
export const getCurPageUrl = (): string => {
  const pages = getCurrentPages();
  const len = pages.length;
  return `${(pages?.[len - 1] as any)?.$page?.fullPath}`;
};

export const toErrorPage = (state: number, url: string): void => {
  if (getStorage(CANNOT_IN_ERROR_PAGE)) {
    // * 禁止重复进入缺省页
    return;
  }

  setStorage(CANNOT_IN_ERROR_PAGE, true);
  uni.redirectTo({
    url: `/pages-main-affiliate/pages/ErrorPage/ErrorPage?state=${state}&url=${encodeURIComponent(url)}`
  });
};

// * 页面重定向
export const toPage = (url: string) => {
  // * tab页面需要switchTab回去
  if (switchTabPages.includes(url!)) {
    uni.switchTab({ url });
  } else {
    uni.redirectTo({ url });
  }
};

/**
 * 获取组装后的原始地址
 * @param {string} url 原始地址
 * @param {Record<string, any>} params 拼接参数
 * @returns 拼接参数后的url
 */
export const getOriginUrl = (url: string, params: Record<string, any>) => {
  return `${url}?${Object.entries(params).reduce((accu: string, cur: [string, any]) => {
    const curKV: string = `${cur[0]}=${cur[1]}`;
    return !accu ? `${curKV}` : `${accu}&${curKV}`;
  }, '')}`;
};
