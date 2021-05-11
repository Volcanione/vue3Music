interface STATETYPE {
  LastPath: any
  routerScroll: any
}
const state: STATETYPE = {
  LastPath: null,
  routerScroll: null
};

const mutations = {
  setLastPath(state: STATETYPE, data: any) {
    state.LastPath = data;
  },
  setRouterScroll(state: STATETYPE, data: any) {
    state.routerScroll = data;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
