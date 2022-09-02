import { mapGetters, createNamespacedHelpers } from 'vuex';
import { computed } from 'vue';
import { IModuleState } from '@/store/store';
import { useStore } from '@/store';
import { IStoreState } from './hooks';

/**
 *
 * @param moduleName 模块命名空间名称
 * @param wrapper 需要获取的getters键名组成的数组
 * @returns storeGetter 包括获取getters计算属性的对象
 */
export const useGetter = (moduleName: keyof IModuleState | string[], wrapper: string[] = []) => {
  const store = useStore();
  let mapFn = mapGetters;

  if (typeof moduleName === 'string') {
    // 说明是访问子模块的getter
    mapFn = createNamespacedHelpers(moduleName).mapGetters;
  } else {
    // 访问根路径的getter
    wrapper = moduleName;
  }

  const storeGettersFns = mapFn(wrapper);

  // 数据专户N
  const storeGetter: IStoreState = {};

  // 使用computed将状态包裹, 转换为计算属性
  Object.keys(storeGettersFns).forEach(fnKey => {
    const fn = storeGettersFns[fnKey].bind({ $store: store });
    storeGetter[fnKey] = computed(fn); // 仅暴露value出去
  });

  return storeGetter;
};
