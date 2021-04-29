import { onMounted, ref, nextTick, onBeforeUnmount, onUpdated, watch } from "vue";
import api from '@/api/index'
export default () => {
  const audioElement = ref(null) as any
  const currentTime = ref(0) //当前播放时间
  const ended = ref(false)//是否播放结束
  const progess = ref(0) //进度
  const duration = ref(0) //长度
  // const url = 'http://m801.music.126.net/20210429181037/fb99fed95047f53d9fdfe14dfb94c426/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/1568662731/2059/7262/3d4e/74a36f21fb591a3c093b40e9bbd1b58e.mp3'

  const getMusicDuration = () => {
    audioElement.value.onloadeddata = null
    audioElement.value.onerror = null
    return new Promise(async (res: (i?: any) => void, rej: (i?: any) => void) => {
      audioElement.value.onloadeddata = () => {
        res(audioElement.value.duration)
      }
      audioElement.value.onerror = () => {
        rej({ code: 0, msg: '无效音乐地址' })
      }
    })
  }

  //设置音乐src地址
  const setPlaySrc = (url: string) => {
    audioElement.value.src = url
  }

  //设置进度条时长 
  const setProessDuration = (duration: number) => {
    audioElement.value.ontimeupdate = null
    audioElement.value.ontimeupdate = () => {
      currentTime.value = audioElement.value.currentTime || 0
      progess.value = + (currentTime.value / duration * 100).toFixed(3)
      ended.value = audioElement.value.ended
    }
  }

  // watch(()=>progess.value,( val ) => {
  //      audioElement.value.currentTime = val / 100 *  duration.value
  // })

  const changeProgess = (proess:any) => {
    audioElement.value.currentTime = proess.value / 100 * duration.value
  }





  //播放暂停
  const setPlayerState = (type?: boolean) => {
    if (type) {
      return audioElement.value.play()
    }
    return audioElement.value.pause()
  }


  //重置
  const resetPlayState = async (type?: boolean) => {

    try {
      const url = 'http://m801.music.126.net/20210429183955/47a0bdc3c4f9c44afb29df252fbd0fd6/jdymusic/obj/w5zDlMODwrDDiGjCn8Ky/1568662731/2059/7262/3d4e/74a36f21fb591a3c093b40e9bbd1b58e.mp3'

      //通过api获取音乐src地址
      setPlaySrc(url)

      ////重置
      audioElement.value.load()

      duration.value = await getMusicDuration()
      //设置进度条时长 
      setProessDuration(duration.value)



      if (type) {
        return audioElement.value.play()
      }
    } catch (error) {
      //错误处理
      setProessDuration(0)
    }
  }





  return {
    audioElement,
    setPlayerState,
    resetPlayState,
    currentTime,
    duration,
    progess,
    changeProgess
  }
}