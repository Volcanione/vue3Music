
import { toRef } from 'vue'
import { useStore } from 'vuex'
const MODELIST = ['alone', 'list', 'random']
export function playerSetup() {

  //不要在这里用钩子函数 或者watch监听函数  会重复调用

  const store: any = useStore()
  const player = store.state.player
  const playerMode = toRef(player, 'playerMode')
  const playerState = toRef(player, 'playerState')
  const playerShow = toRef(player, 'playerShow')


  //打开关闭页面
  const setPlayerShow = (state: boolean = false) => {
    store.commit('player/setPlayerShow', state)
  }

  //切换模式
  const setPlayerMode = () => {
    const idx = MODELIST.findIndex((i) => playerMode.value === i)
    store.commit('player/setPlayerMode', MODELIST[idx < MODELIST.length - 1 ? idx + 1 : 0])
  }

  //播放暂停
  const setPlayerState = (state: boolean = false) => {
    store.commit('player/setPlayerState', state)
  }

  return {
    playerShow,
    setPlayerShow,
    playerMode,
    setPlayerMode,
    playerState,
    setPlayerState
  }


}