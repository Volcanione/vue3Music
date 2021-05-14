<template>
  <div class="slide-banner">
    <div class="slide-banner-wrapper" ref="slideRef">
      <div class="slide-banner-content">
        <div v-for="(item, index) in data" class="slide-page" :key="index">
          <div class="pageconent"><img :src="item.imageUrl" alt="" /></div>
        </div>
        <div class="slide-page" v-if="!data.length"></div>
      </div>
      <div class="sign-list">
        <span v-for="index in data.length" :key="index" :class="{ active: currentPageIndex === index - 1 }"></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {
  defineComponent,
  PropType,
  onMounted,
  onBeforeUnmount,
  toRefs,
  ref,
  watch,
  nextTick,
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
  },
  data() {
    return {
      // nums: 4,
      // slide: {} as BScrollType,
      // currentPageIndex: 0,
    }
  },
  setup(props) {
    const { data } = toRefs(props)
    const nums = ref(4)
    const currentPageIndex = ref(0)
    const slideRef = ref(null) as any
    let slide = {} as BScrollType

    const init = () => {
      slide = new BScroll(slideRef.value as HTMLElement, {
        scrollX: true,
        scrollY: false,
        slide: true,
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

    onMounted(() => {
      init()
    })

    onBeforeUnmount(() => {
      slide.destroy()
    })

    return {
      nums,
      slideRef,
      currentPageIndex,
    }
  },
})
</script>
<style lang="scss" rel="stylesheet/stylus">
.slide-banner {
  position: relative;
  margin-top: 10px;
  width: 100%;
  overflow: hidden;
  height: calc((100vw - 20px) * 0.37);
  .slide-banner-wrapper {
    height: 100%;
    overflow: hidden;
    position: relative;
    .sign-list {
      position: absolute;
      bottom: 10px;
      height: 10px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 5px;
        border-radius: 50%;
        &.active {
          background: #fff;
        }
      }
    }
  }

  .slide-banner-content {
    height: 100%;
    white-space: nowrap;
    font-size: 0;
    .slide-page {
      display: inline-block;
      height: 100%;
      padding: 0 10px;
      overflow: hidden;
      .pageconent {
        height: 100%;
        border-radius: 8px;
        background: #f0f0f0;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>
