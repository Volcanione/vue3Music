import Layz from "./index.vue";
import { createVNode, render, App } from "vue";

interface Options {
  errorImg?: string;
  loadImg?: string;
}

interface ImgConfig extends Options {
  src: string;
}

const directive_layz = (app: App, options: Options) => {
  app.directive("Layz", {
    mounted(el: any, binding: any) {
      if (el.tagName !== "IMG") {
        return console.error("'Element tagName is not 'IMG'");
      }
      //load
      const setloadImg = () => {
        setElStyle();
        if (typeof binding.value === "string") {
          if (!options.errorImg || !options.loadImg) {
            console.warn(
              "When the layz config is a string, the global configuration is missing errorImg or loadImg,This may bring unnecessary errors!"
            );
          }
          // el.src = options.loadImg
          loadConfig(options.loadImg);
          return;
        }
        const Binding: ImgConfig = Object.assign(binding.value, {});
        if (!Binding.loadImg && !options.loadImg) {
          console.warn(
            "When the layz config  is a Object,the global and local configuration must exist,Local weight is more than the global weight!"
          );
        }
        // el.src = Binding.loadImg || options.loadImg
        loadConfig(Binding.loadImg || options.loadImg);
      };

      const loadConfig = (url: any) => {
        const container = document.createElement("div");
        container.className = "ImgLoad";
        const vnode = createVNode(Layz);
        render(vnode, container);
        el.appendChild(container);
      };

      const setElStyle = () => {
        const cloneDom = el.cloneNode(true);
        const ImgDom = document.createElement("div") as any;
        ImgDom.appendChild(cloneDom);
        const ParentDom = el.parentElement;
        ParentDom.replaceChild(ImgDom, el);
        ImgDom.style.position = "relative";
        // ImgDom.style.width =  cloneDom.offsetWidth
        // ImgDom.style.height =  cloneDom.style.offsetHeight
      };

      setloadImg();

      //loading

      const setImgUrl = () => {
        el.src =
          typeof binding.value === "string" ? binding.value : binding.value.src;
      };

      const intersectionObserver = new IntersectionObserver(function (entries) {
        if (entries[0].intersectionRatio <= 0) return;
        getElposition();
      });
      intersectionObserver.observe(el);
      const getElposition = () => {
        const { x, y } = el.getBoundingClientRect();
        if (x > 0 || y > 0) {
          setImgUrl();
        }
      };

      // console.log(binding.value);
      // console.log(document.body.clientHeight);
      // console.log(el.offsetTop);
      // setInterval(() => {
      //   const EL = reactive(el.getBoundingClientRect())
      //   console.log(EL);
      // }, 3000)
      // const container = document.createElement('div');
      // container.className = 'loadingBox'
      // const vnode = createVNode(Layz);
      // render(vnode, container);
      // el.appendChild(container)
      // const instance: any = vnode.component;
      // LayzUpdate[instance.uid] = (state: boolean) => {
      //   instance.data.Layz = state
      // }
      // LayzUpdate[instance.uid](!binding.value)
      // el.setAttribute('id', instance.uid)
    },
    updated(el: HTMLElement, binding: any) {},
  });
};

export default {
  install: (app: App, options: Options) => {
    directive_layz(app, options);
  },
};
