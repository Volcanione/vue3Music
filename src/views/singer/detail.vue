<template>
  <LayerPage class="singerDetail" @pullDown="pullDown">
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" white />
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
      <div class="content">
        <Thumbtack :offset="44">
          <div class="typeTab" style="height:40px;">
            <TabBar v-model="catType" :list="catlist" class="TabBar" />
          </div>
        </Thumbtack>
        <div style="height:1200px">111</div>
      </div>
    </template>
    <template #fixed>
      <div class="top" :style="topStyle">
        <img :src="`${info.bgCover}?param=300y300`" :style="imgStyle">
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/api/index'
import { songlistDetailSetup } from '@/views/songList/setup'
import Thumbtack from '@/components/Thumbtack/index.vue'
export default defineComponent({
  components: { Thumbtack },
  setup() {
    const route = useRoute()
    const name = route.params.name
    const info = reactive({})
    const catlist: any[] = [
      {
        label: '主页',
        value: '0',
      },
      {
        label: '热门歌曲',
        value: '1',
      },
      {
        label: '单曲',
        value: '2',
      },
      {
        label: '专辑',
        value: '3',
      },
      {
        label: 'MV',
        value: '4',
      },
      {
        label: '相似歌手',
        value: '7',
      },
    ]

    const catType = ref('0')

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
      console.log(data)
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
      catlist,
      catType,
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
    position: relative;
    .typeTab {
      width: 100%;
    }
  }
}
.TabBar {
  background: #{$appBackColor};
}
</style>