<template>
  <ScrollPage
    ref="ScrollPage"
    :pull-down="true"
    @refresh="pullDownrefresh"
    @loading="pullUploading"
    :pull-Up="false"
  >
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" />
    </template>
    <div class="viewContent">
      <div class="searchBar">
        <Field
          v-model="search"
          class="field"
          placeholder="搜索"
          disabled
          @click="goSeach"
        >
          <template #label>
            <i class="iconfont">&#xe632;</i>
          </template>
        </Field>
      </div>
    </div>
  </ScrollPage>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { searchFn } from "../search/setup";
import { useRouter } from "vue-router";
export default defineComponent({
  name: "Hall",
  created() {
    this.init();
  },
  setup() {
    const router = useRouter();
    const { getSearchDefault, search } = searchFn();

    //初始化
    const init = () => {
      getSearchDefault();
    };

    const goSeach = () => {
      router.push("/search");
    };

    const pullDownrefresh = async (done: any) => {
      done();
    };
    const pullUploading = async (done: any) => {
      done();
    };

    return {
      init,
      pullDownrefresh,
      pullUploading,
      getSearchDefault,
      search,
      goSeach,
    };
  },
});
</script>
<style lang="scss" scoped>
.viewContent {
  .searchBar {
    display: flex;
    overflow: hidden;
    background: #fff;
    margin: 0 10px;
    border-radius: 8px;
    margin-top: 10px;
    .iconfont {
      margin-left: 10px;
    }
  }
}
</style>
