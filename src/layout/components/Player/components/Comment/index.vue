<template>
  <div class="commentContent">
    <Nav class="nav" :back="() => (show = false)">
      歌曲评论
      <template #right>
        <TabBar
          class="TabBar"
          v-model="active"
          :list="typeList"
          @change="changeType"
        />
      </template>
    </Nav>
    <ScrollPage
      v-if="count"
      class="ScrollPage"
      ref="ScrollPageRef"
      v-loading="loadingState"
      :pull-down="true"
      @refresh="pullDownrefresh"
      @loading="pullUploading"
      :pull-Up="true"
    >
      <template #pullDown="{ state }">
        <PullDownSlot :state="state" />
      </template>
      <CommentItem
        v-for="item in commentList"
        :key="item.id"
        :data="item"
        :type="0"
        :id="playerNow.id"
        foolr
        @getfloor="getFloorData"
      />
      <template #pullUp="{ state }">
        <PullUpSlot :state="state">
          <span class="tip">到底了</span>
        </PullUpSlot>
      </template>
    </ScrollPage>
    <div v-if="!count" class="nodata"><span>没有评论</span></div>
  </div>
  <Drawer
    v-model="foolrShow"
    direction="bottom"
    size="calc(100% - 44px)"
    contentClass="foolrCommit"
  >
    <Floor :data="foolrData" v-model:visible="foolrShow" />
  </Drawer>
</template>
<script lang="ts">
import {
  defineComponent,
  PropType,
  computed,
  watch,
  toRef,
  reactive,
  ref,
  nextTick,
} from "vue";
import api from "@/api/index";
import { useStore } from "vuex";
import CommentItem from "./item.vue";
import { $msg } from "@/components/Msg/index";
import Floor from "./foolr.vue";
export default defineComponent({
  components: { CommentItem, Floor },
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const store = useStore();
    const playerNow = toRef(store.getters, "player/nowPlay");
    const typeList = [
      { label: "最热", value: 0 },
      { label: "推荐", value: 1 },
    ];
    const param = reactive({
      id: playerNow?.value?.id,
      before: "",
      limit: 30,
      offset: 0,
      type: 0,
    });

    const count = ref(1);

    const active = ref(0);

    const commentList = ref([]) as any;

    const ScrollPageRef = ref(null) as any;

    const loadingState = ref(false);

    const show = computed({
      get() {
        return props.visible;
      },
      set(val) {
        emit("update:visible", val);
      },
    });

    const foolrShow = ref(false);
    const foolrData = reactive({});

    const initParam = () => {
      Object.assign(param, {
        limit: 30,
        offset: 0,
      });
    };

    const getData = async (status = false) => {
      loadingState.value = false;
      const Api = !active.value ? api.getMusicCommentHot : api.getMusicComment;
      if (!param.id) {
        loadingState.value = true;
        count.value = 0;
        return (commentList.value = []);
      }
      const { code, hotComments, comments, total } = await Api(param);
      loadingState.value = true;
      if (code !== 200) {
        count.value = 0;
        return (commentList.value = []);
      }

      // commentList.value = code === 200 ? comments || hotComments : []
      count.value = total;
      if (!status) {
        commentList.value = comments || hotComments;
      } else {
        const data = comments || hotComments;
        commentList.value.push(...data);
      }

      refresh();
    };

    //更新组件
    const refresh = async () => {
      await nextTick();
      ScrollPageRef.value?.refresh();
    };

    const changeType = () => {
      param.offset = 0;
      commentList.value = [];
      getData();
    };

    //获取楼层评论
    const getFloorData = (data: any) => {
      foolrShow.value = true;
      Object.assign(foolrData, data);
    };

    //下拉刷新
    const pullDownrefresh = async (done: (state?: boolean) => void) => {
      initParam();
      getData();
      await done();
    };

    //上拉加载
    const pullUploading = async (done: (state?: number) => void) => {
      param.offset++;
      if (count.value <= commentList.value.length) {
        await done(2);
        return $msg({ title: "真的到底了" });
      }

      try {
        getData(true);
        await done(1);
      } catch (error) {
        await done(0);
      }
    };

    watch(
      () => playerNow.value,
      (data) => {
        param.id = data?.id;
      },
      { deep: true }
    );

    const init = () => {
      getData();
    };

    init();

    return {
      show,
      typeList,
      active,
      getData,
      commentList,
      ScrollPageRef,
      loadingState,
      changeType,
      pullDownrefresh,
      pullUploading,
      count,
      playerNow,
      getFloorData,
      foolrShow,
      foolrData,
    };
  },
});
</script>
<style lang="scss" scoped>
.commentContent {
  height: 100%;
  display: flex;
  flex-direction: column;
  .nav {
    background: #fff;
    ::v-deep(.right) {
      width: auto;
    }
    .TabBar {
      width: auto;
      :deep(.line) {
        display: none;
      }
    }
  }
  .ScrollPage {
    flex: 1;
    overflow: hidden;
  }
}
.tip {
  color: #999;
}
.nodata {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  color: #cecece;
  height: 100%;
}
</style>
