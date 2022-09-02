<!-- TODO 已弃用, 暂保留 -->
<template>
  <XeModal
    v-model:value="visible"
    title=""
    content-text=""
    width="100%"
    :is-mask-close="true"
    :container-styles="`padding-top: 0;padding-bottom: ${isAndroid ? '48rpx' : '72rpx'}`"
    :click-container="handleClickModel"
    @click-mask="handleClickModel"
  >
    <template #title>
      <view class="title-container">
        <image mode="aspectFit" class="title-icon" :src="xiaoeImgCircle" />
        <text class="title-content">小鹅通 申请</text>
      </view>
    </template>
    <template #content>
      <view class="modal-content">
        <XeForm ref="formRef" layout="horizontal" :model="formState">
          <XeFormItem
            name="phoneNumber"
            :rules="{ required: true, trigger: ['blur'], validator: validatePhoneNum(setCanGetCode, setErrorMsg) }"
            validate-trigger="blur"
            item-style="height: 156rpx;"
          >
            <XeInput
              v-model:value="phoneNumber"
              class="login-phone-input"
              placeholder="请输入手机号"
              width="686rpx"
              type="number"
              :cursor-spacing="phoneKeyBoardDistance"
              :is-focus-width-full="true"
              :allow-clear="true"
              :maxlength="11"
              @focus="handleFocus"
              @blur="handleBlur"
            />
          </XeFormItem>
          <XeFormItem
            class="form-validate"
            name="validateCode"
            :rules="{ required: true, validator: validateCodeFunc, trigger: ['blur', 'change'] }"
            item-style="height: 156rpx;"
          >
            <XeInput
              v-model:value="validateCode"
              placeholder="请输入验证码"
              class="login-code-input"
              type="number"
              width="686rpx"
              input-width="448"
              :cursor-spacing="codeKeyBoardDistance"
              @focus="handleFocus"
              @blur="handleBlur"
            >
              <template #suffix>
                <view class="get-code" @click="handleGetCode">
                  <view class="get-code-text">{{ validateCodeText }}</view>
                </view>
              </template>
            </XeInput>
          </XeFormItem>
        </XeForm>
        <Agreement ref="agreementRef" />
        <view class="commit-button-box">
          <XeButton :styles="btnStyle" type="default" @click="handleCloseModal">取消</XeButton>
          <XeButton :styles="btnStyle" type="primary" @click="handleLogin">登录</XeButton>
        </view>
        <view v-if="!isFocus && !isAndroid" class="content-foot"></view>
      </view>
    </template>
  </XeModal>
</template>

<script setup lang="ts">
import {
  withDefaults,
  defineProps,
  defineEmits,
  Ref,
  ref,
  onMounted,
  watchEffect,
  watch,
  ComputedRef,
  defineExpose,
  nextTick,
  computed
} from 'vue';
import XeModal from '@xiaoe/uni-ui/lib/xe-modal/xe-modal.vue';
import XeForm from '@xiaoe/uni-ui/lib/xe-form/xe-form.vue';
import XeFormItem from '@xiaoe/uni-ui/lib/xe-form/xe-form-item.vue';
import XeInput from '@xiaoe/uni-ui/lib/xe-input/xe-input.vue';
import XeButton from '@xiaoe/uni-ui/lib/xe-button/xe-button.vue';
import { useState } from '@xiaoe/uni-ui';
import { getPhoneValidateCode, phoneLogin } from '@/api/login';
import { showToast } from '@/utils/tools';
import { useGetter } from '@/hooks/useGetter';
import { useAction } from '@/hooks/useAction';
import { useMutation } from '@/hooks/useMutation';
import { SUCCESS_CODE, EMPTY_CODE } from '@/constants/code';
import { xiaoeImgCircle } from '@/constants/staticUrls';
import { IFormState } from './types';
import {
  GET_CODE,
  TIME_DOWN,
  RE_GET,
  ZERO,
  validateCodeFunc,
  getKeyBoardDistance,
  btnStyle,
  validatePhoneNum
} from './utils';
import Agreement from './agreement.vue';

