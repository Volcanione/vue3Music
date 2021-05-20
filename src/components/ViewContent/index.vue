<template>
  <div class="RouterView">
    <router-view v-slot="{ Component }" :name="routerName">
      <transition
        appear
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        @leave="leave"
        @after-leave="$emit('afterLeave')"
        mode="out-in"
        type="animation"
        :duration="300"
      >
        <component :is="Component" ref="pageRef" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
import { setTabRouteView } from "./index";
import { BScrollType } from "@/interface/index";
export default defineComponent({
  props: {
    type: {
      type: Number as PropType<number>,
      default: () => 0,
    },
    routerName: {
      type: String as PropType<string>,
      default: "default",
    },
    disabled: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  data() {
    return {
      scroll: {} as BScrollType,
    };
  },
  setup(props, context) {
    return setTabRouteView(props, context);
  },
  methods: {
    // afterEnter() {
    //   const RouterView: any = this.$refs.page;
    //   const refresh = RouterView.$refs?.ScrollPage?.refresh;
    //   refresh && refresh();
    // },
    // //下拉
    // async pullDownrefresh(done: () => void) {
    //   //组件请求数据的方法
    //   const pageCom: any = this.$refs.page;
    //   pageCom.init();

    //   await done();
    // },
  },
});
</script>

<style lang="scss" scoped>
@import "~@/style/layout.scss";
.RouterView {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  .pageConent {
    width: 100%;
    overflow: hidden;
  }
}
</style>
