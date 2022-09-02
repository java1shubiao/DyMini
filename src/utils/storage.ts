import { NONE } from '@/constants/config';
import { none } from './type';
import { isDef } from './tools';

// * 兼容老数据
// const parseData = (originValue: any) => {
//   return originValue?.maxAge ? originValue : { value: originValue };
// };

// * 获取过期时间key
const getExpiredKey = (key: string) => `${key}-expired`;

// * 设置本地缓存
export const baseSetStorageSync = uni.setStorageSync;

// * 获取本地缓存
export const baseGetStorageSync = uni.getStorageSync;

// * 清除本地缓存
export const baseRemoveStorageSync = uni.removeStorageSync;

/**
 * 设置缓存以及过期时间
 * @param key 键名
 * @param value 键值
 * @param maxAge 过期时间, 单位: 毫秒
 * @returns UniApp.Uni.setStorageSync, 调用uniapp接口设置本地缓存
 */
export const setStorage = (key: string, value: any, maxAge: number | none = NONE) => {
  const expiredTime = maxAge === NONE ? NONE : new Date().valueOf() + maxAge;
  baseSetStorageSync(getExpiredKey(key), expiredTime);
  return baseSetStorageSync(key, value);
};

// 获取本地缓存数据
export const getStorage = (key: string): any => {
  // * 获取原始值
  const originValue = baseGetStorageSync(key);
  // * 获取过期时间key
  const expiredKey = getExpiredKey(key);
  // * 获取过期时间
  const expiredTime = baseGetStorageSync(expiredKey);
  // * 当前时间
  const curTime = new Date().valueOf();
  const isExpired = expiredTime !== NONE && curTime > expiredTime;

  if (!isDef(originValue) || isExpired) {
    baseRemoveStorageSync(key);
    expiredTime && baseRemoveStorageSync(expiredKey);
  }
  return originValue;
};
