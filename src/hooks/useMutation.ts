import { mapMutations, createNamespacedHelpers } from 'vuex';
import { IModuleState } from '@/store/store';
import { useStore } from '@/store';

/**
 *
 * @param moduleName 模块命名空间名称
 * @param wrapper 需要获取的Mutations键名组成的数组
 * @returns 用于更新的Mutation方法
 */
export const useMutation = (moduleName: keyof IModuleState | string[], wrapper: string[] = []) => {
  const store = useStore();

  let mapFn = mapMutations;

  if (typeof moduleName === 'string') {
    // 说明是访问子模块的Mutation
    mapFn = createNamespacedHelpers(moduleName).mapMutations;
  } else {
    // 访问根路径的Mutation
    wrapper = moduleName;
  }

  const mutations = mapFn(wrapper);

  Object.keys(mutations).forEach(mutationKey => {
    const mutation = mutations[mutationKey].bind({ $store: store });
    mutations[mutationKey] = mutation;
  });

  return mutations;
};
