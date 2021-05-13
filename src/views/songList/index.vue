<template>
  <LayerPage ref="LayerPage" forcedUpdates>
    <template #header>
      <Nav>
        推荐歌单
      </Nav>
      <div class="tabbar">
        <div class="tabbarContent">
          <TabBar v-model="catType" :list="catlist" v-if="catlist.length" />
        </div>
        <span class="more" @click="moreCatList"><i class="iconfont">&#xe623;</i></span>
      </div>
    </template>
    <template #content>
      推荐歌单
    </template>
    <template #fixed>
      <AllCatList v-model="allCatListshow" />
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, ref } from 'vue'
import { TabBar } from '@/components/Tab/index'
import api from '@/api'
import AllCatList from './components/allCatList.vue'
export default defineComponent({
  components: { TabBar, AllCatList },
  name: 'songList',
  created() {
    this.init()
  },
  setup() {
    const catlist = ref([]) //歌单分类
    const catType = ref(1) //当前歌单分类
    const allCatListshow = ref(false) //全部分类弹窗

    const init = () => {
      //初始化
      getSongListCatList()
    }
    //请求歌单分类数据
    const getSongListCatList = async () => {
      const { code, tags } = await api.getSongListCatListHOT()
      catlist.value =
        code === 200
          ? tags.map((item: any): any => {
              return {
                label: item.name,
                value: item.id,
              }
            })
          : []
      catType.value = tags[0]?.id
    }

    //更多歌单
    const moreCatList = () => {
      allCatListshow.value = true
    }

    return {
      catlist,
      catType,
      init,
      allCatListshow,
      moreCatList,
    }
  },
})
</script>

<style lang="scss" scoped>
.tabbar {
  width: 100%;
  height: 30px;
  display: flex;
  overflow: hidden;
  .tabbarContent {
    flex: 1;
    overflow: hidden;
  }
  .more {
    width: 30px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    .iconfont {
      color: #999;
    }
  }
}
</style>
