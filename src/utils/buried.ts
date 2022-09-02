/**
 * 埋点相关
 */

import sensors from '@xiaoe/data-miniprogram-sdk/static/sensors.bytedance.sdk';
import config from '@/constants/config';
import { getStorage } from '@/utils/tools';

import { MAIN, STUDY, MINE } from '@/hooks/useTabBarStatus';
import { PAGE_MAIN, PAGE_LERNA, PAGE_MINE } from '@/constants';

const viewEvent = 'view_page';
const clickEvent = 'click_butt';

// 事件定义
type eventType = 'view_page' | 'click_butt';

// 页面上报函数声明
type IPageBuriedType = (
  pageId: string,
  isLogin: boolean,
  loginUserId?: string,
  otherParam?: object,
  eventName?: eventType
) => void;

// * C端埋点
const PLATFORM = 'C';

// * 字节小程序平台业务模块名称
const L_Program = 'xe_know_douyin';

// * 上报页面配置
// * pageId为约定值
export const pageBuriedConfig = {
  [`${MAIN}`]: {
    pageId: PAGE_MAIN
  },
  [`${STUDY}`]: {
    pageId: PAGE_LERNA
  },
  [`${MINE}`]: {
    pageId: PAGE_MINE
  }
};

// * 事件上报
export const handleBuriedEvent = (eventName: eventType, params: Record<string, any> = {}): void => {
  sensors.track(eventName, params);
};

/**
 * 埋点方法
 */
const handleBuried = (): IPageBuriedType => {
  // 设置环境和平台
  sensors.setEnv(config.BURIED_ENV, PLATFORM);

  let userId = getStorage('userInfo').bUserId || '';

  // * 公共上报属性
  sensors.registerApp({
    l_program: L_Program, // 所属业务模块
    c_user_id: userId // 登录后才有bUserId
  });

  return (
    pageId: string,
    isLogin: boolean,
    loginUserId?: string,
    otherParam = {},
    eventName: eventType = viewEvent
  ): void => {
    if (isLogin) {
      loginUserId = loginUserId || userId;
      userId = loginUserId; // * 同步数据
      sensors.login(loginUserId);
      // * 重新提交
      sensors.registerApp({
        l_program: L_Program, // 所属业务模块
        c_user_id: userId // 登录后才有bUserId
      });
      return;
    }
    // * 页面属性(内部会合并公共上报属性)
    sensors.registerPage({
      page_id: pageId,
      ...otherParam
    });
    // * 页面展示上报
    handleBuriedEvent(eventName);
  };
};

const pageBuried = handleBuried();

export default pageBuried;

/**
 * 事件埋点
 * @param pageId 访问页面
 * @param params 埋点参数
 * @returns 埋点逻辑
 */
export const buriedEvent = (pageId: string, params: Record<string, any> = {}) =>
  pageBuried(
    pageId,
    false,
    undefined,
    {
      user_channel: 'dy_event',
      // 事件埋点占用一下该字段, 数据中心字段有白名单, 不能随意添加, 并且小程序会自带一个url_path获取当前页面的url
      page_path: JSON.stringify({ time: new Date().valueOf(), ...params })
    },
    clickEvent
  );
