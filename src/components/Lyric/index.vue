<template>
  <transition name="fade">
    <div class="LyricBox" :class="{ line: line }" v-if="lyricData?.lyric_0">
      <div class="box">
        <ScrollPage
          ref="scrollPageRef"
          :disabled="line"
          :key="key"
          :scrollBack="false"
        >
          <template v-if="!checkLyricState">
            <div
              class="item ellipsis"
              :class="{ active: activeIdx === index }"
              v-for="(item, index) in lyric_0"
              :key="item.time"
              :ref="lyricItemRef"
            >
              {{ item.lyricText || "••••••" }}
            </div>
          </template>
          <template v-else>
            <div
              class="item ellipsis"
              :class="{ active: activeIdx === index }"
              v-for="(item, index) in lyric_1"
              :key="item.time"
              :ref="lyricItemRef"
            >
              {{ item.lyricText || "••••••" }}
            </div>
          </template>
        </ScrollPage>
      </div>
      <div
        v-if="lyricData?.lyric_1"
        class="btn"
        :class="{ active: checkLyricState }"
        @click="checkLyric"
      >
        <span>译</span>
      </div>
    </div>
  </transition>
  <div
    :class="{ nodata: !line }"
    v-if="lyricData && !lyricData.lyric_0 && !lyricData.lyric_1"
  >
    暂无歌词
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, nextTick, toRefs } from "vue";
import { lyricRegular, NextTimeArray } from "@/utils/player";
export default defineComponent({
  props: {
    line: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    lyricData: {
      type: Object as PropType<any>,
      default: null,
    },
    currentTime: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  setup(props) {
    const scrollPageRef = ref(null);
    const { lyricData } = toRefs(props);
    const lyric_0 = ref([]);
    const lyric_1 = ref([]);
    let lyricItemDom = [] as any;
    const activeIdx = ref(1);
    const checkLyricState = ref(false);
    const key = ref(0);

    let s = null as any;

    watch(
      () => scrollPageRef.value,
      (val) => {
        s = val as any;
      }
    );

    const lyricItemRef = (el: HTMLElement) => {
      if (el) {
        lyricItemDom.push(el);
      }
    };
    //处理歌词
    const delLryic = (data: any) => {
      if (data) {
        data?.lyric_0 && (lyric_0.value = lyricRegular(data.lyric_0));
        data?.lyric_1 && (lyric_1.value = lyricRegular(data.lyric_1));
      }
    };
    delLryic(lyricData.value);
    //当前歌词
    const setIndex = async (time: number) => {
      const arr = !checkLyricState.value ? lyric_0.value : lyric_1.value;
      activeIdx.value = NextTimeArray(time, arr);
      const activeDom = lyricItemDom[activeIdx.value];
      if (s?.scrollToElement) {
        try {
          s?.scrollToElement(activeDom, 300, 0, props.line ? 0 : -150);
        } catch (error) {
          console.log(error);
          key.value = +new Date();
          await nextTick();
        }
      }
    };
    //切换歌词
    const checkLyric = () => {
      lyricItemDom = [];
      checkLyricState.value = !checkLyricState.value;
    };

    watch(
      () => lyricData.value,
      async (val) => {
        if (val) {
          delLryic(val);
        }
        await nextTick();
      },
      { deep: true }
    );
    watch(
      () => props.currentTime,
      (val) => {
        setIndex(val);
      },
      { deep: true }
    );

    watch(
      () => checkLyricState.value,
      async () => {
        await nextTick();
      }
    );

    return {
      scrollPageRef,
      lyricItemRef,
      lyric_1,
      lyric_0,
      activeIdx,
      key,
      checkLyric,
      checkLyricState,
    };
  },
});
</script>

<style lang="scss" scoped>
.LyricBox {
  width: 100%;
  height: 100%;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  .box {
    flex: 1;
    overflow: hidden;
    flex-shrink: 0;
    margin: 0 10px 30px;
    position: relative;
    .item {
      min-height: 30px;
      line-height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      text-align: center;
      &.active {
        color: rgb(214, 91, 91);
      }
    }
  }
  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60px;
    span {
      font-size: 12px;
      padding: 3px;
      color: #fff;
      border-radius: 4px;
      border: 1px solid #fff;
    }
    &.active {
      span {
        color: #000;
        background: rgba(255, 255, 255, 0.7);
        border-color: rgba(255, 255, 255, 0.7);
      }
    }
  }

  &.line {
    flex-direction: row;
    .box {
      margin: 0;
      .item {
        justify-content: flex-start;
        text-align: left;
        &.active {
          color: #fff;
        }
      }
    }
    .btn {
      height: 30px;
      margin-left: 10px;
    }
  }
}
.nodata {
  color: #fff;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
