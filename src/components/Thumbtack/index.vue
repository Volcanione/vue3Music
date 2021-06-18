<template>
  <div
    class="Thumbtack"
    :style="{ ...ThumbtackBoxStyle, zIndex: !fixed ? 1 : -1, opacity: +!fixed }"
    ref="ThumbtackRef"
  >
    <slot v-if="!fixed" />
  </div>
  <teleport :to="targetDom" v-if="targetDom">
    <div
      v-if="fixed"
      :style="{ ...ThumbtackBoxStyle, top: refTop + 'px' }"
      class="fixedBar"
    >
      <slot />
    </div>
  </teleport>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  PropType,
  reactive,
  toRefs,
  ref,
  nextTick,
} from "vue";
import { useStore } from "vuex";
export default defineComponent({
  props: {
    offset: {
      type: Number as PropType<number>,
      default: () => 0,
    },
    target: {
      type: Function as PropType<any>,
      required: false,
    },
  },
  setup(props, { emit }) {
    const { offset } = toRefs(props);
    const store = useStore();
    const ThumbtackRef = ref(null) as any;
    const ThumbtackBoxStyle = reactive({});
    const fixed = ref(false);
    const targetDom = ref(null) as any;
    const refTop = ref(0);

    let scroll: any;
    const init = async () => {
      scroll = store.state.route.routerScroll;
      const width = ThumbtackRef.value.children[0]?.offsetWidth + "px";
      const height = ThumbtackRef.value.children[0]?.offsetHeight + "px";
      Object.assign(ThumbtackBoxStyle, { width, height });
      setScroll();
    };

    onMounted(async () => {
      await nextTick();
      init();
      const getdom: any = props.target ? props.target : () => document.body;
      targetDom.value = getdom();
    });

    const setScroll = () => {
      scroll.on("scroll", () => {
        if (!ThumbtackRef.value) {
          return;
        }
        const { top } = ThumbtackRef.value.getBoundingClientRect();
        refTop.value = props.target ? -top + offset.value : offset.value;
        if (top <= offset.value) {
          fixed.value = true;
        } else {
          fixed.value = false;
        }
      });
    };

    return {
      ThumbtackBoxStyle,
      ThumbtackRef,
      fixed,
      targetDom,
      refTop,
    };
  },
});
</script>

<style lang="scss" scoped>
.Thumbtack {
  position: relative;
}
.fixedBar {
  width: 100%;
  position: absolute;
  z-index: 8;
}
</style>
