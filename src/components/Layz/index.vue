<template>
  <transition name="fade">
    <div class="layz">1</div>
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

<style lang="scss" scoped></style>

<style lang="scss">
.ImgLoad {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: #999;
  z-index: 99;
}
</style>
