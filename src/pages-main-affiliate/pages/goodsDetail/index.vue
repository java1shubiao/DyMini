<template>
  <view class="goodsDetail-content">
    <EmptyList v-if="showDelete" :status-text="empText"></EmptyList>
    <XeGoodsDetail
      v-else
      v-model:showDelete="showDelete"
      v-model:empText="empText"
      :post="postAction"
      :post-action="postActionBizData"
      :get-action="getActionBizData"
      :get="getAction"
      :option="optionData"
      :loadcata="loadcata"
      :env-page="envPage"
      :user-info="getUserInfo"
      :url="url"
      :login-ok="loginOk"
      :to-login="toLogin"
      :page-buried="pageBuried"
      :register-user="registerUser"
    >
      <template #test="data">
        <view class="pay-button" @click="buttonClick">
          <zijie-pay-button
            :custom-class="'pay-css'"
            :mode="2"
            :goods-id="data.goodsInfo.dy_product_id"
            :get-user-info="getUserInfo"
            :app-id="app_id"
            :goods-info="data.goodsInfo"
            :sku-list="data.skuList"
            :user-info="getUserInfo"
            :to-login="toLogin"
            :page-buried="pageBuried"
            :subscribe-message="subscribeMessage"
          />
        </view>
      </template>
      <template #dyFans>
        <view v-if="isShowDyAccountButton" class="focus-on-fans">
          <img src="https://commonresource-1252524126.cdn.xiaoeknow.com/image/l5t03g8f09bz.png" class="img-home" />
          <focus-on-fans
            :aweme-id="dyAccounts"
            :component-type="false"
            :buried-event="buriedEvent"
            :page-id="PAGE_ATTENTION"
            :app-id="app_id"
          />
        </view>
      </template>
    </XeGoodsDetail>
    <ShootVideo :click-shoot="setIsShootVideo" :is-shoot="isShootVideo" />
  </view>
</template>

<script setup lang="ts">
import { ref, Ref } from 'vue';
import { postAction, postActionBizData, getActionBizData, getAction } from '@/api/manage';
import { onLoad, onReachBottom, onShareAppMessage } from '@dcloudio/uni-app';
import useShare, { setShareInfo } from '@/hooks/useShare';
import XeGoodsDetail from '@xiaoe/nui-goods-fe/lib/xe-goodsDetail/xe-goodsDetail.vue';
import EmptyList from '@xiaoe/nui-goods-fe/lib/xe-order-common/empty-list.vue';
import { useGetter } from '@/hooks/useGetter';
import useLogin from '@/hooks/useLogin';
import config, { DOMAIN } from '@/constants/config';
import { mergeDomain } from '@/utils/tools';
import useTabBarStatus, { BEFORE_BUY } from '@/hooks/useTabBarStatus';
import { getShareInfo } from '@/api/share/index';
import { SUCCESS_CODE, PAGE_ATTENTION } from '@/constants';
import { useMutation } from '@/hooks/useMutation';
import pageBuried, { buriedEvent } from '@/utils/buried';
import ShootVideo from '@/components/shootVideo/index.vue';
import { fetchDyAccountApi } from '@/api/toDyAccount';

// * 防止用户未登录直接返回后tabBar消失
useTabBarStatus(BEFORE_BUY);

const { getUserInfo } = useGetter('Login', ['getUserInfo']);
const { handleLogin } = useLogin();

const optionData: any = ref({});
const shareData: any = ref({});
const envPage: any = ref(config[DOMAIN]);
const url: any = ref('');
const app_id: any = ref('');
const loginOk: any = ref(1);
const loadcata: any = ref(0);
const showDelete: any = ref(false);
const empText: any = ref('');
const isShowDyAccountButton: Ref<Number> = ref(0);
const dyAccounts: Ref<String> = ref('');

