import { SPECIAL, BIG_SPECIAL, TRAINING_CAMP, TRAINING_CAMP_PRO } from '@/constants/crouse';
export interface IScanSuccessType {
  errMsg?: string;
  result?: string;
}

export enum resourceEnum {
  '专栏' = SPECIAL,
  '大专栏' = BIG_SPECIAL,
  '训练营' = TRAINING_CAMP,
  '训练营Pro' = TRAINING_CAMP_PRO
}

// * 来源类型, 与 resourceEnum 相匹配
export type ResourceType = 6 | 8 | 25 | 50;

export interface IListItemType {
  appId: string; // 店铺对应id
  imgUrl: string; // 图片url
  resourceCount: number; // 任务数量
  resourceType: ResourceType; // 资源类型
  resourceId: string; // 资源id
  shopName: string; // 店铺名称
  title: string; // 标题
  userCount: number; // 学员数量
  shopLogo: string; // 店铺logo链接
  priceLow: number; // 价格
  priceLine: number; // 划线价格
}
