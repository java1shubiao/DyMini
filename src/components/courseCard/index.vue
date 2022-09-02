<template>
  <view class="main-card" :style="props.cardStyle" @click="handleClick">
    <view v-if="props.isShowShopTitle" class="card-title">
      <image class="title-img" mode="scaleToFill" :src="props.data.shopLogo" />
      <text class="shop-name">{{ props.data.shopName }}</text>
    </view>
    <view class="content-container">
      <view class="content-img-area">
        <image class="card-img" mode="scaleToFill" :src="props.data.imgUrl" />
        <view class="card-tag">{{ resourceEnum[props.data.resourceType as ResourceType] }}</view>
      </view>
      <view class="content-text-area">
        <text class="content-title">
          {{ props.data.title }}
        </text>
        <text class="member-num foot-text">{{ props.data.userCount || 0 }}人在学</text>
        <view class="content-foot">
          <view v-if="props.data.priceLow" class="price-text-container">
            <text class="price price-text price-rmb">￥</text>
            <text class="price price-text price-text-lg">{{ price[0] }}</text>
            <text v-if="price[1]" class="price price-text">.{{ price[1] }}</text>
          </view>
          <text v-else class="price price-text price-text-base">免费</text>
          <text v-if="props.data.priceLine" class="line-price price-text">{{ linePrice }}</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineExpose, defineEmits, computed } from 'vue';
import { toGoodsDetail } from '@/utils/tools';
import { IListItemType, resourceEnum, ResourceType } from './types';
import { getPrice } from './utils';
const props = withDefaults(
  defineProps<{
    data: Partial<IListItemType>;
    cardStyle?: string;
    isShowShopTitle: boolean;
  }>(),
  {
    data: () => ({}),
    cardStyle: '',
    isShowShopTitle: true
  }
);

// * 价格
const price = computed(() => {
  const propPrice = props.data.priceLow || 0;
  return `${getPrice(propPrice)}`.split('.');
});

// * 划线价格
const linePrice = computed(() => {
  const propLinePrice = props.data.priceLine;
  return propLinePrice ? `￥${getPrice(propLinePrice)}` : propLinePrice;
});

const emits = defineEmits<{
  (e: 'click', data: Partial<IListItemType>): void;
}>();

const handleClick = () => {
  const data = props.data;
  toGoodsDetail(data.resourceId as string, data.appId as string);
  emits('click', data);
};

const containerMarginTop = computed(() => (props.isShowShopTitle ? '16rpx' : '0rpx'));

defineExpose({
  handleClick
});
</script>
<style lang="scss" scoped>
.main-card {
  display: flex;
  flex-direction: column;
  width: 686rpx;
  height: 252rpx;
  background-color: #fff;
  padding: 0rpx 32rpx 32rpx 0rpx;
  box-shadow: inset 0 -0.5px 0 0 rgba(235, 235, 235, 1);

  .card-title {
    height: 24rpx;
    display: flex;
    align-items: center;
    .title-img {
      width: 24rpx;
      height: 24rpx;
      background-color: #f5f5f5;
      border-radius: 50%;
    }
    .shop-name {
      display: flex;
      min-height: 24rpx;
      align-items: center;
      margin-left: 8rpx;
      line-height: 24rpx;
      color: $xe-color-black-grey;
      font-size: $xe-font-size-s-mini;
    }
  }
}
.content-container {
  width: 686rpx;
  height: 212rpx;
  display: flex;
  align-items: flex-start;
  background-color: #fff;
  margin-top: v-bind(containerMarginTop);
  .card-img {
    width: 320rpx;
    height: 180rpx;
    border-radius: 16rpx;
    background-color: #f5f5f5;
  }
  .content-img-area {
    position: relative;
    width: 320rpx;
    height: 180rpx;
    background-color: #f5f5f5;
    border-radius: 16rpx;
    .card-tag {
      position: absolute;
      // min-width: 110rpx;
      padding: 4rpx 8rpx;
      height: 32rpx;
      border-radius: 8rpx;
      background: rgba(0, 0, 0, 0.25);
      backdrop-filter: blur(24rpx);
      right: 8rpx;
      bottom: 8rpx;
      font-size: $xe-font-size-s-mini;
      color: $xe-color-white;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .content-text-area {
    margin-left: 16rpx;
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    min-height: 180rpx;
    .content-title {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-height: 80rpx;
      width: 344rpx;
      box-sizing: border-box;
      font-size: $xe-font-size-sm;
      color: $xe-color-black;
      font-weight: 900;
    }
    .member-num {
      display: flex;
      align-items: center;
      height: 32rpx;
      margin-top: 16rpx;
    }
    .foot-text {
      color: $xe-color-grey;
      font-size: $xe-font-size-s-mini;
      display: flex;
      align-items: center;
      height: 28rpx;
      box-sizing: border-box;
    }
    .content-foot {
      display: flex;
      align-items: flex-end;
      height: 32rpx;
      margin-top: auto;
      .price-text-container {
        display: flex;
        align-items: flex-end;
        height: 50rpx;
      }
      .price-text {
        color: $xe-color-grey;
        font-size: $xe-font-size-mini;
        display: flex;
        align-items: center;
        height: 32rpx;
        box-sizing: border-box;
      }
      .price-rmb {
        width: 16rpx;
        justify-content: center;
      }
      .price {
        color: #ff5429;
        font-weight: 600;
      }
      .price-text-lg {
        margin-left: 4rpx;
        font-size: $xe-font-size-base-lg;
        display: flex;
        align-items: flex-end;
        line-height: 1;
        height: 50rpx;
      }
      .price-text-base {
        font-size: $xe-font-size-sm;
        display: flex;
        align-items: flex-end;
        line-height: 1;
        height: 40rpx;
      }
      .line-price {
        text-decoration: line-through;
        margin-left: 12rpx;
      }
    }
  }
}
</style>
