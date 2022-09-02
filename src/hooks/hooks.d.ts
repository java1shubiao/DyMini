import { ComputedRef } from 'vue';

export interface IStoreState {
  [key: string]: ComputedRef<any>;
}
