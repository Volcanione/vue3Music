import user from "@/api/user";
import { removeCookie } from "@/utils/"
interface STATETYPE {
  loginStatus: boolean;
  userInfo: any;
}

const defaultState = (): STATETYPE => {
  return {
    loginStatus: false,
    userInfo: {},
  }
};

const state: STATETYPE = defaultState()

const mutations = {
  setLoginStatus(state: STATETYPE, data: any) {
    state.loginStatus = data;
  },
  setUserInfo(state: STATETYPE, data: any) {
    Object.assign(state.userInfo, data)
  },
  removeUserInfo(state: STATETYPE) {
    Object.assign(state, defaultState())
  },
};

const actions = {
  getLoginStatus({ commit }: any) {
    return new Promise((res, rej) => {
      user
        .loginStatus()
        .then((result: any) => {
          if (!result?.data?.account) {
            rej({ code: 301, msg: "需要登录" })
            commit("setLoginStatus", false);
            return;
          }
          res(result);
          commit("setLoginStatus", true);
        })
        .catch((err: any) => {
          rej({ code: 301, msg: "需要登录" })
          commit("setLoginStatus", false);
        })
    });
  },
  refreshLoginState({ commit }: any) {
    return new Promise((res, rej) => {
      user
        .loginRefresh()
        .then((result: any) => {
          res(result);
          commit("setLoginStatus", true);
        })
        .catch((err: any) => {
          rej(err);
          commit("setLoginStatus", false);
        })
    });
  },
  logOut({ commit }: any) {
    return new Promise((res, rej) => {
      user
        .logout()
        .then((result: any) => {
          res(result)
          commit("setLoginStatus", false)
          commit("removeUserInfo")
          removeCookie("cookie")
          removeCookie("userId")
        })
        .catch((err: any) => {
          rej(err);
        })
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
