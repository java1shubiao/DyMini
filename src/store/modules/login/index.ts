import { IRootState } from '@/store/store';
import { Module } from 'vuex';
import { ACCESS_TOKEN, GREY_APP_ID } from '@/constants/lgoin/index';
import { USER_INFO, PAGE_LOGIN } from '@/constants';
import { AnyObject } from '@/utils/type';
import { login as handleLogin, ILoginParams, updateUserInfo } from '@/api/login/index';
import { SUCCESS_CODE, LOGIN_ING, LOGIN_SUCCESS, LOGIN_FAIL } from '@/constants/code';
import pageBuried, { buriedEvent } from '@/utils/buried';
import { toErrorPage, getCurPageUrl, setStorage, getStorage } from '@/utils/tools';
import { RE_LOGIN_STATE } from '@/constants/errorType';
export interface ILoginType {
  token: string;
  userInfo: AnyObject;
  greyAppId: string;
  canIUseGetUserProfile: boolean;
  isAuthorization: boolean;
  isHideTabBar: Record<string, boolean>;
  moduleName: string;
  isRefresh: boolean; // 是否登录过期
  isLoginIng: boolean; // - 请求锁
}

export const login: Module<ILoginType, IRootState> = {
  namespaced: true,
  state: {
    token: getStorage(ACCESS_TOKEN) || '',
    userInfo: getStorage(USER_INFO) || {},
    greyAppId: getStorage(GREY_APP_ID) || '',
    canIUseGetUserProfile: !!uni.getUserProfile,
    isAuthorization: true, // 当前登录用户是否授权，具体逻辑在utils/request.js中，使用此字段时注意查看
    isHideTabBar: {}, // tabBar状态
    moduleName: '', // 模块名称
    isRefresh: false, // 默认不过期
    isLoginIng: false // - 请求锁
  },
  mutations: {
    SET_TOKEN(state, token: string) {
      state.token = token;
      setStorage(ACCESS_TOKEN, token);
    },
    SET_USER_INFO(state, userInfo: AnyObject) {
      state.userInfo = Object.assign(state.userInfo, userInfo);
      setStorage(USER_INFO, state.userInfo);
    },
    GREY_APP_ID(state, appId: string) {
      state.greyAppId = appId;
      setStorage(GREY_APP_ID, appId);
    },
    CHANGE_TAB_BAR_STATUS(state, { status, moduleName }: { status: boolean; moduleName: string }) {
      state.isHideTabBar[moduleName] = status;
    },
    SET_CURRENT_MODULE_NAME(state, moduleName: string) {
      state.moduleName = moduleName;
    },
    SET_REFRESH_STATUS(state, status) {
      state.isRefresh = status;
    },
    SET_IS_LOGIN_ING(state, status: boolean) {
      state.isLoginIng = status;
    }
  },
  actions: {
    // * 设置token
    setToken({ commit }, token: string) {
      commit('SET_TOKEN', token);
    },
    // * 设置用户信息
    setUserInfo({ commit }, userInfo: AnyObject) {
      commit('SET_USER_INFO', userInfo);
    },
    setGreyAppId({ commit }, appId: string) {
      commit('GREY_APP_ID', appId);
    },
    handleLogin({ commit, state }) {
      return new Promise((resolve, reject) => {
        if (state.isLoginIng) {
          resolve({
            code: LOGIN_ING,
            msg: '登录中'
          });
          return;
        }
        // * 上锁, 防止重复的登录请求
        commit('SET_IS_LOGIN_ING', true);
        uni.login({
          success: (e: ILoginParams) => {
            const { code, anonymousCode } = e;
            handleLogin({
              code,
              anonymousCode
            }).then((res: any) => {
              const { code, data, msg } = res;
              if (code === SUCCESS_CODE) {
                commit('SET_TOKEN', data.token || '');
                commit('SET_USER_INFO', data.userInfo ? { ...data.userInfo, sessionKey: data.sessionKey } : {});
                commit('GREY_APP_ID', data.greyAppId || '');
                // * 登录埋点
                pageBuried('', true, data?.userInfo?.bUserId || '');
                resolve({
                  code: LOGIN_SUCCESS,
                  msg: '登录成功'
                });
              } else {
                msg && uni.showToast({ title: msg, icon: 'none' });
                reject({
                  code: LOGIN_FAIL,
                  msg: '登录失败'
                });
                buriedEvent(PAGE_LOGIN, { code, anonymousCode, msg: '小鹅通登录失败' });
                // * 进入登录失败页面
                toErrorPage(RE_LOGIN_STATE, getCurPageUrl());
              }
              commit('SET_IS_LOGIN_ING', false);
            });
          },
          fail: () => {
            // * 处理失败的情况
            uni.showToast({
              title: '登录失败, 请刷新小程序重试',
              icon: 'none'
            });
            buriedEvent(PAGE_LOGIN, { msg: '抖音登录失败' });
            // * 进入登录失败页
            toErrorPage(RE_LOGIN_STATE, getCurPageUrl());
            commit('SET_IS_LOGIN_ING', false);
          }
        });
      });
    },
    getUserInfo({ commit, dispatch }, update = true) {
      return new Promise((resolve, reject) => {
        const config = {
          desc: '用于更新学员资料' // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
        };
        // TODO 登录判断 暂时不加登录判断
        // if (!state.isLogin) {
        //   return false
        // }
        uni.getUserInfo({
          ...config,
          success: async res => {
            const { nickName, ...others } = res.userInfo;
            const userInfo = {
              nickname: nickName,
              avatar: res.userInfo.avatarUrl,
              ...others
            };
            commit('SET_USER_INFO', userInfo);
            // 等待接口更新用户信息完毕后再resolve
            if (update) {
              await dispatch('updateUserInfo');
              uni.showToast({
                title: '获取成功',
                icon: 'none'
              });
            }
            resolve(userInfo);
          },
          fail: () => {
            uni.showModal({
              content: '点击【确认】，在【权限设置】页-打开【用户信息】开关-返回【我的页】点击头像，即可完成更新信息',
              showCancel: false,
              confirmColor: 'black',
              confirmText: '确认',
              success: () => {
                uni.openSetting({
                  success(res) {
                    console.log(res.authSetting);
                  }
                });
              }
            });
            reject('err');
          }
        });
      });
    },
    updateUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        const params = {
          nickname: state.userInfo.nickname,
          avatar: state.userInfo.avatar
        };
        updateUserInfo(params).then(({ data, code, msg }: any) => {
          if (code === SUCCESS_CODE) {
            const { userInfo = {}, token } = data as any;
            commit('SET_USER_INFO', userInfo);
            commit('SET_TOKEN', token);
            resolve('ok');
          } else {
            reject(msg);
          }
        });
      });
    },
    isFetchPhone({ commit }, status: Boolean) {
      commit('SET_FETCH_PHONE', status);
    }
  },
  getters: {
    getToken(state) {
      return state.token;
    },
    getUserInfo(state) {
      return state.userInfo;
    },
    getTabBarStatus(state) {
      return state.isHideTabBar;
    },
    getModuleName(state) {
      return state.moduleName;
    },
    getRefreshStatus(state) {
      return state.isRefresh;
    },
    // * 是否授权登录
    getIsAuth(state) {
      return state.userInfo.isAuth;
    },
    // * 获取请求锁状态
    getLoginIngStatus(state) {
      return state.isLoginIng;
    }
  }
};
