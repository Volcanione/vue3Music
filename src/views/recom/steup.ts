import { ref } from "vue";
import api from "@/api/index";

export function getPublicDate() {
  const BannerList: any = ref([]);
  const SongList = ref([]);
  const MusicList = ref([]);
  const RadioList = ref([]);

  //请求banner
  const getBanner = async () => {
    const { banners, code } = await api.getBanner();
    BannerList.value = code === 200 ? banners : [];
  }

  //请求推荐歌单
  const getSongList = async () => {
    const { result, code } = await api.getSongList({ limit: 10 });
    SongList.value = code === 200 ? result : [];
  }

  //请求推荐新歌
  const getMusicList = async () => {
    const { result, code } = await api.getMusicList({ limit: 9 });
    MusicList.value =
      code === 200
        ? result
            .filter((i: any, n: number) => n <= 8)
            .map(({ id, name, picUrl, song }: any) => {
              return {
                id,
                name,
                img: picUrl,
                artists: song.artists[0].name,
                duration: song.duration,
              }
            })
        : [];
  }

  //请求推荐MV

  const getMvList = async () => {
    const { result, code } = await api.getMvList({ limit: 12 });
    RadioList.value = code === 200 ? result : [];
  }

  return {
    getBanner,
    getSongList,
    getMusicList,
    getMvList,
    BannerList,
    SongList,
    MusicList,
    RadioList,
  };
}

export function getPrivateDate() {
  const PrivateSongList = ref([]);
  const PrivateMusicList = ref([]);

  const getRecommendSong = async () => {
    const { code, recommend } = await api.getRecommendSong();
    PrivateSongList.value = code === 200 ? recommend : [];
  }
  const getRecommendMusic = async () => {
    const {
      code,
      data: { dailySongs: recommend },
    } = await api.getRecommendMusic()
    PrivateMusicList.value =
      code === 200
        ? recommend
            .filter((i: any, n: number) => n <= 8)
            .map((item: any) => {
              return {
                ...item,
                artists: item?.ar[0].name,
                img: item.al.picUrl,
                duration: item.dt || 0,
              }
            })
        : [];
  }

  return {
    getRecommendSong,
    getRecommendMusic,
    PrivateSongList,
    PrivateMusicList,
  };
}
