<template>
  <div class="slideWapper" ref="slide" :style="{ height, width }">
    <div class="slide-banner-content">
      <div v-if="!list.length"></div>
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { defineComponent, PropType } from "vue";
import { BScrollType } from "@/interface/index";
BScroll.use(Slide);
export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Array<any>>,
      default() {
        return [];
      },
    },
    height: {
      type: String as PropType<string>,
      default: "100%",
    },
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    loop: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  data() {
    return {
      nums: 4,
      slide: {} as BScrollType,
      currentPageIndex: 0,
    };
  },
  watch: {
    list() {
      this.refresh();
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.slide.destroy();
  },
  methods: {
    init() {
      this.slide = new BScroll(this.$refs.slide as HTMLElement, {
        scrollX: true,
        scrollY: false,
        slide: {
          threshold: 100,
          loop: false,
          autoplay: false,
        },
        tap: "tap",
        momentum: false,
      }) as any;
      this.slide.on("slideWillChange", (page) => {
        this.currentPageIndex = page.pageX;
      });
    },
    refresh() {
      this.$nextTick(() => {
        this.slide.refresh();
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.slideWapper {
  width: 100%;
  height: 240px;
  .slide-banner-content {
    height: 100%;
    white-space: nowrap;
    font-size: 0;
    & > div {
      display: inline-block !important;
      overflow: hidden;
    }
  }
}
</style>
