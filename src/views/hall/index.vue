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
      <Slide :data="bannerList" v-loading="bannerList.length" />
      <div class="meunList">
        <div class="item">
          <span class="icon">
            <img src="@/style/icons/animal/wolf.svg" alt="" />
          </span>
          <span class="title">每日推荐</span>
        </div>
        <div class="item">
          <span class="icon">
            <img src="@/style/icons/animal/dargon.svg" alt="" />
          </span>
          <span class="title">私人FM</span>
        </div>
        <div class="item">
          <span class="icon">
            <img src="@/style/icons/animal/tiger.svg" alt="" />
          </span>
          <span class="title">榜单</span>
        </div>
        <div class="item" @click="gotoSinger">
          <span class="icon">
            <img src="@/style/icons/animal/lion.svg" alt="" />
          </span>
          <span class="title">歌手</span>
        </div>
      </div>
      <ScrollBox
        title="最新专辑"
        direction="x"
        height="160px"
        :update="albumList.length"
      >
        <template #rightBtn>
          <span>更多</span>
        </template>
        <template #content>
          <div class="albumList" v-for="item in albumList" :key="item.id">
            <SongItem :key="item.id" :data="item" @click="clickAlbum(item)" />
          </div>
        </template>
      </ScrollBox>
    </div>
  </ScrollPage>
</template>
<script lang="ts">
import Slide from "@/components/Slide/index.vue"
import SongItem from "@/views/recom/components/Item/SongItem.vue"
import { defineComponent } from "vue"
import { hallSetup } from "./setup"
export default defineComponent({
  name: "Hall",
  components: { Slide, SongItem },
  setup() {
    return hallSetup()
  },
})
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
  .meunList {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    .item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      .icon {
        width: 40px;
        height: 40px;
        margin-bottom: 15px;
        img {
          width: 100%;
          height: 100%;
          display: block;
        }
      }
      .title {
        font-size: 12px;
      }
    }
  }
  .albumList {
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
}
</style>
