export type errorActionType = (url?: string) => void;

// * 异常配置单元
export interface IErrorActions {
  // * 错误文案
  text: string;
  // * 操作方式
  action: errorActionType;
  // * 图片路径
  imgUrl: string;
  // * 按钮文案
  btnText: string;
}

// * 错误状态
export interface IErrorTextOptions {
  // * 重新登录(登录失败)
  reLogin: IErrorActions;
  // * 重新加载(请求超时)
  reLoad: IErrorActions;
  // * 返回首页(系统异常, 暂无)
  backHome: IErrorActions;
}

export type typeErrors = 'reLogin' | 'reLoad' | 'backHome';
