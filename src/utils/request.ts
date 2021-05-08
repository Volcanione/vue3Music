import axios from "axios";
import store from "@/store";
import router from "@/router";
import { apiWhitelist } from "./whitelist";
import { $msg } from "@/components/Msg/index";
import { getCookie } from '@/utils/'
// create an axios instance
const service: any = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000, // request timeout
});

// request interceptor
service.interceptors.request.use(
  async (config: any) => {
    // do something before request is sent
    // if (store.getters.token) {
    //   config.data = config.data || {}
    //   config.data['usertoken'] = store.getters.token
    //   // let each request carry token
    //   // ['X-Token'] is a custom headers key
    //   // please modify it according to the actual situation
    //   // config.headers['X-Token'] = getToken()
    // }
    const { method, params = {} } = config;
    const cookie = getCookie('cookie')
    if (method === "post") {
      params["timestamp"] = +new Date();
    }
    cookie && (params['cookie'] = cookie)
    config.params = params
    if (!apiWhitelist.includes(config.url)) {
      if (!store.getters.loginState) {
        try {
          await store.dispatch("user/getLoginStatus");
        } catch (error) {
          await $msg({ title: error.response?.data?.msg });
          router.push({
            path: "/login",
          });
        }
      } else {
        try {
          await store.dispatch("user/refreshLoginState");
        } catch (error) {
          await $msg({ title: error.response?.data?.msg });
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
    if(res?.data?.code===200){
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
