
import { } from 'vue'
import { useStore } from 'vuex'
export function playerSetup() {
  const store: any = useStore()
  const player = store.state.player

  //打开关闭页面
  const setPlayerShow = (state: boolean = false) => {
    store.commit('player/setPlayerShow', state)
  }

  return {
    player,
    setPlayerShow
  }


}