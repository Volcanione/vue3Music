<template></template>
<script lang="tsx">
import { defineComponent, PropType } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
export default defineComponent({
  props: {
    type: {
      type: Number as PropType<number>,
      default: 1,
    },
    data: {
      type: Array as PropType<Array<any>>,
      default() {
        return [];
      },
    },
  },
  setup(props: any) {
    const data = props.data;
    const type = props.type;
    const SongItem = (item: any) => {
      return (
        <div class="song" key={item.id}>
          <div class="left">
            <span class="name">{item.name}</span>
            <span class="art">{item.album.name}</span>
          </div>
          <div class="right">
            <span class="time">
              {dayjs.duration(item.duration).format("mm:ss")}
            </span>
          </div>
        </div>
      );
    };

    const AlbumItem = (item: any) => {
      return (
        <div class="album" key={item.id}>
          <img class="img" v-layz={{ src: item.blurPicUrl }} />
          <div class="right">2</div>
        </div>
      );
    };

    return () => {
      switch (type) {
        case 1:
          return data.map((item: any) => {
            return SongItem(item);
          });
        case 10:
          return data.map((item: any) => {
            return AlbumItem(item);
          });
        default:
          return <span>1</span>;
      }
    };
  },
});
</script>
<style lang="scss" scoped>
.song {
  height: 40px;
  margin: 10px;
  display: flex;
  justify-content: space-between;
  .left {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .art {
      font-size: 12px;
      color: #999;
    }
  }
  .time {
    font-size: 12px;
    color: #999;
  }
}
.album {
  height: 50px;
  margin: 10px;
  display: flex;
  .img {
    height: 100%;
    width: 50px;
    border-radius: 8px;
    overflow: hidden;
    img {
      display: block;
      height: 100%;
    }
  }
}
</style>
