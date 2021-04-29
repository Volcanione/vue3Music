<template>
  <div class="mode" @click="setPlayerMode">
    <i class="iconfont" v-if="playerMode === 'alone'">&#xe6a2;</i>
    <i class="iconfont" v-if="playerMode === 'list'">&#xe6a3;</i>
    <i class="iconfont" v-if="playerMode === 'random'">&#xe624;</i>
  </div>
  <div class="prev" @click="setPrevNow"><i class="iconfont">&#xe607;</i></div>
  <div class="play" @click="setPlayerState(!playerState)">
    <i class="iconfont" v-if="playerState">&#xe76a;</i>
    <i v-else class="iconfont">&#xe646;</i>
  </div>
  <div class="next" @click="setNextNow(true)"><i class="iconfont">&#xe872;</i></div>
  <div class="list"><i class="iconfont">&#xe6e4;</i></div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import { playerSetup } from '@/layout/components/Player/setup'
export default defineComponent({
  setup() {
    const {
      playerMode,
      setPlayerMode,
      playerState,
      setPlayerState,
      playerNow,
      setPlayerNow,
      setPrevNow,
      setNextNow,
    } = playerSetup()
    watch(
      () => playerNow.value,
      (val) => {
        console.log(val)
      },
      { immediate: true }
    )
    return {
      playerState,
      setPlayerState,
      setPlayerMode, //切换模式
      playerMode,
      setPrevNow,
      setNextNow,
    }
  },
})
</script>
<style lang="scss" scoped>
.prev,
.next {
  width: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.playerMode,
.list {
  width: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.play {
  width: 60px;
  height: 60px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
}
.iconfont {
  color: #fff;
  font-size: 26px;
}
</style>
