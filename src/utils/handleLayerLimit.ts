import { useStore } from '../store/index';
import { PAGE_LIMIT, TIME_LIMIT, NUMBER_FAIL } from '../constants/index';
import { getH5Login } from '../api/mine/index';
import { splitQuery, mergeOptions } from '../utils/tools';

export const executeCommit = function() {
  // @ts-ignore
  const _vm = this;
  // 这里要用function 否则无法使用arguments
  return function(...arg: any[]) {
    const [commitName, ...args] = arg;
    _vm.commit(`HistoryRouter/${commitName}`, args);
  };
};

export const getGetter = (store: any, moduleName: string) => {
  const value = store.getters[moduleName];
  return value;
};

export const isWritePrototype = (obj: object, key: string) => {
  const descriptor = Object.getOwnPropertyDescriptor(obj, key);
  return descriptor?.writable;
};

export const setCanWrite = (obj: object, key: string) => {
  Object.defineProperty(obj, key, {
    writable: true
  });
};

export const refactoringJumpInUni = function(oldMethod: Function, _vm: Object) {
  const store = useStore();

  const commit = executeCommit.apply(store);

  // 记录第几次执行
  // eslint-disable-next-line
  let currentIndex = 0;
  let firstTime: any = null;
  let lastTime = null;
  return async function handleRouteHistory() {
    // 添加防抖函数
    lastTime = Date.now();
    if (firstTime && lastTime - firstTime < 500) {
      return;
    }
    firstTime = lastTime;

    // 跳转webview时做的处理
    if (arguments[0]?.isH5Login) {
      const argsItem = arguments[0];
      // 获取要跳转的小程序页面路径
      const splitsUrl = argsItem?.url.split('?');
      const path = splitsUrl[0];
      // 获取title参数
      const queryArr = splitsUrl[1].split('&');

      const { src: url, title } = queryArr.reduce((cur: any, item: string) => {
        cur[item.split('=')[0]] = item.split('=')[1];
        return cur;
      }, {});

      const { appId } = argsItem;
      const { data, code }: any = await getH5Login({
        app_id: appId,
        redirect_uri: url
      });
      if (code === NUMBER_FAIL) {
        commit('SET_FAIL_FETCH_PHONE', true);
        // 上面触发变更后，需要变回原样
        const timer = setTimeout(() => {
          commit('SET_FAIL_FETCH_PHONE', false);
          clearTimeout(timer);
        }, 500);
        return;
      }
      // TODO 没返回数据的情况坐下兼容
      const query = splitQuery(data?.loginUrl);

      if (query !== -1) {
        const { url: h5Url, ...args } = query;
        const options = mergeOptions(args);

        const bool = isWritePrototype(argsItem, 'url');
        !bool && setCanWrite(argsItem, 'url');

        const tit = title || '小鹅通';
        Object.assign(argsItem, {
          url: `${path}?src=${h5Url}&${options}&title=${tit}`
        });
      }
    }

    // 记录第几次跳转
    // eslint-disable-next-line
    currentIndex++;

    // eslint-disable-next-line
    const length = getCurrentPages().length;

    // eslint-disable-next-line
    const currentPages = getCurrentPages();

    // store获取getter的问题, 不能使用useGetter，只能从store上获取
    if (length < PAGE_LIMIT) {
      // 每次更新是因为物理后退无法触发更新，所以后退之后重新跳转的时候要更新

      commit('CLEAR_PAGE_QUEUE');
      currentPages.forEach((item: any) => {
        commit('INIT_PAGE_QUEUE', item?.$vm?.__route__);
      });

      commit('PUSH_PAGE_QUEUE', arguments[0].url);

      // 这里使用apply，不能用bind
      oldMethod.apply(_vm, arguments);
    } else if (length === PAGE_LIMIT) {
      if (arguments[0].isBack && arguments[0].fromMiddlePage) {
        setTimeout(() => {
          oldMethod.apply(_vm, arguments);
        }, TIME_LIMIT);
        // 回退不需要入栈，因此直接return
        return;
      }

      const normalUrl = arguments[0].url ? arguments[0].url : arguments[0];

      if (!arguments[0].isNeed) {
        commit('PUSH_PAGE_QUEUE', normalUrl);
      }
      // 页面前进:判断如果来至中间页,调用旧uni.navigateTo方法
      if (arguments[0].isBack === undefined && arguments[0].fromMiddlePage) {
        // 如果不加延迟，无法跳转 （具体原因还没定位到）
        const timer = setTimeout(() => {
          oldMethod.apply(_vm, arguments);
          clearTimeout(timer);
        }, TIME_LIMIT);
        return;
      }

      // 页面栈：9 - 10 重定向到中间页
      const query = normalUrl.split('?')[1] || '';
      const url = `/pages-assist-affiliate/pages/middle-page/index?${query}`;
      uni.redirectTo({
        url
      });
    } else {
      // 页面入栈
      const normalUrl = arguments[0].url;

      commit('PUSH_PAGE_QUEUE', normalUrl);

      uni.redirectTo({
        url: normalUrl
      });
    }
  };
};

export const refactoringJumpInUniRedirect = function(oldMethod: (options: any) => void, _vm: Record<string, any>) {
  const store = useStore();
  const commit = executeCommit.apply(store);
  return async function() {
    // 跳转webview时做的处理
    if (arguments[0]?.isH5Login) {
      const argsItem = arguments[0];
      // 获取要跳转的小程序页面路径
      const splitsUrl = argsItem?.url.split('?');
      const path = splitsUrl[0];
      // 获取title参数
      const queryArr = splitsUrl[1].split('&');

      const { src: url, title } = queryArr.reduce((cur: any, item: string) => {
        cur[item.split('=')[0]] = item.split('=')[1];
        return cur;
      }, {});

      const { appId } = argsItem;
      const { data, code }: any = await getH5Login({
        app_id: appId,
        redirect_uri: url
      });
      if (code === NUMBER_FAIL) {
        commit('SET_FAIL_FETCH_PHONE', true);
        // 上面触发变更后，需要变回原样
        const timer = setTimeout(() => {
          commit('SET_FAIL_FETCH_PHONE', false);
          clearTimeout(timer);
        }, 500);
        return;
      }
      // TODO 没返回数据的情况坐下兼容
      const query = splitQuery(data?.loginUrl);

      if (query !== -1) {
        const { url: h5Url, ...args } = query;
        const options = mergeOptions(args);

        const bool = isWritePrototype(argsItem, 'url');
        !bool && setCanWrite(argsItem, 'url');

        const tit = title || '小鹅通';
        Object.assign(argsItem, {
          url: `${path}?src=${h5Url}&${options}&title=${tit}`
        });
      }
    }
    const timer = setTimeout(() => {
      oldMethod.apply(_vm, arguments as any);
      clearTimeout(timer);
    }, TIME_LIMIT);
  };
};
