import { ref, nextTick, reactive } from "vue";
import { playerSetup } from '@/layout/components/Player/setup'
import { getMusicPlayUrl, getMusicLyric, getLikeList } from './data'
import { $msg } from '@/components/Msg/index'
import { getCookie } from '@/utils'
export default () => {
  const { playerState, playerNow, setPlayerState, setNextNow, playerMode, playerShow, playerList, setPlayerListShow,
    playerListShow, setProgess, playerProgess: progess, setPlayerShow } = playerSetup()


  const audioElement = ref(null) as any
  const currentTime = ref(0) //当前播放时间
  const ended = ref(false)//是否播放结束
  // const progess = ref(0) //进度
  const duration = ref(0) //长度
  const musicLyric = reactive({})

  const getMusicDuration = () => {
    audioElement.value.onloadeddata = null
    audioElement.value.onerror = null
    return new Promise(async (res: (i?: any) => void, rej: (i?: any) => void) => {
      try {
        audioElement.value.onloadeddata = () => {
          res(audioElement.value.duration)
        }
        audioElement.value.onerror = () => {
          rej({ code: 0, msg: '无效音乐地址' })
        }

      } catch (error) {

      }
    })
  }

  //设置音乐src地址
  const setPlaySrc = (url: string) => {
    try {
      audioElement.value.src = url
    } catch (error) {
    }
  }

  //设置进度条时长 
  const setProessDuration = async (duration: number) => {
    try {
      audioElement.value.ontimeupdate = null
      await nextTick()
      audioElement.value.ontimeupdate = async () => {
        currentTime.value = audioElement.value?.currentTime || 0
        progess.value = + (currentTime.value / duration * 100).toFixed(3)
        ended.value = audioElement.value?.ended || false
        // await nextTick()
        // currentTime.value = 0
      }
    } catch (error) {
    }
  }

  //bug  暂停时切换歌曲  时间和进度条不对应 已修复


  const changeProgess = (proess: any) => {
    audioElement.value.currentTime = proess.value / 100 * duration.value
  }


  const delErorr = async (type = false) => {
    await $msg({ title: '暂无版权' })
    setProessDuration(0)
    if (playerList.length <= 1) {
      return setPlayerState(false)
    }
    await setNextNow()
    //跳转下一首
    //处理跳转逻辑
    //执行

    setPlayerState(type)
    await nextTick()
    playerState.value && updatePlayState(type)

  }




  //播放暂停
  const setPlayerAudioState = async (type?: boolean) => {
    await nextTick()
    try {
      if (type) {
        return await audioElement.value?.play()
      }
      return await audioElement.value?.pause()
    } catch (error) {
    }
  }


  //更新
  const updatePlayState = async (type?: boolean) => {
    resetPlayState()
    setLikeList()
    const url = await getMusicPlayUrl(playerNow.value.id)
    if (!url) {
      return delErorr(type)
    }
    getLyric()
    setPlaySrc(url)
    ////重置
    await nextTick()
    try {
      duration.value = await getMusicDuration()
      //设置进度条时长 
      setProessDuration(duration.value)
      setPlayerState(type)
    } catch (error) {
      //错误处理
      console.log(1111, error);
      delErorr(type)
    }
  }

  //获取喜欢列表
  const setLikeList = () => {
    const uid = getCookie('userId')
    if(!uid){
      return 
    }
    getLikeList(uid)
  }

  //获取歌词

  const getLyric = async () => {
    const lyric = await getMusicLyric(playerNow.value.id)
    if (lyric) {
      Object.assign(musicLyric, lyric)
    }
  }

  //重置
  const resetPlayState = async () => {
    audioElement.value?.load()
    currentTime.value = 0
    progess.value = 0
    duration.value = 0
    Object.assign(musicLyric, { lyric_0: null, lyric_1: null })
    setPlayerState(false)
  }

  //下一首
  const setNextNowPlay = async () => {
    if (playerMode.value === 'alone') {
      updatePlayState(true)
    } else {
      const { code } = await setNextNow()
      if (!code) {
        return setPlayerState(false)
      }
    }
  }





  return {
    audioElement,
    setPlayerAudioState,
    updatePlayState,
    currentTime,
    duration,
    progess,
    setProgess,
    changeProgess,
    playerState,
    playerNow,
    ended,
    setNextNow: setNextNowPlay,
    playerShow,
    resetPlayState,
    musicLyric,
    getLyric,
    setPlayerListShow,
    playerListShow,
    setPlayerState,
    setPlayerShow,
    setLikeList
  }
}