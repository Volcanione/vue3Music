import Loading from "./index.vue";
import { createVNode, render, App } from "vue";

const directive_loading = (app: App) => {
  // const LoadingUpdate = {} as any;
  app.directive("loading", {
    mounted(el: any, binding: any) {
      // const container = document.createElement("div");
      // container.className = "loadingBox";
      const vnode = createVNode(Loading);
      render(vnode, el);
      el.style.position = "relative"
      // el.appendChild(container);
      const instance: any = vnode.component;
      el.setLoading = (state: boolean) => {
        instance.data.loading = state;
      }
      el.setLoading(!binding.value);
      el.setAttribute("id", instance.uid);
    },
    updated(el: any, binding: any) {
      el.setLoading(!binding.value);
    },
  });
}

export default {
  install: (app: App) => {
    directive_loading(app);
  },
};
