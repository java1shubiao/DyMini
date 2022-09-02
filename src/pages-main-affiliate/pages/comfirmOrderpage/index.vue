<template>
  <view class="content">
    <comfirmOrder
      :post-action="postActionBizData"
      :get-action="getActionBizData"
      :params-info="paramsInfo"
    />
  </view>
</template>

<script setup lang="ts">
import { postActionBizData, getActionBizData } from '@/api/manage';
import { ref, Ref } from 'vue'
import comfirmOrder from '@xiaoe/nui-goods-fe/lib/xe-comfirm-order/xe-comfirm-order.vue';
import { onLoad } from '@dcloudio/uni-app'

const paramsInfo: any = ref({});
// * 在onLoad下如果需要调用onShow, 需使用普通配置方式
onLoad((option: any) => {
  paramsInfo.value = option;
});

</script>

<style>
.content {

}

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
