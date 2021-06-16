<template>
  <div class="commentContent">
    <Nav class="nav" :back="() => (show = false)"> 回复（{{ total }}） </Nav>
    <ScrollPage
      v-if="total"
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
        :key="item.commentId"
        :data="item"
      />
      <template #pullUp="{ state }">
        <PullUpSlot :state="state">
          <span class="tip">到底了</span>
        </PullUpSlot>
      </template>
    </ScrollPage>
    <div v-if="!total" class="nodata"><span>没有评论</span></div>
  </div>
</template>

<script lang="ts">
import CommentItem from "./item.vue";
import {
  defineComponent,
  PropType,
  computed,
  watch,
  toRef,
  reactive,
  ref,
  nextTick,
  toRefs,
} from "vue";
import api from "@/api/index";
import { $msg } from "@/components/Msg/index";
export default defineComponent({
  components: { CommentItem },
  props: {
    data: {
      type: Object as PropType<any>,
      default: (): any => {
        return {};
      },
    },
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ["update:visible"],
  setup(props, { emit }) {
    const { data } = toRefs(props);
    const loadingState = ref(true);
    const show = computed({
      get() {
        return props.visible;
      },
      set(val) {
        emit("update:visible", val);
      },
    });
    const param = data.value.param;
    const commentList = ref(data.value.foolr.comments);
    const total = ref(data.value?.foolr?.totalCount);

    const initParam = () => {
      Object.assign(param, {
        limit: 20,
        time: "",
      });
    };

    const getData = async (status = false) => {
      loadingState.value = false;
      const {
        code,
        data: { comments, totalCount },
      } = await api.getCommentfloor(param);
      loadingState.value = true;
      if (code !== 200) {
        total.value = 0;
        commentList.value = [];
        return;
      }
      totalCount && (total.value = totalCount);
      if (!status) {
        commentList.value = comments;
      } else {
        commentList.value.push(...comments);
      }
    };

    const pullDownrefresh = async (done: (state?: boolean) => void) => {
      initParam();
      getData();
      await done();
    };

    const pullUploading = async (done: (state?: number) => void) => {
      const last = commentList.value[commentList.value.length - 1];
      param.time = last?.time;
      if (total.value <= commentList.value.length) {
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

    return {
      show,
      total,
      commentList,
      pullDownrefresh,
      loadingState,
      pullUploading,
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

<style lang="scss">
.foolrCommit {
  border-radius: 10px 10px 0 0;
}
</style>
