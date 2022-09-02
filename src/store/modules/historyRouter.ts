import { IRootState } from '@/store/store';
import { Module } from 'vuex';

export interface IHistoryRouterType {
  name: number;
  historyList: Array<any>;
  isShowLogin: Boolean;
}

export const historyRouter: Module<IHistoryRouterType, IRootState> = {
  namespaced: true,
  state: {
    name: 1,
    historyList: [],
    isShowLogin: false
  },
  mutations: {
    incrementAge(state) {
      state.name++;
    },
    SET_FAIL_FETCH_PHONE(state, status) {
      state.isShowLogin = status;
    },
    /**
     * 初始化页面栈
     * */
    INIT_PAGE_QUEUE(state, route) {
      console.log('INIT_PAGE_QUEUE->route', route);
      state.historyList.push({
        route: route[0]
      });
      // eslint-disable-next-line no-console
      console.log('初始化成功', state.historyList);
    },
    CLEAR_PAGE_QUEUE(state) {
      state.historyList = [];
    },
    /**
     * 小程序路径入栈
     * */
    PUSH_PAGE_QUEUE(state, history) {
      state.historyList.push({
        route: history[0]
      });
      // eslint-disable-next-line no-console
      console.log('入栈成功', state.historyList, history);
    },
    /**
     * 小程序路径出栈
     * */
    POP_PAGE_QUEUE(state, history) {
      state.historyList.pop();
      // eslint-disable-next-line no-console
      console.log('出栈成功', state.historyList, history);
    }
  },
  getters: {
    historyList(state) {
      return state.historyList;
    },
    listLength(state) {
      return state.historyList.length;
    },
    isShowLogin(state) {
      return state.isShowLogin;
    }
  }
};
