<template>
  <view>
    <xe-after-sales-detail
      :post-action-biz="postActionBizData"
      :option="optionData"
    />
  </view>
</template>

<script setup lang="ts">
import { postActionBizData } from '@/api/manage';
import XeAfterSalesDetail from '@xiaoe/nui-goods-fe/lib/xe-after-sales-detail/xe-after-sales-detail.vue'
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const optionData: any = ref({})

onLoad((option: any) => {
  option = {
    ...option
  }
  optionData.value = option
})
</script>

<style lang="scss" scoped>

</style>
