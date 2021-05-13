<template>
  <div class="playContont" ref="wrapper">
    <div class="box">
      <Panel :key="0" ref="Panel" @updateLyric="updateLyric" @updateTime="updateTime" />
      <Lyric :key="1" ref="Lyric" :curTime="curTime" :lyricData="lyricData"   />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, onMounted, reactive, watch } from 'vue'
import Panel from './Panel/index.vue'
import Lyric from './Lyric/index.vue'
import BScroll from '@better-scroll/core'
export default defineComponent({
  components: { Panel, Lyric },
  props: {
    config: {
      type: Object as PropType<any>,
      default() {
        return null
      },
    },
  },
  setup(props: any) {
    const wrapper = ref(null)
    const Panel = ref(null)
    const Lyric = ref(null)
    const curTime = ref(0)
    const lyricData: any = reactive({})
    const scroll = reactive({ config: null }) as any
    onMounted(() => {
      scroll.config = new BScroll(wrapper.value as any, {
        scrollY: false,
        scrollX: true,
        bounce: false,
        click: true,
        preventDefault: false,
      })
      scroll.config.disable()
    })

    watch(
      () => props.config.value,
      (val) => {
        scroll.config.refresh()
        const el: any = val ? Lyric.value : Panel.value
        scroll.config.scrollToElement(el.$el, 300, 0, 0)
      }
    )

    const updateLyric = (data: any) => {
      Object.assign(lyricData, data)

    }

    const updateTime = (data: any) => {
      curTime.value = data
    }

    return {
      wrapper,
      Panel,
      Lyric,
      updateLyric,
      updateTime,
      curTime,
      lyricData
    }
  },
})
</script>

<style lang="scss" scoped>
.playContont {
  width: 100%;
  height: 100%;
  overflow: hidden;
  .box {
    display: flex;
    height: 100%;
    width: 200vw;
    overflow: hidden;
  }
}
</style>
