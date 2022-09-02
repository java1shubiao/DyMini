import { IRootState } from '@/store/store';
import { Module } from 'vuex';
export interface IShareType {
  shareData: Record<string, any>;
}

export const share: Module<IShareType, IRootState> = {
  namespaced: true,
  state: {
    shareData: {} // 分享参数(此处仅供给售后页面使用, 仅于售前页面设置)
  },
  mutations: {
    SET_SHARE_DATA(state, shareData: Record<string, any>) {
      console.info(shareData, 'set');
      state.shareData = shareData;
    }
  },
  getters: {
    getShareData(state) {
      return state.shareData;
    }
  }
};
