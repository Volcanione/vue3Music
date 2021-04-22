<template>
  <div class="pullDown">
    <transition name="fade" mode="out-in">
      <img
        class="icon"
        src="@/style/icons/svg-loaders/puff.svg"
        v-if="setloading"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    state: {
      type: Number as PropType<number>,
    },
  },
  computed: {
    setloading() {
      if (this.state === 0 || this.state === 1 || this.state === 2) {
        return true;
      }
      return false;
    },
  },
});
</script>
<style lang="scss" scoped>
.pullDown {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .icon {
    width: 20px;
    height: 20px;
    display: block;
  }
}
</style>
