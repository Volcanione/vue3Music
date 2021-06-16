<template>
  <LayerPage ref="LayerPage">
    <template #header>
      <Nav :right="false">
        <div class="searchBar">
          <Field v-model="search" class="field" placeholder="搜索">
            <template #label>
              <i class="iconfont searchIcon">&#xe632;</i>
            </template>
            <template #right>
              <i class="iconfont clearIcon" @click="clearSearch">&#xe600;</i>
            </template>
          </Field>
        </div>
      </Nav>
    </template>
    <template #content>
      <ScrollBox
        title="搜索历史"
        direction="x"
        height="30px"
        :update="searchHistoryList.length || 1"
      >
        <template #rightBtn>
          <span @click="removeHistory">清空</span>
        </template>
        <template #content>
          <template v-if="searchHistoryList.length">
            <div
              class="searchHistory"
              v-for="i in searchHistoryList"
              :key="i"
              @click="searchSuggest({ keyword: i })"
            >
              {{ i }}
            </div>
          </template>
          <span v-else class="tip">最近没有搜索</span>
        </template>
      </ScrollBox>
      <ScrollBox title="热门搜索" :update="searchHotList.length">
        <template #content>
          <div class="hotList">
            <div
              class="item"
              v-for="item in searchHotList"
              :key="item.score"
              @click="searchSuggest({ keyword: item.searchWord })"
            >
              <span>{{ item.searchWord }}</span>
              <img v-if="item.iconUrl" :src="item.iconUrl" alt="" />
            </div>
          </div>
        </template>
      </ScrollBox>
    </template>
    <template #fixed>
      <SearchTip
        :keyword="search"
        @comfirm="searchSuggest"
        ref="searchTipRef"
      />
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, nextTick, watch, ref } from "vue";
import { searchFn } from "./setup";
import SearchTip from "./components/SearchTip.vue";
export default defineComponent({
  name: "search",
  components: { SearchTip },
  setup() {
    const init = () => {
      getSearchKey();
      searchHotDeatil();
    };
    const LayerPage = ref(null) as any;

    const {
      search,
      searchSuggest,
      searchHistoryList,
      getSearchKey,
      searchTipRef,
      removeHistory,
      clearSearch,
      searchHotDeatil,
      searchHotList,
    } = searchFn();

    watch(
      () => searchHotList.value,
      () => {
        nextTick(() => {
          LayerPage.value.refresh();
        });
      }
    );
    init();
    return {
      search,
      searchSuggest,
      searchHistoryList,
      searchTipRef,
      searchHotList,
      LayerPage,
      removeHistory,
      clearSearch,
    };
  },
  methods: {},
});
</script>

<style lang="scss" scoped>
.searchBar {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: #fff;
  border-radius: 15px;
  margin-right: 10px;
  & > div {
    height: 30px;
  }
  .searchIcon {
    margin-left: 10px;
  }
  .clearIcon {
    margin-right: 10px;
  }
}
.searchHistory {
  height: 30px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 10px;
  background: #fff;
  border-radius: 15px;
  margin: 0 5px;
  &:first-child {
    margin-left: 10px;
  }
  &:last-child {
    margin-right: 10px;
  }
}
.tip {
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #999;
  margin-left: 10px;
}
.hotList {
  display: flex;
  flex-wrap: wrap;
  .item {
    width: 50%;
    height: 30px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    cursor: pointer;
    justify-content: space-between;
    img {
      height: 12px;
      display: block;
    }
  }
}
</style>