const { CHANGE_TAB_BAR_STATUS } = useMutation('Login', ['CHANGE_TAB_BAR_STATUS']);
const { getUserInfo, getToken } = useGetter('Login', ['getUserInfo', 'getToken']);
const { setUserInfo, setToken } = useAction('Login', ['setUserInfo', 'setToken']);
const [isFocus, setIsFocus] = useState(false);

const formRef = ref<InstanceType<typeof XeForm>>();

const phoneNumber: Ref<string> = ref('');

const validateCode: Ref<string> = ref('');

const [canGetCode, setCanGetCode] = useState<boolean>(false);

const [errorMsg, setErrorMsg] = useState<string>('');

const [phoneKeyBoardDistance, setPhoneKeyBoardDistance] = useState(0);
const [codeKeyBoardDistance, setCodeKeyBoardDistance] = useState(0);
const [isAndroid, setIsAndroid] = useState(false);

const validateCodeStatus: Ref<1 | 2 | 3> = ref(1);

const countDownTime: Ref<number> = ref(60);

const agreementRef = ref<InstanceType<typeof Agreement>>();

const validateCodeText: ComputedRef<string> = computed(() => {
  switch (validateCodeStatus.value) {
    case GET_CODE:
      return '获取验证码';
    case TIME_DOWN:
      return `${countDownTime.value}s`;
    case RE_GET:
      return '重新发送';
    default:
      return '获取验证码';
  }
});

const formState: ComputedRef<IFormState> = computed(() => {
  return {
    phoneNumber: phoneNumber.value,
    validateCode: validateCode.value
  };
});

const visible: Ref<boolean> = ref(false);

const emits = defineEmits<{
  (e: 'update:value', value: boolean): void;
  (e: 'change', value: boolean): void;
}>();

const props = withDefaults(
  defineProps<{
    value?: boolean;
    answer?: string; // * 图形验证码答案
    answerId?: string; // * 图形验证码请求返回id
    sessionId?: string; // * 图形验证码验证用session_id
    setIsShowGraphCode?: (value: boolean) => void;
    onCancel?: () => void;
    onSuccess?: () => void;
    moduleName?: string;
  }>(),
  {
    value: false,
    answer: '',
    answerId: '',
    sessionId: '',
    setIsShowGraphCode: () => {},
    onSuccess: () => {},
    onCancel: () => {},
    moduleName: ''
  }
);

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
  emits('change', visible.value);
  if (visible.value) {
    uni.hideTabBar();
    CHANGE_TAB_BAR_STATUS({ status: true, moduleName: props.moduleName });
    nextTick(async () => {
      await getKeyBoardDistance(setPhoneKeyBoardDistance, setCodeKeyBoardDistance, isAndroid.value);
    });
  } else {
    uni.showTabBar();
    CHANGE_TAB_BAR_STATUS({ status: false, moduleName: props.moduleName });
    nextTick(async () => {
      await getKeyBoardDistance(setPhoneKeyBoardDistance, setCodeKeyBoardDistance, isAndroid.value);
    });
  }
});

onMounted(async () => {
  const platform = uni.getSystemInfoSync().platform;
  setIsAndroid(platform === 'android');
  await getKeyBoardDistance(setPhoneKeyBoardDistance, setCodeKeyBoardDistance, isAndroid.value);
});

const startGetCode = () => {
  if (validateCodeStatus.value === GET_CODE || validateCodeStatus.value === RE_GET) {
    props.setIsShowGraphCode(true);
  }
};

const handleGetCode = () => {
  if (validateCodeStatus.value === TIME_DOWN) return;
  if (!canGetCode.value) {
    const form = formRef?.value;
    form?.validateFields(['phoneNumber']);
    // * 防止输入完毕后直接点击获取验证码
    if (canGetCode.value) {
      startGetCode();
      return;
    }
    showToast(errorMsg.value);
    return;
  }
  startGetCode();
};

