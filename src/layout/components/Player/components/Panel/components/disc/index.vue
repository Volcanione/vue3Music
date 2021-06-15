<template>
  <div class="discBox">
    <div
      class="disc"
      :style="{ 'animation-play-state': playerState ? 'running' : 'paused' }"
    >
      <span class="border"></span>
      <img :src="!src ? defaultImg : src + `?param=${size}y${size}`" alt="" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
export default defineComponent({
  props: {
    src: {
      type: String as PropType<string>,
      default: "",
    },
    playerState: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    size: {
      type: Number as PropType<number>,
      default: 300,
    },
  },
  setup() {
    const SongDiscRef = ref(null);
    const defaultImg = require("@/assets/songListBG.png");
    return {
      SongDiscRef,
      defaultImg,
    };
  },
});
</script>

<style lang="scss" scoped>
.discBox {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .disc {
    width: 80%;
    height: 80%;
    border-radius: 50%;
    overflow: hidden;
    position: relative;
    animation: rotating 10s linear infinite;
    &.paused {
      animation-play-state: paused;
    }
    & .border {
      top: 0;
      box-sizing: border-box;
      left: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 10px solid rgba(0, 0, 0, 0.5);
    }
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}

@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
</style>
