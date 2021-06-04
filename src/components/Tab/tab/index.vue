<template>
  <div class="TABBER" ref="scrollContent" :style="{ height: heightPx }">
    <div class="root" :style="{ width: `${barWidth}px` }">
      <div class="bar" ref="tabbar">
        <div :class="{ item: true, active: item.value === modelValue }" v-for="item in list" :key="item.value" @click="handlerClick(item)">
          {{ item.label }}
        </div>
      </div>
      <div class="line">
        <span :style="style" class="linetip"></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from '@better-scroll/core'
import {
  defineComponent,
  computed,
  toRefs,
  PropType,
  ref,
  watch,
  onMounted,
  nextTick,
  reactive,
  onBeforeUnmount,
} from 'vue'
import { BScrollType } from '@/interface/index'
interface Item {
  label: string
  value: string | number
}

interface SizeSeat {
  width: number
  left: number
  barWidth: number
}

export default defineComponent({
  name: 'Tab',
  props: {
    modelValue: {
      type: [Number, String],
      required: true,
    },
    list: {
      type: Array as PropType<Array<Item>>,
      default: () => {
        return []
      },
    },
    height: {
      type: Number,
      required: false,
    },
    scrollDisabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { height, modelValue, list, scrollDisabled } = toRefs(props)
    const style = reactive({ width: '', transform: '' })
    const tabbar = ref(null) as any
    const scrollContent = ref(null) as any
    let scroll = {} as BScrollType
    const barWidth = ref(0)
    const heightPx = computed(() => {
      return height ? height.value + 'px' : '100%'
    })

    const handlerClick = (item: Item) => {
      emit('update:modelValue', item.value)
    }

    watch(
      modelValue,
      () => {
        setLineStyle()
      },
      { deep: true }
    )

    const IDX: any = computed(() => {
      return list.value.findIndex(
        (item: Item) => item.value === modelValue.value
      )
    })

    watch(IDX, (val, old) => {
      emit('change', val > old ? 1 : 0)
    })

    const setLineStyle = () => {
      const { width, left, barWidth: w } = getActiveWidth()

      Object.assign(style, {
        width: 25 + 'px',
        transform: `translateX(${left + (width - 25) / 2}px)`,
      })
      barWidth.value = w
    }

    const getActiveWidth = (): SizeSeat => {
      const dom = tabbar.value as HTMLElement
      const dix: number = list.value.findIndex(
        (i: any) => i.value === modelValue.value
      )
      const activeDom = dom.children[dix] as HTMLElement
      const scrollIdx: number = Math.max(dix - 1, 0)
      const scrollDom = dom.children[scrollIdx] as HTMLElement
      setScroll(scrollDom)
      return {
        width: activeDom.clientWidth,
        left: activeDom.offsetLeft,
        barWidth: getBarWidth(dom),
      }
    }

    const initWapper = () => {
      scroll = new BScroll(scrollContent.value as HTMLElement, {
        scrollY: false,
        scrollX: true,
        scrollbar: false,
        disableMouse: false,
        disableTouch: false,
        bounce: true,
        click: true,
        tap: 'tap',
      }) as any

      scrollDisabled.value && scroll.disable()
    }

    watch(
      () => scrollDisabled.value,
      (val) => {
        if (val) {
          scroll.disable && scroll.disable()
        } else {
          scroll.disable && scroll.enable()
        }
      },
      { deep: true }
    )

    const refresh = async () => {
      await nextTick()
      scroll.refresh()
    }
    const getBarWidth = (dom: HTMLElement) => {
      const domlist: Element[] = [...dom.children]
      return domlist.reduce((count: number, item: Element) => {
        return item.clientWidth + count
      }, 0)
    }
    const setScroll = (el: HTMLElement) => {
      scroll.scrollToElement && scroll.scrollToElement(el, 300, 0, 0, undefined)
    }

    onMounted(() => {
      setLineStyle()
      initWapper()
      refresh()
    })

    onBeforeUnmount(() => {
      scroll.destroy()
    })

    return {
      heightPx,
      handlerClick,
      tabbar,
      scrollContent,
      refresh,
      barWidth,
      style,
    }
  },
})
</script>
<style lang="scss" scoped>
.TABBER {
  width: 100%;
  height: 100%;
  .root {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    .bar {
      position: relative;
      flex: 1;
      display: flex;
      .item {
        display: flex;
        flex-shrink: 0;
        padding: 0 10px;
        justify-content: center;
        align-items: center;
        color: #666;
        cursor: pointer;
        &.active {
          color: #000;
          font-weight: 600;
        }
      }
    }
    .line {
      height: 4px;
      display: flex;
      .linetip {
        transition: 0.3s;
        height: 4px;
        background: red;
      }
    }
  }
}
</style>
