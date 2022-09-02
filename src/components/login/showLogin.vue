<!-- TODO 已弃用, 暂保留 -->
<template>
  <view clas="login-out-container">
    <Login
      v-if="isShowPhoneLogin && !isProdEnv"
      ref="loginRef"
      v-model:value="isShowPhoneLogin"
      v-model:answer="answer"
      v-model:answerId="id"
      v-model:sessionId="sessionId"
      :set-is-show-graph-code="setIsShowGraphCode"
      :on-cancel="onLoginCancel"
      :on-success="onLoginSuccess"
      :module-name="props.moduleName"
    />
    <GraphValidateCode
      v-if="!isProdEnv"
      v-model:answer="answer"
      v-model:id="id"
      v-model:sessionId="sessionId"
      :visible="isShowGraphCode"
      @commit="handleCommitGraphCode"
      @close="(value: boolean) => setIsShowGraphCode(value)"
    />
    <LoginByPhone
      v-if="isProdEnv"
      v-model:value="isShowPhoneLogin"
      :module-name="props.moduleName"
      :on-cancel="onLoginCancel"
      :on-success="onLoginSuccess"
    />
  </view>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue';
import { onMounted, computed, defineEmits, defineExpose, withDefaults, defineProps, ref } from 'vue';
import { useState } from '@xiaoe/uni-ui';
import Login from '@components/login/index.vue';
import LoginByPhone from '@/components/loginByPhone/index.vue';
import { useGetter } from '@/hooks/useGetter';
import { showToast } from '@/utils/tools';
import { isProdEnv } from '@/constants/config';
import GraphValidateCode from './graphValidateCode.vue';

const props = withDefaults(
  defineProps<{
    moduleName?: string;
    isFirstShowModal: boolean;
  }>(),
  {
    moduleName: '',
    isFirstShowModal: true
  }
);

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'success'): void;
}>();

const loginRef = ref<InstanceType<typeof Login>>();

const { getUserInfo } = useGetter('Login', ['getUserInfo']);

const phoneNumber: ComputedRef<string> = computed(() => {
  return getUserInfo.value?.phone || undefined;
});

// * 是否展示手机号登录
const [isShowPhoneLogin, setIsShowPhoneLogin] = useState<boolean>(false);

// * 是否展示图形验证码
const [isShowGraphCode, setIsShowGraphCode] = useState<boolean>(false);

const [answer] = useState('');
const [id] = useState('');
const [sessionId] = useState('');

const handleGetCode = (sendMessage: () => void) => {
  loginRef?.value?.getCode(sendMessage);
};

const handleCommitGraphCode = () => {
  // * 发起手机验证码请求
  handleGetCode(handleSendValidateCode);
};

const handleSendValidateCode = () => {
  // * 关闭弹窗
  setIsShowGraphCode(false);
  showToast('发送成功');
};

const onLoginCancel = () => {
  emit('cancel');
};

const onLoginSuccess = () => {
  emit('success');
};
// 需传入生命周期执行函数
onMounted(() => {
  props.isFirstShowModal && !phoneNumber.value && handleShowLogin();
});
const handleShowLogin = () => {
  setIsShowPhoneLogin(true);
};

defineExpose({
  handleShowLogin
});
</script>
<style lang="scss" scoped></style>
