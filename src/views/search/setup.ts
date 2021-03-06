import { nextTick, ref, reactive } from "vue";
import api from "@/api/index";
import { LS_set, LS_get, LS_remove } from "@/utils/index";
import { useRouter, useRoute } from "vue-router";
import { $msg } from "@/components/Msg/index";
import { musicSetup } from "@/layout/components/Player/setup";
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

  const foucsSearch = (  ) => {
      searchTipRef.value.setvisible(true)
  }

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
    foucsSearch
  };
}

export function searchResult() {
  const type = ref(1);
  const route = useRoute();
  const router = useRouter();
  const total = ref(0);
  const searchResultRef = ref(null) as any;
  const resultList = ref(<any>[]);
  const loadingState = ref(false);

  const searchParam = reactive({
    keywords: route.params.keyword,
    type,
    limit: 30,
    offset: 0,
  }) as any;
  //请求搜索结果
  const { setPlayerNow } = musicSetup();

  const getsearchResult = async (state = false, refresh?: boolean) => {
    const { code, result } = await api.searchResult(searchParam);
    if (code !== 200) {
      return;
    }
    refresh && (resultList.value = []);
    await nextTick();
    Object.values(result).forEach((val) => {
      if (typeof val === "number") {
        total.value = val;
      }
      if (val instanceof Array) {
        if (!state) {
          resultList.value = val;
        } else {
          resultList.value.push(...val);
        }
      }
    });
    loadingState.value = true;
  };


  //改变类别

  const changeType = async () => {
    searchParam.offset = 0;
    resultList.value = [];
    loadingState.value = false;
    await getsearchResult();
    searchResultRef?.value?.scrollTo();
  };

  //下拉刷新
  const pullDown = async (done: () => void) => {
    searchParam.offset = 0;
    try {
      await getsearchResult();
    } catch (error) { }
    await done();
  };
  //上拉加载
  const pullUp = async (done: (state?: number) => void) => {
    searchParam.offset++;
    if (total.value <= resultList.value.length) {
      await done(2);
      return $msg({ title: "真的到底了" });
    }
    try {
      await getsearchResult(true);
      await done(1);
    } catch (error) {
      await done(0);
    }
  };

  //点击item
  const confirmItem = (data: any) => {
    let routename = "";
    let params = {};
    console.log(type.value, data);
    switch (type.value) {
      case 1:
        return playMusic(data);
      case 1000:
        routename = "SongListDetail";
        params = {
          cat: "搜索",
          id: data.id,
        };
        break;
      case 100:
        routename = "SingerDetail";
        params = {
          cat: "搜索",
          name: data.name,
          id: data.id,
        };
    }

    if (!routename) {
      return;
    }
    router.push({
      name: routename,
      params,
      query: {
        name: data.name,
      },
    });
  };

  //点击单曲
  const playMusic = async (data: any) => {
    const { code, songs } = await api.getSongMusicDetail({ ids: data.id + "" });
    if (code !== 200) {
      return;
    }
    const { id, name, ar, dt, al } = songs[0];
    setPlayerNow({
      id,
      name,
      album: { name: ar[0].name },
      artists: ar[0].name,
      duration: dt,
      img: al.picUrl,
    });
  };

  return {
    getsearchResult,
    type,
    changeType,
    resultList,
    loadingState,
    searchResultRef,
    pullDown,
    pullUp,
    confirmItem,

  };
}
