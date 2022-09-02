<template>
  <button class="wrap-button" @click="handleClickShoot">
    <button class="shoot-video" open-type="share" data-channel="video">
      <image :src="shootVideoIcon" class="shoot-video-img" />
    </button>
  </button>
</template>

<script setup lang="ts">
import { withDefaults, defineProps } from 'vue';
import { shootVideoIcon } from '@/constants/staticUrls';
import { PAGE_SHOOT } from '@/constants';
import { buriedEvent } from '@/utils/buried';

const props = withDefaults(
  defineProps<{
    clickShoot?: (isShoot: boolean) => void;
  }>(),
  {
    clickShoot: () => {}
  }
);

const handleClickShoot = () => {
  buriedEvent(PAGE_SHOOT, { msg: '拉起拍摄器' });
  props?.clickShoot?.(true);
  // * hideLoading 处于分享hooks中, 此处仅关注弹出loading, 并设置拍摄状态
  uni.showLoading({
    title: '正在拉起拍摄器'
  });
};
</script>
<style lang="scss" scoped>
.shoot-video {
  position: fixed;
  right: 10rpx;
  bottom: 194rpx;
  width: 160rpx;
  height: 160rpx;
  border: none;
  border-radius: 0;
  padding: 0;
  background-color: rgba(0, 0, 0, 0);
  .shoot-video-img {
    width: 160rpx;
    height: 160rpx;
  }
}
.shoot-video::after {
  border: none;
}

.wrap-button::after {
  display: none;
}
</style>
