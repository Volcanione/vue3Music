<template>
  <transition name="fade">
    <div class="loading" v-if="loading">
      <i class="iconfont">&#xe60e;</i>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  data() {
    return {
      loading: true,
    };
  },
});
</script>

<style lang="scss" scoped>
.loading {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #f7f7f7;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  i {
    font-size: 20px;
    animation: rotating 2s linear infinite;
    color: #999;
  }
  @keyframes rotating {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(1turn);
    }
  }
}
</style>
