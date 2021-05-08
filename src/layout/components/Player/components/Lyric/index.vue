<template>
  <div class="LyricPage">
    <Lyric :key="playerNow?.id + 'page' || 1+'page'" :lyricData="lyricData" :currentTime="curTime" />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import createAudio from '@/layout/components/Player/audio'
import Lyric from '@/components/Lyric/index.vue'
export default defineComponent({
  props: {
    curTime: {
      type: Number as PropType<Number>,
      default: 0,
    },
    lyricData: {
      type: Object as PropType<any>,
      default: null,
    },
  },
  components: { Lyric },
  setup() {
    const { playerNow } = createAudio()
    return {
      playerNow,
    }
  },
})
</script>

<style lang="scss" scoped>
.LyricPage {
  position: relative;
  flex-shrink: 0;
  width: 100vw;
  height: 100%;
  overflow: hidden;
}
</style>
