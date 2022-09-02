import { getAction } from '../manage';
import { getUrl } from '@/utils/tools';

// * 通过课程码或店铺码搜索售前或者店铺主页(达人主页)
export const getDetail = (code: string) => getAction(getUrl('/xe.dy.course/code.search'), { code });
