import { SPECIAL, BIG_SPECIAL, TRAINING_CAMP, TRAINING_CAMP_PRO } from '@/constants/crouse';

export enum resourceEnum {
  '专栏' = SPECIAL,
  '大专栏' = BIG_SPECIAL,
  '训练营' = TRAINING_CAMP,
  '训练营Pro' = TRAINING_CAMP_PRO
}

export type ResourceType = 6 | 8 | 25 | 50;

export interface IStudyCardType {
  appId: string; // 店铺id
  shopLogo: string; // 店铺logo
  shopName: string; // 店铺名称
  imgUrl: string; // 课程封面
  title: string; // 标题
  resourceCount: number; // 任务数
  resourceId: string; // 任务Id
  spuId: string; // 资源id
  userCount: number; // 参与人数
  resourceType: ResourceType; // 资源类型：6专栏；8大专栏；25训练营
}
