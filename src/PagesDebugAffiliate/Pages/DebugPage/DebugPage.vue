<template>
  <view class="debug-page">
    <text class="debug-title">操作列表</text>
    <view class="debug-test">
      <template v-for="item in debugConfig" :key="item.key">
        <button class="option-button" @click="item.action">{{ item.btnText }}</button>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import { debugConfig } from './utils';
</script>
<style lang="scss" scoped>
.debug-page {
  min-height: 100vh;
  padding-left: 32rpx;
  padding-right: 32rpx;
  background-color: #fff;
  .debug-title {
    margin-bottom: 24rpx;
    font-size: 36rpx;
    color: #333;
    font-weight: 900;
    font-family: 'PingFang SC';
    display: block;
    width: 100%;
    text-align: center;
  }
}
.debug-test {
  display: grid;
  grid-template-columns: 1fr;
  grid-auto-rows: 80rpx;
  .option-button {
    border-radius: 8rpx;
    width: 100%;
    height: 60rpx;
    font-size: 32rpx;
    font-weight: 900;
    background-color: #1472ff;
    color: #fff;
    border-color: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'PingFang SC';
  }
  button.button-hover {
    background-color: #096dd9;
    border-color: #096dd9;
  }
}
</style>
