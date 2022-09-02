<template>
  <web-view :src="src"></web-view>
</template>

<script setup lang="ts">
import { onLoad } from '@dcloudio/uni-app';
import type { Ref } from 'vue';
import { ref } from 'vue';
import { mergeUrlQuery } from '@/utils/tools'
const src: Ref<string> = ref('')
onLoad((options: any) => {
  const { title, ...query } = options
  console.log('query', query);
  const url = mergeUrlQuery(query, options.src)
  console.log('url', url);

  uni.setNavigationBarTitle({
    title: title
  })
  src.value = url || '';
})
</script>
<style lang="scss" scoped></style>
