import { createVNode, render, App } from "vue";
const directive_loading = (app: App) => {
  // const LoadingUpdate = {} as any;
  app.directive("longList", {
    mounted(el: any, binding: any) {
      //开启监听器
      const intersectionObserver = new IntersectionObserver(function (entries) {
        if (entries[0].intersectionRatio <= 0) return;
        const { x, y } = el.getBoundingClientRect();
        if (y >= 0 && x >= 0 && !el.loadingState) {
          el.loadingState = true
          binding.value()
        }
      });
      intersectionObserver.observe(el);
    },
    updated(el: any, binding: any) {},
  });
}
export default {
  install: (app: App) => {
    directive_loading(app);
  },
};
