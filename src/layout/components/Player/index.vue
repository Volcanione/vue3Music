<template>
  <teleport to="body">
    <transition
      @before-enter="beforeEnter"
      @enter="enter"
      @leave="leave"
      @after-leave="afterLeave"
      type="animation"
      :css="false"
    >
      <div class="player" v-show="playerShow">
        <div class="header">
          <PlayerHeader @switch="switchLRY" :active="switchConfig.value" />
        </div>
        <div class="content">
          <PlayContriller :config="switchConfig" />
        </div>
        <div class="playBg">
          <div
            class="filter"
            :style="{
              'background-image': `url('https://p1.music.126.net/uTCh9G5LvjQ1z32dBE5_8A==/109951165872244163.jpg')`,
            }"
          ></div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, toRef, reactive, nextTick, watch } from "vue";
import { playerSetup } from "../Player/setup";
import { TweenMax } from "gsap";
import PlayerHeader from "../Player/components/header.vue";
import PlayContriller from "../Player/components/controller.vue";
export default defineComponent({
  components: { PlayerHeader, PlayContriller },
  setup() {
    const switchConfig = reactive({ type: 0, value: 0 });
    const beforeEnter = async (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: "100%",
        onComplete: done,
      });
      await nextTick();
      switchConfig.type = 0;
      switchConfig.value = 0;
    };
    const enter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: "0",
        onComplete: done,
      });
    };
    const leave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: "100%",
        onComplete: done,
      });
    };
    const afterLeave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: "100%",
        onComplete: done,
      });
    };

    const switchLRY = ({ type, value }: any) => {
      switchConfig.type = type;
      switchConfig.value = value;
    };

    const { playerShow } = playerSetup();

    return {
      playerShow,
      beforeEnter,
      enter,
      leave,
      afterLeave,
      switchLRY,
      switchConfig,
    };
  },
});
</script>
<style lang="scss" scoped>
.player {
  position: fixed;
  z-index: 9;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .header {
    height: 50px;
  }
  .content {
    flex: 1;
    position: relative;
  }
  .playBg {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    -webkit-filter: blur(30px);
    background: rgba(0, 0, 0, 0.9);
    filter: blur(30px);
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      opacity: 0.6;
    }
  }
}
</style>
