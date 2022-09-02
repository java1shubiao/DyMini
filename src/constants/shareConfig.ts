/**
 * @description 分享配置
 */

export interface IShareUrlType {
  url: string; // 路由url
  success?: (...arg: any[]) => void;
  fail?: (...arg: any[]) => void;
  complete?: (...arg: any[]) => void;
}

// ! 后续规范都使用驼峰
// ! 但已有链接不能改变, 二维码路径以及分享路径已固定, 更改则事故
// * 需要分享的路由
export const needShareUrls: IShareUrlType[] = [
  { url: '/pages-main-affiliate/pages/goodsDetail/index' },
  { url: '/pages-main-affiliate/pages/webview-container/index' },
  { url: '/pages-main-affiliate/pages/shopHomePage/index' },
  { url: '/pages/index/index' }
];
