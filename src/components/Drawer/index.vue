<template>
  <teleport :to='target'>
    <template v-if="mask">
      <transition name="fade">
        <div class="bg" :class="bgClass" v-if="show" @click="close"></div>
      </transition>
    </template>
    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave" type="animation" :css="false">
      <template v-if="destroyOnclose">
        <div class="content" :class="contentClass" v-if="show" :style="contentStyle">
          <slot />
        </div>
      </template>
      <template v-else>
        <div class="content" :class="contentClass" v-show="show" :style="contentStyle">
          <slot />
        </div>
      </template>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { TweenMax } from 'gsap'
import { computed, defineComponent, PropType, reactive, toRefs } from 'vue'

type StyleType = {
  width?: string | number
  height?: string | number
  bottom?: string | number
  top?: string | number
  left?: string | number
  right?: string | number
}
type SetType = {
  y?: string | number
  x?: string | number
}

export default defineComponent({
  props: {
    target: {
      type: String as PropType<string>,
      default: 'body',
      validator:(value: string) =>{
        const dom = document.querySelector(value)
        return !!dom
      },
    },
    modelValue: {
      type: Boolean as PropType<boolean>,
      required: true,
      default: false,
    },
    mask: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    direction: {
      type: String as PropType<string>,
      default: 'bottom',
      validator:(value: string)=> {
        return ['bottom', 'top', 'left', 'right'].includes(value)
      },
    },
    size: {
      type: String as PropType<string>,
      default: '80%',
    },
    bgClass: {
      type: String as PropType<string>,
      required: false,
    },
    contentClass: {
      type: String as PropType<string>,
      required: false,
    },
    destroyOnclose: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, { emit }) {
    const { modelValue, size, direction } = toRefs(props)  
    const contentStyle: StyleType = reactive({})
    const config: SetType = reactive({})

    const show = computed({
      get() {
        return modelValue.value
      },
      set(val) {
        emit('update:modelValue', val)
      },
    })

    const init = () => {
      if (direction.value === 'bottom' || direction.value === 'top') {
        contentStyle.width = '100%'
         contentStyle.height = size.value
        if (direction.value === 'bottom') {
          contentStyle.bottom = 0
          config.y = '100%'
        } else {
          contentStyle.top = 0
          config.y = '-100%'
        }
      } else {
        contentStyle.width = size.value
        contentStyle.height = '100%'
        if (direction.value === 'left') {
          contentStyle.left = 0
          config.x = '-100%'
        } else {
          contentStyle.right = 0
          config.x = '100%'
        }
      }
    }

    //关闭
    const close = () => {
      show.value = false
    }

    const beforeEnter = async (el: HTMLElement, done: any) => {
      emit('change', true)
      TweenMax.to(el, 0, {
        ...config,
        onComplete: done,
      })
    }
    const enter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: '0',
        x: '0',
        onComplete: done,
      })
    }
    const leave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        ...config,
        onComplete: done,
      })
    }
    const afterLeave = (el: HTMLElement, done: any) => {
      emit('change', false)
      TweenMax.to(el, 0, {
        ...config,
        onComplete: done,
      })
    }
    init()
    return {
      show,
      close,
      beforeEnter,
      enter,
      leave,
      afterLeave,
      contentStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
}
.content {
  position: fixed;
  z-index: 10;
  background: #fff;
  overflow: hidden;
}
</style>