<template>
  <view class="class"></view>
</template>
<script setup lang="ts">
// import { computed } from 'vue';
import { useGetter } from '../../../hooks/useGetter';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { useStore } from '../../../store/index';
import { PAGE_LIMIT, TIME_LIMIT } from '../../../constants/index';
let isBack = false;

const { historyList } = useGetter('HistoryRouter', ['historyList']);
const store = useStore();
onLoad(() => {
  isBack = false;
});

onShow(() => {
  const pages: any = historyList.value;
  const url = pages[pages.length - 1].route;
  if (!isBack) {
    console.log('中间页->url', url);
    setTimeout(() => {
      (uni.navigateTo as any)({ url, fromMiddlePage: true, isNeed: true });
    }, TIME_LIMIT);
    isBack = true;
  } else {
    console.log('下面开始执行出栈', isBack);
    store.commit('HistoryRouter/POP_PAGE_QUEUE');
    const len = pages.length;
    const currentPage = pages[len - 1].route;
    if (len > PAGE_LIMIT) {
      (uni.navigateTo as any)({
        url: currentPage,
        fromMiddlePage: true,
        isBack: true
      });
    } else if (len === PAGE_LIMIT) {
      // 直接重定向
      uni.redirectTo({
        url: currentPage
      });
    }
  }
});
</script>
