<template>
  <LayerPage
    ref="songListRef"
    :loading="loadingState"
    @pullDown="pullDown"
    @pullUp="pullUp"
    forcedUpdates
  >
    <template #header>
      <Nav>
        推荐歌单
        <template #right>
          <span class="more" @click="moreCatList"
            ><i class="iconfont">&#xe623;</i></span
          >
        </template>
      </Nav>
      <div class="tabbar">
        <TabBar
          v-model="catType"
          :list="catlist"
          v-if="catlist.length"
          @change="changeType"
        />
      </div>
    </template>
    <template #content>
      <div class="content">
        <div class="songlist" v-for="item in songList" :key="item.id">
          <SongItem :key="item.id" :data="item" @click="getSongDetaile(item)" />
        </div>
      </div>
    </template>
    <template #fixed>
      <AllCatList v-model="allCatListshow" @confirm="confirmCheckCat" />
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, ref } from "vue";
import SongItem from "@/views/recom/components/Item/SongItem.vue";
import api from "@/api";
import AllCatList from "./components/allCatList.vue";
import { useRouter } from "vue-router";
import { songlistSetup } from "./setup";
export default defineComponent({
  components: { AllCatList, SongItem },
  name: "songList",
  setup() {
    const router = useRouter();
    const catlist = ref([]); //歌单分类
    const catType = ref(""); //当前歌单分类
    const allCatListshow = ref(false); //全部分类弹窗

    const {
      songList,
      initData,
      loadingState,
      pullDown,
      pullUp,
      songListRef,
      changeType,
      getSongDetaile,
    } = songlistSetup(catType);

    const init = async () => {
      //初始化
      await getSongListCatList();
      initData();
    };
    //请求歌单分类数据
    const getSongListCatList = async () => {
      const { code, tags } = await api.getSongListCatListHOT();
      catlist.value =
        code === 200
          ? tags.map((item: any): any => {
              return {
                label: item.name,
                value: item.name,
              };
            })
          : [];
      catType.value = tags[0]?.name;
    };

    //更多歌单
    const moreCatList = () => {
      allCatListshow.value = !allCatListshow.value;
    };

    //选择歌单回调
    const confirmCheckCat = ({ name }: any) => {
      const isNavCat: any = catlist.value.find(
        (item: any) => item.label === name
      );
      if (isNavCat) {
        catType.value = isNavCat.value;
      } else {
        router.push({ name: "SongListCat", params: { cat: name } });
      }
    };
    init();
    return {
      catlist,
      catType,
      allCatListshow,
      moreCatList,
      confirmCheckCat,
      songList,
      loadingState,
      pullDown,
      pullUp,
      songListRef,
      changeType,
      getSongDetaile,
    };
  },
});
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 30px;
  display: flex;
  overflow: hidden;
  .more {
    .iconfont {
      color: #999;
    }
  }
}
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
