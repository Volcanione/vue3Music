<template>
  <LayerPage
    ref="songListRef"
    :loading="loadingState"
    @pullDown="pullDown"
    @pullUp="pullUp"
  >
    <template #header>
      <Nav>
        {{ title }}
      </Nav>
    </template>
    <template #content>
      <div class="content">
        <div class="songlist" v-for="item in songList" :key="item.id">
          <SongItem :key="item.id" :data="item" @click="getSongDetaile(item)" />
        </div>
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import SongItem from "@/views/recom/components/Item/SongItem.vue";
import { defineComponent, ref } from "vue";
import { useRoute } from "vue-router";
import { songlistSetup } from "./setup";
export default defineComponent({
  name: "songList",
  components: { SongItem },
  setup() {
    const route = useRoute();
    const catType = ref(route.params.cat);
    const title = route.params.cat;
    const {
      songList,
      initData,
      loadingState,
      pullDown,
      pullUp,
      songListRef,
      getSongDetaile,
    } = songlistSetup(catType);

    const init = async () => {
      //初始化
      initData();
    };
    init();
    return {
      title,
      songList,
      loadingState,
      pullDown,
      pullUp,
      songListRef,
      getSongDetaile,
    };
  },
});
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  padding: 5px;
  .songlist {
    width: calc((100vw - 40px) / 3);
    height: calc((100vw - 40px) / 3 + 50px);
    max-width: 200px;
    max-height: 250px;
    margin: 5px;
    flex-shrink: 0;
    :deep(.imgBox) {
      flex: 1;
      img {
        height: 100%;
      }
    }
  }
}
</style>
