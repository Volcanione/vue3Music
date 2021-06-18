<template>
  <div class="playerHead">
    <div class="left" @click="setPlayerShow()">
      <i class="iconfont">&#xe6ca;</i>
    </div>
    <div class="center">
      <TabBar v-model="activeVal" :list="list" />
    </div>
    <div class="right" @click="$emit('comment')">
      <i class="iconfont">&#xe6d3;</i>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType, computed } from "vue";
import { playerSetup } from "../setup";
export default defineComponent({
  props: {
    active: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  emits: ["comment", "switch", "update:active"],
  setup(props, { emit }) {
    const activeVal = computed({
      get() {
        return props.active;
      },
      set(val) {
        emit("update:active", val);
      },
    });
    const list = [
      {
        label: "歌曲",
        value: 0,
      },
      {
        label: "歌词",
        value: 1,
      },
    ];
    const { setPlayerShow } = playerSetup();
    return {
      setPlayerShow,
      activeVal,
      list,
    };
  },
});
</script>
<style lang="scss" scoped>
.playerHead {
  height: 100%;
  display: flex;
  align-items: center;
  color: #fff;
  .left,
  .right {
    width: 50px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .center {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 35px;
    :deep(.TABBER) {
      width: 100px;
      justify-content: space-between;
      .root {
        .item {
          color: rgba(255, 255, 255, 0.5);
          &.active {
            color: #fff !important;
          }
        }
        .linetip {
          background: transparent;
        }
      }
    }
  }
}
</style>
