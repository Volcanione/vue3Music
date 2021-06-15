<template>
  <div class="Panel">
    <div class="SongDisc" ref="SongDiscRef">
      <Disc
        :key="playerNow?.id || -1"
        :src="playerNow?.img"
        :playerState="playerState"
      />
    </div>
    <div class="content">
      <div class="Info">
        <div class="name">
          <span class="title ellipsis">{{ playerNow?.name || "nomusic" }}</span>
          <span class="arts">{{ playerNow?.artists || "-" }}</span>
        </div>
        <div class="icons" v-if="playerNow?.id">
          <i class="iconfont" v-if="!playerNow?.like" @click="setLikeMusic()"
            >&#xe870;</i
          >
          <i class="iconfont" v-else @click="setLikeMusic()">&#xe86f;</i>
        </div>
      </div>
      <div class="lyricBar">
        <Lyric
          v-if="playerShow"
          :key="playerNow?.id || 1"
          line
          :lyricData="musicLyric"
          :currentTime="currentTime"
          ref="lyricRef"
        />
      </div>
      <div class="time">
        <span>{{ curTime || "00:00" }}</span>
        <span>{{ totalTime || "00:00" }}</span>
      </div>
      <div class="progess">
        <Progess
          v-model="progess"
          @changeProgess="changeProgess"
          :disabled="!duration"
        />
      </div>
    </div>
    <div class="bottom">
      <Control />
    </div>
    <audio class="audio" ref="audioElement" />
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  ref,
  watch,
  onMounted,
  nextTick,
  computed,
} from "vue";
import Progess from "./components/Progress/index.vue";
import Control from "./components/Control/index.vue";
import createAudio from "@/layout/components/Player/audio";
import Disc from "./components/disc/index.vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import Lyric from "@/components/Lyric/index.vue";
import ResizeObserver from "resize-observer-polyfill";
dayjs.extend(duration);
export default defineComponent({
  components: { Progess, Control, Lyric, Disc },
  emits: ["updateLyric", "updateTime"],
  setup(props, { emit }) {
    //创建音频
    const {
      audioElement,
      setPlayerAudioState,
      updatePlayState,
      progess,
      setProgess,
      changeProgess,
      currentTime,
      duration,
      playerState,
      playerNow,
      ended,
      setNextNow,
      playerShow,
      resetPlayState,
      musicLyric,
      setLikeList,
      setLikeMusic,
    } = createAudio();

    const SongDiscRef = ref(null);
    const lyricRef = ref(null);

    onMounted(async () => {
      const setDiscWidth = async () => {
        const dom = SongDiscRef.value as any;
        await nextTick();
        dom.style.width = dom.clientHeight + "px";
      };

      //监听器
      const intersectionObserver = new ResizeObserver(function () {
        setDiscWidth();
      });
      intersectionObserver.observe(SongDiscRef.value as any);
      //播放暂停
      watch(
        () => playerState.value,
        (val) => {
          setPlayerAudioState(val);
        }
      );
      //监听当前播放应用变化重置播放器
      await nextTick();

      watch(
        () => playerNow.value,
        (val) => {
          if (!val) {
            return resetPlayState();
          }
          updatePlayState(playerState.value); //传入参数true 为立即播放
        },
        {
          immediate: true,
        }
      );

      watch(
        () => currentTime.value,
        (cur: any | number) => {
          emit("updateTime", cur);
          setProgess(progess.value);
        },
        { immediate: true, deep: true }
      );

      watch(
        () => musicLyric,
        (data) => {
          emit("updateLyric", data);
        },
        { immediate: true, deep: true }
      );

      watch(
        () => ended.value,
        (val) => {
          if (val) {
            setNextNow();
          }
        },
        { immediate: true }
      );
    });

    watch(
      () => playerShow.value,
      (val) => {
        if (!val) {
          return;
        }
        setLikeList();
      }
    );

    const curTime = computed(() => {
      return dayjs.duration((currentTime.value || 0) * 1000).format("mm:ss");
    });
    const totalTime = computed(() => {
      return dayjs.duration((duration.value || 0) * 1000).format("mm:ss");
    });
    return {
      progess,
      playerState,
      playerNow,
      audioElement,
      changeProgess,
      curTime,
      totalTime,
      playerShow,
      duration,
      musicLyric,
      currentTime,
      SongDiscRef,
      lyricRef,
      setLikeMusic,
    };
  },
});
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
  position: relative;
  .SongDisc {
    flex-shrink: 0;
    width: 80vw;
    flex: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
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
        content: "";
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
    .lyricBar {
      height: 30px;
      width: 100%;
      padding: 0 20px;
      font-size: 12px;
      display: flex;
      align-items: center;
      margin-top: 20px;
      overflow: hidden;
      position: relative;
    }
    .progess {
      margin: 10px 0;
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
      padding: 0 20px;
      margin-bottom: 0;
      margin-top: auto;
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
