import request from "@/utils/request";
import {
  APIGetSongList,
  APISearchSuggest,
  APISearchResult,
  APIGetMusicUrl,
  APIGetTopSongList,
  APIGetSongDetail,
  APIGetSongMusicDetail,
  ApiGetBanner,
  APIGetTopSong,
  APIUid,
  APIGetArtistList
} from "@/interface/index";
export default {
  //获取banner
  getBanner(params?: ApiGetBanner) {
    return request({
      url: "/banner",
      method: "get",
      params
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

  //获取歌曲是否能播放
  checkMusic(data: APIGetMusicUrl) {
    return request({
      url: "/check/music",
      method: "post",
      data
    });
  },
  ///获取音乐地址
  getMusicUrl(data: APIGetMusicUrl) {
    return request({
      url: "/song/url",
      method: "post",
      data
    });
  },
  checkMusicByUrl(url: string) {
    return request({
      url,
      method: "get",
    });
  },
  //获取音乐地址
  getMusicUrlById(id: string | number) {
    return request({
      url: `https://music.163.com/song/media/outer/url?id=${id}.mp3 `,
      method: "get",
    })
  },
  //获取歌词
  getlyric(params: APIGetMusicUrl) {
    return request({
      url: '/lyric',
      method: "get",
      params
    })
  },
  //获取歌单分类
  getSongListCatList() {
    return request({
      url: '/playlist/catlist',
      method: "get",
    })
  },

  //获取歌单分类(hot)
  getSongListCatListHOT() {
    return request({
      url: '/playlist/hot',
      method: "get",
    })
  },

  //获取歌单列表
  getSongListAll(data: APIGetTopSongList) {
    return request({
      url: '/top/playlist',
      method: "post",
      data
    })
  },
  //获取歌单详情
  getSongDetail(data: APIGetSongDetail) {
    return request({
      url: '/playlist/detail',
      method: "post",
      data
    })
  },
  //获取歌曲详情
  getSongMusicDetail(data: APIGetSongMusicDetail) {
    return request({
      url: '/song/detail',
      method: "post",
      data
    })
  },
  //最新专辑
  getAlbumNewest() {
    return request({
      url: '/album/newest',
      method: "post",
    })
  },
  //榜单摘要
  getToplistDetail() {
    return request({
      url: '/toplist/artist',
      method: "post",
    })
  },
  //喜欢音乐列表
  getLikelist(data: APIUid) {
    return request({
      url: '/likelist',
      method: "post",
      data
    })
  },
    //喜欢音乐列表
  getArtistList(data: APIGetArtistList) {
    return request({
      url: '/artist/list',
      method: "post",
      data
    })
  },
};
