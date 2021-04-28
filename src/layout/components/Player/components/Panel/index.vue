<template>
  <div class="Panel">
    <div class="SongDisc">
      <div class="disc" :key="key" :style="{'animation-play-state':playerState}">
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
      <div class="progess">
        <Progess v-model="Progess" />
      </div>
    </div>
    <div class="bottom">
      <Control />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import Progess from './components/Progress/index.vue'
import Control from './components/Control/index.vue'
export default defineComponent({
  components: { Progess, Control },
  setup(props, context) {
    const Progess = ref(0)
    const playerState = ref('paused')
    const key = ref(-1)
    //播放暂停
    const palyPause = (type: number = 1) => {
      playerState.value = type === 1 ? 'running' : 'paused'
    }
    //重置
    const reset = () => {
      key.value = +new Date()
      palyPause(0)
    }
    return {
      palyPause,
      playerState,
      reset,
      key,
      Progess,
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
  }
  .bottom {
    height: 100px;
    width: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
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