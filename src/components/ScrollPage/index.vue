<template>
  <div class="scrollWarpper" ref="scrollWarpper">
    <div class="scrollConent">
      <div class="pullingDownLoading" v-if="pullDown">
        <template v-if="!$slots.pullDown">
          {{ pullingDownText }}
        </template>
        <slot name="pullDown" :state="pullDownConfig.type" />
      </div>
      <slot />
      <template v-if="pullUp">
        <div class="pullingUpLoading" ref="pullUpRef" v-if="pullUpShow">
          <template v-if="!$slots.pullUp">
            {{ pullingUpText }}
          </template>
          <slot name="pullUp" :state="pullUpConfig.type" />
        </div>
      </template>
    </div>
  </div>
</template>
<script lang="ts">
import BScroll from "@better-scroll/core";
import PullDown from "@better-scroll/pull-down";
import Pullup from "@better-scroll/pull-up";
import {
  computed,
  defineComponent,
  nextTick,
  onBeforeUnmount,
  onMounted,
  PropType,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { useStore } from "vuex";
import { BScrollType } from "@/interface/index";
BScroll.use(PullDown);
BScroll.use(Pullup);
export default defineComponent({
  props: {
    pullDown: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    pullUp: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    scrollBack: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    forcedUpdates: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { scrollBack, pullDown, pullUp, disabled, forcedUpdates } = toRefs(
      props
    );

    const store: any = useStore();
    const CONFIG = {} as any;
    const threshold = 60;
    const stop = 40;
    let scroll = {} as BScrollType;
    const pullUpRef = ref(null) as any;
    const pullUpShow = ref(true);
    const pullDownConfig = reactive({
      srcollState: true,
      type: 0, //0初始 1 下拉中 2 加载中
      refreshtimeID: -1,
      initializetimeID: -1,
    });
    const pullUpConfig = reactive({
      type: 1, //0上拉 1 成功 2 没有内容
      refreshtimeID: -1,
      initializetimeID: -1,
    });

    const scrollWarpper = ref(null) as any;

    //初始化
    const init = () => {
      initWapper();

      //开启监听器
      setIntersectionObserver();
    };

    const setIntersectionObserver = () => {
      if (!pullUp.value) {
        return;
      }
      const intersectionObserver = new IntersectionObserver(function (entries) {
        if (entries[0].intersectionRatio <= 0) return;
        pullUpShow.value = false;
        intersectionObserver.unobserve(pullUpRef.value);
      });
      intersectionObserver.observe(pullUpRef.value);
    };

    //初始化容器
    const initWapper = () => {
      pullDown.value &&
        (CONFIG.pullDownRefresh = {
          threshold: threshold,
          stop: stop,
        });
      pullUp.value &&
        (CONFIG.pullUpLoad = {
          threshold: 0,
        });

      // Object.assign(
      //   scroll,
      //   new BScroll(scrollWarpper.value, {
      //     scrollbar: false,
      //     stopPropagation: true,
      //     bounce: { top: true, bottom: true, left: false, right: false },
      //     bounceTime: 400,
      //     click: true,
      //     ...CONFIG,
      //   })
      // )
      scroll = new BScroll(scrollWarpper.value, {
        scrollbar: false,
        stopPropagation: true,
        bounce: { top: true, bottom: true, left: false, right: false },
        bounceTime: 400,
        click: true,
        ...CONFIG,
      }) as any;
      pullDown.value && scroll.on("pullingDown", pullingDownHandler);
      pullUp.value && scroll.on("pullingUp", pullingUPHandler);
      scroll.on("scroll", pageScrollHandler);
      scroll.on("touchEnd", pageTouchEndHandler);
      setscrollBack(scroll);
      refresh();
    };

    //下拉
    const pullingDownHandler = () => {
      pullDownConfig.type = 2;
    };
    //页面触摸停止处理
    const pageTouchEndHandler = (pos: any) => {
      pullDown.value && hanlderPulldownTouchEnd(pos);
    };

    //页面滚动处理
    const pageScrollHandler = (pos: any) => {
      pullUpShow.value = true;
      if (pos.y < 10) {
        pullDownConfig.type = 0;
      }
      pullDown.value && hanlderPullDownScroll(pos);
    };

    //下拉逻辑
    const hanlderPullDownScroll = (pos: any) => {
      if (pos.y >= threshold && pullDownConfig.srcollState) {
        pullDownConfig.type = 1;
      }
    };
    //下拉逻辑处理
    const hanlderPulldownTouchEnd = (pos: any) => {
      if (pos.y < threshold) {
        return;
      }
      pullDownConfig.srcollState = false;
      emit("refresh", handlerRefresh);
    };
    //下拉请求数据处理逻辑
    const handlerRefresh = (state = true) => {
      return new Promise((res: any) => {
        clearTimeout(pullDownConfig.refreshtimeID);
        pullDownConfig.refreshtimeID = setTimeout(() => {
          pullDownConfig.type = state ? 3 : 4;
          scroll.finishPullDown && scroll.finishPullDown();
          clearTimeout(pullDownConfig.refreshtimeID);
          refreshScrollPullDown();
          pullDownConfig.srcollState = true;
          res();
        }, 500);
      });
    };
    //完成上拉处理
    const refreshScrollPullDown = () => {
      clearTimeout(pullDownConfig.initializetimeID);
      pullDownConfig.initializetimeID = setTimeout(() => {
        clearTimeout(pullDownConfig.initializetimeID);
        pullDownConfig.type = 0;
        refresh();
      }, 300);
    };

    //上拉
    const pullingUPHandler = () => {
      pullUpConfig.type = 0;
      pullUp.value && hanlderPullUpTouchEnd();
    };
    //上拉结束处理
    const hanlderPullUpTouchEnd = () => {
      emit("loading", handlerLoading);
    };
    //上拉逻辑处理
    const handlerLoading = async (state = 0) => {
      return new Promise((res: any) => {
        clearTimeout(pullUpConfig.refreshtimeID);
        pullUpConfig.refreshtimeID = setTimeout(() => {
          clearTimeout(pullUpConfig.refreshtimeID);
          pullUpConfig.type = state === 0 ? -1 : state;
          scroll.finishPullUp && scroll.finishPullUp();
          refreshScrollPullUp(state);
          res();
        }, 500);
      });
    };
    //完成上拉处理
    const refreshScrollPullUp = (state: number) => {
      clearTimeout(pullUpConfig.initializetimeID);
      pullUpConfig.initializetimeID = setTimeout(() => {
        clearTimeout(pullUpConfig.initializetimeID);
        refresh();
      }, 300);
    };

    //卸载
    const destroy = () => {
      scroll.destroy && scroll.destroy();
    };

    //刷新
    const refresh = async () => {
      forcedUpdates.value && setscrollBack(null);
      await nextTick();
      try {
        forcedUpdates.value && setscrollBack(scroll);
        scroll.refresh && scroll.refresh();
      } catch (error) {
        console.log(error);
      }
    };

    //滚动到顶部
    const scrollTo = () => {
      scroll.scrollTo && scroll.scrollTo(0, 0, 0);
    };

    //滚动指定位置
    const scrollToElement = (
      el: any,
      time: number,
      offsetX: number,
      offsetY: number,
      easing: any
    ) => {
      scroll.scrollToElement &&
        scroll.scrollToElement(el, time, offsetX, offsetY, easing);
    };

    const pullingDownText = computed(() => {
      switch (+pullDownConfig.type) {
        case 0:
          return "下拉刷新";
        case 1:
          return "松开刷新";
        case 2:
          return "加载中";
        case 3:
          return "加载成功";
        default:
          return "加载失败";
      }
    });
    const pullingUpText = computed(() => {
      switch (pullUpConfig.type) {
        case 0:
          return "上拉加载";
        case 1:
          return "加载成功";
        case 2:
          return "没有数据";
        default:
          return "加载失败";
      }
    });

    watch(
      () => pullUpConfig.type,
      () => {
        refresh();
      }
    );
    watch(
      () => disabled.value,
      async (val) => {
        await nextTick();
        val && scroll.disable();
      },
      { immediate: true }
    );

    const setscrollBack = (s: any = null) => {
      if (scrollBack.value) {
        store.commit("route/setRouterScroll", s);
      }
    };

    //挂载
    onMounted(() => {
      init();
    });
    //卸载
    onBeforeUnmount(async () => {
      clearTimeout(pullUpConfig.refreshtimeID);
      clearTimeout(pullUpConfig.initializetimeID);
      setscrollBack();
      await nextTick();
      destroy();
    });

    return {
      scroll,
      refresh,
      scrollWarpper,
      scrollTo,
      pullDownConfig,
      pullUpConfig,
      pullingDownText,
      pullingUpText,
      scrollToElement,
      pullUpRef,
      pullUpShow,
    };
  },
});
</script>
<style lang="scss" scoped>
.scrollWarpper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  .scrollConent {
    width: 100%;
    min-height: 100%;
    position: relative;
    &:after {
      display: block;
      clear: both;
      height: 0;
      content: "";
      visibility: hidden;
      overflow: hidden;
    }
    .pullingDownLoading {
      position: absolute;
      width: 100%;
      transform: translateY(-100%) translateZ(0);
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
    .pullingUpLoading {
      width: 100%;
      position: relative;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }
  }
}
</style>
