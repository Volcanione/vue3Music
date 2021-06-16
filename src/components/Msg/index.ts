import { App, createVNode, render, toRefs } from "vue";
import msg from "./index.vue";

export const $msg = ({ title = "", duration = 2000 }) => {
  return new Promise((res: any) => {
    const id = "msg" + +new Date();
    const container = document.createElement("div");
    const vnode = createVNode(msg);
    container.id = id;
    render(vnode, container);
    const instance = vnode.component;
    const { props, _hub } = instance as any;
    Object.assign(_hub, {
      complete: () => {
        res();
      },
      destroy: () => {
        const node = document.querySelector(`#${id}`) as HTMLElement;
        document.body.removeChild(node);
      },
    });
    Object.assign(props, {
      title,
      duration,
    });
    document.body.appendChild(container);
  });
};

export default {
  install: (app: App, option?: any) => {
    app.component(msg.name, msg);
    app.config.globalProperties.$msg = $msg;
  },
};
