<template>
  <view>
    <view
      v-for="(item, index) in cardList"
      :key="index"
      class="card-list"
      open-type="getUserInfo"
      @tap="item.fn && item.fn(item.url || '', item.name)"
    >
      <view class="text-info">{{ item.name }}</view>
      <XeIcon :type="item.icon" size="32" />
    </view>
  </view>
</template>

<script setup lang="ts">
import XeIcon from '@xiaoe/uni-ui/lib/xe-icons/xe-icons.vue';
import { onMounted, withDefaults, defineProps } from 'vue';
import { CardListItem, CardListInfo } from '../types';
onMounted(() => {});
withDefaults(
  defineProps<{
    cardList: CardListInfo<CardListItem>;
  }>(),
  {
    cardList: () => []
  }
);
</script>
<style lang="scss" scoped>
.card-list {
  width: 686rpx;
  height: 96rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  padding-right: 4.3vw;
  margin-bottom: 24rpx;
  background-color: white;
  .text-info {
    flex: 1 1 0%;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 4.3vw;
    font-size: 14px;
    font-weight: 400;
    font-family: 'PingFang SC';
    text-align: left;
  }
}
</style>
