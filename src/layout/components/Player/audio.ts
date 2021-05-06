import { onMounted, ref, nextTick, onBeforeUnmount, onUpdated, watch } from "vue";
import { playerSetup } from '@/layout/components/Player/setup'
import { getMusicPlayUrl } from './data'
import { $msg } from '@/components/Msg/index'

export default () => {

  const { playerState, playerNow, setPlayerState: setPlayerStateByBtn, setNextNow, playerMode, playerList } = playerSetup()


  const audioElement = ref(null) as any
  const currentTime = ref(0) //当前播放时间
  const ended = ref(false)//是否播放结束
  const progess = ref(0) //进度
  const duration = ref(0) //长度


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
        await nextTick()
        currentTime.value = 0
      }
    } catch (error) {
    }
  }

  // watch(()=>progess.value,( val ) => {
  //      audioElement.value.currentTime = val / 100 *  duration.value
  // })

  const changeProgess = (proess: any) => {
    audioElement.value.currentTime = proess.value / 100 * duration.value
  }


  const delErorr = async () => {
    await $msg({ title: '暂无版权' })
    setProessDuration(0)
    await setNextNow()
    //跳转下一首
    //处理跳转逻辑
    //执行
    playerState.value && resetPlayState(playerState.value)
  }




  //播放暂停
  const setPlayerState = async (type?: boolean) => {
    await nextTick()
    try {
      if (type) {
        return await audioElement.value?.play()
      }
      return await audioElement.value?.pause()
    } catch (error) {
    }
  }


  //重置
  const resetPlayState = async (type?: boolean) => {
    const url = await getMusicPlayUrl(playerNow.value.id)
    if (!url) {
      return delErorr()
    }
    setPlaySrc(url)
    ////重置
    audioElement.value?.load()
    await nextTick()
    try {
      duration.value = await getMusicDuration()
      //设置进度条时长 
      setProessDuration(duration.value)
      if (type) {
        return audioElement.value?.play()
      }
    } catch (error) {
      //错误处理
      delErorr()
    }
  }

  const setNextNowPlay = async () => {
    if (playerMode.value === 'alone') {
      resetPlayState(true)
    } else {
     const {code} =  await setNextNow()
      if(!code){
          return setPlayerStateByBtn(false)
        }
    }
  }





  return {
    audioElement,
    setPlayerState,
    resetPlayState,
    currentTime,
    duration,
    progess,
    changeProgess,
    playerState,
    playerNow,
    ended,
    setNextNow: setNextNowPlay

  }
}