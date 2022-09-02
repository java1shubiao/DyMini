import { IRootState } from '@/store/store';
import { Module } from 'vuex';
import { CancelAction } from 'axios-miniprogram';

interface ICancelMapItem {
  // * 标识是否响应
  response: boolean;
  // * 取消函数
  cancel: CancelAction;
}

interface IOriginCancelItem {
  cancel: CancelAction;
  actionName: string;
}

// * 取消请求配置
interface ICancelOptionsType {
  // 需要取消的集合
  actionNames: string[];
  // 取消信息
  msg: string;
}

export interface IRequestType {
  cancel: Map<string, ICancelMapItem>;
}

export const requestModule: Module<IRequestType, IRootState> = {
  namespaced: true,
  state: {
    cancel: new Map()
  },
  mutations: {
    // * 设置取消函数
    SET_CANCEL(state, { cancel, actionName }: IOriginCancelItem) {
      state.cancel.set(actionName, { cancel, response: false });
    },
    // * 标识为已响应
    RESPONSE(state, actionName: string) {
      if (state.cancel.has(actionName)) {
        state.cancel.set(actionName, { ...state.cancel.get(actionName)!, response: true });
      }
    },
    // * 取消请求
    CANCEL(state, { actionNames = [], msg = '用户手动取消网络请求' }: ICancelOptionsType) {
      if (!state.cancel.size) {
        return false;
      }
      state.cancel.forEach((value, key) => {
        if (actionNames.includes(key)) {
          if (!value?.response) {
            value?.cancel?.(msg);
            state.cancel.set(key, { ...value!, response: true });
          }
        }
      });
    },
    // * 取消所有未响应的请求
    CANCEL_ALL(state, msg: string = '用户手动取消网络请求') {
      if (!state.cancel.size) {
        return false;
      }
      state.cancel.forEach((value, key) => {
        if (!value?.response) {
          value?.cancel?.(msg);
          state.cancel.set(key, { ...value!, response: true });
        }
      });
    }
  },
  actions: {
    setCancel({ commit }, originCancel: IOriginCancelItem) {
      commit('SET_CANCEL', originCancel);
    },
    response({ commit }, actionName: string) {
      commit('RESPONSE', actionName);
    },
    cancel({ commit }, cancelOptions: ICancelOptionsType) {
      commit('CANCEL', cancelOptions);
    },
    cancelAll({ commit }, msg: string) {
      commit('CANCEL_ALL', msg);
    }
  }
};
