<template>
  <div class="sdileWapper" ref="slideRef">
    <div class="slide-content">
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from "vue";
import { BScrollType } from "@/interface/index";
BScroll.use(Slide);

export default defineComponent({
  setup(props) {
    const slideRef = ref(null) as any;
    let slide = {} as BScrollType;
    onMounted(async () => {
      await nextTick();
      init();
    });

    const init = () => {
      slide = new BScroll(slideRef.value as HTMLElement, {
        scrollX: true,
        scrollY: false,
        slide: {
          threshold: 100,
          loop: false,
          autoplay: false,
        },
        tap: "tap",
        click: true,
        momentum: false,
        preventDefault: false,
      }) as any;
      slide.disable();

      refresh();
    };

    const refresh = async () => {
      await nextTick();
      slide.refresh && slide.refresh();
    };

    const goToPage = (idx: number) => {
      slide.goToPage && slide.goToPage(idx, 0);
      return idx;
    };

    return {
      slideRef,
      refresh,
      goToPage,
    };
  },
});
</script>
<style lang="scss" scoped>
.sdileWapper {
  height: 100%;
  width: 100%;
  min-height: 1px;
  overflow: hidden;
  display: flex;
  .slide-content {
    flex: 1;
    font-size: 0;
    display: flex;
    & > div {
      display: inline-block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
