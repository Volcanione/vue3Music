<template>
  <div class="Nav">
    <div class="left">
      <slot name="left" />
      <span class="back" v-if="!$slots.left" @click="handlerBack">
        <i class="iconfont">&#xe603;</i></span
      >
    </div>
    <div class="content">
      <slot />
    </div>
    <div class="right" v-if="right">
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from "vue";
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
  },
  methods: {
    handlerBack() {
      if (this.back) {
        return this.back();
      }
      this.$router.go(-1);
    },
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
    justify-content: center;
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
