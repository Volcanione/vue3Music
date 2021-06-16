import request from "@/utils/request";
import {
  APILogin,
  APIGetUserPlaylist,
  APIGetUserRecord,
} from "@/interface/index";
export default {
  loginStatus() {
    return request({
      url: "/login/status",
      method: "post",
    });
  },
  login(data: APILogin) {
    return request({
      url: !data.email ? "/login/cellphone" : "/login",
      method: "post",
      data,
    });
  },
  logout() {
    return request({
      url: "/logout",
      method: "post",
    });
  },
  loginRefresh() {
    return request({
      url: "/login/refresh",
      method: "post",
    });
  },
  getUserInfo() {
    return request({
      url: "/user/account",
      method: "post",
    });
  },
  getUserPlaylist(data: APIGetUserPlaylist) {
    return request({
      url: "/user/playlist",
      method: "post",
      data,
    });
  },
  getUserRecord(data: APIGetUserRecord) {
    return request({
      url: "/user/record",
      method: "post",
      data,
    });
  },
};
