interface STATETYPE {
  playerShow: boolean;
}
const state: STATETYPE = {
  playerShow: false,
};

const mutations = {
  setPlayerShow(state: STATETYPE, data: boolean) {
    state.playerShow = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
