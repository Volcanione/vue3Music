<template>
  <Drawer v-model="show" direction="bottom" size="80%">
    <div class="commentContent">
      <div class="header"><span>歌曲评论</span>
        <TabBar class="TabBar" v-model="active" :list="typeList" @change="getData" />
      </div>
      <ScrollPage class="ScrollPage" ref="ScrollPageRef">
        <CommentItem v-for="item in commentList" :key="item.id" :data="item"/>
      </ScrollPage>
    </div>
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
} from 'vue'
import api from '@/api/index'
import { useStore } from 'vuex'
import CommentItem from './item.vue'
export default defineComponent({
  components:{CommentItem},
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  emits: ['update:visible'],
  setup(props, { emit }) {
    const store = useStore()
    const playerNow = toRef(store.getters, 'player/nowPlay')
    const typeList = [
      { label: '最热', value: 0 },
      { label: '推荐', value: 1 },
    ]
    const param = reactive({
      id: '',
      before: '',
      limit: 30,
      offset: 0,
      type: 0,
    })

    const count = ref(0)

    const active = ref(0)

    const commentList = ref([])

    const ScrollPageRef = ref(null) as any

    const show = computed({
      get() {
        return props.visible
      },
      set(val) {
        emit('update:visible', val)
      },
    })

    const getData = async () => {
      const Api = !active.value ? api.getMusicCommentHot : api.getMusicComment
      if (!param.id) {
        return (commentList.value = [])
      }
      const { code, hotComments, comments, total } = await Api(param)
      commentList.value = code === 200 ? comments || hotComments : []
      count.value = total
      await nextTick()
      refresh()
    }

    //更新组件
    const refresh = async () => {
      ScrollPageRef.value?.refresh()
    }

    watch(
      () => props.visible,
      (val) => {
        if (!val) {
          return
        }
        getData()
      },
      { deep: true }
    )

    watch(
      () => playerNow.value,
      (data) => {
        param.id = data?.id
      },
      { deep: true }
    )

    return {
      show,
      typeList,
      active,
      getData,
      commentList,
      ScrollPageRef,
    }
  },
})
</script>
<style lang="scss" scoped>
.commentContent {
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 40px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    font-size: 14px;
    justify-content: space-between;
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
</style>