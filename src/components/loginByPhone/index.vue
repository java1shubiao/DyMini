<!-- TODO 已弃用, 暂保留 -->
<template>
  <view class="get-phone-container">
    <XeModal
      v-model:value="visible"
      title=""
      content-text=""
      width="100%"
      :is-mask-close="true"
      :container-styles="`padding-top: 0; padding-bottom: 84rpx; padding-left: 0; padding-right: 0;`"
      @click-mask="handleClickModel"
    >
      <template #title>
        <view class="title-container">
          <text class="title-text">登录小鹅通</text>
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
        <view class="modal-content">
          <image class="modal-image" :src="xiaoeHighQualityImg" mode="aspectFill" />
          <XeButton
            :styles="btnStyle"
            class="xe-button"
            type="primary"
            open-type="getPhoneNumber"
            @click="handleBtnClick"
            @getphonenumber="handleGetPhone"
          >
            获取手机号
          </XeButton>
        </view>
      </template>
    </XeModal>
  </view>
</template>

<script setup lang="ts">
import { withDefaults, defineProps, defineEmits, watchEffect, watch } from 'vue';
import XeButton from '@xiaoe/uni-ui/lib/xe-button/xe-button.vue';
import XeModal from '@xiaoe/uni-ui/lib/xe-modal/xe-modal.vue';
import XeIcon from '@xiaoe/uni-ui/lib/xe-icons/xe-icons.vue';
import { useState } from '@xiaoe/uni-ui';
import { getPhoneLogin } from '@/api/login/index';
import { useGetter } from '@/hooks/useGetter';
import { useAction } from '@/hooks/useAction';
import { useMutation } from '@/hooks/useMutation';
import { SUCCESS_CODE } from '@/constants';
import { xiaoeHighQualityImg } from '@/constants/staticUrls';
import { showToast } from '@/utils/tools';
import { btnStyle } from './utils';

const { getUserInfo: userInfo, getToken } = useGetter('Login', ['getUserInfo', 'getToken']);
const { CHANGE_TAB_BAR_STATUS } = useMutation('Login', ['CHANGE_TAB_BAR_STATUS']);
const { setUserInfo, setToken } = useAction('Login', ['setUserInfo', 'setToken']);

const [visible, setVisible] = useState<boolean>(false);

const props = withDefaults(
  defineProps<{
    value?: boolean;
    moduleName?: string;
    // * 失败或关闭弹窗
    onCancel?: () => void;
    // * 成功
    onSuccess?: () => void;
  }>(),
  {
    value: false,
    moduleName: '',
    onCancel: () => {},
    onSuccess: () => {}
  }
);

const emits = defineEmits<{
  (e: 'update:value', value: boolean): void;
}>();

// * 外部传入的数据更新内部弹窗数组
watch(
  () => props.value,
  (newVal: boolean) => {
    visible.value = newVal;
  },
  {
    immediate: true
  }
);

// * 弹窗内部双向绑定更新外部value
watchEffect(() => {
  emits('update:value', visible.value);
  if (visible.value) {
    uni.hideTabBar();
    CHANGE_TAB_BAR_STATUS({ status: true, moduleName: props.moduleName });
  } else {
    uni.showTabBar();
    CHANGE_TAB_BAR_STATUS({ status: false, moduleName: props.moduleName });
  }
});

const handleClickModel = () => {
  props.onCancel();
};

const handleClose = () => {
  setVisible(false);
  props.onCancel();
};

// * 按钮点击
const handleBtnClick = () => {
  setVisible(false);
};

const handleGetPhone = (e: any) => {
  if (!e?.detail?.encryptedData) {
    // 表示失败
    handleClose();
    return;
  }
  const params = {
    encryptedData: e?.detail?.encryptedData || '',
    iv: e?.detail?.iv || '',
    sessionKey: userInfo?.value?.sessionKey || ''
  };
  showToast('加载中', 'loading', 20000);
  getPhoneLogin(params)
    .then((res: any) => {
      if (res.code === SUCCESS_CODE) {
        const { data } = res;
        setUserInfo({
          ...userInfo.value,
          phone: data?.phone || '',
          nickname: `用户${data?.phone?.value?.slice?.(7) || ''}`
        });
        setToken(data.token || getToken.value);
        props.onSuccess();
        showToast('手机号绑定成功');
      } else {
        showToast(res.msg);
        handleClose();
      }
    })
    .finally(() => {
      // * 延迟msg消失
      setTimeout(() => {
        uni.hideToast();
      }, 1000);
    });
};
</script>
<style lang="scss" scoped>
.title-container {
  width: 100%;
  height: 116rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  .title-text {
    color: $xe-color-black;
    font-size: $xe-font-size-base;
    font-weight: 500;
    height: 40rpx;
  }
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
}
.modal-content {
  padding: 32rpx 32rpx 0 32rpx;
  height: 430rpx;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  .modal-image {
    width: 228rpx;
    height: 228rpx;
  }
  .xe-button {
    margin-top: auto;
  }
}
</style>
