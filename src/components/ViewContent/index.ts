interface TabRouteView {
  beforeEnter: (el: HTMLElement, done: any) => void;
  enter: (el: HTMLElement, done: any) => void;
  leave: (el: HTMLElement, done: any) => void;
}

import { toRefs, watch, ref } from "vue";
import { TweenMax } from "gsap";

interface Props {
  type: number;
  disabled: boolean;
}

export function setTabRouteView(props: Props, context: any): TabRouteView {
  const { type, disabled } = toRefs(props);
  const X = ref();
  const Left = ref();
  watch([type, disabled], ([val, dis]) => {
    X.value = dis ? 0 : val ? "-100%" : "100%";
    Left.value = dis ? 0 : !val ? "-100%" : "100%";
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
