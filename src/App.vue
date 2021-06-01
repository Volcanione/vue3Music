<template>
  <div id="MUSICAPP">
    <Layout />
    <Layer />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Layout from "@/layout/index.vue";
import Layer from "@/components/Layer/index.vue";
export default defineComponent({
  name: "Home",
  components: {
    Layout,
    Layer,
  },
});
</script>
<style lang="scss">
#MUSICAPP {
  position: relative;
}
</style>
