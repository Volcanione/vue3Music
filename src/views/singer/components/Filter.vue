<template>
  <transition name="fade" @click.self="$emit('update:visible',false)">
    <div class="filterSingerBg" v-if="visible">
    </div>
  </transition>
  <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave" type="animation" :css="false">
    <div class="filterSinger" v-if="visible"></div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, nextTick, PropType } from 'vue'
import { TweenMax } from 'gsap'
export default defineComponent({
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props) {
    const beforeEnter = async (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: -200,
        onComplete: done,
      })
    }
    const enter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: 0,
        onComplete: done,
      })
    }
    const leave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: -200,
        onComplete: done,
      })
    }
    const afterLeave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: -200,
        onComplete: done,
      })
    }

    return {
      beforeEnter,
      enter,
      leave,
      afterLeave,
    }
  },
})
</script>

<style lang="scss" scoped>
.filterSingerBg {
  position: absolute;
  top: 44px;
  width: 100%;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
}
.filterSinger {
  position: absolute;
  top: 44px;
  width: 100%;
  background: #fff;
  height: 200px;
}
</style>