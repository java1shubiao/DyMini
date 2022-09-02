<template>
  <XePage :status="(status as statusType)" :is-need-status="!!listData.length" :grey="false">
    <!-- 此处无输入需求, 使用假输入框即可 -->
    <view class="search-container" @click="handleToSearch">
      <XeIcon type="input_search" size="32" color="#999" class="xe-icon-search" />
      <text class="search-text">请输入</text>
    </view>
    <view v-if="bannerArr.length && isShowBanner" class="banner-container">
      <Banner :data="bannerArr" :click="handleClick" />
    </view>
    <!-- 占位, 防止跳动 -->
    <view v-if="!isShowBanner" class="banner-container banner-box" />
    <view class="main-title">课程列表</view>
    <template v-for="item in (listData as IListItemType[])" :key="item.resourceId">
      <CourseCard :data="item" :style="{ marginTop: '32rpx' }" />
    </template>
    <XeEmpty v-if="!listData.length" class="xe-empty-container" :empty-img-url="emptyImg" empty-text="暂无相关课程" />
  </XePage>
</template>

<script setup lang="ts">
import { onLoad, onReachBottom, onPullDownRefresh, onShareAppMessage, onShow, onHide } from '@dcloudio/uni-app';
import XePage from '@xiaoe/uni-ui/lib/xe-page/xe-page.vue';
import XeEmpty from '@xiaoe/uni-ui/lib/xe-empty/xe-empty.vue';
import XeIcon from '@xiaoe/uni-ui/lib/xe-icons/xe-icons.vue';
import { statusType } from '@xiaoe/uni-ui/lib/xe-page/utils';
import { useState } from '@xiaoe/uni-ui';
import { IListItemType } from '@/components/courseCard/types';
import CourseCard from '@/components/courseCard/index.vue';
import useFetch from '@/hooks/useFetch';
import useTabBarStatus from '@/hooks/useTabBarStatus';
import useShare, { setShareInfo } from '@/hooks/useShare';
import { emptyImg, defaultShareImg } from '@/constants/staticUrls';
import { toGoodsDetail } from '@/utils/tools';
import Banner from './components/banner.vue';

useShare();

const onShareSuccess = (res: any) => {
  console.info(res, 'shareSuccess');
};

onShareAppMessage(() => {
  return setShareInfo({ imageSrc: defaultShareImg, successCallback: onShareSuccess });
});

// * 防止轮播图滚动出错, 需在页面出现时重新渲染轮播图
const [isShowBanner, setShowBanner] = useState<boolean>(false);

useTabBarStatus();

const [listData, status, fetchList] = useFetch<{ pageSize?: number; pageIndex?: number }, IListItemType>(
  '/xe.dy.course/home_list',
  'list'
);

// * 轮播图数据
const [bannerArr, setBannerArr] = useState<IListItemType[]>([]);

const getRandom = (len: number) => {
  return (Math.random() * len) >>> 0;
};

const getRandomArr = (len: number): number[] => {
  const res: number[] = [];
  while (res.length < Math.min(len, 3)) {
    const random = getRandom(len);
    if (!res.includes(random)) {
      res.push(random);
    }
  }
  return res;
};

// * 在onLoad下如果需要调用onShow, 需使用普通配置方式
onLoad(() => {
  (fetchList(true) as Promise<void | IListItemType[]>).then((list: void | IListItemType[]) => {
    if (Array.isArray(list)) {
      const len = list.length;
      // * 计算随机取值
      const randomArr = getRandomArr(len);
      // * 深拷贝, 防止轮播图数据变化
      const curListData = JSON.parse(JSON.stringify(listData.value));
      setBannerArr(randomArr.map((item: number) => curListData[item]));
    }
  });
  onShow(() => {
    setShowBanner(true);
  });
});

onHide(() => {
  setShowBanner(false);
});

const handleClick = (data: Partial<IListItemType>) => {
  toGoodsDetail(data.resourceId as string, data.appId as string);
};

// 触底逻辑
onReachBottom(() => {
  // 加一层定时器, 小程序的触底有cd时间, 若触底过快, 不会触发这一层逻辑 ,微信小程序为130ms左右
  setTimeout(() => {
    // * 触底加载开始
    fetchList();
  }, 150);
});

// 刷新逻辑
onPullDownRefresh(() => {
  fetchList(true);
  uni.stopPullDownRefresh();
});

// * 跳转到搜索页
const handleToSearch = () => {
  uni.navigateTo({
    url: '/pages-main-affiliate/pages/searchCourse/index'
  });
};
</script>

<style lang="scss" scoped>
.search-container {
  width: 100%;
  height: 64rpx;
  display: flex;
  align-items: center;
  background-color: #fafafa;
  padding-left: 24rpx;
  border-radius: 40rpx;
  margin-top: 16rpx;
  margin-bottom: 32rpx;
  .search-text {
    font-size: $xe-font-size-sm;
    color: #b2b2b2;
    display: block;
    margin-left: 16rpx;
  }
}

.banner-container {
  width: 100%;
  border-radius: 16rpx;
  overflow: hidden;
}

.banner-box {
  height: 386rpx;
}
.scan-code-btn {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
  box-shadow: 0 14rpx 60rpx 0 rgba(20, 114, 255, 0.4);
  border-radius: 24rpx;
}
.main-title {
  font-size: $xe-font-size-base;
  color: $xe-color-black;
  height: 88rpx;
  padding: 32rpx 0 8rpx 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  // margin-top: 32rpx;
  width: 100%;
  font-weight: 700;
}

::v-deep {
  .xe-page-content {
    background-color: #fff;
    padding-top: 0;
  }
  .xe-card .xe-card-content {
    margin-top: 0;
  }
}
.xe-empty-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
