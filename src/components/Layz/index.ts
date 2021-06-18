import Layz from "./index.vue";
import { h, render, App, watch, ref, computed, nextTick } from "vue";

interface Options {
  errorImg?: string;
  loadImg?: string;
}

interface ImgConfig extends Options {
  src: string;
}

const config = async (
  el: any,
  binding: any,
  options: Options,
  update = false
) => {
  if (el.tagName !== "IMG") {
    return console.error("'Element tagName is not 'IMG'");
  }

  if (typeof binding?.value === "string") {
    if (!options.errorImg || !options.loadImg) {
      return console.warn(
        "When the layz config is a string, the global configuration is missing errorImg or loadImg,This may bring unnecessary errors!"
      );
    }
  } else {
    const Binding: ImgConfig = Object.assign(binding?.value || {}, {});
    if (!Binding?.loadImg && !options?.loadImg) {
      return console.warn(
        "When the layz config  is a Object,the global and local configuration must exist,Local weight is more than the global weight!"
      );
    }
  }

  let parentDom = el;

  if (!update) {
    parentDom = createImageBitmap(el, binding, options);
  } else {
    //图片路径为空到赋值时 存在bug 无法显示
  }

  //开启监听器
  const intersectionObserver = new IntersectionObserver(function (entries) {
    if (entries[0].intersectionRatio <= 0) return;
    const { x, y } = parentDom.getBoundingClientRect();
    if (x >= 0 && y >= 0) {
      setImg(parentDom, binding, options);
      intersectionObserver.unobserve(el)
    }
  });
  intersectionObserver.observe(parentDom);
};

//创建Dom
const createImageBitmap = (el: any, binding: any, options: Options) => {
  if (!el.offsetWidth) {
    el.style.width = "100%";
    el.style.display = "block";
  }
  if (!el.offsetHeight) {
    el.style.height = "100%";
    el.style.display = "block";
  }

  const cloneDom = el.cloneNode(false);
  //创建dom
  const container = document.createElement("div") as any;
  const LAYZNODE = h(Layz);
  render(LAYZNODE, container);
  container.style.height = el.height + "px";
  container.style.width = el.width + "px";
  container.style.position = "relative";
  cloneDom.style.position = "relative";
  cloneDom.style.zIndex = 1;
  container.appendChild(cloneDom);
  el.parentNode && el.parentNode.replaceChild(container, el);
  //创建数据
  const { props, _hub }: any = LAYZNODE.component;
  props.loadImg = binding.value?.loadImg || options.loadImg;
  props.errorImg = binding.value?.errorImg || options.errorImg;

  const setImgState = (state: number) => {
    // console.log(ctx);
    _hub.setloadState(state);
  };

  container.setImgState = setImgState;
  return container;
};

const setImg = (el: any, binding: any, options: any) => {
  //设置图片路径
  const imgUrl = computed(() => {
    return binding.value?.src || binding.value;
  });

  if (!imgUrl.value) {
    return;
  }
  const setImgState = el.setImgState;
  el.lastChild.src = binding.value?.src || binding.value;

  el.lastChild.onload = () => {
    setImgState(1);
  };
  el.lastChild.onerror = () => {
    setImgState(-1);
  };
};

const directive_layz = (app: App, options: Options) => {
  app.directive("Layz", {
    mounted(el: any, binding: any) {
      if (binding.value || binding.value?.src) {
        config(el, binding, options);
      } else {
        el.src = options.loadImg;
      }
    },
    updated(el: HTMLElement, binding: any) {
      // config(el, binding, options, true)
      if (binding.value || binding.value?.src) {
        config(el, binding, options);
      }
    },
  });
};

export default {
  install: (app: App, options: Options) => {
    directive_layz(app, options);
  },
};
