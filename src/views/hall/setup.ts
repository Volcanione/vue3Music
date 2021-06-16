import { searchFn } from "../search/setup";
import { useRouter } from "vue-router";
import api from "@/api/index";
import { ref } from "vue";
export function hallSetup() {
  const router = useRouter();
  const { getSearchDefault, search } = searchFn();
  const bannerList = ref([]);
  const albumList = ref([]);
  //初始化
  const init = () => {
    getSearchDefault();
    getBanner();
    getAlbumNewest();
  };

  //请求banner
  const getBanner = async () => {
    const { banners, code } = await api.getBanner({ type: 2 });
    bannerList.value = code === 200 ? banners : [];
  };

  //新歌速递
  const getAlbumNewest = async () => {
    const { code, albums } = await api.getAlbumNewest();
    albumList.value = code === 200 ? albums : [];
  };

  const clickAlbum = (item: any) => {
    console.log(item);
  };

  //跳转歌手
  const gotoSinger = () => {
    router.push("/singer");
  };

  //搜索

  const goSeach = () => {
    router.push("/search");
  };

  const pullDownrefresh = async (done: any) => {
    done();
  };
  const pullUploading = async (done: any) => {
    done();
  };

  init();

  return {
    pullDownrefresh,
    pullUploading,
    getSearchDefault,
    search,
    goSeach,
    bannerList,
    albumList,
    clickAlbum,
    gotoSinger,
  };
}
