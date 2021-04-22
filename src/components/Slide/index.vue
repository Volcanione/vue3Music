<template>
  <div class="slide-banner">
    <div class="slide-banner-wrapper" ref="slide">
      <div class="slide-banner-content">
        <div v-for="(item, index) in list" class="slide-page" :key="index">
          <div class="pageconent"><img :src="item.imageUrl" alt="" /></div>
        </div>
        <div class="slide-page" v-if="!list.length"></div>
      </div>
      <div class="sign-list">
        <span
          v-for="index in list.length"
          :key="index"
          :class="{ active: currentPageIndex === index - 1 }"
        ></span>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from "@better-scroll/core";
import Slide from "@better-scroll/slide";
import { defineComponent, PropType } from "vue";
import { BScrollType } from "@/interface/index";
BScroll.use(Slide);

export default defineComponent({
  props: {
    list: {
      type: Array as PropType<Array<any>>,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      nums: 4,
      slide: {} as BScrollType,
      currentPageIndex: 0,
    };
  },
  watch: {
    list() {
      this.refresh();
    },
  },
  mounted() {
    this.init();
  },
  beforeUnmount() {
    this.slide.destroy();
  },
  methods: {
    init() {
      this.slide = new BScroll(this.$refs.slide as HTMLElement, {
        scrollX: true,
        scrollY: false,
        slide: true,
        momentum: false,
      }) as any;
      this.slide.on("slideWillChange", (page) => {
        this.currentPageIndex = page.pageX;
      });
    },
    refresh() {
      this.$nextTick(() => {
        this.slide.refresh();
      });
    },
  },
});
</script>
<style lang="scss" rel="stylesheet/stylus">
.slide-banner {
  position: relative;
  margin-top: 10px;
  width: 100%;
  overflow: hidden;
  height: calc((100vw - 20px) * 0.37);
  .slide-banner-wrapper {
    height: 100%;
    overflow: hidden;
    position: relative;
    .sign-list {
      position: absolute;
      bottom: 10px;
      height: 10px;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        width: 8px;
        height: 8px;
        background: rgba(255, 255, 255, 0.5);
        margin: 0 5px;
        border-radius: 50%;
        &.active {
          background: #fff;
        }
      }
    }
  }

  .slide-banner-content {
    height: 100%;
    white-space: nowrap;
    font-size: 0;
    .slide-page {
      display: inline-block;
      height: 100%;
      padding: 0 10px;
      overflow: hidden;
      .pageconent {
        height: 100%;
        border-radius: 8px;
        background: #f0f0f0;
        overflow: hidden;
        img {
          display: block;
          width: 100%;
        }
      }
    }
  }
}
</style>
