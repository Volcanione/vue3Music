
import api from '@/api/index'
import { ref, reactive, nextTick, onMounted } from 'vue'
import { $msg } from "@/components/Msg/index";
import ResizeObserver from 'resize-observer-polyfill'
import { useRouter } from 'vue-router'
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
    const { code, playlists, total: sum } = await api.geSongList(searchParam)
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
    console.log(item);
    router.push({
      name: 'SongListDetail', params: {
        cat: '11',
        id: item.id
      },
      query:{
        name:item.name
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