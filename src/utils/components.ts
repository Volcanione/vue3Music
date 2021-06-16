import { App } from "vue";
import LayerPage from "@/components/LayerPage/index.vue";
import Nav from "@/components/Nav/index.vue";
import SlideWapper from "@/components/SlideWapper/index.vue";
import ScrollPage from "@/components/ScrollPage/index.vue";
import ScrollBox from "@/components/ScrollBox/index.vue";
import { PullDownSlot, PullUpSlot } from "@/components/PullDownUp/index";
import Field from "@/components/Field/index.vue";
import { TabBar } from "@/components/Tab/index";
import Drawer from "@/components/Drawer/index.vue";
export default {
  install: (app: App) => {
    app.component("LayerPage", LayerPage);
    app.component("Nav", Nav);
    app.component("SlideWapper", SlideWapper);
    app.component("ScrollPage", ScrollPage);
    app.component("ScrollBox", ScrollBox);
    app.component("PullDownSlot", PullDownSlot);
    app.component("PullUpSlot", PullUpSlot);
    app.component("Field", Field);
    app.component("TabBar", TabBar);
    app.component("Drawer", Drawer);
  },
};
