import { nextTick, ref } from "vue";
import api from "@/api/index";
import { LS_set, LS_get, LS_remove } from "@/utils/index";
import { useRouter, useRoute } from "vue-router";
import { $msg } from "@/components/Msg/index";
export function searchFn() {
  const router = useRouter();
  const route = useRoute();
  const SEARCHKEY = "searcH";
  const searchHistoryList = ref([]);
  const search = ref(route?.params?.keyword || "");
  const searchTipRef = ref(null) as any;
  const searchHotList = ref([]);

  //获取默认搜索词
  const getSearchDefault = async () => {
    const {
      code,
      data: { realkeyword },
    } = await api.getSearchDefault();
    search.value = code === 200 ? realkeyword : "搜索";
  };

  //搜索事件
  const searchEnter = (keyword: string, state = false) => {
    if (state) {
      router.replace({
        name: `SearchResult`,
        params: { keyword },
      });
    } else {
      router.push({
        name: `SearchResult`,
        params: { keyword },
      });
    }
  };

  //清空输入框
  const clearSearch = () => {
    search.value = "";
  };

  //搜索建议点击
  const searchSuggest = (item: any, state = false) => {
    search.value = item.keyword;
    saveSearchKey();
    searchEnter(item.keyword, state);
    nextTick(() => {
      let timeid = -1;
      timeid = setTimeout(() => {
        searchTipRef?.value?.close();
        clearTimeout(timeid);
      }, 0);
    });
  };

  //搜索数据持久化
  const saveSearchKey = () => {
    let ls = LS_get(SEARCHKEY);
    if (ls) {
      const idx = ls.findIndex((i: string) => i === search.value);
      if (idx !== -1) {
        ls.splice(idx, 1);
      }
      if (ls.length > 10) {
        ls.pop();
      }
      ls.unshift(search.value);
    } else {
      ls = [search.value];
    }
    LS_set(SEARCHKEY, ls);
    searchHistoryList.value = ls;
  };

  const getSearchKey = () => {
    searchHistoryList.value = LS_get(SEARCHKEY) || [];
  };

  const removeHistory = () => {
    LS_remove(SEARCHKEY);
    getSearchKey();
  };

  //请求热门搜索
  const searchHotDeatil = async () => {
    const { code, data } = await api.searchHotDeatil();
    searchHotList.value = code === 200 ? data : [];
  };

  return {
    search,
    searchSuggest,
    getSearchDefault,
    searchHistoryList,
    removeHistory,
    getSearchKey,
    searchTipRef,
    clearSearch,
    searchHotDeatil,
    searchHotList,
  };
}

export function searchResult() {
  const type = ref(1);
  const route = useRoute();
  const offset = ref(0);
  const total = ref(0);
  const searchResultRef = ref(null) as any;
  const resultList = ref(<any>[]);
  const loadingState = ref(false);
  //请求搜索结果

  const getsearchResult = async (state = false, refresh?: boolean) => {
    const keywords = route.params.keyword as string;
    const { code, result } = await api.searchResult({
      keywords,
      type: type.value,
      limit: 30,
      offset: offset.value,
    });
    if (code !== 200) {
      return;
    }
    refresh && (resultList.value = [])
    await nextTick()
    Object.values(result).forEach((val) => {
      if (typeof val === "number") {
        total.value = val;
      }
      if (val instanceof Array) {
        if (!state) {
          resultList.value = val;
        } else {
          resultList.value.push(...val)
        }

      }
    });
    loadingState.value = true;
    nextTick(() => {
      searchResultRef?.value?.refresh();
    });
  };

  //改变类别

  const changeType = async () => {
    offset.value = 0
    resultList.value = []
    loadingState.value = false;
    await getsearchResult();
    nextTick(() => {
      searchResultRef?.value?.scrollTo();
    });
  };

  //下拉刷新
  const pullDown = async (done: () => void) => {
    offset.value = 0
    try {

      await getsearchResult()

    } catch (error) {

    }
    await done()

  }
  //上拉加载
  const pullUp = async (done: (state?: number) => void) => {
    offset.value++
    if (total.value <= resultList.value.length) {
      await done(2);
      return $msg({ title: "真的到底了" });
    }
    try {
      await getsearchResult(true)
      await done(1)
    } catch (error) {
      await done(0)
    }
  }

  return {
    getsearchResult,
    type,
    changeType,
    resultList,
    loadingState,
    searchResultRef,
    pullDown,
    pullUp
  };
}
