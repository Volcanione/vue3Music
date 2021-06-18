<template>
  <LayerPage class="my" :loading="loadingState" @pullDown="pullDown">
    <template #pullDown="{ state }">
      <PullDownSlot :state="state" white />
    </template>
    <template #header>
      <Nav class="nav" :bgImgStyle="bgImgStyle">
        我的
        <template #right>
          <i class="iconfont" @click="logOut">&#xe63a;</i>
        </template>
      </Nav>
    </template>
    <template #content>
      <div class="infoBox">
        <div class="avatar">
          <img
            v-layz="
              userInfo?.avatarUrl ? `${userInfo?.avatarUrl}?param=100y100` : ''
            "
          />
        </div>
        <div class="infoText">
          <span class="nickname">{{ userInfo.nickname }}</span>
        </div>
      </div>
      <div class="content">
        <div class="songlist">
          <div class="title">
            <span>我创建的歌单</span>
            <span>{{ createList.length }}</span>
          </div>
          <Item
            :data="createList"
            :type="1000"
            v-if="createList.length"
            @confirm="getSongDetaile"
          />
        </div>
        <div class="songlist">
          <div class="title">
            <span>喜欢的歌单</span>
            <span>{{ likeList.length }}</span>
          </div>
          <Item
            :data="likeList"
            :type="1000"
            v-if="likeList.length"
            @confirm="getSongDetaile"
          />
        </div>
      </div>
    </template>
    <template #fixed>
      <div class="top" :style="topStyle">
        <div :style="imgStyle">
          <img
            :src="
              userInfo?.backgroundUrl
                ? `${userInfo?.backgroundUrl}?param=300y300`
                : ''
            "
          />
        </div>
      </div>
    </template>
  </LayerPage>
</template>
<script lang="ts">
import Item from "@/views/search/components/Item/item.vue";
import { defineComponent, reactive, ref, nextTick } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import user from "@/api/user";
import { songlistDetailSetup } from "@/views/songList/setup";
import { $msg } from "@/components/Msg/index";
import { removeCookie } from "@/utils";
export default defineComponent({
  components: { Item },
  name: "my",
  setup() {
    const store = useStore();
    const router = useRouter();
    const userInfo = reactive(store.getters.userInfo);
    const loadingState = ref(false);
    const { topStyle, imgStyle, bgImgStyle } = songlistDetailSetup();
    const playListParam = reactive({
      uid: store.getters.userInfo.userId,
      limit: 30,
      offset: 0,
    });

    const createList = ref([]);
    const likeList = ref([]);

    const getUserInfo = async () => {
      if (userInfo.userId) {
        return;
      }
      const { code, profile } = await user.getUserInfo();
      if (code !== 200) {
        return;
      }
      store.commit("user/setUserInfo", profile);
      playListParam.uid = profile.userId;
    };

    const getUserPlaylist = async () => {
      const { code, playlist } = await user.getUserPlaylist(playListParam);
      if (code !== 200) {
        return;
      }
      createList.value = playlist.filter((item: any) => {
        return item.creator.userId === userInfo.userId;
      });
      likeList.value = playlist.filter((item: any) => {
        return item.creator.userId !== userInfo.userId;
      });
      await nextTick();
    };

    //歌单详细
    const getSongDetaile = (item: any) => {
      router.push({
        name: "SongListDetail",
        params: {
          cat: "my",
          id: item.id,
        },
        query: {
          name: item.name,
        },
      });
    };

    const pullDown = async (done: () => void) => {
      await init();
      done();
    };

    //登出

    const logOut = async () => {
      //存在bug  登出后用户token等store信息未清空bug
      try {
        await store.dispatch("user/logOut");
        removeCookie("userId");
        removeCookie("cookie");
        $msg({ title: "当前账号已退出" });
        router.replace({
          path: "/recom",
        });
      } catch (error) {
        //
      }
    };

    const init = async () => {
      loadingState.value = false;
      await getUserInfo();
      await getUserPlaylist();
      loadingState.value = true;
    };

    init();
    return {
      userInfo,
      topStyle,
      imgStyle,
      pullDown,
      bgImgStyle,
      createList,
      likeList,
      getSongDetaile,
      loadingState,
      logOut,
    };
  },
});
</script>

<style lang="scss" scoped>
@import "~@/style/layout.scss";
.my {
  :deep(.viewContent) {
    background: transparent;
  }
  .nav {
    position: fixed;
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
      content: "";
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
    .songlist {
      overflow: hidden;
      margin-bottom: 10px;
      .title {
        display: flex;
        align-items: center;
        height: 40px;
        justify-content: space-between;
        padding: 0 10px;
      }
    }
  }
}
</style>
