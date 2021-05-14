<template>
  <div class="item">
    <div class="imgBox">
      <img alt="" v-layz="data?.picUrl || data?.coverImgUrl" />
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
  .imgBox {
    width: 100%;
    height: 110px;
    border-radius: 8px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
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
  }
}
</style>