const fetchDyAccount = (appId: string) => {
  fetchDyAccountApi({
    app_id: appId
  }).then((res: any) => {
    if (!res.code) {
      console.log('-----------', res.data);
      const { dyAccount, dyAccountStatus } = res.data;
      dyAccounts.value = dyAccount;
      isShowDyAccountButton.value = dyAccountStatus;
    }
  });
};

const registerUser = (fun?: () => any) => {
  postAction('/dy_server/xe.dy.h5/user.register/1.0.0', {
    app_id: optionData.value.app_id
  }).then((res: any) => {
    if (res.code === 0) {
      fun?.();
    }
  });
};

const toLogin = (resolve: () => any, reject: () => any) => {
  // 绑定用户信息弹框
  handleLogin()
    .then(() => {
      // 注册用户信息
      registerUser(resolve);
    })
    .catch(() => {
      reject();
    });
};

const subscribeMessage = () => {
  const params = {
    app_id: optionData.value.app_id,
    spu_id: optionData.value.spu_id,
    tpl_id: 1,
    page: 'pages-main-affiliate/pages/goodsDetail/index'
  };
  postAction('/dy_server/message/send.template.message/1.0.0', params).then(res => {
    console.log(res);
  });
};

const { isShootVideo, setIsShootVideo } = useShare();
onShareAppMessage(() => shareData.value);

const { SET_SHARE_DATA } = useMutation('Share', ['SET_SHARE_DATA']);

onLoad((option: any) => {
  option = {
    ...option
  };
  optionData.value = option;
  fetchDyAccount(option.app_id);
  const resultUrl = mergeDomain(config[DOMAIN], option.app_id);
  url.value = resultUrl;
  app_id.value = option.app_id; // * 获取分享信息
  getShareInfo({ appId: option.app_id, spuId: option.spu_id }).then((res: Record<string, any>) => {
    const { code, data } = res;
    console.info(data, code, 'shareInfo');
    if (code === SUCCESS_CODE) {
      const { imgUrl, shareInfo: shareInfoJSON, appId, spuId } = data;
      const shareInfo = shareInfoJSON ? JSON.parse(shareInfoJSON) : '';
      shareData.value = setShareInfo({
        title: `${shareInfo?.shareWay || ''}${shareInfo?.shareText || ''}${shareInfo?.shareContent || ''}`,
        imageSrc: imgUrl,
        path: `/pages-main-affiliate/pages/goodsDetail/index?app_id=${appId}&spu_id=${spuId}`,
        successCallback: (res: any) => {
          console.info(res, '拍摄成功');
        }
      }); // * 设置分享信息, 于webview页面使用, 供给拍视频/直播锚点, 让无权限的用户回到售前页面（禁止直接进入售后）
      SET_SHARE_DATA(shareData.value);
    }
  });
});

const buttonClick = () => {
  const app_version = uni.getStorageSync('app_version');
  const arr = app_version.split('.');
  const versionArr = [20, 8, 0];
  if (
    Number(versionArr[0]) > Number(arr[0]) ||
    (Number(versionArr[0]) === Number(arr[0]) && Number(versionArr[1]) > Number(arr[1])) ||
    (Number(versionArr[0]) === Number(arr[0]) &&
      Number(versionArr[1]) === Number(arr[1]) &&
      Number(versionArr[2]) > Number(arr[2]))
  ) {
    uni.showModal({
      content: '当前抖音App版本过低, 请升级到最新版本，避免无法正常使用小程序'
    });
  }
};

onReachBottom(() => {
  loadcata.value = 1;
  setTimeout(() => {
    loadcata.value = 0;
  }, 150);
});
</script>

<style scoped lang="scss">
page {
  height: 100%;
}
.goodsDetail-content {
  height: 100%;
}

.pay-button {
  padding: 16rpx 32rpx;
}

.focus-on-fans {
  height: 96rpx;
  opacity: 1;
  border: 0 solid rgba(151, 151, 151, 1);
  background: rgba(255, 255, 255, 1);
  display: flex;
  align-items: center;
  justify-content: center;

  .img-home {
    width: 32rpx;
    height: 32rpx;
  }
}
</style>
