import { logout } from '@/api/login';
import { showToast, toErrorPage, getCurPageUrl, setStorage, getStorage } from '@/utils/tools';
import { SUCCESS_CODE } from '@/constants';
import { ACCESS_TOKEN } from '@/constants/lgoin';
import { RE_LOAD_STATE, RE_LOGIN_STATE } from '@/constants/errorType';
import { IDebugConfigType } from './type';

export const handleLogout = (isKeepToken: boolean = false) => {
  logout().then((res: any) => {
    if (res.code === SUCCESS_CODE) {
      showToast('退出登录成功');
      !isKeepToken && uni.removeStorageSync(ACCESS_TOKEN);
    }
  });
};

export const toReLoginPage = (): void => {
  const url = getCurPageUrl();
  toErrorPage(RE_LOGIN_STATE, url);
};

export const toWeakNetPage = (): void => {
  const url = getCurPageUrl();
  toErrorPage(RE_LOAD_STATE, url);
};

export const handleClearStorage = (): void => {
  handleLogout(true);
  uni.clearStorage();
};

const setStorageOneTime = () => {
  setStorage('tst', '我曾在这里设置了一个值', 1000);
};

const getStorageOneTime = () => {
  const val = getStorage('tst');
  console.info(val);
  return val;
};

export const debugConfig: Array<IDebugConfigType> = [
  {
    key: 1,
    btnText: '退出登录',
    action: () => handleLogout(false)
  },
  {
    key: 2,
    btnText: '退出登录, 保留token',
    action: () => handleLogout(true)
  },
  {
    key: 3,
    btnText: '重新登录',
    action: toReLoginPage
  },
  {
    key: 4,
    btnText: '断网页',
    action: toWeakNetPage
  },
  {
    key: 5,
    btnText: '清除所有storage, 且退出登录',
    action: handleClearStorage
  },
  {
    key: 6,
    btnText: '设置storage, 1s过期',
    action: setStorageOneTime
  },
  {
    key: 7,
    btnText: '获取上面的值',
    action: getStorageOneTime
  }
];
