import { getAction } from '@/api/manage';
import { getUrl, showToast } from '@/utils/tools';
import { ref, computed, Ref, ComputedRef } from 'vue';
import { START, LOADING, COMPLETE, EMPTY } from '@/constants/page';
import { SUCCESS_CODE } from '@/constants/code';

const isEmptyArray = (target: any[]) => target.length === 0;

type Params = Partial<{
  pageSize: number;
  pageIndex: number;
}>;

/**
 * @param url 列表请求接口地址
 * @param listKey 接口响应后从data上取出列表的key值
 * @param params 请求参数
 * @param urlVersion 接口版本
 * @returns Tuple[listData, status, fetch, pageIndex] 列表数据, 列表状态, 请求方法 当前加载分页
 */
const useFetch = <T extends Params, L>(
  url: string,
  listKey: string,
  params?: ComputedRef<T>,
  urlVersion: string = '1.0.0'
): [Ref<L[]>, Ref<number>, (isInit?: boolean) => Promise<void | L[]> | undefined, Ref<number>] => {
  const key = listKey || 'list';
  const { pageSize = 10 } = params?.value || {};
  const pageIndex: Ref<number> = ref(1);
  const fetchParams = computed(() => ({
    pageSize,
    pageIndex: pageIndex.value,
    ...(params?.value || {})
  }));

  const listData: Ref<L[]> = ref([]);

  const status = ref(START);

  const fetch = (isInit: boolean = false) => {
    // * 没有数据或者数据加载完成都无需再次加载
    if ((status.value === COMPLETE || status.value === EMPTY) && !isInit) {
      return;
    }
    isInit ? (pageIndex.value = 1) : pageIndex.value++;
    status.value = LOADING;
    isInit && showToast('加载中', 'loading', 100000);
    return getAction(getUrl(url, urlVersion), fetchParams.value)
      .then((res: any) => {
        const { code, msg, data } = res;
        if (code === SUCCESS_CODE) {
          uni.hideToast();
          const newList = data?.[key] || [];
          // const newList = data?.[key];
          if (newList && Array.isArray(newList)) {
            isInit ? (listData.value = [...newList]) : (listData.value = [...listData.value, ...newList]);
            return newList;
          }
        } else {
          msg && showToast(msg, 'error');
          return Promise.reject('');
        }
      })
      .then((newList: any) => {
        // ? 正常返回进入then中
        // * 加载新页返回空数组
        if (isEmptyArray(newList)) {
          status.value = isInit ? EMPTY : COMPLETE;
          return listData.value;
        }
        // * 加载新页数组长度已经不足一页
        // TODO 无法判断小于pageSize, 可能会存在某一页数据不到一页的情况, 但实际上没有加载完
        // TODO 由于上述不能使用整页判断, 但是空页判断会导致部分第一页数据过少无法触底的情况, 此处采用减去5条数据判断加载完成
        const checkListCompleteLength = 5;
        if (newList.length < checkListCompleteLength) {
          status.value = COMPLETE;
          return listData.value;
        }
        status.value = START;
        return listData.value;
      })
      .catch(() => {
        // * 有报错
        status.value = EMPTY;
        uni.hideLoading();
      });
  };

  return [listData, status, fetch, pageIndex];
};

export default useFetch;
