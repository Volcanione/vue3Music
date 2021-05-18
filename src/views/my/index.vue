<template>
  <LayerPage class="my" @pullDown="pullDown">
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" white />
    </template>
    <template #header>
      <Nav class="nav" :bgImgStyle="bgImgStyle"> 我的 </Nav>
    </template>
    <template #content>
      <div class="infoBox">
        <div class="avatar">
          <img :src="`${userInfo.avatarUrl}?param=100y100`">
        </div>
      </div>
      <div class="content"></div>
    </template>
    <template #fixed>
      <div class="top" :style="topStyle">
        <img :src="`${userInfo.backgroundUrl}?param=300y300`" :style="imgStyle">
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import { defineComponent, reactive } from 'vue'
import { useStore } from 'vuex'
import user from '@/api/user'
import { songlistDetailSetup } from '@/views/songList/setup'
export default defineComponent({
  name: 'my',
  setup() {
    const store = useStore()
    const userInfo = reactive(store.getters.userInfo)
    const { topStyle, imgStyle, bgImgStyle } = songlistDetailSetup()

    const getUserInfo = async () => {
      console.log(userInfo)
      if (userInfo.userId) {
        return
      }
      const { code, profile } = await user.getUserInfo()
      if (code !== 200) {
        return
      }
      store.commit('user/setUserInfo', profile)
    }

    const pullDown = (done: () => void) => {
      done()
    }

    const init = () => {
      getUserInfo()
    }

    init()
    return {
      userInfo,
      topStyle,
      imgStyle,
      pullDown,
      bgImgStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
@import '~@/style/layout.scss';
.my {
  ::v-deep .viewContent {
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
    img {
      width: 100%;
      height: auto;
      position: absolute;
      display: block;
      top: 50%;
      transform: translateY(-50%);
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
      padding: 2px;
      background: rgba(0,0,0,0.3);
      img {
        width: 100%;
        height: 100%;
         border-radius: 50%;
        display: block;
      }
    }
  }
  .content {
    height: 1000px;
    background: #{$appBackColor};
  }
}
</style>
