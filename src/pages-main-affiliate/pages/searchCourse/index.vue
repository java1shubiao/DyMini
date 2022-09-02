<template>
  <view class="search-container">
    <view class="search-container-view">
      <XeInput
        v-model:value="courseCode"
        width="598rpx"
        height="64rpx"
        placeholder="请输入"
        :input-width="inputWidth"
        :maxlength="8"
        :allow-clear="true"
        input-padding-right="24rpx"
        :mask-left-offset="72"
        type="text"
        placeholder-style="color: #b2b2b2; font-size: 14px; font-weight: 400;"
        :focus="focus"
        :input-styles="{
          borderRadius: '40rpx',
          backgroundColor: '#fafafa',
          border: 'none',
          overflow: 'hidden'
        }"
        confirm-type="search"
        @confirm="handleSearch"
        @blur="handleBlur"
      >
        <template #prefix>
          <XeIcon type="input_search" size="32" color="#999" class="xe-icon-search" @tap.stop="() => setFocus(true)" />
        </template>
      </XeInput>
      <text class="search-text" @click="handleSearch">搜索</text>
    </view>
    <XeEmpty
      v-if="emptyState"
      class="xe-empty-container"
      empty-img-url="https://commonresource-1252524126.cdn.xiaoeknow.com/image/l14g7cm400rw.png"
      :empty-text="emptyText[emptyState]"
    />
  </view>
</template>

<script setup lang="ts">
import XeInput from '@xiaoe/uni-ui/lib/xe-input/xe-input.vue';
import XeIcon from '@xiaoe/uni-ui/lib/xe-icons/xe-icons.vue';
import XeEmpty from '@xiaoe/uni-ui/lib/xe-empty/xe-empty.vue';
import { computed, ref } from 'vue';
import { useState } from '@xiaoe/uni-ui';
import { onShow } from '@dcloudio/uni-app';
import { getDetail } from '@/api/searchCourse';
import { NO_COURSE, SUCCESS_CODE, TAKE_DOWN, PAGE_SEARCH } from '@/constants';
import { showToast, debounce } from '@/utils/tools';
import { buriedEvent } from '@/utils/buried';
import {
  CODE_LENGTH,
  COURSE_TAKE_DOWN,
  COURSE_EMPTY,
  OTHER_ERROR,
  ErrorType,
  IErrorParams,
  SHOP_CODE_LENGTH
} from './constant';

// * 调试页暗号
const cypher = '阳哥发红包';

const [focus, setFocus] = useState<boolean | undefined>(undefined);

const handleBlur = () => {
  setFocus(false);
};

onShow(() => {
  // ? 延迟focus, 防止输入框卡住, 导致placeholder丢失, 同时focus还是true
  setTimeout(() => {
    setFocus(true);
  }, 100);
});

const toDetail = (spuId: string, appId: string) => {
  uni.redirectTo({
    url:
      courseCode.value.length === CODE_LENGTH
        ? `/pages-main-affiliate/pages/goodsDetail/index?spu_id=${spuId}&app_id=${appId}`
        : `/pages-main-affiliate/pages/shopHomePage/index?app_id=${appId}`
  });
};

// * 是否空状态
const [emptyState, setEmptyState] = useState<number>(0);

// * 课程码
const courseCode = ref('');

// * input宽度
const inputWidth = computed(() => {
  return courseCode.value ? '446' : '526';
});

enum emptyText {
  '暂无数据' = COURSE_EMPTY,
  '商品已下架' = COURSE_TAKE_DOWN
}

// * 抛提示并设置状态
const renderToast = (msg: string, errorState: ErrorType): void => {
  showToast(msg);
  setEmptyState(errorState);
};

// * 处理错误信息, 抛提示并设置状态
const resolveErrorMsg = ({ msg, errorState, code, data }: IErrorParams): void => {
  if (typeof code !== 'number') {
    return renderToast(msg as string, errorState as ErrorType);
  } else {
    const spuId = data.spuId;
    const appId = data.appId;
    switch (code) {
      case SUCCESS_CODE:
        // * 正常进入商品详情页或店铺(达人)详情页
        return toDetail(spuId, appId);
      case NO_COURSE:
        // * 暂无课程或课程码错误但可提交
        return renderToast('暂无数据', COURSE_EMPTY);
      case TAKE_DOWN:
        // * 商品下架
        return renderToast('商品已下架', COURSE_TAKE_DOWN);
      default:
        // * 其余异常情况
        return renderToast('网络异常', OTHER_ERROR);
    }
  }
};

// * 点击搜索, 防抖300ms
const handleSearch = debounce(() => {
  if (courseCode.value === cypher) {
    console.info('暗号正确, 可冲, 进入调试页面');
    uni.navigateTo({
      url: '/PagesDebugAffiliate/Pages/DebugPage/DebugPage'
    });
    return;
  }
  buriedEvent(PAGE_SEARCH, {
    value: courseCode.value
  });
  if (!/^[0-9a-zA-Z]*$/.test(courseCode.value)) {
    // * 特殊字符校验, 不予提交
    resolveErrorMsg({ msg: '格式不正确，请重新输入', errorState: OTHER_ERROR });
    return;
  }
  // * 小于6位的店铺码或者小于8位的课程码不予以通过
  if (
    courseCode.value.length < SHOP_CODE_LENGTH ||
    (courseCode.value.length < CODE_LENGTH && courseCode.value.length > SHOP_CODE_LENGTH)
  ) {
    // 位数不够不予提交
    resolveErrorMsg({ msg: '位数不正确, 请重新输入', errorState: OTHER_ERROR });
    return;
  }
  showToast('搜索中', 'loading', 20000);
  getDetail(courseCode.value)
    .then((res: any) => {
      const { code, data } = res;
      resolveErrorMsg({ code, data });
    })
    .finally(() => {
      // 给Toast展示时间
      setTimeout(() => {
        uni.hideToast();
      }, 300);
    });
}, 300);
</script>
<style lang="scss" scoped>
.xe-icon-search {
  width: 72rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-container {
  background-color: #fff;
  width: 100%;
  height: 100vh;
  padding-top: 16rpx;
  padding-left: 32rpx;
  padding-right: 32rpx;
  .search-text {
    font-size: $xe-font-size-sm;
    color: $xe-color-black;
    height: 40rpx;
    line-height: 40rpx;
  }
  .xe-empty-container {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
.search-container-view {
  margin-bottom: 16rpx;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}
::v-deep {
  .search-container {
    .xe-input .xe-input-inner {
      background-color: #fafafa;
    }
  }
}
</style>
