<!-- TODO 已弃用, 暂保留 -->
<template>
  <Tooltip ref="tooltipRef" content="已阅读并同意以下协议和政策" trigger="contextVisible">
    <view class="service-agreement">
      <XeRadio
        v-model:value="isAgree"
        content=""
        class="xe-radio-outer"
        styles="height: 32rpx; width: 32rpx;"
        @change="handleRadioChange"
      />
      <text class="service-agreement-text">已阅读并同意</text>
      <text
        class="service-agreement-info service-agreement-text"
        @click="handleGoService('https://admin.xiaoe-tech.com/charge_protocol_page', '小鹅通服务协议')"
      >
        《小鹅通服务协议》
      </text>
      <text class="service-agreement-info service-agreement-text">、</text>
      <text
        class="service-agreement-info service-agreement-text"
        @click="handleGoService('https://admin.xiaoe-tech.com/privacy_protocol_page', '小鹅通隐私政策')"
      >
        《小鹅通隐私政策》
      </text>
    </view>
  </Tooltip>
</template>

<script setup lang="ts">
import { ref, Ref, defineExpose } from 'vue';
import XeRadio from '@xiaoe/uni-ui/lib/xe-radio/xe-radio.vue';
import Tooltip from '../tooltip/tooltip.vue';
// * 是否勾选协议
const isAgree: Ref<boolean> = ref(false);

const tooltipRef = ref<InstanceType<typeof Tooltip>>();

const handleGoService = (src: string, title: string) => {
  uni.navigateTo({
    url: `/pages-main-affiliate/pages/agreement-info/service-agreement-info?src=${src}&title=${title}`
  });
};

const handleRadioChange = (val: boolean) => {
  if (val) {
    const tooltip = tooltipRef.value;
    tooltip?.handleHideTips?.();
  }
};

const showTooltip = () => {
  if (!isAgree.value) {
    const tooltip = tooltipRef.value;
    tooltip?.handleShowTips?.();
    return false;
  }
};

const hideTips = () => {
  const tooltip = tooltipRef.value;
  tooltip?.handleHideTips?.();
};

defineExpose({
  showTooltip,
  hideTips,
  isAgree
});
</script>
<style lang="scss" scoped>
.service-agreement {
  display: flex;
  align-items: center;
  margin-top: 36rpx;
  height: 40rpx;
  .xe-radio-outer {
    display: block;
    margin-right: 16rpx;
  }
  .service-agreement-text {
    font-size: $xe-font-size-mini;
    color: $xe-color-black;
    &.service-agreement-info {
      color: $xe-color-primary;
    }
  }
}
</style>
