<template>
  <div class="pullDown">
    <transition name="fade">
      <img class="icon" src="@/style/icons/svg-loaders/oval.svg" v-if="setloading" />
      <span v-else class="tip">
        <slot />
      </span>
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
  },
  setup(props) {
    const { state } = toRefs(props)
    const setloading = computed(() => {
      if (state?.value === 0) {
        return true
      }
      return false
    })
    return {
      setloading,
    }
  },
})
</script>
<style lang="scss" scoped>
.pullDown {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .tip {
    position: absolute;
  }
  .icon {
    width: 20px;
    height: 20px;
    display: block;
  }
}
</style>
