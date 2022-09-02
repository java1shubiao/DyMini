<template>
  <view class="tooltip">
    <view v-if="visibleRef" class="tooltip-content">
      {{ props.content }}
    </view>
    <!-- <view v-if="visibleRef" class="tooltip-mask" @click="handleHideTips" /> -->
    <view class="tooltip-content-container" @click="handleContentClick">
      <slot />
    </view>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, defineEmits, defineProps, watch, computed, defineExpose } from 'vue';
import { useState } from '@xiaoe/uni-ui';
import { ITooltipTrigger } from './type';

const CLICK = 'click';
const props = withDefaults(
  defineProps<{
    content?: string;
    offsetX?: string;
    offsetY?: string;
    triangleOffsetX?: string;
    triangleOffsetY?: string;
    visible?: boolean;
    arrowPointAtCenter?: boolean; // 箭头是否指向目标中心
    trigger?: ITooltipTrigger;
    height?: string | number;
  }>(),
  {
    content: '',
    offsetX: '-10rpx',
    offsetY: '-112rpx',
    triangleOffsetX: '24rpx',
    triangleOffsetY: '-32rpx',
    visible: false,
    arrowPointAtCenter: false,
    trigger: 'click',
    height: 88
  }
);

const emits = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'click', target: Event): void;
  (e: 'change', value: boolean): void;
}>();

const minHeight = computed(() => {
  const height = props.height;
  return typeof height === 'string' ? height : `${height}rpx`;
});

const [visibleRef, setVisibleRef] = useState(props.visible);

watch(visibleRef, newVal => {
  if (newVal !== props.visible) {
    emits('update:visible', visibleRef.value);
    emits('change', visibleRef.value);
  }
});

const handleContentClick = (e: Event) => {
  if (props.trigger === CLICK) {
    setVisibleRef(true);
    emits('click', e);
  }
};

const handleShowTips = () => {
  setVisibleRef(true);
};

const handleHideTips = () => {
  setVisibleRef(false);
};

const offsetX = computed(() => props.offsetX);
const offsetY = computed(() => props.offsetY);
const triangleOffsetX = computed(() => props.triangleOffsetX);
const triangleOffsetY = computed(() => props.triangleOffsetY);

defineExpose({
  handleHideTips,
  handleContentClick,
  handleShowTips,
  props,
  offsetX,
  offsetY,
  triangleOffsetX,
  triangleOffsetY,
  minHeight,
  visibleRef
});
</script>
<style lang="scss" scoped>
.tooltip {
  position: relative;
  .tooltip-content-container {
    padding-left: 16rpx;
  }
  // .tooltip-mask {
  //   position: fixed;
  //   height: 100vh;
  //   width: 100vw;
  //   top: 0;
  //   left: 0;
  //   z-index: 99;
  // }
  .tooltip-content {
    z-index: 190;
    min-height: v-bind(minHeight);
    display: flex;
    align-items: center;
    background: rgba(0, 0, 0, 0.7);
    border-radius: 8rpx;
    font-size: $xe-font-size-sm;
    color: $xe-color-white;
    top: v-bind(offsetY);
    left: v-bind(offsetX);
    padding: 24rpx 32rpx;
    position: absolute;
  }
  .tooltip-content::after {
    content: '';
    width: 0;
    height: 0;
    border: 16rpx solid transparent;
    border-top: 16rpx solid rgba(0, 0, 0, 0.7);
    bottom: v-bind(triangleOffsetY);
    left: v-bind(triangleOffsetX);
    position: absolute;
  }
}
</style>
