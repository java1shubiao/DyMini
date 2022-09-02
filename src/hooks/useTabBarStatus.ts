import { onShow } from '@dcloudio/uni-app';
import { useGetter } from './useGetter';
import { useMutation } from './useMutation';
import { computed, watchEffect } from 'vue';
import pageBuried, { pageBuriedConfig } from '@/utils/buried';

export const MAIN = 'main'; // 首页
export const STUDY = 'study'; // 学习
export const MINE = 'mine'; // 我的
export const BEFORE_BUY = 'beforeBuy'; // 售前

// * 处理快速切换tab造成的底部tab隐藏问题
const useTabBarStatus = (moduleName: string = 'main') => {
  const { getTabBarStatus, getModuleName } = useGetter('Login', ['getTabBarStatus', 'getModuleName']);
  const { SET_CURRENT_MODULE_NAME } = useMutation('Login', ['SET_CURRENT_MODULE_NAME']);

  const isGetTabBarStatusChange = computed(() => {
    return getTabBarStatus.value[MINE] || getTabBarStatus.value[STUDY] || getTabBarStatus.value[BEFORE_BUY];
  });

  const runShow = () => {
    // * 最后onShow需要修改当前的page
    SET_CURRENT_MODULE_NAME(moduleName);
    if (moduleName !== MAIN && getTabBarStatus.value[moduleName]) {
      // * 说明此时弹窗依然存在, 还没有隐藏
      uni.hideTabBar();
    }
  };

  runShow();

  watchEffect(() => {
    if (getModuleName.value === MAIN && isGetTabBarStatusChange) {
      // * 当前页面在首页, 监听到tabBar隐藏后立即弹出
      uni.showTabBar();
    }
  });

  onShow(() => {
    runShow();
    // * 上报
    const pageId = pageBuriedConfig?.[moduleName]?.pageId;
    pageId && pageBuried(pageId, false);
  });
};
export default useTabBarStatus;
