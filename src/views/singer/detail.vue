<template>
  <LayerPage class="singerDetail" @pullDown="pullDown">
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" />
    </template>
    <template #header>
      <Nav class="nav" :bgImgStyle="bgImgStyle">
        {{name}}
      </Nav>
    </template>
    <template #content>
      <div class="infoBox">
        <div class="avatar">
          <img v-layz="info?.cover?`${info?.cover}?param=100y100`:''">
        </div>
        <div class="infoText">
          <span class="nickname">{{info.name}}</span>
        </div>
      </div>
      <div class="content"></div>
    </template>
    <template #fixed>
      <div class="top" :style="topStyle">
        <img :src="`${info.bgCover}?param=300y300`" :style="imgStyle">
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/index'
import { songlistDetailSetup } from '@/views/songList/setup'
export default defineComponent({
  setup() {
    const route = useRoute()
    const name = route.params.name
    const info = reactive({})

    const {
      topStyle,
      imgStyle,
      bgImgStyle,
      // refreshScroll,
    } = songlistDetailSetup()

    const getData = async () => {
      const { code, data } = await api.getArtistDetail({ id: +route.params.id })
      if (code !== 200) {
        return
      }
      Object.assign(info, {
        cover: data?.artist?.cover,
        briefDesc: data.artist.briefDesc,
        bgCover: data?.user?.backgroundUrl || data.artist.cover,
        name: data?.artist.name,
      })
    }

    const pullDown = async (done: () => void) => {
      await init()
      done()
    }

    const init = () => {
      getData()
    }

    init()

    return {
      name,
      topStyle,
      info,
      imgStyle,
      bgImgStyle,
      pullDown,
    }
  },
})
</script>  

<style lang="scss" scoped>
@import '~@/style/layout.scss';
.singerDetail {
  :deep(.viewContent) {
    background: transparent;
  }
  .nav {
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
      top: -100vh;
      bottom: 0;
    }
    img {
      width: 100%;
      height: auto;
      position: absolute;
      display: block;
      top: 50%;
      transform: translateY(-50%);
      -webkit-filter: blur(5px);
      filter: blur(5px);
    }
  }
  .infoBox {
    height: 200px;
    padding: 44px 10px 10px;
    display: flex;
    align-items: center;
    overflow: hidden;

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      overflow: hidden;
      background: rgba(0, 0, 0, 0.3);
      img {
        width: 100%;
        height: 100%;
        display: block;
      }
    }
    .infoText {
      flex: 1;
      padding-left: 20px;
      .nickname {
        font-size: 16px;
        color: #fff;
      }
    }
  }
  .content {
    min-height: calc(100vh - 200px);
    background: #{$appBackColor};
    overflow: hidden;
  }
}
</style>