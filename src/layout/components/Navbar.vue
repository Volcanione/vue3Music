<template>
  <div class="navbar">
    <span class="left-btn" @click="openPlayer(true)">
      <i class="iconfont">&#xe63b;</i>
    </span>
    <div class="content">
      <TabBar v-model="menuActive" :list="list" @change="
          (val) => {
            $emit('changeRoute', val);
          }
        " />
    </div>
    <span class="right-btn" @click="setRouter('/setting')">
      <i class="iconfont">&#xe643;</i>
    </span>
  </div>
</template>

<script lang="ts">
import { TabBar } from '@/components/Tab/index'
import { defineComponent, watch } from 'vue'
import { playerSetup } from '../components/Player/setup'
export default defineComponent({
  components: { TabBar },
  data() {
    return {
      menuActive: '/recom',
      list: [
        {
          label: '推荐',
          value: '/recom',
        },
        {
          label: '音乐馆',
          value: '/hall',
        },
        {
          label: '电台',
          value: '/radio',
        },
      ],
    }
  },
  setup() {
    const { setPlayerShow } = playerSetup()
    return {
      openPlayer: setPlayerShow,
    }
  },
  watch: {
    menuActive: {
      immediate: true,
      handler(val) {
        this.setRouter(val)
      },
    },
    $route: {
      handler(val) {
        if (!this.list.find((item) => item.value === val.path)) {
          return
        }
        this.menuActive = val.path
      },
    },
  },
  methods: {
    setRouter(val: string) {
      this.$router.push({ path: val })
    },
  },
})
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';
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
