<!-- TODO 已弃用, 暂保留 -->
<template>
  <XeModal
    :value="props.visible"
    title=""
    width="576rpx"
    content-text=""
    :is-mask-close="false"
    position="center"
    container-styles="padding: 24rpx 32rpx 48rpx; border-radius: 16rpx;position: relative;"
    @close="handleChange"
  >
    <template #title>
      <view class="graph-validate-title">
        <text class="title-text">安全验证</text>
        <view class="close-icon">
          <XeIcon
            class="icon"
            type="closeModal"
            :size="32"
            color="#d6d6d6"
            :styles="{ width: '32rpx', height: '32rpx' }"
            @click="handleClose"
          />
        </view>
      </view>
    </template>
    <template #content>
      <view class="graph-validate-code">
        <XeInput
          v-model:value="validateCode"
          class="validate-code-input"
          type="text"
          placeholder="请输入下图验证码，不区分大小写"
          placeholder-style="font-size: 14px;"
          input-width="512"
          width="512rpx"
          :cursor-spacing="200"
          :is-validate="false"
        />
        <view class="input-code-container">
          <image
            v-if="validateCodeImg"
            class="validate-code-img"
            mode="scaleToFill"
            :src="validateCodeImg"
            @click="handleRefresh"
          />
          <view v-else class="validate-code-img" @click="handleRefresh" />
          <XeIcon
            class="refresh-icon"
            type="shuaxin"
            :size="40"
            color="#666"
            :styles="{ width: '40rpx', height: '40rpx' }"
            @click="handleRefresh"
          />
        </view>
        <XeButton type="primary" :styles="btnStyle" @click="handleCommit">确定</XeButton>
      </view>
    </template>
  </XeModal>
</template>

<script setup lang="ts">
import { defineEmits, defineProps, withDefaults, watch } from 'vue';
import XeModal from '@xiaoe/uni-ui/lib/xe-modal/xe-modal.vue';
import XeIcon from '@xiaoe/uni-ui/lib/xe-icons/xe-icons.vue';
import XeInput from '@xiaoe/uni-ui/lib/xe-input/xe-input.vue';
import XeButton from '@xiaoe/uni-ui/lib/xe-button/xe-button.vue';
import { useState } from '@xiaoe/uni-ui';
import { getGraphCode } from '@/api/login';
import { SUCCESS_CODE } from '@/constants/code';
import { showToast, debounce } from '@/utils/tools';

const props = withDefaults(
  defineProps<{
    visible?: boolean;
  }>(),
  {
    visible: false
  }
);

const [validateCode, setValidateCode] = useState<string>('');

const [validateCodeImg, setValidateCodeImg] = useState<string>('');

const [loading, setLoading] = useState<boolean>(false);

watch(
  () => loading.value,
  newVal => {
    if (newVal) {
      showToast('加载中', 'loading', 200000);
    } else {
      uni.hideToast();
    }
  }
);

const btnStyle = 'width: 358rpx; height: 80rpx; font-weight: 500; margin-top: 48rpx;';

const emit = defineEmits<{
  (e: 'close', value: boolean): void;
  (e: 'update:answer', value: string): void;
  (e: 'update:id', value: string): void;
  (e: 'update:sessionId', value: string): void;
  (e: 'commit'): void;
}>();

const handleChange = (value: boolean) => {
  emit('close', value);
};

const handleClose = () => {
  handleChange(false);
};

const handleRefresh = debounce(() => {
  // 防止连续点击
  if (loading.value) {
    return;
  }
  setLoading(true);
  getGraphCode()
    .then((res: any) => {
      console.info(res);
      const { code, data, msg } = res;
      if (code === SUCCESS_CODE) {
        setValidateCodeImg(data.b64s);
        emit('update:id', data.id);
        emit('update:sessionId', data.sessionId);
      } else {
        // * 失败则直接刷掉
        setValidateCodeImg('');
        uni.showToast({ title: msg, icon: 'none' });
      }
    })
    .finally(() => {
      // 延迟刷掉msg信息
      setTimeout(() => {
        setLoading(false);
      }, 300);
    });
}, 300);

watch(validateCode, (newVal: string) => {
  if (newVal) {
    emit('update:answer', newVal);
  }
});

const handleCommit = debounce(() => {
  if (!validateCode.value) {
    showToast('请输入验证码', 'none');
    return;
  }
  showToast('验证中', 'loading');
  emit('commit');
});

watch(
  () => props.visible,
  newVal => {
    if (newVal) {
      // * 清空
      setValidateCode('');
      // * 重发
      handleRefresh();
    }
  },
  { immediate: true }
);
</script>
<style lang="scss" scoped>
.close-icon {
  position: absolute;
  right: 0;
  top: 0;
  width: 32rpx;
  height: 32rpx;
  box-sizing: content-box;
  padding: 24rpx;
  .icon {
    width: 32rpx;
    height: 32rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 32rpx;
  }
}
.graph-validate-title {
  display: flex;
  height: 88rpx;
  justify-content: center;
  padding-top: 24rpx;
  .title-text {
    color: $xe-color-black;
    font-size: $xe-font-size-base;
    font-weight: 500;
    height: 48rpx;
  }
}

.graph-validate-code {
  display: flex;
  flex-direction: column;
  margin-top: 16rpx;
  .input-code-container {
    display: flex;
    align-items: center;
    margin-top: 32rpx;
  }
  .validate-code-img {
    width: 440rpx;
    height: 96rpx;
    border-radius: 8rpx;
    background-color: #aaa;
    margin-right: 32rpx;
  }
  .refresh-icon {
    width: 40rpx;
    height: 40rpx;
    line-height: 40rpx;
  }
}
</style>
