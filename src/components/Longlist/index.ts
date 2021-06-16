import { createVNode, render, App } from "vue";

function obsEl(el: any, binding: any) {
  if (!binding.arg) {
    return
  }
  //开启监听器
  const intersectionObserver = new IntersectionObserver(function (entries) {
    if (entries[0].intersectionRatio <= 0) return;
    const { x, y } = el.getBoundingClientRect();
    if (y >= 0 && x >= 0) {
      binding.value();
      intersectionObserver.unobserve(el)
    }
  });
  intersectionObserver.observe(el);
}


const directive_loading = (app: App) => {
  // const LoadingUpdate = {} as any;
  app.directive("longList", {
    mounted(el: any, binding: any) {
      // //开启监听器
      obsEl(el, binding)
    },
    updated(el: any, binding: any) {
      obsEl(el, binding)
    },
  });
};
export default {
  install: (app: App) => {
    directive_loading(app);
  },
};
