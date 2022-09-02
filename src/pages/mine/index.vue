<template>
  <XePage back-type="grey" :is-need-status="false">
    <view class="mine-page">
      <HeadInfo />
      <CardList :card-list="cardList" />
      <!-- <ShowLogin ref="showLoginRef" :module-name="MINE" /> -->
    </view>
  </XePage>
</template>

<script setup lang="ts">
import XePage from '@xiaoe/uni-ui/lib/xe-page/xe-page.vue';
import CardList from './components/cardList.vue';
import HeadInfo from './components/headInfo.vue';
import { useGetter } from '@/hooks/useGetter';
import { useAction } from '@/hooks/useAction';
// import ShowLogin from '@components/login/showLogin.vue';
import useTabBarStatus, { MINE } from '@/hooks/useTabBarStatus';
import { createCardList } from './utils';

useTabBarStatus(MINE);

const { getUserInfo } = useAction('Login', ['getUserInfo']);
const { getUserInfo: userInfo } = useGetter('Login', ['getUserInfo']);

const reAuthorize = () => {
  // 重新授权
  (async () => {
    await getUserInfo(true);
  })();
};

// TODO 待会要改下
const handleOrder = () => {
  if (!userInfo.value.isAuth) {
    reAuthorize();
    return;
  }
  uni.navigateTo({
    url: '/pages-main-affiliate/pages/order/order-list'
  });
};

const cardList = createCardList(handleOrder);
</script>
<style lang="scss" scoped>
.mine-page {
  width: 100%;
}
</style>
