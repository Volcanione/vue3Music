<template>
  <div class="Panel">
    <div class="SongDisc">
      <div class="disc" :key="playerNow? playerNow.id:-1" :style="{ 'animation-play-state': playerState?'running':'paused' }">
        <img src="https://p1.music.126.net/uTCh9G5LvjQ1z32dBE5_8A==/109951165872244163.jpg" />
      </div>
    </div>
    <div class="content">
      <div class="Info">
        <div class="name">
          <span class="title ellipsis">歌曲名称</span>
          <span class="arts">歌手</span>
        </div>
        <div class="icons">
          <i class="iconfont">&#xe870;</i>
        </div>
      </div>
      <div class="lyric ellipsis">歌词歌词一行</div>
      <div class="time">
        <span>{{currentTime}}</span>
        <span>{{duration}}</span>
      </div>
      <div class="progess">
        <Progess v-model="progess" @changeProgess="changeProgess" />
      </div>
    </div>
    <div class="bottom">
      <Control />
    </div>
    <audio class="audio" ref="audioElement" />
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch, onMounted, nextTick } from 'vue'
import Progess from './components/Progress/index.vue'
import Control from './components/Control/index.vue'
import { playerSetup } from '@/layout/components/Player/setup'
import createAudio from '@/layout/components/Player/audio'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
export default defineComponent({
  components: { Progess, Control },
  setup(props, context) {
    const { playerState, playerNow } = playerSetup()

    //创建音频
    const {
      audioElement,
      setPlayerState,
      resetPlayState,
      progess,
      changeProgess,
      currentTime,
      duration,
    } = createAudio()

    onMounted(async () => {
      //播放暂停
      watch(
        () => playerState.value,
        (val) => {
          setPlayerState(val)
        }
      )
      //监听当前播放应用变化重置播放器
      await nextTick()
      watch(
        () => playerNow.value,
        (val) => {
          if (!val) {
            return
          }
          resetPlayState() //传入参数true 为立即播放
        },
        {
          immediate: true,
        }
      )
    })


    return {
      progess,
      playerState,
      playerNow,
      audioElement,
      changeProgess,
      currentTime,
      duration,
    }
  },
})
</script>

<style lang="scss" scoped>
.Panel {
  flex-shrink: 0;
  width: 100vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  color: #fff;
  .SongDisc {
    width: 80vw;
    height: 80vw;
    max-width: 600px;
    max-height: 600px;
    display: flex;
    align-items: center;
    justify-content: center;
    .disc {
      width: 80%;
      height: 80%;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      animation: rotating 10s linear infinite;
      &.paused {
        animation-play-state: paused;
      }
      &::after {
        top: 0;
        box-sizing: border-box;
        left: 0;
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 10px solid rgba(0, 0, 0, 0.5);
      }
      img {
        display: block;
        width: 100%;
        height: 100%;
      }
    }
  }
  .content {
    width: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .Info {
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      width: 100%;
      padding: 0 20px;
      height: 45px;
      .name {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        overflow: hidden;
        .title {
          font-size: 20px;
        }
        .arts {
          font-size: 12px;
        }
      }
      .icons {
        margin-left: 20px;
        .iconfont {
          font-size: 25px;
        }
      }
    }
    .lyric {
      height: 30px;
      width: 100%;
      padding: 0 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 10px;
    }
    .progess {
      margin: 20px 0;
      width: 100%;
      padding: 0 20px;
      height: 20px;
      display: flex;
      align-items: center;
    }
    .time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 12px;
      color: #fff;
    }
  }
  .bottom {
    height: 100px;
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .audio {
    display: none;
  }
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
</style>
