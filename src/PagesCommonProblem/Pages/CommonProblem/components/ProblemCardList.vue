<template>
  <div class="problem-list">
    <template v-for="item in listConfig" :key="item.key">
      <view class="problem-card" @click="handleExpand(item.key)">
        <view class="title-container">
          <text class="title">{{ item.title }}</text>
          <XeIcon class="left-icon" :type="expandedKey === item.key ? 'down' : 'right'" size="32" />
        </view>
        <view v-if="item.key === expandedKey" class="content-container">
          <template v-for="(content, index) in item.content" :key="index">
            <text class="problem-content">{{ content }}</text>
          </template>
        </view>
      </view>
    </template>
  </div>
</template>

<script setup lang="ts">
import { listConfig } from '../utils';
import XeIcon from '@xiaoe/uni-ui/lib/xe-icons/xe-icons.vue';
import { useState } from '@xiaoe/uni-ui';

const [expandedKey, setExpandedKey] = useState<number>(0);

const handleExpand = (key: number) => {
  expandedKey.value === key ? setExpandedKey(0) : setExpandedKey(key);
};
</script>
<style lang="scss" scoped>
.problem-list {
  padding-left: 32rpx;
  padding-right: 32rpx;
  background-color: #fff;
  .problem-card:not(:last-child) {
    box-shadow: inset 0 -0.5px 0px 0px rgba(235, 235, 235, 1);
  }
  .title-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 96rpx;
    .title {
      font-size: $xe-font-size-sm;
      color: $xe-color-black;
      font-weight: 500;
    }
    .left-icon {
      transition: all 0.3s;
    }
  }
  .content-container {
    padding-bottom: 32rpx;
    display: flex;
    flex-direction: column;
    .problem-content {
      font-size: $xe-font-size-mini;
      color: $xe-color-black-grey;
      line-height: 48rpx;
    }
  }
}
</style>
