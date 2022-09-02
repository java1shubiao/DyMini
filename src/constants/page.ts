/**
 * @description 页面底部状态相关常量
 */
// * 加载中
export const LOADING = 1;
// * 加载完成
export const COMPLETE = 2;
// * 未开始加载
export const START = 3;
// * 没有数据
export const EMPTY = 4;

// * 可以通过二维码跳转的url, 解析出任何不包含在内的url全都跳转到扫码错误页
export const withQRCodeJumpConfig: string[] = ['/pages-main-affiliate/pages/goodsDetail/index'];

// * 主页
export const HOME_PAGE = '/pages/index/index';
// * 学习
export const STUDY_PAGE = '/pages/study/index';
// * 我的
export const MINE_PAGE = '/pages/mine/index';

// * 需要switchTab的页面
export const switchTabPages: string[] = [HOME_PAGE, STUDY_PAGE, MINE_PAGE];

export const CANNOT_IN_ERROR_PAGE = 'isInErrorPage';

// ---- 埋点用pageId
// 拼写错误为当初文档约定时产品拼写错误, 已埋下, 更改会出事
export const PAGE_MAIN = 'xekonwdy#main'; // 主页
export const PAGE_LERNA = 'xekonwdy#learn'; // 学习
export const PAGE_MINE = 'xekonwdy#me'; // 我的
export const PAGE_SEARCH = 'xeknowdy#search'; // 搜索按钮
export const PAGE_LOGIN = 'xeknowdy#login'; // 登录标识
export const PAGE_SHOOT = 'xeknowdy#shoot'; // 拍摄标识
export const PAGE_ATTENTION = 'xeknowdy#attention'; // 关注标识
export const PAGE_SHOP_HOME_PAGE = 'xeknowdy#shop_home_page'; // 达人主页
// ---- 埋点用pageId
