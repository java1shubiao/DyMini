// TODO 已弃用, 暂保留
import { RuleObject } from '@xiaoe/uni-ui/lib/xe-form/types';
import { getClientRect, getWindowHeight } from '@/utils/tools';

type setDistance = (distance: number) => void;

export const GET_CODE = 1; // 获取
export const TIME_DOWN = 2; // 倒计时
export const RE_GET = 3; // 重新获取
export const ZERO = 0;

export const validateCodeFunc = async (rule: RuleObject, value: string) => {
  if (!value) {
    return Promise.reject('请输入验证码');
  } else if (value && value.length < 6) {
    return Promise.reject('请输入正确的验证码');
  } else {
    return Promise.resolve();
  }
};

export const validatePhoneNum = (setCanGetCode: (canGetCode: boolean) => void, setErrorMsg: (msg: string) => void) => {
  return async (rule: RuleObject, value: string) => {
    const phoneReg = /^1(3\d|4[5-9]|5[0-35-9]|6[2567]|7[0-8]|8\d|9[0-35-9])\d{8}$/;
    if (value === '') {
      setCanGetCode(false);
      const errMsg = '请输入11位手机号';
      setErrorMsg(errMsg);
      return Promise.reject(errMsg);
    } else if (!phoneReg.test(value)) {
      setCanGetCode(false);
      const errMsg = '手机号格式错误';
      setErrorMsg(errMsg);
      return Promise.reject(errMsg);
    } else {
      setCanGetCode(true);
      setErrorMsg('');
      return Promise.resolve();
    }
  };
};

export const getKeyBoardDistance = async (
  setPhoneKeyBoardDistance: setDistance,
  setCodeKeyBoardDistance: setDistance,
  isAndroid: boolean
) => {
  // ! rect下left bottom top right 对应左下上右边界在可视窗口中的坐标, ios下不管软键盘距离输入框距离有多远, 都会自动计算到不超出边界的情况
  const phoneInputRect = await getClientRect('.login-phone-input');
  const codeInputRect = await getClientRect('.login-code-input');
  const windowHeight = await getWindowHeight();
  const phoneAdjustDistance =
    phoneInputRect.bottom && phoneInputRect.top ? (phoneInputRect.bottom - phoneInputRect.top) / 4 : 0; // 尽量接近光标位置
  const codeAdjustDistance =
    codeInputRect.bottom && codeInputRect.top ? (codeInputRect.bottom - codeInputRect.top) / 4 : 0; // 尽量接近光标位置
  if (isAndroid) {
    const phoneInputDistance =
      typeof phoneInputRect.bottom === 'number' ? phoneInputRect.bottom - phoneAdjustDistance : 0;
    const codeInputDistance = typeof codeInputRect.bottom === 'number' ? codeInputRect.bottom - codeAdjustDistance : 0;
    setPhoneKeyBoardDistance(windowHeight - phoneInputDistance);
    setCodeKeyBoardDistance(windowHeight - codeInputDistance);
    return;
  }
  setPhoneKeyBoardDistance(windowHeight - (phoneInputRect.top || 0));
  setCodeKeyBoardDistance(windowHeight - (codeInputRect.top || 0));
};

export const btnStyle = 'width: 320rpx; height: 80rpx; font-weight: 500;';
