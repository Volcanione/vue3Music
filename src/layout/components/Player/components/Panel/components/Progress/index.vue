<template>
  <div class="root">
    <div
      class="progessBar"
      ref="progessBar"
      @click.capture="handlerClick"
      @touchstart.capture="fn_progressTouchStart"
      @touchmove.capture="fn_progressTouchMove"
    >
      <div class="line" :style="{ width: `${value}%` }"></div>
    </div>
    <div class="bar" ref="lineBar" :style="{ left: `${barLeft}px` }"></div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  watch,
  onMounted,
  nextTick,
} from "vue";
import ResizeObserver from "resize-observer-polyfill";
export default defineComponent({
  emits: ["changeProgess", "update:modelValue"],
  props: {
    modelValue: {
      type: Number as PropType<number>,
      default: 0,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const value = ref(0);
    const barLeft = ref(0);
    const progessBar = ref(null);
    const lineBar = ref(null);
    const WidthLength = ref(0);
    const touchStart = ref(0);

    //初始化
    const wacthmodelValue = () => {
      value.value = Math.min(props.modelValue, 100);
    };

    //获取进度条可拖拽总长度
    const getWidthLenght = async () => {
      const progessBarDom = progessBar.value as any;
      const lineBarDom = lineBar.value as any;
      await nextTick();
      try {
        WidthLength.value = progessBarDom.clientWidth - lineBarDom.clientWidth;
      } catch (error) {
        console.log(error);
      }
      setBarLet();
    };

    //监听器
    const intersectionObserver = new ResizeObserver(function () {
      getWidthLenght();
    });
    //设置球位置
    const setBarLet = () => {
      barLeft.value = (WidthLength.value * value.value) / 100;
    };
    //点击进度条
    const handlerClick = (el: any) => {
      if (props.disabled) {
        return;
      }
      setValue(el.x);
    };

    //拖拽事件
    const fn_progressTouchStart = (el?: any) => {
      if (props.disabled) {
        return;
      }
      touchStart.value = el.touches[0].clientX;
      setValue(touchStart.value);
    };
    const fn_progressTouchMove = (el?: any) => {
      if (props.disabled) {
        return;
      }
      const move = el.touches[0].clientX;
      setValue(move);
    };

    //设置value
    const setValue = (length: number) => {
      let percentage: number = +(
        ((length - 25) / WidthLength.value) *
        100
      ).toFixed(3);
      value.value = Math.min(Math.max(percentage, 0), 100);
      emit("changeProgess", value);
    };

    onMounted(async () => {
      getWidthLenght();
      //屏幕大小改变
      intersectionObserver.observe(progessBar.value as any);

      watch(
        () => props.modelValue,
        (val) => {
          if (val < 0 || val > 100) {
            return;
          }

          wacthmodelValue();
        },
        {
          immediate: true,
        }
      );
      watch(
        () => value,
        (value) => {
          setBarLet();
          emit("update:modelValue", value.value);
        },
        { deep: true }
      );
    });

    return {
      value,
      progessBar,
      lineBar,
      barLeft,
      handlerClick,
      fn_progressTouchStart,
      fn_progressTouchMove,
    };
  },
});
</script>
<style lang="scss" scoped>
.root {
  width: 100%;
  position: relative;
  .progessBar {
    width: 100%;
    height: 6px;
    background: rgba(0, 0, 0, 0.5);
    position: relative;
    border-radius: 3px;
    overflow: hidden;
    .line {
      height: 100%;
      background: #fff;
      pointer-events: none;
    }
  }
  .bar {
    position: absolute;
    width: 10px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    top: 50%;
    transform: translateY(-50%);
    overflow-y: visible !important;
    pointer-events: none;
  }
}
</style>
