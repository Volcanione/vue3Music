<template>
  <ScrollPage
    ref="ScrollPage"
    :pull-down="true"
    @refresh="pullDownrefresh"
    @loading="pullUploading"
    :pull-Up="true"
  >
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" />
    </template>
    <div class="viewContent">
      <Slide :data="BannerList" v-loading="BannerList.length" />
      <ScrollBox
        title="推荐歌单"
        direction="x"
        height="160px"
        :update="SongList.length"
      >
        <template #rightBtn>
          <span @click="moreSongList">更多</span>
        </template>
        <template #content>
          <div class="songlist" v-for="item in SongList" :key="item.id">
            <SongItem :key="item.id" :data="item" @click="handlerClick(item)" />
          </div>
        </template>
      </ScrollBox>
      <ScrollBox title="推荐新曲" height="240px" :update="MusicList.length">
        <template #content>
          <SlideWapper
            height="240px"
            width="calc(100vw - 20px)"
            :data="MusicList"
            v-loading="MusicList.length"
          >
            <MusicItem :data="MusicList" @confirm="checkMusicItem" />
          </SlideWapper>
        </template>
      </ScrollBox>
      <ScrollBox
        title="推荐电台"
        direction="x"
        height="170px"
        :update="RadioList.length"
      >
        <template #content>
          <div class="RadioList" v-for="item in RadioList" :key="item.id">
            <MvItem :data="item" :key="item.id" />
          </div>
        </template>
      </ScrollBox>
      <transition name="fade">
        <div v-if="PrivateState">
          <ScrollBox
            title="私人推荐"
            height="240px"
            :update="PrivateMusicList.length"
          >
            <template #rightBtn>
              <span>更多</span>
            </template>
            <template #content>
              <SlideWapper
                height="240px"
                width="calc(100vw - 20px)"
                :data="PrivateMusicList"
                v-loading="loadingState"
              >
                <MusicItem :data="PrivateMusicList" @confirm="checkMusicItem" />
              </SlideWapper>
            </template>
          </ScrollBox>
          <ScrollBox
            title="私人歌单"
            direction="x"
            height="170px"
            :update="PrivateSongList.length"
          >
            <template #content>
              <div
                class="RadioList"
                v-for="item in PrivateSongList"
                :key="item.id"
              >
                <MvItem
                  :data="item"
                  :key="item.id"
                  @click="handlerClick(item)"
                />
              </div>
            </template>
          </ScrollBox>
        </div>
      </transition>
    </div>
    <template #pullUp="{ state }">
      <PullUpSlot :state="state">
        <span class="tip">到底了</span>
      </PullUpSlot>
    </template>
  </ScrollPage>
</template>
<script lang="ts">
import Slide from "@/components/Slide/index.vue"
import SongItem from "./components/Item/SongItem.vue"
import MusicItem from "./components/Item/MusicItem.vue"
import MvItem from "./components/Item/MvItem.vue"
import { defineComponent, nextTick, ref } from "vue"
import { useRouter, onBeforeRouteLeave } from "vue-router"
import { $msg } from "@/components/Msg/index"
import { getPublicDate, getPrivateDate } from "./steup"
import { musicSetup } from "@/layout/components/Player/setup"
export default defineComponent({
  name: "Recom",
  components: {
    Slide,
    SongItem,
    MusicItem,
    MvItem,
  },
  setup() {
    //初始化路由
    const router = useRouter()
    const PUBLIC = getPublicDate()
    const PRIVATE = getPrivateDate()

    const PrivateState = ref(false)
    const loadingState = ref(false)

    // const PrivateSongList = ref([])
    // const PrivateState = ref(false)
    const { setPlayerNow } = musicSetup()
    const init = async () => {
      Object.values(PUBLIC).forEach((val) => {
        if (val instanceof Function) {
          val()
        }
      })
    };

    //点击歌单
    const handlerClick = (data: any) => {
      router.push({
        name: "SongListDetail",
        params: {
          cat: "推荐歌单",
          id: data.id,
        },
        query: {
          name: data.name,
        },
      })
    };
    //点击歌单更多
    const moreSongList = () => {
      router.push({
        path: "/songList",
        query: { type: 0 },
      })
    };

    //下拉
    const pullDownrefresh = async (done: (state?: boolean) => void) => {
      try {
        const obj = { ...PUBLIC }
        if (PrivateState.value) {
          Object.assign(obj, { ...PRIVATE })
        }
        await Promise.all(
          Object.values(obj)
            .filter((val) => val instanceof Function)
            .map((fn: any) => fn())
        )
        await done(true)
        $msg({ title: "更新成功" })
      } catch (error) {
        await done(false)
      }
    }

    //上拉

    const pullUploading = async (done: (state?: number) => void) => {
      if (PrivateState.value) {
        await done(2)
        $msg({ title: "没有内容了" })
        return;
      }
      try {
        await Promise.all(
          Object.values({ ...PRIVATE })
            .filter((val) => val instanceof Function)
            .map((fn: any) => fn())
        )
        await done(1)
        PrivateState.value = true
        nextTick(() => {
          loadingState.value = true
        });
      } catch (error) {
        console.log(error)
        await done(0)
      }
      // PrivateState.value = true
    }

    //点击最新歌曲
    const checkMusicItem = (data: any) => {
      setPlayerNow(data)
    };

    onBeforeRouteLeave((to) => {
      if (to.name === "SongListDetail") {
        to.meta.parent = null
      }
    })

    init()

    return {
      ...PUBLIC,
      ...PRIVATE,
      handlerClick,
      pullDownrefresh,
      pullUploading,
      PrivateState,
      loadingState,
      checkMusicItem,
      moreSongList,
    }
  },
  methods: {},
})
</script>
<style lang="scss" scoped>
.viewContent {
  .songlist,
  .RadioList {
    width: 110px;
    height: 160px;
    margin: 0 5px;
    flex-shrink: 0;
    &:first-child {
      margin-left: 10px;
    }
    &:last-child {
      margin-right: 10px;
    }
  }
  .RadioList {
    height: 170px;
  }
}
.tip {
  color: #999;
}
</style>
