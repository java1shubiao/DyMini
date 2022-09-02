<template>
  <view class="card-wrap" @click="toCourseDetail">
    <view class="card-title">
      <image class="shop-logo" :src="data.shopLogo" mode="scaleToFill"></image>
      <text class="shop-name">{{ data.shopName }}</text>
    </view>
    <view class="card-main">
      <view class="course-img-wrap">
        <image :src="data.imgUrl" class="course-img"></image>
        <view class="course-tag">{{ resourceEnum[data.resourceType as ResourceType] }}</view>
      </view>
      <view class="card-right">
        <view class="course-name">{{ data.title }}</view>
        <view class="course-detail-wrap">
          <view class="course-detail">
            <text class="task-num">{{ data.resourceCount }}个任务</text>
            <text class="participant-num">{{ data.userCount }}人参与</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, onMounted } from 'vue';
import { IStudyCardType, resourceEnum, ResourceType } from '../types';
const props = withDefaults(
  defineProps<{
    data: Partial<IStudyCardType>;
  }>(),
  {
    data: () => ({})
  }
);

onMounted(() => {
  console.log(props.data);
});
const toCourseDetail = () => {
  const { appId, spuId } = props.data;
  const url = `/pages-main-affiliate/pages/goodsDetail/index?app_id=${appId}&spu_id=${spuId}&course_id=${spuId}`;
  uni.navigateTo({ url });
};
</script>

<style lang="scss" scoped>
.card-wrap {
  width: 686rpx;
  height: 252rpx;
  padding: 0 32 32rpx;
  margin-bottom: 32rpx;
  font-family: 'PingFang SC';
  border-bottom: 1px solid #ebebeb;
  .card-title {
    height: 24rpx;
    display: flex;
    align-items: center;
    .shop-logo {
      width: 24rpx;
      height: 24rpx;
      background-color: #f5f5f5;
      border-radius: 50%;
    }
    .shop-name {
      margin-left: 8rpx;
      color: #666666;
      font-size: 20rpx;
      line-height: 24rpx;
      font-family: 'PingFang SC';
    }
  }
  .card-main {
    display: flex;
    padding: 24rpx 0 16rpx;
    .course-img-wrap {
      position: relative;
      width: 320rpx;
      height: 180rpx;
      .course-img {
        width: 100%;
        height: 100%;
        border-radius: 16rpx;
      }
      .course-tag {
        position: absolute;
        padding: 4rpx 8rpx;
        height: 32rpx;
        border-radius: 8rpx;
        background: rgba(0, 0, 0, 0.25);
        right: 8rpx;
        bottom: 8rpx;
        font-size: $xe-font-size-s-mini;
        color: $xe-color-white;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .card-right {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: 390rpx;
      padding-left: 16rpx;
      .course-name {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        color: #333333;
        font-size: 28rpx;
        font-weight: 700;
        line-height: 40rpx;
        max-height: 80rpx;
      }
      .course-detail-wrap {
        display: flex;
        justify-content: space-between;
        color: #999999;
        font-size: 24rpx;
        lighting-color: 32rpx;
        .task-num {
          padding-right: 8rpx;
          border-right: 1rpx solid #ebebeb;
        }
        .participant-num {
          padding-left: 8rpx;
        }
        .progress {
          display: flex;
          justify-content: center;
          align-items: center;
          .progress-ring {
            width: 24rpx;
            height: 24rpx;
            border-radius: 50%;
            --mask: radial-gradient(closest-side, transparent 62%, #cccccc 63%);
            -webkit-mask-image: var(--mask);
            mask-image: var(--mask);
            margin-right: 8rpx;
          }
          .complete {
            width: 24rpx;
            height: 24rpx;
          }
        }
      }
    }
  }
}
</style>
