<template>
  <div class="scrollWarpper" ref="scrollWarpper">
    <div class="scrollConent">
      <div class="pullingDownLoading" v-if="pullDown">
        <template v-if="!$slots.pullDown">
          {{ pullingDownText }}
        </template>
        <slot name="pullDown" :state="pullDownConfig.type" />
      </div>
      <slot />
      <template v-if="pullUp">
        <div class="pullingUpLoading">
          <template v-if="!$slots.pullUp">
            {{ pullingUpText }}
          </template>
          <slot name="pullUp" :state="pullUpConfig.type" />
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from '@better-scroll/core'
import PullDown from '@better-scroll/pull-down'
import Pullup from '@better-scroll/pull-up'
import { defineComponent, nextTick, PropType } from 'vue'
import { BScrollType } from '@/interface/index'
BScroll.use(PullDown)
BScroll.use(Pullup)
export default defineComponent({
  props: {
    pullDown: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    pullUp: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  data() {
    return {
      scroll: {} as BScrollType,
      threshold: 60,
      stop: 40,
      pullDownConfig: {
        srcollState: true,
        type: 0, //0初始 1 下拉中 2 加载中
        refreshtimeID: -1,
        initializetimeID: -1,
      },
      pullUpConfig: {
        type: 0, //0初始 1 上拉中 2 加载中
        refreshtimeID: -1,
        initializetimeID: -1,
      },
    }
  },
  computed: {
    pullingDownText() {
      switch (this.pullDownConfig.type) {
        case 0:
          return '下拉刷新'
        case 1:
          return '松开刷新'
        case 2:
          return '加载中'
        case 3:
          return '加载成功'
        default:
          return '加载失败'
      }
    },
    pullingUpText() {
      switch (this.pullUpConfig.type) {
        case 0:
          return '加载中'
        case 1:
          return '加载成功'
        case 2:
          return '没有数据'
        default:
          return '加载失败'
      }
    },
  },
  mounted() {
    this.init()
  },
  watch: {
    'pullUpConfig.type': {
      handler() {
        this.refresh()
      },
    },
    disabled:{
      immediate:true,
       handler(val) {
        this.$nextTick((  ) => {
          val &&  this.scroll.disable()
        })
      },
    }
  },
  methods: {
    init() {
      this.initWapper()
      this.refresh()
    },
    initWapper() {
      const CONFIG = {} as any
      this.pullDown &&
        (CONFIG.pullDownRefresh = {
          threshold: this.threshold,
          stop: this.stop,
        })
      this.pullUp &&
        (CONFIG.pullUpLoad = {
          threshold: 0,
        })

      this.scroll = new BScroll(this.$refs.scrollWarpper as HTMLElement, {
        scrollbar: false,
        stopPropagation: true,
        bounce: { top: true, bottom: true, left: false, right: false },
        bounceTime: 400,
        click: true,
        ...CONFIG,
      }) as any
      this.pullDown && this.scroll.on('pullingDown', this.pullingDownHandler)
      this.pullUp && this.scroll.on('pullingUp', this.pullingUPHandler)

      this.scroll.on('scroll', this.pageScrollHandler)
      this.scroll.on('touchEnd', this.pageTouchEndHandler)
    },
    refresh() {
      this.$nextTick(() => {
        try {
          this.scroll.refresh && this.scroll.refresh()
        } catch (error) {}
      })
    },
    scrollTo() {
      this.scroll.scrollTo && this.scroll.scrollTo(0, 0, 0)
    },

    //下拉刷新
    pullingDownHandler() {
      this.pullDownConfig.type = 2
    },

    //上拉加载
    pullingUPHandler() {
      this.pullUpConfig.type = 0
      this.pullUp && this.hanlderPullUpTouchEnd()
    },

    //监听滚动
    pageScrollHandler(pos: any) {
      if (pos.y < 10) {
        this.pullDownConfig.type = 0
      }
      this.pullDown && this.hanlderPullDownScroll(pos)
    },
    //下拉逻辑
    hanlderPullDownScroll(pos: any) {
      if (pos.y >= this.threshold && this.pullDownConfig.srcollState) {
        this.pullDownConfig.type = 1
      }
    },

    //手指离开
    pageTouchEndHandler(pos: any) {
      this.pullDown && this.hanlderPulldownTouchEnd(pos)
    },

    //下拉逻辑
    hanlderPulldownTouchEnd(pos: any) {
      if (pos.y < this.threshold) {
        return
      }
      this.pullDownConfig.srcollState = false
      this.$emit('refresh', this.handlerRefresh)
    },
    //上拉逻辑
    hanlderPullUpTouchEnd() {
      this.$emit('loading', this.handlerLoading)
    },
    //下拉请求数据处理逻辑
    async handlerRefresh(state = true) {
      return new Promise((res: any) => {
        clearTimeout(this.pullDownConfig.refreshtimeID)
        this.pullDownConfig.refreshtimeID = setTimeout(() => {
          this.pullDownConfig.type = state ? 3 : 4
          this.scroll.finishPullDown && this.scroll.finishPullDown()
          clearTimeout(this.pullDownConfig.refreshtimeID)
          this.refreshScrollPullDown()
          this.pullDownConfig.srcollState = true
          res()
        }, 500)
      })
    },
    refreshScrollPullDown() {
      clearTimeout(this.pullDownConfig.initializetimeID)
      this.pullDownConfig.initializetimeID = setTimeout(() => {
        clearTimeout(this.pullDownConfig.initializetimeID)
        this.pullDownConfig.type = 0
        this.refresh()
      }, 300)
    },

    //上拉加载数据处理逻辑
    async handlerLoading(state = 0) {
      return new Promise((res: any) => {
        clearTimeout(this.pullUpConfig.refreshtimeID)
        this.pullUpConfig.refreshtimeID = setTimeout(() => {
          clearTimeout(this.pullUpConfig.refreshtimeID)
          this.pullUpConfig.type = state === 0 ? -1 : state
          this.scroll.finishPullUp && this.scroll.finishPullUp()
          this.refreshScrollPullUp(state)
          res()
        }, 500)
      })
    },
    refreshScrollPullUp(state: number) {
      clearTimeout(this.pullUpConfig.initializetimeID)
      this.pullUpConfig.initializetimeID = setTimeout(() => {
        clearTimeout(this.pullUpConfig.initializetimeID)
        this.refresh()
      }, 300)
    },
    //卸载
    destroy() {
      this.scroll.destroy && this.scroll.destroy()
    },
  },
  beforeUnmount() {
    clearTimeout(this.pullUpConfig.refreshtimeID)
    clearTimeout(this.pullUpConfig.initializetimeID)
    this.$nextTick(() => {
      this.destroy()
    })
  },
})
</script>
<style lang="scss" scoped>
.scrollWarpper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .scrollConent {
    width: 100%;
    min-height: 100%;
    position: relative;
    .pullingDownLoading {
      position: absolute;
      width: 100%;
      transform: translateY(-100%) translateZ(0);
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .pullingUpLoading {
      width: 100%;
      position: relative;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  }
}
</style>
