import { onMounted, ref, nextTick, onBeforeUnmount, onUpdated, watch } from "vue";
import api from '@/api/index'
import { playerSetup } from '@/layout/components/Player/setup'


export default () => {

  const { playerState, playerNow, setPlayerState: setPlayerStateByBtn } = playerSetup()


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
    audioElement.value.src = url
  }

  //设置进度条时长 
  const setProessDuration = async (duration: number) => {
    try {
      audioElement.value.ontimeupdate = null
      await nextTick()
      audioElement.value.ontimeupdate = () => {
        currentTime.value = audioElement.value?.currentTime || 0
        progess.value = + (currentTime.value / duration * 100).toFixed(3)
        ended.value = audioElement.value?.ended || false
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
    setProessDuration(0)
    // if (playerState.value) {
    //   setPlayerStateByBtn()
    // }
    //跳转下一首
    //处理跳转逻辑
    //执行
    await nextTick()
    playerState.value && resetPlayState(playerState.value)
  }




  //播放暂停
  const setPlayerState = async (type?: boolean) => {
    try {
      if (type) {
        return await audioElement.value?.play()
      }
      return await audioElement.value?.pause()
    } catch (error) {
      delErorr()
    }
  }


  //重置
  const resetPlayState = async (type?: boolean) => {

    try {
      const url = 'http://m801.music.126.net/20210430115155/fcac619e695444812b9901fc9c93f671/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/1568662731/2059/7262/3d4e/74a36f21fb591a3c093b40e9bbd1b58e.mp3'

      // console.log(playerNow.value);
      //通过api和(playerNow.value获取音乐src地址
      setPlaySrc(url)
      ////重置
      audioElement.value?.load()
      await nextTick()
      duration.value = await getMusicDuration()
      //设置进度条时长 
      setProessDuration(duration.value)



      if (type) {
        return audioElement.value?.play()
      }
    } catch (error) {
      console.log(11);
      //错误处理
      delErorr()
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
    playerNow

  }
}