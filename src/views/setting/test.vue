<template>
  <LayerPage>
    <template #header>
      <Nav> </Nav>
    </template>
    <template #content>
      <div style="height: 1000px; background: red">test</div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "test",
  components: {},
  methods: {},
});
</script>

<style lang="scss" scoped>
.viewContent {
  .btn {
    padding: 20px;
    background: red;
  }
}
</style>
