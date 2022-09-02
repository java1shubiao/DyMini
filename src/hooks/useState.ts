import { mapState, createNamespacedHelpers } from 'vuex';
import { computed } from 'vue';
import { IModuleState } from '@/store/store';
import { useStore } from '@/store';
import { IStoreState } from './hooks';

/**
 *
 * @param moduleName 模块名
 * @param wrapper 模块下state组成的数组
 * @return storeState 需要使用的计算属性state
 */
export const useStoreState = (moduleName: keyof IModuleState | string[], wrapper: string[] = []): IStoreState => {
  const store = useStore();
  let mapFn = mapState;

  if (typeof moduleName === 'string') {
    // 访问子模块的状态
    mapFn = createNamespacedHelpers(moduleName).mapState;
  } else {
    // 访问RootState
    wrapper = moduleName;
  }

  const storeStateFns = mapFn(wrapper);

  // 转换数据
  const storeState: IStoreState = {};

  // 使用 computed 将状态包裹一层再返回
  Object.keys(storeStateFns).forEach(fnKey => {
    const fn = storeStateFns[fnKey].bind({ $store: store }); // 不绑定store, vuex执行会报错
    storeState[fnKey] = computed(fn); // 仅暴露value出去
  });

  return storeState;
};
