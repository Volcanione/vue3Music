<template>
  <teleport to='body'>
    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave" type="animation" :css="false">
      <div class="player" v-if="playerShow">
        <div class="header">
          <PlayerHeader />
        </div>
        <div class="content"></div>
      </div>
    </transition>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, toRef } from 'vue'
import { playerSetup } from '../Player/setup'
import { TweenMax } from 'gsap'
import PlayerHeader from './components/header.vue'
export default defineComponent({
  components: { PlayerHeader },
  setup() {
    const beforeEnter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: '100%',
        onComplete: done,
      })
    }
    const enter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: '0',
        onComplete: done,
      })
    }
    const leave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: '100%',
        onComplete: done,
      })
    }
    const afterLeave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: '100%',
        onComplete: done,
      })
    }
    const { player } = playerSetup()
    const playerShow = toRef(player, 'playerShow')
    return {
      playerShow,
      beforeEnter,
      enter,
      leave,
      afterLeave,
    }
  },
})
</script>
<style lang="scss" scoped>
.player {
  position: fixed;
  z-index: 9;
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  flex-direction: column;
  .header {
    height: 50px;
  }
  .content {
    flex: 1;
  }
}
</style>