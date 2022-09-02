<template>
  <XePage :status="(status as statusType)" :is-need-status="!!listData.length" :grey="false">
    <Header :shop-info="shopInfo">
      <template #dyFans>
        <view v-if="isShowDyAccountButton" class="focus-on-fans">
          <focus-on-fans :aweme-id="dyAccounts" :buried-event="buriedEvent" :page-id="PAGE_ATTENTION" :app-id="appId" />
        </view>
      </template>
    </Header>
    <template v-for="(item, index) in (listData as IListItemType[])" :key="item.resourceId">
      <CourseCard
        :data="item"
        :card-style="
          `width: 100%; padding: 32rpx 38rpx 32rpx 32rpx;${index === listData.length - 1 ? 'box-shadow: none;' : ''}`
        "
        :is-show-shop-title="false"
        :style="{ width: '100%' }"
      />
    </template>
    <XeEmpty v-if="!listData.length" class="xe-empty-container" :empty-img-url="emptyImg" empty-text="暂无上架课程" />
    <ShootVideo :click-shoot="setIsShootVideo" :is-shoot="isShootVideo" />
  </XePage>
</template>

<script setup lang="ts">
import { computed, watchEffect, Ref, ref } from 'vue';
import XePage from '@xiaoe/uni-ui/lib/xe-page/xe-page.vue';
import XeEmpty from '@xiaoe/uni-ui/lib/xe-empty/xe-empty.vue';
import { statusType } from '@xiaoe/uni-ui/lib/xe-page/utils';
import { useState } from '@xiaoe/uni-ui';
import CourseCard from '@/components/courseCard/index.vue';
import useFetch from '@/hooks/useFetch';
import { emptyImg } from '@/constants/staticUrls';
import { IListItemType } from '@/components/courseCard/types';
import Header from './components/Header.vue';
import { getShopInfo } from '@/api/shopHomepage';
import { fetchDyAccountApi } from '@/api/toDyAccount';
import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage, onShow } from '@dcloudio/uni-app';
import { PAGE_SHOP_HOME_PAGE, SUCCESS_CODE, PAGE_ATTENTION } from '@/constants';
import useShare, { setShareInfo } from '@/hooks/useShare';
import ShootVideo from '@/components/shootVideo/index.vue';
import pageBuried, { buriedEvent } from '@/utils/buried';

const [shopInfo, setShopInfo] = useState<Record<string, any>>({});
const [appId, setAppId] = useState<string>('');
const { setIsShootVideo, isShootVideo } = useShare();

const isShowDyAccountButton: Ref<Number> = ref(0);
const dyAccounts: Ref<String> = ref('');

const onShareSuccess = (res: any) => {
  console.info(res, 'shareSuccess');
};

const defaultShareVal = setShareInfo({
  successCallback: onShareSuccess,
  title: '查看更多课程',
  imageSrc: shopInfo?.value?.shopLogo
});

const [shareData, setShareData] = useState(defaultShareVal);

watchEffect(() => {
  if (isShootVideo.value) {
    setShareData({
      ...shareData.value,
      imageUrl: '',
      path: `/pages-main-affiliate/pages/shopHomePage/index?app_id=${appId.value}`
    });
  } else {
    setShareData({
      ...shareData.value,
      imageUrl: shopInfo?.value?.shopLogo,
      path: `/pages-main-affiliate/pages/shopHomePage/index?app_id=${appId.value}`
    });
  }
});

onShareAppMessage(() => {
  return shareData.value;
});

const listParams = computed(() => ({
  appId: appId.value
}));

const [listData, status, fetchList] = useFetch<{ pageSize?: number; pageIndex?: number; appId: string }, IListItemType>(
  '/xe.dy.course/shop_home_list',
  'list',
  listParams
);

const initShopInfo = (appId: string) => {
  uni.showLoading({
    title: '加载中'
  });
  getShopInfo(appId)
    .then((res: any) => {
      if (res.code === SUCCESS_CODE) {
        setShopInfo(res.data);
      } else {
        uni.showToast({
          title: '获取店铺信息失败!'
        });
      }
    })
    .finally(() => {
      uni.hideLoading();
    });
};

const fetchDyAccount = (appId: string) => {
  fetchDyAccountApi({
    app_id: appId
  }).then((res: any) => {
    if (!res.code) {
      const { dyAccount, dyAccountStatus } = res.data;
      dyAccounts.value = dyAccount;
      isShowDyAccountButton.value = dyAccountStatus;
    }
  });
};

onLoad(options => {
  const { app_id } = options;
  setAppId(app_id!);
  fetchDyAccount(app_id!);
  initShopInfo(app_id!);
  fetchList(true);
});

// 触底逻辑
onReachBottom(() => {
  // 加一层定时器, 小程序的触底有cd时间, 若触底过快, 不会触发这一层逻辑 ,微信小程序为130ms左右
  setTimeout(() => {
    // * 触底加载开始
    fetchList();
  }, 150);
});

onShow(() => {
  // 达人主页埋点
  pageBuried(PAGE_SHOP_HOME_PAGE, false);
});

// 刷新逻辑
onPullDownRefresh(() => {
  fetchList(true);
  uni.stopPullDownRefresh();
});
</script>
<style lang="scss" scoped>
::v-deep {
  .xe-page-content {
    padding: 0;
  }
}
.focus-on-fans {
  top: 340rpx;
  left: 50%;
  transform: translateX(-40px);
  position: relative;
  z-index: 4;
}
.xe-empty-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
