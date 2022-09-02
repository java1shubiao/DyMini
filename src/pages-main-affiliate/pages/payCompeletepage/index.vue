<template>
  <view class="content">
    <payCompelete :params-info="paramsInfo" :post-action="postActionBizData" @jump-webView="jumpWebView">
      <template #courseDetailButton>
        <course-detail-button :subscribe-message="subscribeMessage" />
      </template>
    </payCompelete>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import payCompelete from '@xiaoe/nui-goods-fe/lib/xe-pay-compelete/xe-pay-compelete.vue';
import { postActionBizData, postAction } from '@/api/manage';
import { onLoad } from '@dcloudio/uni-app';
import config, { DOMAIN } from '@/constants/config';
import { mergeDomain } from '@/utils/tools';
import pageBuried from '@/utils/buried';

const paramsInfo: any = ref({});
const spuId: any = ref('');
// * 在onLoad下如果需要调用onShow, 需使用普通配置方式
onLoad(options => {
  paramsInfo.value = {
    app_id: options.app_id,
    order_id: options.order_id,
    title: options.title || '',
    fromOrder: options.from_order,
    spu_id: options.spu_id,
    domain: config[DOMAIN]
  };
  const otherParam = {
    app_id: options.app_id
  };
  // 增加浏览埋点
  pageBuried('goods#pay_complete', false, '', otherParam);
  getSpuId();
});
const jumpWebView = val => {
  console.log('jumpurl', val, paramsInfo.value);
  const url = mergeDomain(paramsInfo.value.domain, paramsInfo.value.app_id, val);
  console.log('url: ', url);
  uni.redirectTo({
    url: `/pages-main-affiliate/pages/webview-container/index?src=${url}&title=${paramsInfo.value.title}`,
    appId: paramsInfo.value.app_id,
    title: paramsInfo.value.title,
    isH5Login: true
  });
};
const subscribeMessage = () => {
  const params = {
    app_id: paramsInfo.value.app_id,
    spu_id: spuId.value,
    tpl_id: 1,
    page: 'pages-main-affiliate/pages/goodsDetail/index'
  };
  postAction('/dy_server/message/send.template.message/1.0.0', params).then(res => {
    console.log(res);
  });
};
const getSpuId = () => {
  const params = {
    app_id: paramsInfo.value.app_id,
    order_id: paramsInfo.value.order_id,
    mini_pro_type: 'dymini'
  };
  postActionBizData('/xe.transaction.order.info.get/1.0.0', params).then(res => {
    const { code, data } = res;
    if (code === 0) {
      spuId.value = data.basic.goods_list[0].spu_id;
    }
  });
};
</script>

<style>
.logo {
  height: 200rpx;
  width: 200rpx;
  margin-top: 200rpx;
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.title {
  font-size: 36rpx;
  color: #8f8f94;
}
.fuck1 {
  color: red;
}
.fuck2 {
  color: green;
}
</style>
