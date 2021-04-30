import { toRef } from "vue";
import { useStore } from "vuex";
import { $msg } from "@/components/Msg/index";
const MODELIST = ["alone", "list", "random"];
export function playerSetup() {
  //不要在这里用钩子函数 或者watch监听函数  会重复调用

  const store: any = useStore();
  const player = store.state.player;
  const playerGetter = store.getters
  const playerMode = toRef(player, "playerMode");
  const playerState = toRef(player, "playerState");
  const playerShow = toRef(player, "playerShow");
  const playerNow = toRef(playerGetter, "player/nowPlay");

  //打开关闭页面
  const setPlayerShow = (state = false) => {
    store.commit("player/setPlayerShow", state);
  };

  //切换模式
  const setPlayerMode = () => {
    const idx = MODELIST.findIndex((i) => playerMode.value === i);
    store.commit(
      "player/setPlayerMode",
      MODELIST[idx < MODELIST.length - 1 ? idx + 1 : 0]
    );
  };

  //播放暂停
  const setPlayerState = (state = false) => {
    if (!playerNow.value) {
      store.commit("player/setPlayerState", false);
      return $msg({ title: "音乐列表为空额" });
    }
    store.commit("player/setPlayerState", state);
  };

  //添加至当前播放

  const setPlayerNow = () => {
    store.commit("player/setNowPlaye_History", { id: 2 });
  }

  //上一首
  const setPrevNow = () => {
    store.dispatch("player/prevPlayer");
  }


  //下一首
  const setNextNow = (update?: boolean) => {
    store.dispatch("player/nextPlayer", update);
  }



  return {
    playerShow,
    setPlayerShow,
    playerMode,
    setPlayerMode,
    playerState,
    setPlayerState,
    playerNow,
    setPlayerNow,
    setPrevNow,
    setNextNow
  };
}
