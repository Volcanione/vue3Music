<template>
  <transition name="fade" @after-enter="afterEnter">
    <div class="SearchTip" v-if="visible" v-loading="loadingState">
      <ScrollPage ref="ScrollPage">
        <div
          class="item"
          v-for="item in searchSuggestList"
          :key="item.keyword"
          @click="handlerClick(item)"
        >
          {{ item.keyword }}
        </div>
        <div v-if="!searchSuggestList.length && loadingState" class="nodate">
          {{ `'${keyword}'没有匹配内容` }}
        </div>
      </ScrollPage>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, PropType, watch, ref, nextTick } from "vue";
import api from "@/api/index";
export default defineComponent({
  name: "searchTip",
  props: {
    keyword: {
      type: String as PropType<string>,
      default: "",
    },
  },
  setup(props, { emit }) {
    const searchSuggestList = ref([]);
    const loadingState = ref(false);
    const visible = ref(false);
    const ScrollPage = ref(null) as any;

    //搜索建议接口
    const searchSuggest = async () => {
      loadingState.value = false;
      const { code, result } = await api.searchSuggest({
        type: "mobile",
        keywords: props.keyword as string,
      });
      searchSuggestList.value = code === 200 ? result?.allMatch || [] : [];
      loadingState.value = true;
      nextTick(() => {
        ScrollPage?.value?.refresh();
      })
    }

    //点击单行
    const handlerClick = (item: any) => {
      emit("comfirm", item);
      close();
    }

    const close = () => {
      nextTick(() => {
        visible.value = false;
      })
    }

    watch(
      () => props.keyword,
      (val) => {
        visible.value = !!val;
      }
    );

    const afterEnter = () => {
      searchSuggest();
      watch(
        () => props.keyword,
        (val) => {
          if (!val) {
            return;
          }
          searchSuggest();
        }
      );
    }

    return {
      afterEnter,
      searchSuggestList,
      loadingState,
      ScrollPage,
      handlerClick,
      visible,
      close,
    };
  },
});
</script>
<style lang="scss" scoped>
@import "~@/style/layout.scss";
.SearchTip {
  height: calc(100% - 44px);
  width: 100%;
  position: absolute !important;
  background: #{$appBackColor};
  top: 44px;
  left: 0;
  z-index: 9;
  .nodate {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    color: #999;
  }
  .item {
    height: 30px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    font-size: 12px;
    cursor: pointer;
  }
}
</style>
