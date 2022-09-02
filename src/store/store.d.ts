import { IRequestType } from './modules/requestModule';
import { ILoginType } from './modules/login';
import { IShareType } from './modules/share';
import { IHistoryRouterType } from './modules/historyRouter';

// * 根模块类型定义
export interface IRootState {
  content: string;
}

export interface IModuleState {
  RequestModule: IRequestType;
  Login: ILoginType;
  Share: IShareType;
  HistoryRouter: IHistoryRouterType;
}

export interface AllState extends IRootState, IModuleState {}
