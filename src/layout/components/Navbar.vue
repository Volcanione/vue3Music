<template>
  <div class="navbar">
    <span class="left-btn" @click="openPlayer(true)">
      <i class="iconfont">&#xe63b;</i>
    </span>
    <div class="content">
      <TabBar
        v-model="menuActive"
        :list="list"
        @change="
          (val) => {
            $emit('changeRoute', val);
          }
        "
      />
    </div>
    <span class="right-btn" @click="setRouter('/my')">
      <i class="iconfont">&#xe643;</i>
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { playerSetup } from "../components/Player/setup";
import { useRouter, useRoute } from "vue-router";
export default defineComponent({
  data() {
    return {};
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const menuActive = ref("/recom");
    const list = [
      {
        label: "推荐",
        value: "/recom",
      },
      {
        label: "音乐馆",
        value: "/hall",
      },
      {
        label: "电台",
        value: "/radio",
      },
    ];
    const { setPlayerShow } = playerSetup();

    const setRouter = (val: string) => {
      router.push({ path: val });
    };

    watch(
      () => menuActive.value,
      (val) => {
        setRouter(val);
      },
      { immediate: true }
    );

    watch(
      () => route,
      (val) => {
        if (!list.find((item) => item.value === val.path)) {
          return;
        }
        menuActive.value = val.path;
      },
      { deep: true }
    );

    return {
      openPlayer: setPlayerShow,
      list,
      menuActive,
      setRouter,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~@/style/layout.scss";
.navbar {
  height: #{$navbarHeight};
  background: #{$appBackColor};
  display: flex;
  .content {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  .left-btn,
  .right-btn {
    width: 44px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
