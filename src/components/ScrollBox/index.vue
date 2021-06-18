<template>
  <div class="ScrollBox">
    <div class="header" v-if="$slots.header || title || $slots.rightBtn">
      <template v-if="!$slots.header">
        <span>{{ title }}</span>
        <div class="right">
          <slot name="rightBtn" />
        </div>
      </template>
      <slot name="header" />
    </div>
    <div
      class="warpper"
      ref="scrollWarpper"
      v-loading="update"
      :style="{ width: width, height: height }"
    >
      <div class="content" :style="{ width: contentWidth }" ref="content">
        <slot name="content" />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import BScroll from "@better-scroll/core";
import ObserveDOM from "@better-scroll/observe-dom";
import { BScrollType } from "@/interface/index";
BScroll.use(ObserveDOM);
export default defineComponent({
  props: {
    update: {
      type: Number as PropType<number>,
      default: 0,
    },
    title: {
      type: String as PropType<string>,
      required: false,
    },
    direction: {
      type: String as PropType<string>,
      validator: function (value: string): boolean {
        // 这个值必须匹配下列字符串中的一个
        return ["auto", "x", "y"].indexOf(value) !== -1;
      } as any,
      required: false,
    },
    width: {
      type: String as PropType<string>,
      default: "100%",
    },
    height: {
      type: String as PropType<string>,
      default: "100%",
    },
  },
  data() {
    return {
      scroll: {} as BScrollType,
      contentWidth: "100%" as string,
    };
  },
  watch: {
    update() {
      if (!this.direction) {
        return;
      }
      this.updateRender();
    },
  },
  mounted() {
    if (!this.direction) {
      return;
    }
    this.init();
  },
  beforeUnmount() {
    // if (!this.direction) {
    //   return
    // }
    this.scroll.destroy && this.scroll.destroy();
  },
  methods: {
    init() {
      this.initWapper();
      this.updateRender();
    },
    updateRender() {
      this.$nextTick(() => {
        this.getContentWidth();
      });
    },
    initWapper() {
      const scrollConfig = {
        scrollY: this.direction === "y",
        scrollX: this.direction === "x",
        freeScroll: this.direction === "auto",
      };
      this.scroll = new BScroll(this.$refs.scrollWarpper as HTMLElement, {
        scrollbar: false,
        disableMouse: false,
        disableTouch: false,
        observeDOM: true,
        bounce: true,
        ...scrollConfig,
      }) as any;
    },
    //设置宽
    getContentWidth() {
      if (this.direction !== "x") {
        return null;
      }
      const dom = this.$refs.content as HTMLElement;
      const domlist: Element[] = [...dom.children];

      this.contentWidth =
        domlist.reduce((count: number, item: Element) => {
          const l = +getComputedStyle(item, null)
            .getPropertyValue("margin-left")
            .split("px")[0];
          const r = +getComputedStyle(item, null)
            .getPropertyValue("margin-right")
            .split("px")[0];
          return item.clientWidth + l + r + count;
        }, 0) + "px";
    },
  },
});
</script>
<style lang="scss" scoped>
.ScrollBox {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  .header {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .right {
      color: #999;
    }
  }
  .warpper {
    width: 100%;
    position: relative;
    .content {
      display: flex;
    }
  }
}
</style>
