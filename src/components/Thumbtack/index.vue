<template>
  <div class="Thumbtack" :style="{...ThumbtackBoxStyle,opacity:+!fixed}" ref="ThumbtackRef">
    <slot />
  </div>
  <teleport to='body'>
    <div :style="{...ThumbtackBoxStyle,top:offset + 'px',opacity:fixed?1:0}" class="fixedBar">
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  toRefs,
  ref,
  nextTick,
} from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  props: {
    offset: {
      type: Number as PropType<number>,
      default: () => 0,
    },
  },
  setup(props, { emit }) {
    const { offset } = toRefs(props)
    const store = useStore()
    const ThumbtackRef = ref(null) as any
    const ThumbtackBoxStyle = reactive({})
    const fixed = ref(false)
    let scroll: any
    const init = async () => {
      scroll = store.state.route.routerScroll
      const width = ThumbtackRef.value.children[0]?.offsetWidth + 'px'
      const height = ThumbtackRef.value.children[0]?.offsetHeight + 'px'
      Object.assign(ThumbtackBoxStyle, { width, height })
      setScroll()
    }

    onMounted(async () => {
      await nextTick()
      init()
    })

    const setScroll = () => {
      scroll.on('scroll', () => {
        const { top } = ThumbtackRef.value.getBoundingClientRect()
        if (top <= offset.value) {
          fixed.value = true
        } else {
          fixed.value = false
        }
      })
    }

    return {
      ThumbtackBoxStyle,
      ThumbtackRef,
      fixed,
    }
  },
})
</script>

<style lang="scss" scoped>
.Thumbtack {
  position: relative;
  z-index: 8;
}
.fixedBar {
  width: 100%;
  position: fixed;
  opacity: 0;
  z-index: 8;
}
</style>