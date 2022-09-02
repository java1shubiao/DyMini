<script lang="ts">
import { defineComponent } from 'vue';
import { refactoringJumpInUni, refactoringJumpInUniRedirect } from './utils/handleLayerLimit';
import { mapActions, mapGetters } from 'vuex';
import { APP_NAME, APP_VERSION, USER_INFO } from '@/constants/users';
import { getPhoneNumber } from '@/api/login';
import { SUCCESS_CODE } from './constants';
import { setStorage, getStorage } from '@/utils/tools';
export default defineComponent({
  name: 'App',
  computed: {
    ...mapGetters('Login', ['getToken', 'getUserInfo'])
  },
  onLaunch() {
    this.onUserLogin();
    const oldMethod = uni.navigateTo;
    const oldRedireTo = uni.redirectTo;
    uni.navigateTo = refactoringJumpInUni(oldMethod, this);
    uni.redirectTo = refactoringJumpInUniRedirect(oldRedireTo, this);
    this.checkVersion();
    this.getAppInfo();
  },
  methods: {
    ...mapActions({
      handleLogin: 'Login/handleLogin'
    }),
    onUserLogin() {
      // ! 此处必须前置登录, 否则会造成不存在token的情况下请求先出去
      const token = this.getToken;
      (!token || !this?.getUserInfo?.sessionKey) && this.handleLogin();
      this.checkSessionAndLogin(token);
    },
    // * 检查登录态, 并登录
    checkSessionAndLogin(token: string) {
      // * token不存在一定是过期的
      token &&
        uni.checkSession({
          success: () => {
            console.log('session 未过期');
          },
          fail: () => {
            console.log('session 已过期，需要重新登录');
            this.handleLogin();
          }
        });
    },
    checkVersion() {
      const updateManager = uni.getUpdateManager();
      updateManager.onUpdateReady(() => {
        uni.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启小程序？',
          success: res => {
            if (res.confirm) {
              // * 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate();
            }
          }
        });
      });

      updateManager.onUpdateFailed(() => {
        uni.showToast({
          title: '新版本下载失败，请稍后再试',
          icon: 'none'
        });
      });
    },
    getAppInfo() {
      uni.getSystemInfo({
        success: ({ version, appName }: any) => {
          setStorage(APP_VERSION, version);
          setStorage(APP_NAME, appName);
        }
      });
    },
    getPhoneNumber({ params, success, fail }: any) {
      const { iv, encryptedData } = params;

      const onFail = (fail: (fn: any) => void) => {
        fail(() => {
          return {
            msg: '获取手机号失败'
          };
        });
      };

      const userInfo = getStorage(USER_INFO);
      const sessionKey = userInfo.sessionKey || '';
      const phoneParams = {
        sessionKey,
        iv,
        encryptedData
      };

      getPhoneNumber(phoneParams)
        .then((res: any) => {
          if (res.code === SUCCESS_CODE) {
            const result = {
              phoneNumber: res.data.phone || ''
            };
            success(result);
          } else {
            onFail(fail);
          }
        })
        .catch(() => {
          onFail(fail);
        });
    }
  }
});
</script>
<style></style>
