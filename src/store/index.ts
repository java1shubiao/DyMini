import { createStore, Store, useStore as baseStore } from 'vuex';

import { AllState, IRootState } from './store';

import { requestModule as RequestModule } from './modules/requestModule';
import { historyRouter as HistoryRouter } from './modules/historyRouter';
import { InjectionKey } from 'vue';
import { login as Login } from './modules/login';
import { share as Share } from './modules/share';

export default createStore<IRootState>({
  state: {
    content: 'hello guys'
  },
  modules: {
    RequestModule,
    HistoryRouter,
    Login,
    Share
  }
});

export const key: InjectionKey<Store<IRootState>> = Symbol('rootStore'); // 定义一个key

export function useStore() {
  return baseStore<AllState>(key);
}
