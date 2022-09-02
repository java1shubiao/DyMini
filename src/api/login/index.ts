import { postAction, getAction } from '../manage';
import { getUrl, getStorage } from '@/utils/tools';
import { ACCESS_TOKEN, LOGIN_OUT_SIGN } from '@/constants/lgoin';

export type ILoginParams = Partial<{
  code: string; // code码, 从抖音登录中获取
  anonymousCode: string; // anonymousCode, 同样从抖音登录中获取
}>;

export interface IPhoneValidateCode {
  sessionId: string; // 验证会话id
  id: string; // 验证码id
  answer: string; // 验证码图片答案
  phone: string; // 手机号
}

export interface IPhoneLoginParams {
  code: string;
  phone: string;
  sessionId: string;
}

export interface UserInfo {
  nickname: string;
  avatar: string;
}

export interface IPhoneLoginType {
  encryptedData: string;
  iv: string;
  sessionKey: string;
}

// * 静默登录
export const login = (props: ILoginParams) => postAction(getUrl('/xe.dy.account/login'), props);

// * 获取短信验证码
export const getPhoneValidateCode = (props: IPhoneValidateCode) => postAction(getUrl('/xe.dy.account/msg.send'), props);

// * 获取图形验证码
export const getGraphCode = () => getAction(getUrl('/xe.dy.account/captcha.get'));

// * 手机号登录
export const phoneLogin = (params: IPhoneLoginParams) => postAction(getUrl('/xe.dy.account/msg.check'), params);

// * 更新userInfo
export const updateUserInfo = (params: UserInfo) => postAction(getUrl('/xe.dy.account/userinfo.update'), params);

// * 解析手机号
export const getPhoneNumber = (params: IPhoneLoginType) =>
  postAction(getUrl('/xe.dy.account/phone.encrypt.get'), params);

// * 退出登录
export const logout = () =>
  postAction('/dy_example/user_login_out', {
    k: LOGIN_OUT_SIGN,
    token: getStorage(ACCESS_TOKEN)
  });

// * 获取验证码登录
export const getPhoneLogin = (params: IPhoneLoginType) =>
  postAction(getUrl('/xe.dy.account/userinfo.phone.encrypt.update'), params);