// * 获取手机验证码
const getCode = async (sendMessage: () => void) => {
  // * 发起请求
  const params = {
    sessionId: props.sessionId,
    id: props.answerId,
    answer: props.answer,
    phone: phoneNumber.value // 手机号
  };
  const res: any = await getPhoneValidateCode(params);
  if (res.code === SUCCESS_CODE) {
    validateCodeStatus.value = TIME_DOWN;
    countDownTime.value = 59;
    sendMessage(); // 弹出toast并且关闭弹窗
    // setValidateCodeFocus(true); // 强制让验证码输入框focus
    let time: any = setInterval(() => {
      countDownTime.value = countDownTime.value - 1;
      if (countDownTime.value === ZERO) {
        clearInterval(time as number);
        time = null;
        validateCodeStatus.value = RE_GET;
      }
    }, 1000);
  } else if (res.code === EMPTY_CODE) {
    // * 未填写验证码
    showToast('请输入验证码', 'none');
  } else {
    showToast('请输入正确的验证码', 'none');
  }
};

// * 展开tooltip
const showTooltip = () => {
  const tooltip = agreementRef?.value;
  tooltip?.showTooltip?.();
};

const handleLogin = () => {
  const form = formRef?.value;
  const isAgree = agreementRef?.value?.isAgree;
  form
    ?.validateFields()
    ?.then(() => {
      // * 已通过表单校验
      if (!isAgree) {
        return showTooltip();
      }
      loginInMiniProgram();
    })
    .catch(() => {
      return showTooltip();
    });
};

const loginInMiniProgram = () => {
  const params = {
    code: validateCode.value,
    phone: phoneNumber.value,
    sessionId: props.sessionId
  };
  showToast('加载中', 'loading', 20000);
  phoneLogin(params)
    .then((res: any) => {
      const { code, msg, data } = res;
      if (code === 0) {
        showToast('登录成功');
        visible.value = false;
        setUserInfo({ ...getUserInfo.value, phone: phoneNumber.value, nickname: `用户${phoneNumber.value.slice(7)}` });
        console.info(getToken.value);
        setToken(data.token || getToken.value);
        props.onSuccess();
      } else {
        showToast(msg || '信息错误');
      }
    })
    .finally(() => {
      uni.hideToast();
    });
};

const handleClickModel = () => {
  // * 关闭弹窗
  const agreement = agreementRef.value;
  agreement?.hideTips?.();
};

const handleCloseModal = () => {
  visible.value = false;
  props.onCancel();
};

const handleFocus = () => {
  setIsFocus(true);
};
const handleBlur = () => {
  setIsFocus(false);
};

defineExpose({
  handleLogin,
  validateCodeFunc,
  handleGetCode,
  getCode
});
</script>
<style lang="scss" scoped>
.title-container {
  display: flex;
  height: 116rpx;
  align-items: center;
  padding: 36rpx 0 36rpx 0;
  margin-bottom: 32rpx;
  .title-icon {
    width: 44rpx;
    height: 44rpx;
    border-radius: 50%;
  }
  .title-content {
    font-size: $xe-font-size-sm;
    color: $xe-color-dark-black;
    font-weight: 500;
    margin-left: 16rpx;
  }
}

.form-validate {
  display: block;
  // margin-top: 16rpx;
}

.get-code {
  width: 204rpx;
  height: 96rpx;
  display: flex;
  align-items: center;
  .get-code-text {
    display: flex;
    align-items: center;
    border-left: 1rpx solid #e5e5e5;
    width: 100%;
    height: 72rpx;
    color: $xe-color-primary;
    font-size: $xe-font-size-sm;
    justify-content: center;
  }
}

.content-foot {
  height: 68rpx;
  width: 100%;
  background-color: #fff;
}

.commit-button-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-right: 16rpx;
  padding-left: 16rpx;
  margin-top: 32rpx;
}
</style>
