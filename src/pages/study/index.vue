<template>
  <XePage
    :status="(status as statusType)"
    :light="true"
    :is-need-status="isAuth && listData.length !== 0 ? true : false"
    :class="[!(isAuth && listData.length !== 0) ? 'study-page' : '']"
  >
    <!-- 未登录页面 -->
    <view v-if="!isAuth" class="not-logged">
      <image class="not-logged-img" :src="goLoginImg"></image>
      <view class="not-logged-text authorization" @click="toLogin">授权登录</view>
      <view class="not-logged-text">才可正常使用小程序</view>
    </view>

    <!-- 已登录页面 -->
    <template v-else>
      <view v-if="listData.length" class="study-container">
        <template v-for="item in (listData as IStudyCardType[])" :key="item.resourceId">
          <StudyCard :data="item"></StudyCard>
        </template>
      </view>
      <view v-else class="study-empty-container">
        <image class="empty" :src="emptyImg"></image>
        <view class="empty-text">暂无相关课程</view>
      </view>
    </template>
  </XePage>
</template>

<script setup lang="ts">
// import type { ComputedRef } from 'vue';
import { onReachBottom, onPullDownRefresh, onShow } from '@dcloudio/uni-app';
import { defineExpose } from 'vue';
import XePage from '@xiaoe/uni-ui/lib/xe-page/xe-page.vue';
import { statusType } from '@xiaoe/uni-ui/lib/xe-page/utils';
import useFetch from '@/hooks/useFetch';
import useLogin from '@/hooks/useLogin';
import useTabBarStatus, { STUDY } from '@/hooks/useTabBarStatus';
import { emptyImg, goLoginImg } from '@/constants/staticUrls';
import StudyCard from './components/studyCard.vue';
import { IStudyCardType } from './types';

useTabBarStatus(STUDY);

const { handleLogin, isAuth } = useLogin();
// 获取学习列表数据
const [listData, status, fetchList] = useFetch<{ pageIndex?: number; pageSize?: number }, IStudyCardType>(
  '/xe.dy.course/learn_list',
  'list'
);

onShow(() => {
  fetchList(true);
});

onReachBottom(() => {
  // 触底逻辑  加一层定时器, 小程序的触底有cd时间, 若触底过快, 不会触发这一层逻辑 ,微信小程序为130ms左右
  setTimeout(() => fetchList(), 150);
});

onPullDownRefresh(() => {
  // 刷新逻辑
  console.info('刷新');
  fetchList(true);
  uni.stopPullDownRefresh();
});
const toLogin = () => {
  handleLogin().then(() => {
    // 登录成功
    fetchList(true);
  });
};
// 暴露需要暴露的变量
defineExpose({});
</script>

<style lang="scss" scoped>
.study-page ::v-deep.xe-page-content {
  padding-top: 420rpx;
}
::v-deep.xe-page-content {
  background-color: #ffffff;
}
.not-logged {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .not-logged-img {
    width: 176rpx;
    height: 176rpx;
  }
  .not-logged-text {
    font-size: 28rpx;
    line-height: 48rpx;
    color: #999999;
  }
  .authorization {
    padding-top: 48rpx;
    color: rgba(20, 114, 255, 1);
  }
}
.empty {
  width: 176rpx;
  height: 176rpx;
}
.empty-text {
  margin-top: 48rpx;
  font-size: 28rpx;
  color: #999999;
  line-height: 40rpx;
  text-align: center;
}
</style>
