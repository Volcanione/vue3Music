
import api from '@/api/index'
import { ref, reactive, nextTick, onMounted, onBeforeUnmount } from 'vue'
import { $msg } from "@/components/Msg/index";
import ResizeObserver from 'resize-observer-polyfill'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { musicSetup } from '@/layout/components/Player/setup'
export function songlistSetup(catType: any) {
  const router = useRouter()
  const songList = ref(<any>[])//歌单
  const searchParam = reactive({ //搜索条件
    cat: catType,
    limit: 30,
    offset: 0
  })

  const loadingState = ref(false)
  const songListRef = ref(null) as any
  const total = ref(0)

  const getSongList = async (state = false, refresh?: boolean) => {//请求数据
    loadingState.value = false
    const { code, playlists, total: sum } = await api.getSongListAll(searchParam)
    loadingState.value = true
    if (code !== 200) {
      return;
    }
    total.value = sum
    refresh && (songList.value = [])
    await nextTick()
    if (!state) {
      songList.value = playlists
    } else {
      songList.value.push(...playlists)
    }
    refreshScroll()
  }

  const refreshScroll = async () => {//刷新Dom
    await nextTick();
    songListRef?.value?.refresh();
  }

  //下拉
  const pullDown = async (done: () => void) => {
    searchParam.offset = 0
    try {
      await getSongList()
    } catch (error) {
    }
    await done()
  }
  //上拉
  const pullUp = async (done: (state?: number) => void) => {
    searchParam.offset++
    if (total.value <= songList.value.length) {
      await done(2);
      return $msg({ title: "真的到底了" });
    }
    try {
      await getSongList(true)
      await done(1)
    } catch (error) {
      await done(0)
    }
  }

  //设置limit
  const setLimit = async (l: number) => {
    searchParam.limit = l
    searchParam.offset = 0
    if (!loadingState.value) {
      return
    }
    await getSongList()
    refreshScroll()
    songListRef?.value?.scrollTo()
  }

  //改变类别

  const changeType = async () => {
    searchParam.offset = 0
    songList.value = []
    loadingState.value = false;
    await getSongList();
    refreshScroll()
    songListRef?.value?.scrollTo()
  };


  const initData = () => {

    getSongList()
  }

  //更新宽度
  //监听器
  const intersectionObserver = new ResizeObserver(function () {
    const el = songListRef.value?.$el as HTMLElement
    if (!el) {
      return
    }

    const x = Math.max(Math.floor(el.offsetWidth / 210), 3)
    const y = Math.ceil(el.offsetHeight / 170)
    const l = x * (y + Math.ceil(y / 2))
    setLimit(l)
  })

  onMounted(() => {
    intersectionObserver.observe(songListRef.value?.$el as any)
  })

  //歌单详细
  const getSongDetaile = (item: any) => {
    router.push({
      name: 'SongListDetail', params: {
        cat: '11',
        id: item.id
      },
      query: {
        name: item.name
      }
    })
  }

  return {
    songList,
    initData,
    loadingState,
    pullDown,
    pullUp,
    songListRef,
    changeType,
    getSongDetaile
  }
}

export function songlistDetailSetup() {
  const store: any = useStore()
  const route = useRoute()
  const name = route.query.name
  const loadingState = ref(false)
  const songList = ref([])
  const imgStyle = reactive({
    opacity: 1,
    transform: `scale(1) translateY(-50%)`,
  })
  const bgImgStyle = reactive({}) as any
  const topStyle = reactive({}) as any

  let scroll = null as any
  const info = reactive({}) as any

  const { setPlayerNow } = musicSetup()

  const init = () => {
    getSongDetail()
  }

  const getSongDetail = async () => {
    loadingState.value = false
    const { code, playlist } = await api.getSongDetail({
      id: route.params.id + '',
    })
    if (code !== 200) {
      return
    }
    Object.assign(info, playlist)
    Object.assign(bgImgStyle, {
      // backgroundImage: `url(${playlist.coverImgUrl}?param=300y300)`,
    })
    const ids = info.trackIds.map(({ id }: any) => {
      return id
    }).join(',')
    const data = await getSongMusicDetail(ids)
    loadingState.value = true
    songList.value = data.map(({ id, name, ar, dt, al }: any) => {
      return {
        id,
        name,
        album: { name: ar[0].name },
        artists: ar[0].name,
        duration: dt,
        img: al.picUrl,
      }
    })
    await nextTick()
    refreshScroll()
  }

  const refreshScroll = () => {
    scroll.refresh()
  }

  //获取歌曲详情
  const getSongMusicDetail = async (ids: string) => {
    try {
      const { code, songs } = await api.getSongMusicDetail({ ids })
      if (code !== 200) {
        return []
      }
      return songs
    } catch (error) {
      return []
    }
  }

  const setTopImg = () => {
    scroll.on('scroll', scrollHandler)
  }

  const scrollHandler = ({ y }: any) => {
    imgStyle.opacity = y > 0 ? 1 : Math.max(200 - Math.abs(y), 0) / 200
    imgStyle.transform =
      y > 0
        ? ` scale(${1 + Math.abs(y) / 200}) translateY(-50%)`
        : ` scale(1) translateY(-50%)`

    bgImgStyle.opacity = y > 0 ? 0 : Math.max(Math.abs(y), 1) / 200
    topStyle.top = `${y}px`
  }

  //点击单曲
  const checkMusicItem = (data: any) => {
    setPlayerNow(data)
  }

  //全部播放
  const playAll = () => {
    setPlayerNow(songList.value)
  }

  const pullDown = async (done: () => void) => {
    await getSongDetail()
    done()
  }

  onMounted(async () => {
    scroll = store.state.route.routerScroll
    await nextTick()
    setTopImg()
  })

  onBeforeUnmount(() => {
    scroll.off('scroll', scrollHandler)
    scroll = null
  })

  return {
    name,
    init,
    info,
    loadingState,
    pullDown,
    imgStyle,
    bgImgStyle,
    topStyle,
    songList,
    checkMusicItem,
    playAll,
    refreshScroll
  }
}