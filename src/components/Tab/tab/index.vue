<template>
  <div class="TABBER" ref="scrollContent" :style="{ height: heightPx }">
    <div class="root" :style="{ width: `${barWidth}px` }">
      <div class="bar" ref="tabbar">
        <div
          :class="{ item: true, active: item.value === modelValue }"
          v-for="item in list"
          :key="item.value"
          @click="handlerClick(item)"
        >
          {{ item.label }}
        </div>
      </div>
      <div class="line">
        <span :style="style" class="linetip"></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from "@better-scroll/core";
import { defineComponent, computed, toRefs, PropType, ref, watch } from "vue";
import { BScrollType } from "@/interface/index";
interface Item {
  label: string;
  value: string | number;
}

interface SizeSeat {
  width: number;
  left: number;
  barWidth: number;
}

export default defineComponent({
  name: "Tab",
  props: {
    modelValue: {
      type: [Number, String],
      required: true,
    },
    list: {
      type: Array as PropType<Array<Item>>,
      default: () => {
        return [];
      },
    },
    height: {
      type: Number,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { height, modelValue, list } = toRefs(props);
    const heightPx = computed(() => {
      return height ? height.value + "px" : "100%";
    });
    let IDX = ref(0);
    const handlerClick = (item: Item) => {
      emit("update:modelValue", item.value);
    };
    watch(IDX, (val, old) => {
      emit("change", val > old ? 1 : 0);
    });

    watch(modelValue, (val) => {
      IDX.value = list.value.findIndex((item: Item) => item.value === val);
    });

    return {
      heightPx,
      handlerClick,
    };
  },
  data() {
    return {
      style: {},
      scroll: {} as BScrollType,
      barWidth: 0,
    };
  },
  watch: {
    modelValue() {
      this.setLineStyle();
    },
  },
  mounted() {
    this.setLineStyle();
    this.initWapper();
    this.refresh();
  },
  methods: {
    setLineStyle() {
      const { width, left, barWidth } = this.getActiveWidth();
      this.style = {
        width: 25 + "px",
        transform: `translateX(${left + (width - 25) / 2}px)`,
      };
      this.barWidth = barWidth;
    },

    getActiveWidth(): SizeSeat {
      const dom = this.$refs.tabbar as HTMLElement;
      const dix: number = this.list.findIndex(
        (i: any) => i.value === this.modelValue
      );
      const activeDom = dom.children[dix] as HTMLElement;
      const scrollIdx: number = Math.max(dix - 1, 0);
      const scrollDom = dom.children[scrollIdx] as HTMLElement;

      this.setScroll(scrollDom);
      return {
        width: activeDom.clientWidth,
        left: activeDom.offsetLeft,
        barWidth: this.getBarWidth(dom),
      };
    },

    initWapper() {
      this.scroll = new BScroll(this.$refs.scrollContent as HTMLElement, {
        scrollY: false,
        scrollX: true,
        scrollbar: false,
        disableMouse: false,
        disableTouch: false,
        bounce: true,
        click: true,
        tap: "tap",
      }) as any;
    },
    refresh() {
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    },

    getBarWidth(dom: HTMLElement): number {
      const domlist: Element[] = [...dom.children];
      return domlist.reduce((count: number, item: Element) => {
        return item.clientWidth + count;
      }, 0);
    },
    setScroll(el: HTMLElement) {
      this.scroll.scrollToElement &&
        this.scroll.scrollToElement(el, 300, 0, 0, undefined);
    },
  },
});
</script>
<style lang="scss" scoped>
.TABBER {
  width: 100%;
  height: 100%;
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .bar {
      position: relative;
      flex: 1;
      display: flex;
      .item {
        display: flex;
        flex-shrink: 0;
        padding: 0 10px;
        justify-content: center;
        align-items: center;
        color: #666;
        cursor: pointer;
        &.active {
          color: #000;
          font-weight: 600;
        }
      }
    }
    .line {
      height: 4px;
      display: flex;
      .linetip {
        transition: 0.3s;
        height: 4px;
        background: red;
      }
    }
  }
}
</style>
