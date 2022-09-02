import { Data } from 'axios-miniprogram';

export type IResTypes = Data & {
  code: number;
  msg: string;
  data: any;
};

export interface AnyObject<T extends any = any> {
  [x: string]: T;
}

export type IRectTypes = Partial<{
  bottom: number;
  dataset: Record<string, any>;
  height: number;
  id: string;
  left: number;
  right: number;
  top: number;
  width: number;
}>;

export type none = 'none';
