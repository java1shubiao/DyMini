export interface IProblemItemType {
  // * 卡片名称
  title: string;
  // * 展开内容
  content: string[];
  // * 唯一键
  key: number;
}

export type problemConfigType = Array<IProblemItemType>;
