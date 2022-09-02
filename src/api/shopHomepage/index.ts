import { getAction } from '../manage';
import { getUrl } from '@/utils/tools';
import { IGetShopCourseListParams } from './type';

// * 获取店铺信息
export const getShopInfo = (appId: string) => getAction(getUrl('/xe.dy.course/shop_info'), { appId });

export const getShopCourseList = (params: IGetShopCourseListParams) =>
  getAction(getUrl('/xe.dy.course/shop_home_list'), params);
