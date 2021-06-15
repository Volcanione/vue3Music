<template>
  <transition name="fade" @after-leave="afterLeave">
    <div class="Msg" v-show="show">{{ title }}</div>
  </transition>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  ref,
  nextTick,
  onBeforeMount,
  getCurrentInstance,
} from "vue";
export default defineComponent({
  name: "msg",
  props: {
    title: {
      type: String as PropType<string>,
      default: "",
    },
    duration: {
      type: Number as PropType<number>,
      default: 2000,
    },
  },
  data() {
    return {};
  },
  setup(props) {
    let instance: any = getCurrentInstance();
    onBeforeMount(() => {
      instance._hub = {
        complete: () => {
          console.log("complete");
        },
        destroy: () => {
          console.log("destroy");
        },
      };
    });
    let timeID = -1;
    const show = ref(false);
    nextTick(() => {
      show.value = true;
    });
    timeID = setTimeout(() => {
      clearTimeout(timeID);
      show.value = false;
      instance._hub["complete"]();
    }, props.duration);

    const afterLeave = () => {
      //  emit('destroy')
      instance._hub["destroy"]();
    };

    return {
      show,
      afterLeave,
    };
  },
});
</script>

<style lang="scss" scoped>
.Msg {
  position: fixed;
  z-index: 9999;
  background: rgba(000, 000, 000, 0.5);
  min-height: 30px;
  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #fff;
  border-radius: 15px;
  left: 50%;
  transition: all 0.3s ease;
  top: 64px;
  transform: translate(-50%, 0);
}
.fade-enter-active,
.fade-leave-active {
  opacity: 0;
  transform: translate(-50%, -10px);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}
</style>
