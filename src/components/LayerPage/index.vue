<template>
  <div class="layePage">
    <div class="header" v-if="$slots.header">
      <slot name="header" />
    </div>
    <div class="content" v-loading="loading">
      <ScrollPage @refresh="pullDownrefresh" :pull-down="pullDown" @loading="pullUploading" :pull-Up="pullUp" ref="ScrollPage" :forcedUpdates="forcedUpdates">
        <template #pullDown="{ state }">
          <PullDownSlot :state="state" />
        </template>
        <div class="viewContent">
          <slot name="content" />
        </div>
        <template #pullUp="{ state }">
          <PullUpSlot :state="state">
            <span class="tip">到底了，请继续</span>
          </PullUpSlot>
        </template>
      </ScrollPage>
    </div>
    <slot name="fixed" />
  </div>
</template>
<script lang="ts">
import ScrollPage from '@/components/ScrollPage/index.vue'
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  components: { ScrollPage },
  props: {
    loading: {
      type: Boolean as PropType<boolean>,
      default: true,
    },
    forcedUpdates: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
  },
  computed: {
    pullDown(): boolean {
      return !!this.$attrs.onPullDown
    },
    pullUp(): boolean {
      return !!this.$attrs.onPullUp
    },
  },

  methods: {
    handlerPush() {
      this.$router.push('/test')
    },
    refresh() {
      const ScrollPage = this.$refs.ScrollPage as any
      this.$nextTick(() => {
        ScrollPage?.refresh()
      })
    },
    scrollTo() {
      const ScrollPage = this.$refs.ScrollPage as any
      this.$nextTick(() => {
        ScrollPage?.scrollTo()
      })
    },
    //下拉
    async pullDownrefresh(done: () => void) {
      this.$emit('pullDown', done)
    },
    //上拉
    async pullUploading(done: () => void) {
      this.$emit('pullUp', done)
    },
  },
})
</script>

<style lang="scss" scoped>
.layePage {
  display: flex;
  flex-direction: column;
  .content {
    flex: 1;
    overflow: hidden;
    position: relative;
  }
}
.tip {
  color: #999;
}
</style>
