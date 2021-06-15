<template>
  <div class="Nav">
    <div class="left">
      <slot name="left" />
      <span class="back" v-if="!$slots.left" @click="handlerBack">
        <i class="iconfont">&#xe603;</i></span
      >
    </div>
    <div class="content">
      <div class="ellipsis">
        <slot />
      </div>
    </div>
    <div class="right" v-if="right">
      <slot name="right" />
    </div>
    <div class="bgImg" v-if="bgImgStyle" :style="bgImgStyle"></div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { useRouter } from "vue-router";
export default defineComponent({
  props: {
    right: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    back: {
      type: Function as PropType<() => void>,
      required: false,
    },
    bgImgStyle: {
      type: Object as PropType<any>,
      required: false,
    },
  },
  setup(props) {
    const router = useRouter();
    const handlerBack = () => {
      if (props.back) {
        return props.back();
      }
      router.go(-1);
    };
    return {
      handlerBack,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "~@/style/layout.scss";
.Nav {
  height: #{$navbarHeight};
  background: #{$appBackColor};
  display: flex;
  justify-content: space-between;
  width: 100%;
  position: relative;
  z-index: 2;
  .bgImg {
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: -1;
    background-position: center calc(50% - 44px);
    background-size: 100% auto;
    opacity: 0;
    // -webkit-filter: blur(2px);
    // filter: blur(2px);
    overflow: hidden;
    background-color: #{$appBackColor};
  }
  .left,
  .right {
    width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .content {
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    & > div {
      width: 100%;
    }
  }
  .back {
    width: 44px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
