import request from "@/utils/request";
import {
  APIGetSongList,
  APISearchSuggest,
  APISearchResult,
} from "@/interface/index";
export default {
  //获取banner
  getBanner() {
    return request({
      url: "/banner",
      method: "get",
    });
  },

  //获取歌单
  getSongList(params?: APIGetSongList) {
    return request({
      url: "/personalized",
      method: "get",
      params,
    });
  },
  //获取歌曲
  getMusicList(params?: APIGetSongList) {
    return request({
      url: "/personalized/newsong",
      method: "get",
      params,
    });
  },

  //获取Mv
  getMvList(params?: APIGetSongList) {
    return request({
      url: "/personalized/djprogram",
      method: "get",
      params,
    });
  },

  //每日推荐歌单
  getRecommendSong() {
    return request({
      url: "/recommend/resource",
      method: "post",
    });
  },
  //每日推荐歌曲
  getRecommendMusic() {
    return request({
      url: "/recommend/songs",
      method: "post",
    });
  },
  //获取默认搜索关键词
  getSearchDefault() {
    return request({
      url: "/search/default",
      method: "get",
    });
  },
  //搜索建议
  searchSuggest(params: APISearchSuggest) {
    return request({
      url: "/search/suggest",
      method: "get",
      params,
    });
  },

  //热搜列表
  searchHotDeatil() {
    return request({
      url: "/search/hot/detail",
      method: "get",
    });
  },

  //搜索结果
  searchResult(params: APISearchResult) {
    return request({
      url: "/search/cloudsearch",
      method: "get",
      params,
    });
  },
};