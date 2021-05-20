import { createApp } from "vue";
import "normalize.css/normalize.css";
import "@/style/index.scss";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./permission";
import MyCom from "@/utils/components";
import loading from "@/components/Loading/index";
import layz from "@/components/Layz/index";
import msg from "@/components/Msg/index";
const app = createApp(App);

app.use(store).use(router)
app.use(MyCom);
app.use(msg);
app.use(loading);
const loadImg = require("./assets/songListBG.png");
app.use(layz, {
  errorImg: loadImg,
  loadImg: loadImg,
});
app.mount("#app");
