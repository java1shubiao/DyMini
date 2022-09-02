import { postAction } from '../manage';
import { getUrl } from '@/utils/tools';

// * 获取抖音号以及是否展示抖音号按钮
export const fetchDyAccountApi = (params: any) => postAction(getUrl('/xe.dy.course/get_dy_config'), params);
