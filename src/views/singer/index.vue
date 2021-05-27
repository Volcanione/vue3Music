<template>
  <LayerPage class="my">
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" />
    </template>
    <template #header>
      <Nav class="nav"> 歌手
        <template #right>
          <span class="filter" @click="filterSingerVisible = !filterSingerVisible" ><i class="iconfont">&#xe60a;</i></span>
        </template>
      </Nav>
    </template>
    <template #content>
      <div style="height:2000px">111</div>
    </template>
    <template #fixed>
      <FilterLetter v-model="letter" />
      <FilterSinger  v-model:visible="filterSingerVisible"/>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, nextTick } from 'vue'
import FilterLetter from '@/components/FilterLetter/index.vue'
import FilterSinger from './components/Filter.vue'
export default defineComponent({
  components: { FilterLetter,FilterSinger },
  setup(props) {
    const letter = ref('热')
    const filterSingerVisible = ref(false)

    return {
      letter,
      filterSingerVisible
    }
  },
})
</script>

<style lang="scss" scoped>
  .filter{
    color: #999;
  }
</style>