<template></template>
<script lang="tsx">
import { computed, defineComponent, PropType } from "vue";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);
export default defineComponent({
  emits: ["confirm"],
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
  setup(props: any, { emit }) {
    const data = computed(() => props.data) as any;
    const type = computed(() => props.type) as any;
    const SongItem = (item: any) => {
      return (
        <div
          class="song"
          key={item.id}
          onClick={() => {
            emit("confirm", item);
          }}
        >
          <div class="left">
            <span class="name ellipsis">{item.name}</span>
            <span class="art">{item.album.name}</span>
          </div>
          <span class="time">
            {dayjs.duration(item.duration).format("mm:ss")}
          </span>
        </div>
      );
    };

    const AlbumItem = (item: any) => {
      return (
        <div
          class="album"
          key={item.id}
          onClick={() => {
            emit("confirm", item);
          }}
        >
          <div class="imgBox">
            <img v-layz={item.blurPicUrl + "?param=100y100"} />
          </div>
          <div class="right">
            <span class="name ellipsis">{item.name}</span>
            <span class="art">{item.artist.name}</span>
          </div>
        </div>
      );
    };

    const artsItem = (item: any, idx: number) => {
      return (
        <div
          class="arts"
          key={item.id}
          onClick={() => {
            emit("confirm", item);
          }}
        >
          <div class="ImgBox">
            <img v-layz={item.img1v1Url + "?param=100y100"} />
          </div>
          <div class="right">
            <span class="ellipsis">{item.name}</span>
            <span class="albums">{item.albumSize}张专辑</span>
          </div>
        </div>
      );
    };

    const songList = (item: any) => {
      return (
        <div
          class="songList"
          key={item.id}
          onClick={() => {
            emit("confirm", item);
          }}
        >
          <div class="ImgBox">
            <img v-layz={item.coverImgUrl + "?param=100y100"} />
          </div>
          <div class="right">
            <span class="name ellipsis">{item.name}</span>
            <span class="count">{item.bookCount || item.trackCount}首</span>
          </div>
        </div>
      );
    };

    const MVlist = (item: any) => {
      return (
        <div
          class="Mv"
          key={item.id}
          onClick={() => {
            emit("confirm", item);
          }}
        >
          <div class="ImgBox">
            <img v-layz={item.cover + "?param=100y100"} />
          </div>
          <div class="right">
            <span class="name ellipsis">{item.name}</span>
            <div class="info">
              <span>{item.artistName}</span>
              <span>{dayjs.duration(item.duration).format("mm:ss")}</span>{" "}
            </div>
          </div>
        </div>
      );
    };

    const radio = (item: any) => {
      return (
        <div
          class="radio"
          key={item.id}
          onClick={() => {
            emit("confirm", item);
          }}
        >
          <div class="ImgBox">
            <img v-layz={item.picUrl + "?param=100y100"} />
          </div>
          <div class="right">
            <span>{item.name}</span>
            <span class="time">
              {dayjs(item.createTime).format("YYYY-MM-DD")}
            </span>
          </div>
        </div>
      );
    };

    return () => {
      switch (type.value) {
        case 1:
          return data.value.map((item: any) => {
            return SongItem(item);
          });
        case 10:
          return data.value.map((item: any) => {
            return AlbumItem(item);
          });
        case 100:
          return data.value.map((item: any, idx: number) => {
            return artsItem(item, idx);
          });
        case 1000:
          return data.value.map((item: any) => {
            return songList(item);
          });
        case 1004:
          return data.value.map((item: any) => {
            return MVlist(item);
          });
        case 1009:
          return data.value.map((item: any) => {
            return radio(item);
          });
        default:
          return <span>1</span>;
      }
    };
  },
});
</script>
<style lang="scss" scoped>
.right {
  flex: 1;
  padding-left: 10px;
  display: flex;
}
.song {
  height: 40px;
  margin: 0 10px 10px;
  &:first-child {
    margin-top: 10px;
  }
  display: flex;
  justify-content: space-between;
  .left {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
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
  margin: 0 10px 10px;
  &:first-child {
    margin-top: 10px;
  }
  display: flex;
  .imgBox {
    height: 100%;
    width: 50px;
    border-radius: 8px;
    overflow: hidden;
  }
  .right {
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .art {
      color: #999;
      font-size: 12px;
    }
  }
}
.arts {
  height: 50px;
  margin: 0 10px 10px;
  &:first-child {
    margin-top: 10px;
  }
  display: flex;
  .ImgBox {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
  }
  .right {
    align-items: center;
    overflow: hidden;
    .albums {
      font-size: 12px;
      color: #999;
      margin-left: 10px;
    }
  }
}
.songList {
  height: 50px;
  margin: 0 10px 10px;
  &:first-child {
    margin-top: 10px;
  }
  display: flex;
  .ImgBox {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
  }
  .right {
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .count {
      font-size: 12px;
      color: #999;
    }
  }
}
.Mv {
  height: 50px;
  margin: 0 10px 10px;
  &:first-child {
    margin-top: 10px;
  }
  display: flex;
  .ImgBox {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
  }
  .right {
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .info {
      display: flex;
      justify-content: space-between;
      span {
        font-size: 12px;
        color: #999;
      }
    }
  }
}
.radio {
  height: 50px;
  margin: 0 10px 10px;
  &:first-child {
    margin-top: 10px;
  }
  display: flex;
  .ImgBox {
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;
  }
  .right {
    flex-direction: column;
    justify-content: space-around;
    overflow: hidden;
    .time {
      font-size: 12px;
      color: #999;
    }
  }
}
.ImgBox {
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
