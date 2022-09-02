import { getAction } from '../manage';
import { getUrl } from '@/utils/tools';

interface IShareParams {
  appId?: string;
  spuId?: string;
}

export const getShareInfo = (params: IShareParams) => getAction(getUrl('/xe.dy.course/share_info.get'), params);
