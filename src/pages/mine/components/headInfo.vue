<template>
  <view class="head-info">
    <view class="avatar-wrapper" @tap="reAuthorize">
      <img :src="userInfo.avatar || defaultPhoto" class="avatar" />
      <img :src="refreshImg" class="authorize" open-type="getUserInfo" />
    </view>
    <view class="base-info">
      <view class="nickname">{{ userInfo.isAuth ? userInfo.nickname : '请登录' }}</view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, ref } from 'vue';
import { useAction } from '@/hooks/useAction';
import { useGetter } from '@/hooks/useGetter';
import { refreshImg, defaultAvatar } from '@/constants/staticUrls';
import { HeadInfo } from '../types';
const { getUserInfo } = useAction('Login', ['getUserInfo']);
const { getUserInfo: userInfo } = useGetter('Login', ['getUserInfo']);

const defaultPhoto = ref(defaultAvatar);
const emit = defineEmits<{
  (e: 'fetchUserInfo'): void;
  (e: 'on-tap'): void;
}>();

const reAuthorize = () => {
  // 重新授权
  (async () => {
    await getUserInfo(true);
    emit('fetchUserInfo');
    emit('on-tap');
  })();
};
withDefaults(
  defineProps<{
    data: HeadInfo;
  }>(),
  {
    data: () => ({})
  }
);
</script>
<style lang="scss" scoped>
.head-info {
  display: flex;
  margin-bottom: 64rpx;
  .avatar-wrapper {
    width: 17vw;
    height: 17vw;
    background-color: #ffffff;
    border-radius: calc(17vw / 2);
    position: relative;
    margin-right: 3.2vw;
    display: flex;
    align-items: center;
    justify-content: center;
    .avatar {
      width: 16vw;
      height: 16vw;
      border-radius: calc(16vw / 2);
    }
    .authorize {
      width: 5.3vw;
      height: 5.3vw;
      position: absolute;
      bottom: 0px;
      right: 0px;
    }
  }
  .base-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    .nickname {
      opacity: 1;
      font-size: 20px;
      font-weight: 500;
      font-family: 'PingFang SC';
      text-align: left;
      line-height: 28px;
    }
    .number {
      font-size: 14px;
      font-weight: 400;
      font-family: 'PingFang SC';
      text-align: left;
      line-height: 20px;
      color: #666666;
    }
  }
}
</style>
