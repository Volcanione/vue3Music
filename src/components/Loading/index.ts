import Loading from "./index.vue";
import { createVNode, render, App } from "vue";

const directive_loading = (app: App) => {
  const LoadingUpdate = {} as any;
  app.directive("loading", {
    mounted(el: HTMLElement, binding: any) {
      const container = document.createElement("div");
      container.className = "loadingBox";
      const vnode = createVNode(Loading);
      render(vnode, container);
      el.style.position = 'relative'
      el.appendChild(container);
      const instance: any = vnode.component;
      LoadingUpdate[instance.uid] = (state: boolean) => {
        instance.data.loading = state;
      };
      LoadingUpdate[instance.uid](!binding.value);
      el.setAttribute("id", instance.uid);
    },
    updated(el: HTMLElement, binding: any) {
      LoadingUpdate[el.id](!binding.value);
    },
  });
};

export default {
  install: (app: App) => {
    directive_loading(app);
  },
};
