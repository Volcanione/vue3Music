interface STATETYPE {
  playerShow: boolean;
  playerState: boolean;
  playerMode: string;
  playerList: PlayListType[];
  playeHistory: PlayListType[]
}

import { PlayListType } from "@/interface/music";
import { getIdx, getrandomData } from "@/utils/index";

const state: STATETYPE = {
  playerShow: false,
  playerMode: "alone",
  playerState: false,
  playerList: [

    { id: 0 },
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },

  ],//所有加入播放列表的音乐
  playeHistory: [],//正在播放和已经播放过的音乐
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
      const idx = getIdx<PlayListType>(state.playerList, data, "id");
      if (idx === 0) {
        return;
      }
      if (idx !== -1) {
        state.playerList.splice(idx, 1);
      }
      state.playerList.unshift(data);
    }
  },
  deleteToPlayerList(state: STATETYPE, data?: PlayListType) {
    if (!data) {
      return (state.playerList = []);
    }
    const idx = getIdx<PlayListType>(state.playerList, data, "id");
    state.playerList.splice(idx, 1);
  },
  setNowPlaye_History(state: STATETYPE, data: PlayListType) {
    const idx = getIdx<PlayListType>(state.playeHistory, data, "id");
    if (idx === 0) {
      return;
    }
    if (idx !== -1) {
      state.playeHistory.splice(idx, 1);
    }
    state.playeHistory.unshift(data);
  },

  setPrevPlaye_History(state: STATETYPE) {
    if (state.playeHistory.length <= 1) {
      return
    }
    state.playeHistory.shift()
  }


};

const actions = {
  nextPlayer({ commit, state, getters }: any, update?: false) {
    const { playerMode, playerList, playeHistory } = state
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
          const noPlayList = playerList.filter((i: PlayListType) => getIdx<PlayListType>(playeHistory, i, "id") === -1)
          if (noPlayList.length) {
            // commit("setNowPlaye_History", getrandomData(noPlayList))
            nextPlay = getrandomData(noPlayList) as PlayListType
          } else {
            // commit("setNowPlaye_History", getrandomData(playeHistory, nowPlay, 'id'))
            nextPlay = getrandomData(playeHistory, nowPlay, 'id') as PlayListType
          }
          break
        default:
          nextPlay = {} as PlayListType
          break
      }
      commit("setNowPlaye_History", nextPlay)
      return res({ code: 200, msg: '下一首' })
    })

  },

  prevPlayer({ commit, }: any) {
    const { playeHistory } = state
    return new Promise((res, rej) => {
      commit('setPrevPlaye_History')
      if (playeHistory.length <= 1) {
        return rej({ code: 0, msg: '没有之前的记录' })
      }
      return res({ code: 200, msg: '上一首' })
    })
  }
};



const getters = {
  nowPlay: (state: any) => state.playeHistory[0],
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
