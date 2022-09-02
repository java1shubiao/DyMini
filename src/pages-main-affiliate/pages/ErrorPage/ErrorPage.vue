<template>
  <ErrorComp :state="errorState" :origin-url="originUrl" />
</template>

<script setup lang="ts">
import ErrorComp from '@components/ErrorComp/ErrorComp.vue';
import { onLoad, onUnload } from '@dcloudio/uni-app';
import { useState } from '@xiaoe/uni-ui';
import { hideToast, setStorage } from '@/utils/tools';
import { IErrorPageOptions } from './type';
import { useMutation } from '@/hooks/useMutation';
import { RE_LOAD_STATE } from '@/constants/errorType';
import { CANNOT_IN_ERROR_PAGE } from '@/constants/page';

const { SET_REFRESH_STATUS: setRefreshStatus } = useMutation('Login', ['SET_REFRESH_STATUS']);

// * 无网络
const NONE = 'none';

// * 如果以页面级存在, 那么此值为初始值undefined, 而后在onLoad中设置正确的值, 如果以组件形式存在, 那么此值作为入参, 直接赋初始值作用
const [errorState, setErrorState] = useState<number>(undefined);
const [originUrl, setOriginUrl] = useState<string>(undefined);

const getNetworkType = (options: IErrorPageOptions) => {
  return new Promise((resolve, reject) => {
    uni.getNetworkType({
      success: ({ networkType }) => {
        // 网络状态优先级高于登录失败
        if (networkType === NONE) {
          // 无网络
          setErrorState(RE_LOAD_STATE);
        } else {
          // 正常设置
          setErrorState(Number(options.state));
        }
        resolve(networkType);
      },
      fail: errMsg => reject(errMsg)
    });
  });
};

// * 初始化
const handleInitErrPage = (options: IErrorPageOptions): void => {
  getNetworkType(options)
    .catch(() => {
      // * 未获取到网络信息
      setErrorState(Number(options.state));
    })
    .finally(() => {
      // * 取消错误页面的loading
      hideToast();
      // * url解码
      setOriginUrl(decodeURIComponent(options.url!));
      setTimeout(() => {
        // 进入页面后放开重新登录锁, 允许进入token过期逻辑
        // 此处需要使用宏队列, 放到下一次事件循环中处理, 让当次未被取消的请求全部结束响应, 防止有已进入响应的请求进入重登录逻辑
        setRefreshStatus(false);
      });
    });
};

// * 以页面存在
onLoad((options: IErrorPageOptions) => {
  handleInitErrPage(options);
});

onUnload(() => {
  // 允许进入
  setStorage(CANNOT_IN_ERROR_PAGE, false);
});
// const
</script>
<style lang="scss" scoped></style>
