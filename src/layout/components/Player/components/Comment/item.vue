<template>
  <div class="item">
1
  </div>
</template>

  
<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<any>,
    },
  },
  setup(props){
    console.log(props.data);
  }
})
</script>
<style lang="scss" scoped>
.item {
}
</style>