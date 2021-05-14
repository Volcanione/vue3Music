interface TabRouteView {
  beforeEnter: (el: HTMLElement, done: any) => void;
  enter: (el: HTMLElement, done: any) => void;
  leave: (el: HTMLElement, done: any) => void;
}

import { toRefs, watch, ref, computed } from "vue";
import { TweenMax } from "gsap";

interface Props {
  type: number;
  disabled: boolean;
}

export function setTabRouteView(props: Props, context: any): TabRouteView {
  const { type, disabled } = toRefs(props);



  const X = computed(() => {
    return disabled.value ? 0 : type.value ? "-100%" : "100%"
  });
  const Left = computed(() => {
    return disabled.value ? 0 : !type.value ? "-100%" : "100%";
  });

  const beforeEnter = (el: HTMLElement, done: any) => {
    context.emit("beforeEnter");
    el.style.backfaceVisibility = "hidden";
    TweenMax.to(el, 0, {
      x: Left.value,
      transform: "translateZ(0)",
      onComplete: done,
    });
  };

  //  const afterEnter = (el: HTMLElement, done: any) => {
  //   TweenMax.to(el, 0, { x: 0, onComplete: done })
  // }

  const enter = (el: HTMLElement, done: any) => {
    el.style.backfaceVisibility = "hidden";
    TweenMax.to(el, 0.2, { x: 0, onComplete: done });
  };
  const leave = (el: HTMLElement, done: any) => {
    el.style.backfaceVisibility = "hidden";
    TweenMax.to(el, 0.2, { x: X.value, onComplete: done });
  };
  return {
    beforeEnter,
    enter,
    leave,
  };
}
