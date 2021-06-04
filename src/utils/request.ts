import axios from "axios";
import store from "@/store";
import router from "@/router";
import { apiAuthlist } from "./whitelist";
import { $msg } from "@/components/Msg/index";
import { getCookie, removeCookie } from '@/utils/'
// create an axios instance
const service: any = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

let loginState = true

// request interceptor
service.interceptors.request.use(
  async (config: any) => {
    const { method, params = {}, data } = config;
    const cookie = getCookie('cookie')
    params["timestamp"] = +new Date();



    if (data?.limit && data?.offset) {
      data.offset = data.offset * data.limit
    }


    if (params?.limit && params?.offset) {
      params.offset = params.offset * params.limit
    }



    cookie && (params['cookie'] = cookie)
    config.params = params
    if (apiAuthlist.includes(config.url)) {
      if (!store.getters.loginState) {
        if (loginState) {
          loginState = false
          try {
            await store.dispatch("user/getLoginStatus");
          } catch (error) {
            await $msg({ title: error?.msg });
            loginState = true
            removeCookie('userId')
            removeCookie('cookie')
            router.push({
              path: "/login",
            });
          }
        }
      } else {
        try {
          await store.dispatch("user/refreshLoginState");
        } catch (error) {
          await $msg({ title: error.response?.data?.msg });
          removeCookie('userId')
          removeCookie('cookie')
          router.push({
            path: "/login",
          });
        }
      }
    }
    return config;
  },
  (error: any) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response: any) => {
    const res = response.data;
    // if the custom code is not 20000, it is judged as an error.
    if (response?.data?.size) {
      return res
    }
    if (res?.data?.code === 200) {
      return res
    }
    if (res.code !== 200 && !res.success) {
      return Promise.reject(new Error(res.message || "Error"));
    }
    return res;
  },
  async (error: any) => {
    const code = error.response?.data?.code;
    if (code !== 301) {
      $msg({ title: error.response?.data?.msg });
    }
    return Promise.reject(error);
  }
);

export default service;
