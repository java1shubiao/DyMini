import { IErrorTextOptions } from './type';
import store from '@/store';
import { HOME_PAGE } from '@/constants/page';
import { showToast, hideToast, toPage } from '@/utils/tools';
import reloadImg from '@/static/images/status/weaknet.png';

// * 缺省配置
export const errorTextOptions: IErrorTextOptions = {
  reLogin: {
    text: '登录失败',
    imgUrl: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6evtc4x05ve.png',
    btnText: '重新登录',
    action: (url?: string) => {
      showToast('登录中', 'loading', 1000000);
      store
        .dispatch('Login/handleLogin')
        .then(() => {
          hideToast();
          toPage(url!);
          showToast('登录成功', 'none');
        })
        .catch(() => {
          hideToast();
          showToast('登录失败', 'none');
        });
    }
  },
  reLoad: {
    text: '网络异常\n请检查网络设置或稍后重试',
    // imgUrl: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6evtc4t06rb.png',
    imgUrl: reloadImg,
    btnText: '重试',
    action: (url?: string) => {
      toPage(url!);
    }
  },
  backHome: {
    text: '系统异常',
    imgUrl: 'https://commonresource-1252524126.cdn.xiaoeknow.com/image/l6evtc4x05ve.png',
    btnText: '返回首页',
    action: () => {
      uni.switchTab({
        url: HOME_PAGE
      });
    }
  }
};
