<template>
  <div class="playerHead">
    <div class="left" @click="setPlayerShow()">
      <i class="iconfont">&#xe6ca;</i>
    </div>
    <div class="center">
      <TabBar
        v-model="active"
        :list="list"
        @change="
          (val) => {
            $emit('switch', { type: val, value: active });
          }
        "
      />
    </div>
    <div class="right">-</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, ref, PropType, watch } from "vue";
import { playerSetup } from "../setup";
import { TabBar } from "@/components/Tab/index";
export default defineComponent({
  components: { TabBar },
  props: {
    active: {
      type: Number as PropType<number>,
      default: 0,
    },
  },
  data() {
    return {
      list: [
        {
          label: "歌曲",
          value: 0,
        },
        {
          label: "歌词",
          value: 1,
        },
      ],
    };
  },
  setup(props) {
    const active = ref(0);
    watch(
      () => props.active,
      (val) => {
        active.value = val;
      }
    );
    const { setPlayerShow } = playerSetup();
    return {
      setPlayerShow,
      active,
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
    ::v-deep(.TABBER) {
      width: 100px;
      justify-content: space-between;
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
</style>
