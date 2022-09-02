<template>
  <view class="common-problem-page">
    <ProblemCardList />
  </view>
</template>

<script setup lang="ts">
import ProblemCardList from './components/ProblemCardList.vue';
</script>
<style lang="scss" scoped>
.common-problem-page {
  min-height: 100vh;
  background-color: #fafafa;
  padding-top: 16rpx;
}
</style>
