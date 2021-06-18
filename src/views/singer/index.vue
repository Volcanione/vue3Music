<template>
  <LayerPage
    :loading="loadingState"
    ref="singerResultRef"
    @pullDown="pullDown"
    @pullUp="pullUp"
  >
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" />
    </template>
    <template #header>
      <Nav class="nav">
        歌手
        <template #right>
          <span
            class="filter"
            @click="filterSingerVisible = !filterSingerVisible"
            ><i class="iconfont">&#xe60a;</i></span
          >
        </template>
      </Nav>
    </template>
    <template #content>
      <Item
        :data="dataList"
        :type="100"
        v-if="dataList.length"
        @confirm="getDetail"
      />
    </template>
    <template #fixed>
      <FilterLetter v-model="letter" />
      <FilterType v-model:visible="filterSingerVisible" v-model="filterData" />
      <div class="letterBar">{{ letter }}</div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, reactive, ref, nextTick, watch } from "vue";
import { $msg } from "@/components/Msg/index";
import FilterLetter from "@/components/FilterLetter/index.vue";
import FilterType from "./components/FilterType.vue";
import Item from "@/views/search/components/Item/item.vue";
import api from "@/api/index";
import { useRouter } from "vue-router";
export default defineComponent({
  components: { FilterLetter, FilterType, Item },
  setup(props) {
    const letter = ref("热");
    const loadingState = ref(false);
    const filterSingerVisible = ref(false);
    const singerResultRef = ref(null) as any;
    const router = useRouter();
    const filterData = reactive({
      type: -1,
      area: -1,
    });

    const offsetLimit = reactive({
      limit: 30,
      offset: 0,
    });

    const dataList = ref([]) as any;
    const moreData = ref(true);

    watch(
      () => filterData,
      () => {
        offsetLimit.offset = 0;
        getData();
      },
      { deep: true }
    );

    watch(
      () => letter,
      () => {
        offsetLimit.offset = 0;
        getData();
      },
      { deep: true }
    );

    const getData = async (state = false) => {
      loadingState.value = false;
      const { code, more, artists } = await api.getArtistList({
        ...filterData,
        ...offsetLimit,
        initial:
          letter.value === "热" ? -1 : letter.value === "#" ? 0 : letter.value,
      });
      moreData.value = more;
      if (code !== 200) {
        return (dataList.value = []);
      }
      if (!state) {
        dataList.value = [...artists];
      } else {
        dataList.value.push(...artists);
      }
      loadingState.value = true;
    };

    const pullDown = async (done: () => void) => {
      offsetLimit.offset = 0;
      try {
        await getData();
      } catch (error) {
        //
      }
      await done();
    };

    const pullUp = async (done: (state?: number) => void) => {
      offsetLimit.offset++;
      if (!moreData.value) {
        await done(2);
        return $msg({ title: "真的到底了" });
      }
      try {
        await getData(true);
        await done(1);
      } catch (error) {
        await done(0);
      }
    };

    const getDetail = (item: any) => {
      router.push({
        name: "SingerDetail",
        params: { id: item.id, name: item.name },
      });
    };

    //初始化
    const init = () => {
      getData();
    };

    //初始化
    init();

    return {
      letter,
      filterSingerVisible,
      filterData,
      dataList,
      loadingState,
      pullDown,
      pullUp,
      singerResultRef,
      getDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.filter {
  color: #999;
}
.letterBar {
  position: absolute;
  width: 100%;
  height: 30px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  top: 44px;
  background: rgba(255, 255, 255, 0.5);
}
</style>
