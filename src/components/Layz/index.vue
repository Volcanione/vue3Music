<template>
  <transition name="fade">
    <div class="layz" v-if="loadState === 0"><img :src="loadImg" alt="" /></div>
  </transition>
  <transition name="fade">
    <div class="layz" v-if="loadState === -1">
      <img :src="errorImg" alt="" />
    </div>
  </transition>
</template>

<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  getCurrentInstance,
  onBeforeMount,
} from "vue";
export default defineComponent({
  props: {
    loadImg: {
      type: Number as PropType<number>,
      default: 0,
    },
    errorImg: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup() {
    let instance: any = getCurrentInstance();
    const loadState = ref(0);
    onBeforeMount(() => {
      instance._hub = {
        setloadState: (code: number) => {
          loadState.value = code;
        },
      };
    });
    // const setloadState = (code: number) => {
    //   loadState.value = code
    // }
    return {
      loadState,
    };
  },
});
</script>

<style lang="scss" scoped></style>

<style lang="scss">
.layz {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  z-index: 1;
  background: red;
  img {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>
