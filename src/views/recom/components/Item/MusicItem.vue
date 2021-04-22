<template>
  <div v-for="(item, index) in List" :key="index" class="MusicBox">
    <div class="item" v-for="i in item" :key="i.id">
      <img v-layz="i.img" alt="" />
      <div class="info">
        <span class="name ellipsis">{{ i.name }}</span>
        <span class="artists ellipsis">{{ i.artists }}</span>
      </div>
      <div class="btn">{{ setTime(i.duration) }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
import { defineComponent, PropType, watchEffect, ref } from "vue";
export default defineComponent({
  props: {
    data: {
      type: Array as PropType<any[]>,
      default() {
        return [];
      },
    },
  },
  setup(props: any) {
    const List = ref([]);

    watchEffect(() => {
      const Arr: any[] = [];
      props.data.forEach((item: any, index: number) => {
        const idx = index % 3;
        const i = Math.floor(index / 3);
        if (idx === 0) {
          const arr: any[] = [item];
          Arr.push(arr);
        } else {
          Arr[i].push(item);
        }
        List.value = Arr as [];
      });
    });
    return {
      List,
    };
  },
  computed: {
    setTime() {
      return (val: number) => {
        return dayjs.duration(val).format("mm:ss");
      };
    },
  },
});
</script>

<style lang="scss" scoped>
.MusicBox {
  height: 240px;
  padding: 0 10px;
  flex-shrink: 0;
  display: inline-block;
  overflow: hidden;
  .item {
    height: 70px;
    margin-bottom: 10px;
    display: flex;
    img {
      display: block;
      width: 70px;
      height: 70px;
      border-radius: 8px;
      background: #999;
      overflow: hidden;
    }
    .info {
      flex: 1;
      display: flex;
      flex-direction: column;
      margin-left: 10px;
      justify-content: space-around;
      overflow: hidden;
      .name {
        color: #000;
        overflow: hidden;
      }
      .artists {
        font-size: 12px;
        color: #999;
        overflow: hidden;
      }
    }
    .btn {
      width: 30px;
      margin-left: 10px;
      padding: 10px 0;
      font-size: 12px;
      color: #999;
    }
  }
}
</style>
