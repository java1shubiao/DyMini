/**
 * @description 缺省状态
 */
// * 枚举名称集
export const RE_LOGIN = 'reLogin';
export const RE_LOAD = 'reLoad';
export const BACK_HOME = 'backHome';

// * 状态集
export const RE_LOGIN_STATE = 1;
export const RE_LOAD_STATE = 2;
export const BACK_HOME_STATE = 3;

export enum errorTypes {
  reLogin = 1, // * 登录失败
  reLoad, // * 请求超时
  backHome // * 返回首页
}
