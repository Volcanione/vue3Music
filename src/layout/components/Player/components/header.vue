<template>
  <div class="playerHead">
    <div class="left" @click="setPlayerShow()"><i class="iconfont">&#xe6ca;</i></div>
    <div class="center">center</div>
    <div class="right">x</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { playerSetup } from '../setup'
export default defineComponent({
  setup() {
    const { setPlayerShow } = playerSetup()
    return {
      setPlayerShow,
    }
  },
})
</script>
<style lang="scss" scoped>
.playerHead {
  height: 100%;
  display: flex;
  align-items: center;
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
  }
}
</style>