import { nextTick, ref } from "vue";
import api from "@/api/index";
import { LS_set, LS_get, LS_remove } from "@/utils/index";
import { useRouter, useRoute } from "vue-router";
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
  const loadingState = ref(true);
  //请求搜索结果

  const getsearchResult = async () => {
    loadingState.value = false;
    resultList.value = [];
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
    Object.values(result).forEach((val) => {
      if (typeof val === "number") {
        total.value = val;
      }
      if (val instanceof Array) {
        resultList.value = val;
      }
    });
    loadingState.value = true;
    nextTick(() => {
      searchResultRef?.value?.refresh();
      searchResultRef?.value?.scrollTo();
    });
  };

  //改变类别

  const changeType = () => {
    getsearchResult();
  };

  return {
    getsearchResult,
    type,
    changeType,
    resultList,
    loadingState,
    searchResultRef,
  };
}
