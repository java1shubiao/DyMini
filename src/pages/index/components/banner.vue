<template>
  <view class="swiper-container">
    <swiper
      class="swiper"
      indicator-active-color="#fff"
      indicator-color="rgba(255, 255, 255, 0.5)"
      :indicator-dots="false"
      :autoplay="true"
      :interval="2000"
      :duration="500"
      :circular="true"
      :current="currentId"
      @change="handleSwiperChange"
    >
      <template v-for="item in props.data" :key="item.resourceId">
        <swiper-item :item-id="item.resourceId">
          <view class="swiper-item">
            <image :src="item.imgUrl" mode="scaleToFill" class="swiper-item-img" @click="props.click(item)" />
          </view>
        </swiper-item>
      </template>
    </swiper>
    <view class="swiper-dot-content">
      <template v-for="index in swiperDot" :key="index">
        <text
          :class="['swiper-dot', index === currentId && 'swiper-dot-active']"
          @click="handleClickSwiperDot(index)"
        />
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { defineProps, withDefaults, watch, computed, nextTick } from 'vue';
import { useState } from '@xiaoe/uni-ui';
import { IListItemType } from '@/components/courseCard/types';
import { bannerEventType, swiperDotType } from '../utils';
const props = withDefaults(
  defineProps<{
    data?: Array<Partial<IListItemType>>;
    click?: (data: Partial<IListItemType>) => void;
  }>(),
  {
    data: () => [],
    click: (data: Partial<IListItemType>) => {
      console.info(data);
    }
  }
);

// * 指示器渲染数组
const swiperDot = computed(
  (): swiperDotType => {
    return props.data.map((item, index: number) => index);
  }
);

// * 当前选中的swiper对应的id
// * current不能使用id绑定, 必须使用下标, 否则swiper处理错误导致真机轮播错位
const [currentId, setCurrentId] = useState<number>(0);

watch(
  () => props.data,
  () => {
    nextTick(() => {
      setCurrentId(0);
    });
  },
  {
    immediate: true
  }
);

// swiper自动变化
const handleSwiperChange = (e: bannerEventType): void => {
  // console.info(e.detail)
  setCurrentId(e.detail.current as number);
};

// 点击swiper指示器
const handleClickSwiperDot = (id: number) => {
  setCurrentId(id);
};
</script>
<style lang="scss" scoped>
.swiper-container {
  width: 686rpx;
  height: 386rpx;
  display: flex;
  justify-content: center;
  border-radius: 16rpx;
  position: relative;
}
.swiper-item {
  width: 686rpx;
  height: 386rpx;
  border-radius: 16rpx;
  .swiper-item-img {
    width: 100%;
    height: 100%;
    border-radius: 16rpx;
  }
}
.swiper-dot-content {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 16rpx;
  display: flex;
  align-items: center;
  height: 8rpx;
  width: 50rpx;
  justify-content: center;
  .swiper-dot {
    background-color: #fff;
    opacity: 0.5;
    width: 8rpx;
    height: 8rpx;
    border-radius: 50%;
    display: block;
    &.swiper-dot-active {
      opacity: 1;
    }
  }
  .swiper-dot:not(:first-child) {
    margin-left: 8rpx;
  }
}
.swiper {
  width: 100%;
  height: 386rpx;
  display: flex;
  justify-content: center;
  border-radius: 16rpx;
}
</style>
