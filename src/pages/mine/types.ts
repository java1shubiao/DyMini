export interface CardListInfo<V> {
  [index: number]: V;
}

export interface CardListItem {
  name?: string;
  icon?: string;
  url?: string;
  fn?: (...args: any[]) => void;
}

export interface HeadInfo {
  nickname?: string;
  number?: string;
  avatar?: string;
}
