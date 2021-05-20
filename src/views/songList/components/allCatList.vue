<template>
  <transition name="fade" >
    <div class="songListCat" v-if="modelValue" v-loading="loadingState">
      <ScrollPage ref="ScrollPage">
        <div class="cat" v-for="cat in catList" :key="cat.cat">
          <div class="name">{{cat.cat}}</div>
          <div class="catContent">
            <span class="item" v-for="item in cat.list" :key="item.name" @click="checkCat(item)">{{item.name}}</span>
          </div>
        </div>
      </ScrollPage>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, PropType, watch, ref } from 'vue'
import api from '@/api/index'
export default defineComponent({
  emits: ['confirm', 'update:modelValue'],
  name: 'searchTip',
  props: {
    modelValue: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  setup(props, { emit }) {
    const loadingState = ref(false)
    const ScrollPage = ref(null) as any
    const catList = ref([]) as any

    watch(
      () => props.modelValue,
      (val) => {
        val && init()
      }
    )

    //初始化
    const init = () => {
      getSongListCatList()
    }

    //全部分类接口
    const getSongListCatList = async () => {
      loadingState.value = false
      const { code, categories, sub } = await api.getSongListCatList()
      loadingState.value = true
      if (code !== 200) {
        return
      }
      catList.value = Object.keys(categories).map((idx: string | number) => {
        return {
          cat: categories[idx],
          list: sub.filter((i: any) => i.category === +idx),
        }
      })

      ScrollPage?.value?.refresh()
    }


    //点击分类
    const checkCat = (item: any) => {
      emit('confirm', item)
      close()
    }
    //关闭窗口
    const close = () => {
      emit('update:modelValue', false)
    }

    return {
      loadingState,
      ScrollPage,
      catList,
      checkCat,
    }
  },
})
</script>
<style lang="scss" scoped>
@import '~@/style/layout.scss';
.songListCat {
  height: calc(100% - 44px);
  width: 100%;
  position: absolute !important;
  background: #{$appBackColor};
  top: 44px;
  left: 0;
  z-index: 9;
  .cat {
    margin-bottom: 10px;
    overflow: hidden;
    &:first-child {
      margin-top: 10px;
    }
    .name {
      color: #999;
      padding: 0 10px;
      margin-bottom: 10px;
    }
    .catContent {
      display: flex;
      flex-wrap: wrap;
      margin: 0 5px;
      margin-bottom: 10px;
      .item {
        flex-shrink: 0;
        margin: 5px;
        padding: 5px 8px;
        background: #ddd;
        border-radius: 15px;
        color: #333;
      }
    }
  }
}
</style>
