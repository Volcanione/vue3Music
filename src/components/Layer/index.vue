<template>
  <div :class="{ layerContent: true, show: show }" ref="layer">
    <router-view v-slot="{ Component }" name="layer">
      <transition
        appear
        :css="false"
        @before-enter="beforeEnter"
        @enter="enter"
        @leave="leave"
        @after-leave="afterLeave"
        type="animation"
        :duration="200"
      >
        <component :is="Component" :key="comId" />
      </transition>
    </router-view>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { mapState } from "vuex";
import { TweenMax } from "gsap";
export default defineComponent({
  data() {
    return {
      show: false,
      routeBack: false,
    };
  },
  computed: {
    ...mapState(["route"]),
    comId() {
      const Param = Object.values(this.$route.params).length;
      if (!Param) {
        return 1;
      }
      return Param + +new Date();
    },
  },
  watch: {
    $route: {
      deep: true,
      handler(to, from) {
        const fromParent = from?.meta?.parent;
        const toName = to.name;
        this.routeBack = fromParent === toName;
      },
    },
  },
  methods: {
    beforeEnter(el: HTMLElement, done: any) {
      this.setLayerShow();
      el.style.backfaceVisibility = "hidden";
      TweenMax.to(el, 0, {
        x: this.routeBack ? "0" : "100%",
        opacity: 0,
        onComplete: done,
      });
      const parent = this.$route?.meta?.parent;
      const state = this.isRouteNameLayer();
      const layer = this.$refs.layer as HTMLElement;
      layer.style.backfaceVisibility = "hidden";
      TweenMax.to(layer as HTMLElement, 0, {
        opacity: !state || (!parent && !this.routeBack) ? 0 : 1,
        onComplete: done,
      });
    },
    enter(el: HTMLElement, done: any) {
      const state = this.isRouteNameLayer();
      el.style.backfaceVisibility = "hidden";
      TweenMax.to(el, 0.5, { x: 0, opacity: 1, onComplete: done });
      const layer = this.$refs.layer as HTMLElement;
      layer.style.backfaceVisibility = "hidden";
      TweenMax.to(layer as HTMLElement, 0.5, {
        opacity: state ? 1 : 0,
        onComplete: done,
      });
    },
    leave(el: HTMLElement, done: any) {
      const parent = this.$route?.meta?.parent;
      el.style.backfaceVisibility = "hidden";
      TweenMax.to(el, 0.5, {
        x: this.routeBack || !parent ? "100%" : "0",
        onComplete: done,
      });
      const layer = this.$refs.layer as HTMLElement;
      layer.style.backfaceVisibility = "hidden";
      TweenMax.to(layer, 0.5, {
        opacity: this.isRouteNameLayer() ? 1 : 0,
        onComplete: done,
      });
    },
    afterLeave(el: HTMLElement, done: any) {
      this.setLayerShow();
    },
    setLayerShow() {
      this.show = this.isRouteNameLayer();
    },
    isRouteNameLayer(): boolean {
      const nowRouter: any = this.$route.matched.find(
        (route) => route.name === this.$route.name
      );
      return Boolean(nowRouter.components.layer);
    },
  },
});
</script>
<style lang="scss" scoped>
.layerContent {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 8;
  top: 0;
  left: 0;
  background: #fefefe;
  overflow: hidden;
  display: none;
  &.show {
    display: block;
  }
}
</style>
