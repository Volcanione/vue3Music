<template>
  <div
    class="filterLetter"
    @touchstart.capture="letterTouchStart"
    @touchmove.capture="letterTouchMove"
    ref="filterLetterRef"
    @touchend.capture="tipShow = false"
  >
    <span
      class="letter"
      :class="{ active: l === active }"
      v-for="l in letter"
      :key="l"
      @click="active = l"
      >{{ l }}</span
    >
  </div>
  <transition name="fade">
    <div class="filterLetterTip" v-if="tipShow">{{ active }}</div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, PropType, computed } from "vue";
export default defineComponent({
  props: {
    modelValue: {
      type: String as PropType<string>,
      default: "热",
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, { emit }) {
    const active = computed({
      get: () => props.modelValue,
      set: (val) => {
        emit("update:modelValue", val);
      },
    });
    const letter: string[] = [
      "热",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "#",
    ];
    const touchStart = ref(0);
    const letterDom = ref([]) as any;
    const domHeight = ref(0);
    const tipShow = ref(false);

    onMounted(async () => {
      domHeight.value = filterLetterRef.value.offsetTop;
      const letters = filterLetterRef.value.children;
      letters.forEach(async (el: HTMLElement) => {
        const top = el.offsetTop;
        const height = el.offsetHeight;
        const text = el.innerText;
        letterDom.value.push({
          text,
          top,
          height,
        });
      });
    });

    const filterLetterRef = ref(null) as any;

    const letterTouchStart = (el?: any) => {
      touchStart.value = el.touches[0].clientY;
      setValue(touchStart.value);
      tipShow.value = true;
    };

    const letterTouchMove = (el?: any) => {
      const move = el.touches[0].clientY;
      setValue(move);
    };

    const setValue = (length: number) => {
      const top = length - domHeight.value;
      const data = letterDom.value.find((item: any) => {
        return top > item.top && top < item.top + item.height;
      });
      if (!data) {
        return;
      }
      active.value = data.text;
    };

    return {
      letter,
      active,
      letterTouchStart,
      letterTouchMove,
      filterLetterRef,
      tipShow,
    };
  },
});
</script>

<style lang="scss" scoped>
.filterLetter {
  width: 20px;
  position: absolute !important;
  background: #fff;
  right: 10px;
  top: 54px;
  bottom: 70px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  z-index: 1;
  .letter {
    width: 100%;
    font-size: 12px;
    color: #cecece;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    &.active {
      color: #000;
    }
  }
}
.filterLetterTip {
  position: absolute;
  width: 30px;
  height: 30px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  color: #fff;
  border-radius: 6px;
}
</style>
