<template>
  <Drawer v-model="show" direction="bottom" size="150px">
    <div class="filterSinger">
      <div class="type">
        <span
          v-for="item in typeList"
          :key="item.value"
          :class="{ active: config.type === item.value }"
          @click="config.type = item.value"
          >{{ item.label }}</span
        >
      </div>
      <div class="language">
        <span
          v-for="item in languageList"
          :key="item.value"
          :class="{ active: config.area === item.value }"
          @click="config.area = item.value"
          >{{ item.label }}</span
        >
      </div>
    </div>
  </Drawer>
</template>
<script lang="ts">
import { defineComponent, PropType, computed, watch } from "vue"
import { TweenMax } from "gsap"
export default defineComponent({
  props: {
    visible: {
      type: Boolean as PropType<boolean>,
      default: false,
    },
    modelValue: {
      type: Object as PropType<any>,
      required: true,
    },
  },
  emits: ["update:modelValue", "update:visible"],
  setup(props, { emit }) {
    const config = computed(() => props.modelValue)
    const show = computed({
      get() {
        return props.visible
      },
      set(val) {
        emit("update:visible", val)
      },
    })

    watch(
      () => config,
      (val) => {
        emit("update:modelValue", val)
      },
      { deep: true }
    )

    const typeList: any[] = [
      {
        label: "全部",
        value: -1,
      },
      {
        label: "男",
        value: 1,
      },
      {
        label: "女",
        value: 2,
      },
      {
        label: "乐团",
        value: 3,
      },
    ]

    const languageList: any[] = [
      {
        label: "全部",
        value: -1,
      },
      {
        label: "华语",
        value: 7,
      },
      {
        label: "欧美",
        value: 96,
      },
      {
        label: "日本",
        value: 8,
      },
      {
        label: "韩国",
        value: 16,
      },
      {
        label: "其他",
        value: 0,
      },
    ]

    const beforeEnter = async (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: "-100%",
        onComplete: done,
      })
    };
    const enter = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: 0,
        onComplete: done,
      })
    };
    const leave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0.4, {
        y: "-100%",
        onComplete: done,
      })
    };
    const afterLeave = (el: HTMLElement, done: any) => {
      TweenMax.to(el, 0, {
        y: "-100%",
        onComplete: done,
      })
    };

    return {
      beforeEnter,
      enter,
      leave,
      afterLeave,
      typeList,
      languageList,
      config,
      show,
    }
  },
})
</script>

<style lang="scss" scoped>
.filterSinger {
  z-index: 1;
  background: #fff;
  padding: 10px;
  overflow: hidden;
  height: 100%;
  .type,
  .language {
    display: flex;
    span {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 15px;
      height: 30px;
      border-radius: 15px;
      background: #f0f0f0;
      color: #999;
      margin-right: 10px;
      margin-bottom: 10px;
      font-size: 12px;
      &.active {
        background: #408e94;
        color: #fff;
      }
    }
  }
  .language {
    flex-wrap: wrap;
    margin-top: 10px;
  }
}
</style>
