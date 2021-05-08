<template>
  <teleport to="body">
    <transition name="fade">
      <div class="bg" v-if="playerListShow" @click.self="setPlayerListShow(false)"></div>
    </transition>
    <transition @before-enter="beforeEnter" @enter="enter" @leave="leave" @after-leave="afterLeave" type="animation" :css="false">
      <div class="contentList" v-show="playerListShow">
        <div class="top">
          <span @click="setPlayerMode" class="mode">
            <i class="iconfont" v-if="playerMode === 'alone'">&#xe6a2;</i>
            <i class="iconfont" v-if="playerMode === 'list'">&#xe6a3;</i>
            <i class="iconfont" v-if="playerMode === 'random'">&#xe624;</i>
          </span>
          <span class="modeType">
            {{playerMode === 'alone'?'单曲循环':playerMode === 'list'?'顺序播放':'随机播放'}} - {{playerList.length}}
          </span>
          <span class="remove" @click="removePlayList()">
            <i class="iconfont">&#xe601;</i>
          </span>
        </div>
        <div class="center">
          <ScrollPage ref="scrollPageRef">
            <div class="item" :class="{playing:playerNow?.id===item.id}" v-for="item in playerList" :key="item.id">
              <span class="name ellipsis" @click.self="setPlayerNow(item)">{{item.name}}</span>
              <span class="artists ellipsis" @click.self="setPlayerNow(item)">{{item.artists}}</span>
              <span class="play" v-if="playerNow?.id===item.id"> <i class="iconfont">&#xe610;</i></span>
              <span class="remove" @click="removePlayList(item)"><i class="iconfont">&#xe600;</i></span>
            </div>
          </ScrollPage>
        </div>
        <div class="bottom"></div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'
import { TweenMax } from 'gsap'
import { playerSetup, musicSetup } from '@/layout/components/Player/setup'
import ScrollPage from '@/components/ScrollPage/index.vue'
export default defineComponent({
  components: { ScrollPage },
  setup() {
    const {
      playerListShow,
      setPlayerListShow,
      playerMode,
      setPlayerMode,
      playerList,
      playerNow,
    } = playerSetup()
    const { setPlayerNow, removePlayList } = musicSetup()
    const scrollPageRef = ref(null)
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

    //更新组件
    const refresh = () => {
      const s = scrollPageRef.value as any
      s?.refresh()
    }

    watch(
      () => playerListShow.value,
      async (val) => {
        if (!val) {
          return
        }
        await nextTick()
        refresh()
      }
    )

    watch(
      () => playerList,
      () => {
        refresh()
      },
      { deep: true }
    )

    return {
      beforeEnter,
      enter,
      leave,
      afterLeave,
      setPlayerMode,
      playerMode,
      playerListShow,
      setPlayerListShow,
      scrollPageRef,
      playerList,
      playerNow,
      setPlayerNow,
      removePlayList,
    }
  },
})
</script>

<style lang="scss" scoped>
.bg {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10;
  background: rgba(0, 0, 0, 0.5);
}
.contentList {
  position: fixed;
  z-index: 10;
  width: 100%;
  bottom: 0;
  height: 80%;
  background: #fff;
  border-radius: 10px 10px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  .top {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    .mode,
    .remove {
      cursor: pointer;
      .iconfont {
        font-size: 16px;
        color: #999;
      }
    }
    .modeType {
      flex: 1;
      padding-left: 10px;
    }
  }
  .center {
    flex: 1;
    overflow: hidden;
    .item {
      padding: 0 10px;
      height: 30px;
      display: flex;
      align-items: center;
      overflow: hidden;
      font-size: 14px;
      &.playing {
        color: rgb(197, 84, 84);
      }
      .artists {
        color: #cecece;
        margin: 0 10px;
      }
      .remove {
        margin-right: 0;
        margin-left: auto;
      }
    }
  }
}
</style>