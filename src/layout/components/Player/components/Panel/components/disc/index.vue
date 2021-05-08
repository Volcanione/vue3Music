<template>
  <div class="discBox">
    <img v-if="src" v-layz="src+'?param=300y300'" alt="">
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    src: {
      type: String as PropType<string>,
      default: '',
    },
  },
})
</script>

<style lang="scss" scoped>
.discBox {
  width: 100%;
  height: 100%;
}
</style>


