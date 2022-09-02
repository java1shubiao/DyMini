<template>
  <view>
    <xe-apply-after-sales :post-action-biz="postActionBizData" :option="optionData" :env-page="envPage" />
  </view>
</template>

<script setup lang="ts">
import { postActionBizData } from '@/api/manage';
import XeApplyAfterSales from '@xiaoe/nui-goods-fe/lib/xe-apply-after-sales/xe-apply-after-sales.vue';
import { ref } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import config, { DOMAIN } from '@/constants/config';

const optionData: any = ref({});
const envPage: any = ref(config[DOMAIN]);

onLoad((option: any) => {
  option = {
    ...option
  };
  optionData.value = option;
});
</script>

<style lang="scss" scoped></style>
