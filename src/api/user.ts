import request from "@/utils/request";
import { APILogin } from "@/interface/index";
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
  loginRefresh() {
    return request({
      url: "/login/refresh",
      method: "post",
    });
  },
};
