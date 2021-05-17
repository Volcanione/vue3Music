<template>
  <div :class="{ layerContent: true, show: show }" ref="layerRef">
    <router-view v-slot="{ Component }" name="layer">
      <transition appear :css="false" @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave" type="animation" :duration="200">
        <component :is="Component" :key="comId" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, computed, watch, nextTick } from 'vue'
import { TweenMax } from 'gsap'
import { useRoute } from 'vue-router'
export default defineComponent({
  watch: {
    $route: {
      deep: true,
      handler(to, from) {
        const fromParent = from?.meta?.parent
        const toName = to.name
        if (fromParent instanceof Array) {
          this.routeBack = fromParent.includes(toName)
        } else {
          this.routeBack = fromParent === toName
        }
      },
    },
  },
  setup() {
    const show = ref(false)
    const routeBack = ref(false)
    const route = useRoute()
    const layerRef = ref(null) as any
    // const fromParent = ref([]) as any
    // const toName = ref(null) as any

    const comId = computed(() => {
      const Param = Object.values(route.params).length
      if (!Param) {
        return 1
      }
      return Param + +new Date()
    })

    const beforeEnter = (el: HTMLElement, done: any) => {
      setLayerShow()
      el.style.backfaceVisibility = 'hidden'
      TweenMax.to(el, 0, {
        x: routeBack.value ? '0' : '100%',
        opacity: 0,
        onComplete: done,
      })
      const parent = route?.meta?.parent
      const state = isRouteNameLayer()
      const layer = layerRef.value as HTMLElement
      layer.style.backfaceVisibility = 'hidden'
      TweenMax.to(layer as HTMLElement, 0, {
        opacity: !state || (!parent && !routeBack.value) ? 0 : 1,
        onComplete: done,
      })
    }
    const enter = (el: HTMLElement, done: any) => {
      const state = isRouteNameLayer()
      el.style.backfaceVisibility = 'hidden'
      TweenMax.to(el, 0.5, { x: 0, opacity: 1, onComplete: done })
      const layer = layerRef.value as HTMLElement
      layer.style.backfaceVisibility = 'hidden'
      TweenMax.to(layer as HTMLElement, 0.5, {
        opacity: state ? 1 : 0,
        onComplete: done,
      })
    }

    const leave = (el: HTMLElement, done: any) => {
      const parent = route?.meta?.parent
      el.style.backfaceVisibility = 'hidden'
      TweenMax.to(el, 0.5, {
        x: routeBack.value || !parent ? '100%' : '0',
        onComplete: done,
      })
      const layer = layerRef.value as HTMLElement
      layer.style.backfaceVisibility = 'hidden'
      TweenMax.to(layer, 0.5, {
        opacity: isRouteNameLayer() ? 1 : 0,
        onComplete: done,
      })
    }

    const afterLeave = (el: HTMLElement, done: any) => {
      setLayerShow()
    }

    const setLayerShow = () => {
      show.value = isRouteNameLayer()
    }

    const isRouteNameLayer = (): boolean => {
      const nowRouter: any = route.matched.find(
        (route) => route.name === route.name
      )
      return Boolean(nowRouter.components.layer)
    }

    return {
      show,
      comId,
      routeBack,
      beforeEnter,
      enter,
      leave,
      afterLeave,
      setLayerShow,
      isRouteNameLayer,
      layerRef,
    }
  },
})
</script>
<style lang="scss" scoped>
.layerContent {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 8;
  top: 0;
  left: 0;
  background: #fefefe;
  overflow: hidden;
  display: none;
  &.show {
    display: block;
  }
}
</style>
