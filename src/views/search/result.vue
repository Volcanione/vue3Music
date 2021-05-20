<template>
  <LayerPage :loading="loadingState" ref="searchResultRef" @pullDown="pullDown" @pullUp="pullUp" forcedUpdates>
    <template #header>
      <Nav :right="false">
        <div class="searchBar">
          <Field v-model="search" class="field" placeholder="搜索">
            <template #label>
              <i class="iconfont searchIcon">&#xe632;</i>
            </template>
            <template #right>
              <i class="iconfont clearIcon"  @click="clearSearch">&#xe600;</i>
            </template>
          </Field>
        </div>
      </Nav>
      <div class="tabbar">
        <TabBar v-model="type" :list="list" @change="changeType" />
      </div>
    </template>
    <template #content>
      <Item :data="resultList" :type="type" v-if="resultList.length" @confirm="confirmItem" />
    </template>
    <template #fixed>
      <SearchTip
        :keyword="search"
        @comfirm="
          (item) => {
            searchSuggest(item, true);
          }
        "
      />
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { searchFn, searchResult } from "./setup";
import SearchTip from "./components/SearchTip.vue";
import Item from "./components/Item/item.vue";
export default defineComponent({
  name: "searchResult",
  components: { SearchTip, Item },
  data() {
    return {
      list: [
        {
          label: "单曲",
          value: 1,
        },
        {
          label: "专辑",
          value: 10,
        },
        {
          label: "歌手",
          value: 100,
        },
        {
          label: "歌单",
          value: 1000,
        },
        {
          label: "MV",
          value: 1004,
        },
        {
          label: "电台",
          value: 1009,
        },
        // {
        //   label: "视频",
        //   value: 1014,
        // },
      ],
    };
  },
  setup(props) {
    const { search, searchSuggest, clearSearch, } = searchFn();

    const init = () => {
      getsearchResult();
    };

    const {
      getsearchResult,
      type,
      changeType,
      resultList,
      loadingState,
      searchResultRef,
      pullDown,
      pullUp,
      confirmItem
    } = searchResult();
    init()
    return {
      search,
      searchSuggest,
      clearSearch,
      type,
      changeType,
      resultList,
      loadingState,
      searchResultRef,
      pullDown,
      pullUp,
      confirmItem
    };
  },
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
.tabbar {
  height: 30px;
}
</style>
