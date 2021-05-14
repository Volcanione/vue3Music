<template>
  <LayerPage ref="songDetailRef">
    <template #header>
      <Nav>
        {{name}}
      </Nav>
    </template>
    <template #content>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
export default defineComponent({
  name: 'songList',
  created() {},
  setup() {
    const route = useRoute()
    const name = route.query.name
    console.log(route.query)
    console.log(route.params)
    return {
      name,
    }
  },
})
</script>