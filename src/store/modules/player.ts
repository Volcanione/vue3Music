interface STATETYPE {
  playerShow: boolean;
  playerState: boolean;
  playerMode: string;
  playerList: PlayListType[];
  playerListShow: boolean;
  playerHistory: PlayListType[]
  playerProgess: number
}

import { PlayListType } from "@/interface/music";
import { getIdx, getrandomData } from "@/utils/index";

const state: STATETYPE = {
  playerShow: false,
  playerMode: "alone",
  playerState: false,
  playerList: [
  ],//所有加入播放列表的音乐
  playerListShow: false,
  playerHistory: [],//正在播放和已经播放过的音乐
  playerProgess: 0
};

const mutations = {
  setPlayerShow(state: STATETYPE, data: boolean) {
    state.playerShow = data;
  },
  setPlayerMode(state: STATETYPE, data: string) {
    state.playerMode = data;
  },
  setPlayerState(state: STATETYPE, data: boolean) {
    state.playerState = data;
  },
  addToPlayerList(state: STATETYPE, data: PlayListType[] | PlayListType) {
    if (data instanceof Array) {
      data.forEach((i) => {
        const idx = getIdx<PlayListType>(state.playerList, i, "id");
        if (idx !== -1) {
          return;
        }
        state.playerList.push(i);
      });
    } else {
      //打开播放器
      mutations.setPlayerShow(state, true)
      const idx = getIdx<PlayListType>(state.playerList, data, "id");
      if (idx === -1) {
        // state.playerList.splice(idx, 1);
        state.playerList.unshift(data);
      }
      // state.playerList.unshift(data);
      //添加歌曲为对象时 会自动播切换当前放音乐
      mutations.setNowPlaye_History(state, data)
      mutations.setPlayerState(state, true)
    }
  },
  setPlayerListShow(state: STATETYPE, data: boolean) {
    state.playerListShow = data;
  },
  deleteToPlayerList(state: STATETYPE, data?: PlayListType) {
    if (!data) {
      return (state.playerList.length = state.playerHistory.length = 0);
    }
    const idx = getIdx<PlayListType>(state.playerList, data, "id");
    state.playerList.splice(idx, 1);

    const lidx = getIdx<PlayListType>(state.playerHistory, data, "id");
    state.playerHistory.splice(lidx, 1);


  },
  setNowPlaye_History(state: STATETYPE, data: PlayListType) {
    const idx = getIdx<PlayListType>(state.playerHistory, data, "id");
    if (idx === 0) {
      return;
    }
    if (idx !== -1) {
      state.playerHistory.splice(idx, 1);
    }
    state.playerHistory.unshift(data);
  },

  setPrevPlaye_History(state: STATETYPE) {
    if (state.playerHistory.length <= 1) {
      return
    }
    state.playerHistory.shift()
  },

  setPlayerProgess(state: STATETYPE, data: number) {
    state.playerProgess = data
  }



};

const actions = {
  nextPlayer({ commit, state, getters }: any, update?: false) {
    const { playerMode, playerList, playerHistory } = state
    const { nowPlay } = getters
    return new Promise((res, rej) => {
      if (!playerList.length) {
        return rej({ code: 0, msg: '还没有添加音乐' })
      }
      let idx = nowPlay ? getIdx<PlayListType>(playerList, nowPlay, "id") : -1
      let nextPlay: PlayListType
      switch (playerMode) {
        case 'alone':
          if (!update) {
            // commit("setNowPlaye_History", nowPlay || playerList[0])
            nextPlay = nowPlay || playerList[0]
          } else {
            idx = idx < playerList.length - 1 ? idx + 1 : 0
            // commit("setNowPlaye_History", playerList[idx])
            nextPlay = playerList[idx]
          }
          break
        case 'list':
          idx = idx < playerList.length - 1 ? idx + 1 : 0
          // commit("setNowPlaye_History", playerList[idx])
          nextPlay = playerList[idx]
          break
        case 'random':
          const noPlayList = playerList.filter((i: PlayListType) => getIdx<PlayListType>(playerHistory, i, "id") === -1)
          if (noPlayList.length) {
            // commit("setNowPlaye_History", getrandomData(noPlayList))
            nextPlay = getrandomData(noPlayList) as PlayListType
          } else {
            // commit("setNowPlaye_History", getrandomData(playerHistory, nowPlay, 'id'))
            nextPlay = getrandomData(playerHistory, nowPlay, 'id') as PlayListType
          }
          break
        default:
          nextPlay = {} as PlayListType
          break
      }
      if (playerList.length === 1 && playerMode !== 'alone') {
        return rej({ code: 0, msg: '已经听完了' })
      }
      commit("setNowPlaye_History", nextPlay)
      return res({ code: 200, msg: '下一首' })
    })

  },

  prevPlayer({ commit, }: any) {
    const { playerHistory } = state
    return new Promise((res, rej) => {
      if (playerHistory.length <= 1) {
        return rej({ code: 0, msg: '没有之前的记录' })
      }
      commit('setPrevPlaye_History')
      return res({ code: 200, msg: '上一首' })
    })
  }
};



const getters = {
  nowPlay: (state: any) => state.playerHistory[0],
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
