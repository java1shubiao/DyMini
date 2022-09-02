const handleProtocol = (src: string, title: string) => {
  uni.navigateTo({
    url: `/pages-main-affiliate/pages/agreement-info/service-agreement-info?src=${src}&title=${title}`
  });
};

// * 前往常见问题页
const ToProblemPage = () => {
  uni.navigateTo({
    url: '/PagesCommonProblem/Pages/CommonProblem/CommonProblem'
  });
};

// * 列表配置
export const createCardList = (handleOrder: () => void) => [
  {
    name: '历史订单',
    icon: 'right',
    fn: handleOrder
  },
  {
    name: '服务协议',
    icon: 'right',
    url: 'https://admin.xiaoe-tech.com/charge_protocol_page',
    fn: handleProtocol
  },
  {
    name: '隐私政策',
    icon: 'right',
    url: 'https://admin.xiaoe-tech.com/privacy_protocol_page',
    fn: handleProtocol
  },
  {
    name: '常见问题',
    icon: 'right',
    fn: ToProblemPage
  }
];
