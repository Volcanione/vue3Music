<template>
  <div class="item">
    <div class="box">
      <div class="imgBox"> <img v-layz="data.picUrl" alt="" /></div>
      <span class="tip"> <i></i>10万 </span>
    </div>
    <div class="info">{{ data.name }}</div>
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<object>,
      default: null,
    },
  },
})
</script>
<style lang="scss" scoped>
.item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .box {
    position: relative;
    .tip {
      position: absolute;
      bottom: 0;
      width: 40px;
      height: 20px;
      border-radius: 10px;
      background: rgb(64, 142, 148);
      transform: translate(0, 10px);
      font-size: 12px;
      color: #fff;
      display: flex;
      align-items: center; 
      justify-content: center;
      z-index:999;
    }
  }
  .imgBox {
    width: 100%;
    height: 110px;
    border-radius: 8px;
    overflow: hidden;
  }
  img {
    display: block;
    width: 100%;
    height: 110px;
  }
  .info {
    height: 40px;
    line-height: 20px;
    font-size: 12px;
    display: -webkit-box !important;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: break-all;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    margin: 5px 0;
    margin-top: 10px;
  }
}
</style>
