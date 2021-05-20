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
          <span class="remove" @click="removePlayList()" v-show="!currentPage">
            <i class="iconfont">&#xe601;</i>
          </span>
        </div>
        <div class="center">
          <SlideWapper v-if="wappperShow" ref="slideWapperRef">
            <div class="playList">
              <ScrollPage ref="scrollPageRef" :scrollBack="false" v-if="playerList.length">
                <div class="item" :class="{playing:playerNow?.id===item.id}" v-for="item in playerList" :key="item.id">
                  <span class="name ellipsis" @click.self="addplay(item)">{{item.name}}</span>
                  <span class="artists ellipsis" @click.self="addplay(item)">{{item.artists}}</span>
                  <span class="play" v-if="playerNow?.id===item.id"> <i class="iconfont">&#xe610;</i></span>
                  <span class="remove" @click="removePlayList(item)"><i class="iconfont">&#xe600;</i></span>
                </div>
              </ScrollPage>
              <div v-if="!playerList.length" class="noData">
                最近没有播放过音乐哟
              </div>
            </div>
            <div class="playList" v-loading="loadingState">
              <ScrollPage :scrollBack="false" v-if="userPlayList.length">
                <div class="item" v-for="item in userPlayList" :key="item.id">
                  <span class="name ellipsis" @click.self="addPlayRecord(item)">{{item.name}}</span>
                  <span class="artists ellipsis" @click.self="addPlayRecord(item)">{{item.artists}}</span>
                </div>
              </ScrollPage>
              <div v-if="!userPlayList.length" class="noData">
                还没登录 <span class="loginBtn" @click="goLogin"> 点我登录</span>
              </div>
            </div>
          </SlideWapper>
        </div>
        <div class="bottom">
          <span class="btn" :class="{active:!currentPage}" @click="changeList(0)">当前列表</span>
          <span class="btn" :class="{active:currentPage}" @click="changeList(1)">播放记录</span>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref, watch, nextTick } from 'vue'
import { TweenMax } from 'gsap'
import { playerSetup, musicSetup } from '@/layout/components/Player/setup'
import SlideWapper from '@/components/SlideWapper/wapper.vue'
import { listSetUp } from './setup'
import { useRouter } from 'vue-router'
export default defineComponent({
  components: {  SlideWapper },
  setup() {
    const router = useRouter()
    const {
      playerListShow,
      setPlayerListShow,
      playerMode,
      setPlayerMode,
      playerList,
      playerNow,
      playerShow,
      setPlayerShow,
    } = playerSetup()

    const { userPlayList, getUserRecord } = listSetUp()
    const { setPlayerNow, removePlayList } = musicSetup()
    const scrollPageRef = ref(null) as any
    const slideWapperRef = ref(null) as any
    const currentPage = ref(0)
    const wappperShow = ref(false)
    const loadingState = ref(false)

    const beforeEnter = async (el: HTMLElement, done: any) => {
      wappperShow.value = true
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
      wappperShow.value = false
      TweenMax.to(el, 0, {
        y: '100%',
        onComplete: done,
      })
    }

    const addplay = (item: any) => {
      console.log(11)
      const state = playerShow.value
      setPlayerNow(item)
      setPlayerShow(state)
    }

    const addPlayRecord = (item: any) => {
      setPlayerListShow(false)
      setPlayerNow(item)
    }

    //更新组件
    const refresh = async () => {
      scrollPageRef.value?.refresh()
      currentPage.value = 0
    }

    //登录
    const goLogin = () => {
      setPlayerListShow(false)
      setPlayerShow(false)
      router.push('/login')
    }

    watch(
      () => playerListShow.value,
      async (val) => {
        if (!val) {
          return
        }
        loadingState.value = false
        await getUserRecord()
        loadingState.value = true
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

    //切换播放列表
    const changeList = (type: number) => {
      currentPage.value = slideWapperRef.value?.goToPage(type)
    }

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
      addplay,
      slideWapperRef,
      changeList,
      currentPage,
      wappperShow,
      userPlayList,
      addPlayRecord,
      goLogin,
      loadingState,
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
    .playList {
      width: 100%;
      height: 100%;
      position: relative;
    }
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
    .noData {
      display: flex;
      align-items: center;
      justify-content: center;
      color: #999;
      height: 100%;
      font-size: 12px;
      .loginBtn {
        margin-left: 10px;
        color: rgb(197, 84, 84);
      }
    }
  }
  .bottom {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .btn {
      font-size: 14px;
      color: #999;
      &.active {
        color: rgb(204, 99, 99);
      }
    }
  }
}
</style>