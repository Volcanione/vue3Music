<template>
  <LayerPage>
    <template #header>
      <Nav> 设置 </Nav>
    </template>
    <template #content>
      <div style="height: 300px; background: red">1</div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "setting",
  methods: {
    // async pullDownrefresh(done: () => void) {
    //   await done()
    // },
    // async pullUpLoading(done: (state?:number) => void) {
    //   await done(1)
    // },
  },
});
</script>

<style lang="scss" scoped>
.setting {
}
</style>
