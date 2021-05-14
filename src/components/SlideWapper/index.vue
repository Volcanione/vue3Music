<template>
  <div class="slideWapper" ref="slideRef" :style="{ height, width }">
    <div class="slide-banner-content">
      <div v-if="!data.length"></div>
      <slot />
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  ref,
  toRefs,
  watch,
} from 'vue'
import { BScrollType } from '@/interface/index'
BScroll.use(Slide)
export default defineComponent({
  props: {
    data: {
      type: Array as PropType<Array<any>>,
      default: () => {
        return []
      },
    },
    height: {
      type: String as PropType<string>,
      default: '100%',
    },
    width: {
      type: String as PropType<string>,
      default: '100%',
    },
    loop: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props) {
    const { data } = toRefs(props)
    let slide = {} as BScrollType
    const slideRef = ref(null) as any
    const currentPageIndex = ref(0)

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      slide.destroy()
    })

    const init = () => {
      slide = new BScroll(slideRef.value as HTMLElement, {
        scrollX: true,
        scrollY: false,
        slide: {
          threshold: 100,
          loop: false,
          autoplay: false,
        },
        tap: 'tap',
        momentum: false,
      }) as any
      slide.on('slideWillChange', (page) => {
        currentPageIndex.value = page.pageX
      })
    }

    const refresh = async () => {
      await nextTick()
      slide.refresh()
    }

    watch(
      () => data,
      () => {
        refresh()
      },
      { deep: true }
    )

    return {
      currentPageIndex,
      slideRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.slideWapper {
  width: 100%;
  height: 240px;
  .slide-banner-content {
    height: 100%;
    white-space: nowrap;
    font-size: 0;
    & > div {
      display: inline-block !important;
      overflow: hidden;
    }
  }
}
</style>
