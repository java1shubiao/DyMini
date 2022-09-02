<template>
  <view class="page-container">
    <xe-order-list
      ref="orderListRef"
      :post-action-biz="postActionBizData"
      :option="optionData"
      :page-buried="pageBuried"
    >
      <template #payButton="{ params }">
        <zijie-pay-button
          :custom-class="'list-pay'"
          :mode="params.mode"
          :order-status="params.orderStatus"
          :order-id="params.orderId"
          :app-id="params.appId"
          :goods-name="params.goodsName"
        />
      </template>
    </xe-order-list>
  </view>
</template>

<script setup lang="ts">
import { postActionBizData } from '@/api/manage';
import XeOrderList from '@xiaoe/nui-goods-fe/lib/xe-order-list/xe-order-list.vue';
import { ref } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import pageBuried from '@/utils/buried';

const optionData: any = ref({});
const orderListRef = ref();

onLoad((option: any) => {
  option = {
    ...option
  };
  optionData.value = option;
});
onShow(() => {
  if (orderListRef.value) {
    orderListRef.value.reloadOrderList('onShow');
  }
});
</script>

<style lang="scss" scoped>
.page-container {
  height: 100%;
  background-color: #f5f5f5;
}
</style>
