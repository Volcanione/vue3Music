<template>
  <Drawer
    v-model="playerShow"
    direction="bottom"
    size="100%"
    @change="changeDrawer"
    :destroyOnclose="false"
    :mask="false"
  >
    <div class="player">
      <div class="header">
        <PlayerHeader
          @switch="switchLRY"
          :active="switchConfig.value"
          @comment="openComment"
        />
      </div>
      <div class="content">
        <PlayContriller :config="switchConfig" />
      </div>
      <div class="playBg">
        <div
          class="filter"
          :style="{
            'background-image': `url('${
              playerNow?.img || bgImg
            }?param=500y500')`,
          }"
        ></div>
      </div>
    </div>
  </Drawer>
  <Drawer v-model="commentShow" direction="bottom" size="100%">
    <Comment v-model:visible="commentShow" />
  </Drawer>
</template>
<script lang="ts">
import { defineComponent, reactive, nextTick, ref } from "vue";
import { playerSetup } from "../Player/setup";
import PlayerHeader from "../Player/components/header.vue";
import PlayContriller from "../Player/components/controller.vue";
import Comment from "./components/Comment/index.vue";
export default defineComponent({
  components: { PlayerHeader, PlayContriller, Comment },
  setup() {
    const switchConfig = reactive({ type: 0, value: 0 });
    const commentShow = ref(false);
    const bgImg = require("@/assets/bg.jpg");
    const switchLRY = ({ type, value }: any) => {
      switchConfig.type = type;
      switchConfig.value = value;
    };

    //评论
    const openComment = () => {
      commentShow.value = !commentShow.value;
    };

    const changeDrawer = async (val: boolean) => {
      if (!val) {
        return;
      }
      await nextTick();
      switchConfig.type = 0;
      switchConfig.value = 0;
    };

    const { playerShow, playerNow } = playerSetup();

    return {
      playerShow,
      switchLRY,
      switchConfig,
      playerNow,
      bgImg,
      openComment,
      commentShow,
      changeDrawer,
    };
  },
});
</script>
<style lang="scss" scoped>
.player {
  position: fixed;
  z-index: 9;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;

  .header {
    height: 50px;
  }
  .content {
    flex: 1;
    position: relative;
    overflow: hidden;
  }
  .playBg {
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    -webkit-filter: blur(30px);
    background: rgba(0, 0, 0, 0.9);
    filter: blur(30px);
    .filter {
      position: absolute;
      width: 100%;
      height: 100%;
      background-position: center;
      background-size: cover;
      opacity: 0.6;
    }
  }
}
</style>
