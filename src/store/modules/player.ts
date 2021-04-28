interface STATETYPE {
  playerShow: boolean
  playerState: boolean
  playerMode: string
  playerList: PlayListType[]
}

import { PlayListType } from '@/interface/music'
import { getIdx } from '@/utils/index'

const state: STATETYPE = {
  playerShow: false,
  playerMode: 'alone',
  playerState: false,
  playerList: []
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
      data.forEach(i => {
        const idx = getIdx<PlayListType>(state.playerList, i, 'id')
        if (idx !== -1) {
          return
        }
        state.playerList.push(i)
      })
    } else {
      const idx = getIdx<PlayListType>(state.playerList, data, 'id')
      if (idx === 0) {
        return
      }
      if (idx !== -1) {
        state.playerList.splice(idx, 1)
      }
      state.playerList.unshift(data)
    }
  },
  deleteToPlayerList(state: STATETYPE, data?: PlayListType) {
    if (!data) {
      return state.playerList = []
    }
    const idx = getIdx<PlayListType>(state.playerList, data, 'id')
    state.playerList.splice(idx, 1)
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
