export type bannerDetailType = {
  current: number; // 当前swiper的序号
  currentItemId: string | number; // 当前swiperItem的id
  source: string; // 来源
};

export interface targetType extends bannerDetailType {
  dataset: Record<string, any>; // 数据
  id: number | string; // 唯一键
  offsetLeft: number; // 距离左侧距离
  offsetTop: number; // 距离顶部距离
}

export type bannerEventType = {
  detail: bannerDetailType;
  target?: targetType;
};

export type swiperDotType = Array<number>;
