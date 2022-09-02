<!-- 通用H5页面 -->
<template>
  <web-view :src="src"></web-view>
</template>

<script setup lang="ts">
import { onLoad, onShareAppMessage } from '@dcloudio/uni-app';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { mergeUrlQuery } from '@/utils/tools'
import { useGetter } from '@/hooks/useGetter';

const src: Ref<string> = ref('')

const { getShareData } = useGetter('Share', ['getShareData']);

uni.hideShareMenu({
  hideShareItems: ['record', 'share']
});

onShareAppMessage(() => getShareData.value);

onLoad((options: any) => {
  const { title, ...query } = options
  const url = mergeUrlQuery(query)
  uni.setNavigationBarTitle({
    title
  })
  src.value = url || '';
})
</script>
<style lang="scss" scoped></style>
