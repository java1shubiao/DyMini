import { postAction } from '../manage';
import { getUrl } from '@/utils/tools';

export interface IStudyPageParams {
  app_id: string;
  redirect_uri: string;
}

export const getH5Login = (params: IStudyPageParams) => postAction(getUrl('/xe.dy.h5login/login.url'), params);
