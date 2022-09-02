<template>
  <div class="error-page">
    <image class="error-img" :src="errorOption.imgUrl" />
    <text class="error-text">{{ errorOption.text }}</text>
    <XeButton class="error-btn" type="primary" @click="handleReOperating">{{ errorOption.btnText }}</XeButton>
  </div>
</template>

<script setup lang="ts">
import XeButton from '@xiaoe/uni-ui/lib/xe-button/xe-button.vue';
import { errorTypes } from '@/constants/errorType';
import type { ComputedRef } from 'vue';
import { computed, defineEmits, defineProps, withDefaults } from 'vue';
import { typeErrors, IErrorActions } from './type';
import { errorTextOptions } from './utils';

const emits = defineEmits<{
  (e: 'update'): void
}>();

const props = withDefaults(defineProps<{
  // 错误类型, 具体见errorType
  state?: number;
   // 原始地址, 跳转路径
  originUrl?: string;
}>(), {
  state: undefined,
  originUrl: undefined
});

// * 获取当前缺省状态相关配置
const errorOption: ComputedRef<IErrorActions> = computed(() => {
  return errorTextOptions[errorTypes[props.state] as typeErrors];
});

const handleReOperating = () => {
  emits('update');
  errorOption?.value?.action?.(props.originUrl);
}
</script>
<style lang="scss" scoped>
.error-page {
  background-color: #fafafa;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding-top: 240rpx;
  min-height: 100vh;
  .error-img {
    height: 176rpx;
    width: 176rpx;
  }
  .error-text {
    color: $xe-color-grey;
    font-size: $xe-font-size-sm;
    display: block;
    margin-top: 32rpx;
    text-align: center;
    line-height: 20px;
  }

  .error-btn {
    margin-top: 64rpx;
    width: 368rpx;
    height: 80rpx;
  }
}
</style>
