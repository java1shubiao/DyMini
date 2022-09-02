/**
 * @description 全局配置
 */
const ENV = import.meta.env;

const HEAD = 'VITE_APP_';

export const BASE_URL = `${HEAD}BASE_URL`;

export const MP_APP_ID = `${HEAD}MP_APP_ID`;

export const STORE_APP_ID = `${HEAD}STORE_APP_ID`;

export const DOMAIN = `${HEAD}DOMAIN`;

export const PROP_ENV_APP_ID = 'tt1bdf6d6284f58a92';

// * 上报环境, 埋点用, dev:开发/测试环境   prod: 现网环境  默认: dev
export const BURIED_ENV = ENV[DOMAIN] === '' ? 'prod' : 'dev';

// * 是否为现网环境
// ? 字节平台下, 部分api需要现网才可使用
export const isProdEnv = PROP_ENV_APP_ID === ENV[MP_APP_ID];

export default Object.assign(ENV, {
  BASE_URL: ENV[BASE_URL],
  MP_APP_ID: ENV[MP_APP_ID],
  STORE_APP_ID: ENV[STORE_APP_ID],
  DOMAIN: ENV[DOMAIN],
  BURIED_ENV
});

// * none状态
export const NONE = 'none';
