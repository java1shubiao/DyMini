// * 课程码位数
export const CODE_LENGTH = 8;

// * 店铺主页码(达人码)位数
export const SHOP_CODE_LENGTH = 6;

// * 暂无相关课程
export const COURSE_EMPTY = 1;
// * 课程已下架
export const COURSE_TAKE_DOWN = 2;

// * 无特殊情况
export const OTHER_ERROR = 0;

export type ErrorType = 8 | 1 | 2 | 0;

export interface IErrorParams {
  msg?: string; // msg信息
  errorState?: ErrorType; // 错误状态
  code?: number; // 状态码
  data?: any; // 原始数据
}
