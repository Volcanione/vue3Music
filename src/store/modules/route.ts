interface STATETYPE {
  LastPath: any;
}
const state: STATETYPE = {
  LastPath: null,
};

const mutations = {
  setLastPath(state: STATETYPE, data: any) {
    state.LastPath = data;
  },
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
