import user from "@/api/user";
interface STATETYPE {
  loginStatus: boolean;
  token: string;
}
const state: STATETYPE = {
  loginStatus: false,
  token: "",
};

const mutations = {
  setLastPath(state: STATETYPE, data: any) {
    state.loginStatus = data;
  },
};

const actions = {
  getLoginStatus({ commit }: any) {
    return new Promise((res, rej) => {
      user
        .loginStatus()
        .then((result: any) => {
          if (!result?.data?.account) {
            rej({ code: 301, msg: '需要登录' });
            commit("setLastPath", false);
            return
          }
          res(result);
          commit("setLastPath", true);
        })
        .catch((err: any) => {
          rej({ code: 301, msg: '需要登录' });
          commit("setLastPath", false);
        });
    });
  },
  refreshLoginState({ commit }: any) {
    return new Promise((res, rej) => {
      user
        .loginRefresh()
        .then((result: any) => {
          res(result);
          commit("setLastPath", true);
        })
        .catch((err: any) => {
          rej(err);
          commit("setLastPath", false);
        });
    });
  },
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
