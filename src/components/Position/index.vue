<template>
  <teleport to="body">
    <div class="PositionBox" @click="$emit('click')">
      <i class="iconfont">&#xe640;</i>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["click"],
});
</script>
<style lang="scss" scoped>
.PositionBox {
  position: fixed;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 1px 1px rgba(0, 0, 0, 0.1);
  z-index: 99;
  bottom: 50px;
  right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  i {
    font-size: 16px;
    color: #cecece;
  }
}
</style>
