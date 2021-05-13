<template></template>
<script lang="tsx">
import { defineComponent, PropType } from 'vue'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
dayjs.extend(duration)
export default defineComponent({
  props: {
    type: {
      type: Number as PropType<number>,
      default: 1,
    },
    data: {
      type: Array as PropType<Array<any>>,
      default() {
        return []
      },
    },
  },
  setup(props: any) {
    const data = props.data
    const type = props.type
    const SongItem = (item: any) => {
      return (
        <div class="song" key={item.id}>
          <div class="left">
            <span class="name ellipsis">{item.name}</span>
            <span class="art">{item.album.name}</span>
          </div>
          <span class="time">
            {dayjs.duration(item.duration).format('mm:ss')}
          </span>
        </div>
      )
    }

    const AlbumItem = (item: any) => {
      return (
        <div class="album" key={item.id}>
          <div class="imgBox">
            <img v-layz={item.blurPicUrl} />
          </div>
          <div class="right">
            <span class="name ellipsis">{item.name}</span>
            <span class="art">{item.artist.name}</span>
          </div>
        </div>
      )
    }

    const artsItem = (item: any) => {
      return (
        <div class="arts" key={item.id}>
          <div class="ImgBox">
            <img v-layz={item.img1v1Url} />
          </div>
          <div class="right">
            <span class="ellipsis">{item.name}</span>
            <span class="albums">{item.albumSize}张专辑</span>
          </div>
        </div>
      )
    }

    const songList = (item: any) => {
      return (
        <div class="songList" key={item.id}>
          <div class="ImgBox">
            <img v-layz={item.coverImgUrl} />
          </div>
          <div class="right">
            <span class="name ellipsis">{item.name}</span>
            <span class="count">{item.bookCount}首</span>
          </div>
        </div>
      )
    }

    const MVlist = (item: any) => {
      return (
        <div class="Mv" key={item.id}>
          <div class="ImgBox">
            <img v-layz={item.cover} />
          </div>
          <div class="right">
            <span class="name ellipsis">{item.name}</span>
            <div class="info">
              <span>{item.artistName}</span>
              <span>{dayjs.duration(item.duration).format('mm:ss')}</span>{' '}
            </div>
          </div>
        </div>
      )
    }

    const radio = (item: any) => {
      return (
        <div class="radio" key={item.id}>
          <div class="ImgBox">
            <img v-layz={item.picUrl} />
          </div>
          <div class="right">
            <span>{item.name}</span>
            <span class="time">
              {dayjs(item.createTime).format('YYYY-MM-DD')}
            </span>
          </div>
        </div>
      )
    }

    return () => {
      switch (type) {
        case 1:
          return data.map((item: any) => {
            return SongItem(item)
          })
        case 10:
          return data.map((item: any) => {
            return AlbumItem(item)
          })
        case 100:
          return data.map((item: any) => {
            return artsItem(item)
          })
        case 1000:
          return data.map((item: any) => {
            return songList(item)
          })
        case 1004:
          return data.map((item: any) => {
            return MVlist(item)
          })
        case 1009:
          return data.map((item: any) => {
            return radio(item)
          })
        default:
          return <span>1</span>
      }
    }
  },
})
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
</style>
