<template>
  <LayerPage ref="songDetailRef" :loading="loadingState" @pullDown="pullDown" class="songDetaile">
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" white />
    </template>
    <template #header>
      <Nav class="Nav" :bgImgStyle="bgImgStyle">
        {{name}}
      </Nav>
    </template>
    <template #content>
      <div class="info">
        <div class="imgBox"><img v-if="info?.coverImgUrl"  v-layz="info?.coverImgUrl" alt=""></div>
        <div class="infoBox">
          <span class="name">{{info.name}}</span>
          <span class="subscribe"><i class="iconfont">&#xe870;</i> {{info.subscribedCount}}</span>
          <span class="ellipsis">简介：{{info.description}}</span>
        </div>
      </div>
      <div class="content">
        <div class="toolBar">
          <span class="playAll" @click="playAll"> <i class="iconfont">&#xe65b;</i>播放全部</span>
          <span>{{info.trackCount}}</span>
        </div>
        <Item :data="songList" :type="1" v-if="songList.length" @confirm="checkMusicItem" />
      </div>
    </template>
    <template #fixed>
      <div class="top" :style="topStyle">
        <img :src="`${info.coverImgUrl}?param=300y300`" :style="imgStyle">
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import Item from '@/views/search/components/Item/item.vue'
import { songlistDetailSetup } from './setup'
export default defineComponent({
  components: { Item },
  setup() {
    const data = songlistDetailSetup()
    data.init()
    return data
  },
})
</script>
<style lang="scss" scoped>
@import '~@/style/layout.scss';
.songDetaile {
  :deep(.viewContent) {
    background: transparent;
  }
  .Nav {
    position: fixed;
    z-index: 1;
    background: transparent;
    color: #333;
  }
  .top {
    width: 100%;
    position: absolute;
    top: 0;
    z-index: -1;
    height: 200px;
    &::after {
      position: absolute;
      content: '';
      width: 100%;
      background: rgba(255, 255, 255, 0.3);
      top: -100%;
      bottom: 0;
    }
    img {
      width: 100%;
      height: auto;
      position: absolute;
      display: block;
      top: 50%;
      transform: translateY(-50%);
      -webkit-filter: blur(10px);
      filter: blur(10px);
    }
  }
  .info {
    height: 200px;
    padding: 44px 10px 10px;
    display: flex;
    align-items: center;
    overflow: hidden;
    .imgBox {
      width: 110px;
      height: 110px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 8px;
      overflow: hidden;
      // border: 4px solid rgba(219, 214, 214, 0.1);
      padding: 4px;
      img {
        display: block;
        border-radius: 8px;
      }
    }
    .infoBox {
      flex: 1;
      overflow: hidden;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      color: #fff;
      .name {
        font-size: 18px;
        margin-bottom: 20px;
        line-height: 24px;
      }
      .subscribe {
        margin-bottom: 10px;
      }
    }
  }
  .content {
    position: relative;
    z-index: 1;
    background: #{$appBackColor};
    overflow: hidden;
    min-height: calc(100vh - 200px);
    flex: 1;
    .toolBar {
      height: 40px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        .iconfont {
          margin-right: 10px;
          font-size: 12px !important;
        }
        font-size: 12px !important;
      }
    }
  }
}
</style>