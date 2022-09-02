import { mapActions, createNamespacedHelpers } from 'vuex';
import { IModuleState } from '@/store/store';
import { useStore } from '@/store';

/**
 *
 * @param moduleName 模块命名空间名称
 * @param wrapper 需要获取的Action键名组成的数组
 * @returns 用于更新的Action方法
 */
export const useAction = (moduleName: keyof IModuleState | string[], wrapper: string[] = []) => {
  const store = useStore();

  let mapFn = mapActions;

  if (typeof moduleName === 'string') {
    // 说明是访问子模块的Action
    mapFn = createNamespacedHelpers(moduleName).mapActions;
  } else {
    // 访问根路径的Action
    wrapper = moduleName;
  }

  const actions = mapFn(wrapper);

  Object.keys(actions).forEach(actionKey => {
    const action = actions[actionKey].bind({ $store: store });
    actions[actionKey] = action;
  });

  return actions;
};
