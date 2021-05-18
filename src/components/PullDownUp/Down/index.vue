<template>
  <div class="pullDown">
    <transition name="fade" mode="out-in">
      <img class="icon" :src="src" v-if="setloading" />
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed, toRefs } from 'vue'
export default defineComponent({
  props: {
    state: {
      type: Number as PropType<number>,
    },
    white: {
      type: Boolean as PropType<boolean>,
    },
  },
  setup(props) {
    const {state,white} = toRefs(props)
    const setloading = computed(() => {
      if (state?.value === 0 ||state?.value === 1 || state?.value === 2) {
        return true
      }
      return false
    })

    const src = computed((  ) => {
        return white?.value?require('@/style/icons/svg-loaders/puffwhite.svg'):require('@/style/icons/svg-loaders/puff.svg')
    })
    return {
      setloading,
      src
    }
  },
})
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
