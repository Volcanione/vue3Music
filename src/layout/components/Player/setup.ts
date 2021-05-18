import { nextTick, toRef, toRefs } from "vue";
import { useStore } from "vuex";
import { $msg } from "@/components/Msg/index";
import { PlayListType } from "@/interface/music";
const MODELIST = ["alone", "list", "random"];
export function playerSetup() {
  //不要在这里用钩子函数 或者watch监听函数  会重复调用

  const store: any = useStore();
  const player = store.state.player;
  const playerGetter = store.getters
  // const playerMode = toRef(player, "playerMode");
  // const playerState = toRef(player, "playerState");
  // const playerShow = toRef(player, "playerShow");
  // const playerListShow = toRef(player, "playerListShow");
  const playerNow = toRef(playerGetter, "player/nowPlay");

  const { playerMode, playerState, playerShow, playerListShow, playerProgess } = toRefs(player)
  //打开关闭页面
  const setPlayerShow = (state = false) => {
    store.commit("player/setPlayerShow", state);
    // if (!state) {
    //   setPlayerListShow(state)
    // }
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
      return $msg({ title: "音乐列表空空如也" });
    }
    store.commit("player/setPlayerState", state);
  };

  //上一首
  const setPrevNow = async () => {

    try {
      return await store.dispatch("player/prevPlayer");
    } catch (error) {
      $msg({ title: error.msg })
      return error
    }
  }


  //下一首
  const setNextNow = async (update?: boolean) => {
    try {
      return await store.dispatch("player/nextPlayer", update);
    } catch (error) {
      $msg({ title: error.msg })
      return error
    }
  }

  //进度

  const setProgess = (data: number) => {
    store.commit("player/setPlayerProgess", data);
  }


  //打开播放列表

  const setPlayerListShow = (state = false) => {
    store.commit("player/setPlayerListShow", state);
  }







  return {
    playerShow,
    setPlayerShow,
    playerMode,
    setPlayerMode,
    playerState,
    setPlayerState,
    playerNow,
    setPrevNow,
    setNextNow,
    playerList: player.playerList,
    setPlayerListShow,
    playerListShow,
    setProgess,
    playerProgess
  };
}


export function musicSetup() {
  const store: any = useStore();
  //添加至当前播放
  const setPlayerNow = (data: PlayListType[] | PlayListType) => {
    // store.commit("player/addToPlayerList", data);
    store.dispatch("player/addListPlaying",data)
  }
  //删除歌曲
  const removePlayList = (data?: PlayListType) => {
    store.commit("player/deleteToPlayerList", data);
  }

  return {
    setPlayerNow,
    removePlayList
  }

}