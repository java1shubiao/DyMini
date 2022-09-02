<template>
  <view class="page-container">
    <xe-order-detail
      ref="orderDetailRef"
      :post-action-biz="postActionBizData"
      :get-action="getAction"
      :option="optionData"
      :page-buried="pageBuried"
      :domain="domain"
    >
      <template #afterSalesButton="{ params }">
        <zijie-pay-button
          :custom-class="'after-sale'"
          :mode="params.mode"
          :order-status="params.orderStatus"
          :order-id="params.orderId"
          :refund-id="params.refundId"
          :app-id="params.appId"
          :user-id="params.userId"
          :sku-id="params.skuId"
          :study-time="params.studyTime"
        />
      </template>
      <template #payButton="{ params }">
        <zijie-pay-button
          :custom-class="'detail-pay'"
          :mode="params.mode"
          :order-status="params.orderStatus"
          :order-id="params.orderId"
          :app-id="params.appId"
          :goods-name="params.goodsName"
        />
      </template>
    </xe-order-detail>
  </view>
</template>

<script setup lang="ts">
import { postActionBizData, getAction } from '@/api/manage';
import XeOrderDetail from '@xiaoe/nui-goods-fe/lib/xe-order-detail/xe-order-detail.vue';
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import pageBuried from '@/utils/buried';
import { mergeDomain } from '@/utils/tools';
import config, { DOMAIN } from '@/constants/config';

const optionData: any = ref({});
const orderDetailRef = ref();
const domain: any = ref('');

onLoad((option: any) => {
  option = {
    ...option
  };
  optionData.value = option;
  domain.value = mergeDomain(config[DOMAIN], option.app_id);
});
onShow(() => {
  if (orderDetailRef.value) {
    orderDetailRef.value.getOrderInfo();
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  background-color: #f5f5f5;
}
</style>
