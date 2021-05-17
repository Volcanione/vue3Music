<template>
  <LayerPage ref="songDetailRef" :loading="loadingState" @pullDown="pullDown" class="songDetaile">
    <template #header>
      <Nav background="transparent" class="Nav">
        {{name}}
      </Nav>
    </template>
    <template #content>
      <div class="content"></div>
    </template>
    <template #fixed>
      <div class="top">
        <img :src="`${info.coverImgUrl}?param=300y300`" :style="imgStyle">
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import {
  defineComponent,
  reactive,
  onMounted,
  nextTick,
  onBeforeUnmount,
  ref,
} from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import api from '@/api/index'
export default defineComponent({
  name: 'songList',
  created() {
    this.init()
  },
  setup() {
    const store: any = useStore()
    const route = useRoute()
    const name = route.query.name
    const loadingState = ref(false)
    const imgStyle = reactive({ opacity: 1, transform: `scale(1) translateY(-50%)` })
    let scroll = null as any
    const info = reactive({})
    const init = () => {
      getSongDetail()
    }

    const getSongDetail = async () => {
      loadingState.value = false
      const { code, playlist, privileges } = await api.getSongDetail({
        id: route.params.id + '',
      })
      loadingState.value = true
      if (code !== 200) {
        return
      }
      Object.assign(info, playlist)
    }

    const setTopImg = () => {
      scroll.on('scroll', scrollHandler)
    }

    const scrollHandler = ({ x, y }: any) => {
      imgStyle.opacity = y > 0 ? 1 : Math.max(300 - Math.abs(y), 0) / 300
      imgStyle.transform =
        y > 0 ? ` scale(${1 + Math.abs(y) / 300}) translateY(-50%)` : ` scale(1) translateY(-50%)`

      console.log(imgStyle.transform)
    }

    onMounted(async () => {
      scroll = store.state.route.routerScroll
      await nextTick()
      setTopImg()
    })

    onBeforeUnmount(() => {
      scroll.off('scroll', scrollHandler)
      scroll = null
    })

    const pullDown = (done: () => void) => {
      done()
    }

    return {
      name,
      init,
      info,
      loadingState,
      pullDown,
      imgStyle,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '~@/style/layout.scss';
.songDetaile {
  ::v-deep .viewContent {
    background: transparent;
  }
  .Nav {
    position: fixed;
    z-index: 1;
  }
  .top {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    height: 300px;
    img {
      width: 100%;
      height: auto;
      position: absolute;
      display: block;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .content {
    height: 1000px;
    position: relative;
    z-index: 1;
    margin-top: 300px;
    background: #{$appBackColor};
  }
}
</style>