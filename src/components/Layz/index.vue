<template>
  <transition name="fade">
    <div class="layz" v-if="loadState===0"><img :src="loadImg" alt=""></div>
  </transition>
  <transition name="fade">
    <div class="layz" v-if="loadState===-1"><img :src="errorImg" alt=""></div>
  </transition>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    loadState: {
      type: Number as PropType<number>,
      default: 0,
    },
    loadImg: {
      type: String as PropType<string>,
      default: '',
    },
    errorImg: {
      type: String as PropType<string>,
      default: '',
    },
  },
  data() {
    return {
      loading: true,
    }
  },
})
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.layz {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 99;
  background: red;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
