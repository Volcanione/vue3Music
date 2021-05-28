<template>
  <teleport to="body">
    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave" type="animation" :css="false">
      <div class="homeController" v-show="show">

        <div class="homeDisc" @click="setPlayerShow(true)">
          <Disc :size="50" :key=" playerNow?.id||-1" :src="playerNow?.img" :playerState="playerState" />
        </div>
        <div class="name ellipsis">{{ playerNow?.name || 'nomusic'}}</div>
        <div class="playBtn">
          <PlayProgess :progess="progess" :playerState="playerState" @play=" setPlayerState(!playerState)" />
        </div>
        <div class="listBtn" @click="setPlayerListShow(!playerListShow)">
          <i class="iconfont">&#xe6e4;</i>
        </div>
        <div class="bg"></div>
      </div>
    </transition>
  </teleport>
</template>
<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'
import { TweenMax } from 'gsap'
import { useStore } from 'vuex'
import Disc from '../Panel/components/disc/index.vue'
import PlayProgess from './components/play_progess.vue'
import createAudio from '@/layout/components/Player/audio'
export default defineComponent({
  components: { Disc, PlayProgess },
  setup() {
    const {
      playerState,
      playerNow,
      setPlayerListShow,
      playerListShow,
      progess,
      setPlayerState,
      setPlayerShow,
    } = createAudio()

    const store: any = useStore()
    const routeConfig = store.state.route
    const show = ref(true)
    let scroll = null as any

    const beforeEnter = async (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: '100%',
        onComplete: done,
      })
    }
    const enter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: '0',
        onComplete: done,
      })
    }
    const leave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: '100%',
        onComplete: done,
      })
    }
    const afterLeave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: '100%',
        onComplete: done,
      })
    }

    const init = () => {
      scroll.off('scrollEnd', scrollEnd)
      scroll.on('scrollEnd', scrollEnd)
    }

    const scrollEnd = ({ y }: any) => {
      show.value = y <= scroll.maxScrollY ? false : true
    }

    watch(
      () => routeConfig.routerScroll,
      async (val) => {
        if (!val) {
          return
        }
        scroll = val
        // console.log(scroll)
        await nextTick()
        init()
      }
    )

    return {
      beforeEnter,
      enter,
      leave,
      afterLeave,
      show,
      playerState,
      playerNow,
      setPlayerListShow,
      playerListShow,
      progess,
      setPlayerState,
      setPlayerShow,
    }
  },
})
</script>

<style lang="scss" scoped>
.homeController {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: rgba(255, 255, 255, 0.7);
  z-index: 8;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  .bg {
    position: absolute;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 1);
    -webkit-filter: blur(10px);
    filter: blur(10px);
    z-index: -1;
  }
  .homeDisc {
    width: 40px;
    height: 40px;
    overflow: hidden;
    :deep(.discBox .border) {
      border-width: 2px;
    }
  }
  .listBtn {
    .iconfont {
      font-size: 16px;
      color: #999;
    }
  }
  .name {
    flex: 1;
    padding-left: 10px;
  }
  .playBtn {
    width: 40px;
    height: 40px;
    margin-right: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>