import { createStore } from "vuex";
import route from "./modules/route";
import player from "./modules/player";
import user from "./modules/user";
import getters from "./getters";
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { route, user,player },
  getters,
}) as any;
