<template>
  <view class="shop-header">
    <image
      class="shop-img"
      mode="scaleToFill"
      :src="
        props.shopInfo.shopLogo ||
          'http://wechatapppro-1252524126.cdn.xiaoeknow.com/appXdNN0due1177/image/kf55ylfi05fvt8uohgly.png'
      "
    />
    <text class="shop-name">{{ props?.shopInfo?.shopName || '' }}</text>
    <slot name="dyFans"></slot>
    <view class="filter" :style="{ backgroundImage: `url(${backImg})` }" />
  </view>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, computed } from 'vue';
interface IShopInfoType {
  shopId?: string;
  shopLogo?: string;
  shopName?: string;
}
const props = withDefaults(
  defineProps<{
    shopInfo: IShopInfoType;
  }>(),
  {
    shopInfo: () => ({})
  }
);

const backImg = computed(
  () =>
    props?.shopInfo?.shopLogo ||
    'http://wechatapppro-1252524126.cdn.xiaoeknow.com/appXdNN0due1177/image/kf55ylfi05fvt8uohgly.png'
);
</script>
<style lang="scss" scoped>
.shop-header {
  width: 750rpx;
  height: 414rpx;
  position: relative;
  overflow: hidden;
  .shop-img {
    box-sizing: border-box;
    position: absolute;
    width: 168rpx;
    height: 168rpx;
    border: 2rpx solid #fff;
    top: 55rpx;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50%;
    overflow: hidden;
    z-index: 10;
  }
  .shop-name {
    position: absolute;
    top: 245rpx;
    left: 50%;
    transform: translateX(-50%);
    height: 50rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    color: #fff;
    font-size: $xe-font-size-base-lg;
    z-index: 10;
    white-space: nowrap;
    max-width: 90%;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .filter {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    &::after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.4);
      z-index: 3;
      backdrop-filter: blur(20px);
    }
  }
}
</style>
