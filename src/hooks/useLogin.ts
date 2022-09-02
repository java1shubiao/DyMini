import { useGetter } from './useGetter';
import { useAction } from './useAction';
import { computed } from 'vue';

const useLogin = () => {
  const { getUserInfo: userInfo } = useGetter('Login', ['getUserInfo']);

  const { getUserInfo } = useAction('Login', ['getUserInfo']);

  const isAuth = computed(() => userInfo.value.isAuth);

  const handleLogin = () => {
    if (!isAuth.value) {
      return getUserInfo(true);
    }
    // * 表示已经有登录态
    return Promise.resolve(true);
  };

  return { isAuth, handleLogin, userInfo };
};

export default useLogin;
