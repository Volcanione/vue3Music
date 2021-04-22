import { createStore } from "vuex";
import route from "./modules/route";
import user from "./modules/user";
import getters from "./getters";
export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: { route, user },
  getters,
}) as any;
