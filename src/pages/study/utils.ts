import config, { DOMAIN } from '@/constants/config';

import { SPECIAL, BIG_SPECIAL, TRAINING_CAMP_PRO } from '@/constants/crouse';

enum courseType {
  'column' = SPECIAL, // 专栏
  'big_column' = BIG_SPECIAL, // 大专栏
  'ecourse' = TRAINING_CAMP_PRO // 训练营Pro
}

export const getH5CrouseUrl = (appId: string, resourceType: number, resourceId: string) => {
  const domain = config[DOMAIN] ? `.${config[DOMAIN]}` : '';
  return `https://${appId}.h5${domain}.xiaoeknow.com/p/course/${courseType[resourceType]}/${resourceId}`;
};
