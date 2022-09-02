import { needShareUrls, PAGE_SHOOT } from '@/constants';
import { getUrlAndParams } from '@/utils/tools';
import { onHide, onShow } from '@dcloudio/uni-app';
// import { defaultShareImg } from '@/constants/staticUrls';
import { onMounted, watch } from 'vue';
import { useState } from '@xiaoe/uni-ui';
import { buriedEvent } from '@/utils/buried';

/**
 * 分享用hook, 内部继承分享后的处理逻辑等, 需在 needShareUrls 中配置
 */
const useShare = () => {
  const [isShootVideo, setIsShootVideo] = useState(false);
  let timer: any = null;
  onShow(() => {
    if (isShootVideo.value) {
      setIsShootVideo(false);
      uni.hideLoading();
    }
  });

  const clearTimer = () => {
    timer && clearTimeout(timer);
    timer = null;
  };

  watch(
    () => isShootVideo.value,
    newVal => {
      if (newVal) {
        timer = setTimeout(() => {
          uni.showToast({
            title: '拉起视频拍摄器失败!',
            icon: 'none'
          });
        }, 10000);
      } else {
        clearTimer();
      }
    }
  );

  // * 说明已经弹出拍摄器或者已经退出当前页面
  onHide(() => {
    clearTimer();
  });

  onMounted(() => {
    const currentPages = getCurrentPages();
    const index = currentPages.length - 1;
    const originUrl = (currentPages?.[index] as any)?.$page?.fullPath || `/${currentPages?.[index]?.route}`;
    const { url } = getUrlAndParams(originUrl);
    const options = needShareUrls.find(item => item.url === url);
    if (options) {
      uni.showShareMenu({
        success: res => {
          // 成功逻辑
          options?.success?.(res);
        },
        fail: res => {
          buriedEvent(PAGE_SHOOT, { msg: '拍摄失败' });
          // 失败逻辑
          options?.fail?.(res);
        },
        complete: res => {
          // 完成逻辑
          options?.complete?.(res);
        }
      });
    }
  });
  return { setIsShootVideo, isShootVideo };
};

export type IShareInfoType = Partial<{
  title: string;
  imageSrc: string;
  query: string;
  successCallback: (res?: any) => void;
  failCallback: () => void;
  path: string;
  extras: Record<string, any>;
  other: Record<string, any>;
}>;

// * 设置分享模板
export const setShareInfo = ({
  title,
  imageSrc,
  query,
  path,
  successCallback,
  failCallback,
  other,
  extras
}: IShareInfoType = {}) => {
  // * 拍视频/直播挂载默认配置
  extras = extras || {};
  const extra = {
    withVideoId: true,
    hashtag_list: ['小鹅通微店'], // * 默认分享话题
    videoTopics: ['小鹅通微店'], // * 默认分享话题(兼容处理)
    ...extras
  };
  return {
    title: title || '学知识找小鹅通',
    imageUrl: imageSrc,
    query,
    path,
    success: (res: any) => {
      // 拍摄成功埋点
      buriedEvent(PAGE_SHOOT, { msg: res.videoId ? '拍摄成功' : '分享成功', videoId: res.videoId || '' });
      successCallback?.(res);
    },
    fail: failCallback,
    extra,
    ...other
  };
};

export default useShare;
