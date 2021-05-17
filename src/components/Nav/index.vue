<template>
  <div class="Nav" :style="styleObject">
    <div class="left">
      <slot name="left" />
      <span class="back" v-if="!$slots.left" @click="handlerBack">
        <i class="iconfont">&#xe603;</i></span>
    </div>
    <div class="content">
      <div class="ellipsis">
        <slot />
      </div>
    </div>
    <div class="right" v-if="right">
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from 'vue'
import { useRouter } from 'vue-router'
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
    background: {
      type: String as PropType<string>,
      default: '',
    },
  },
  setup(props) {
    const router = useRouter()
    const styleObject = computed(() => {
      return props.background
        ? { background: props.background, color: '#fff' }
        : null
    })
    const handlerBack = () => {
      if (props.back) {
        return props.back()
      }
      router.go(-1)
    }
    return {
      handlerBack,
      styleObject,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '~@/style/layout.scss';
.Nav {
  height: #{$navbarHeight};
  background: #{$appBackColor};
  display: flex;
  justify-content: space-between;
  width: 100%;
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
