<template>
  <div class="item">
    <div class="avatar">
      <img v-layz="data.user.avatarUrl + '?param=100y100'" alt="">
    </div>
    <div class="content">
      <div class="userInfo">
        <p class="name">
          <span>{{data.user.nickname}}</span>
          <span class="zan"><i class="iconfont">&#xe78a;</i>{{data.likedCount}}</span>
        </p>
        <p class="time">{{showtime}}</p>
      </div>
      <div class="text">{{data.content}}</div>
    </div>
  </div>
</template>

  
<script lang="ts">
import { defineComponent, PropType, watch, ref } from 'vue'
import dayjs from 'dayjs'
export default defineComponent({
  props: {
    data: {
      type: Object as PropType<any>,
      default: null,
    },
  },
  setup(props) {
    const { data }: any = props
    const showtime = dayjs(data.time).format('YYYY-MM-DD HH:mm:ss')

    return { showtime }
  },
})
</script>
<style lang="scss" scoped>
.item {
  padding: 10px;
  display: flex;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .content {
    position: relative;
    flex: 1;
    padding-left: 10px;
    display: flex;
    flex-direction: column; 
    &::after{
        position: absolute;
        content: '';
        width: 100%;
        height: 1px;
        background: #f0f0f0;
        bottom: -10px;
    }
    .userInfo {
      height: 40px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      p {
        margin: 0;
      }
      .name {
        font-size: 14px;
        color: #333;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .zan {
          font-size: 12px;
          color: #cecece;
          .iconfont {
            margin-right: 2px;
          }
        }
      }
      .time {
        font-size: 12px;
        color: #cecece;
      }
    }
    .text {
      font-size: 14px;
      margin-top: 5px;
      line-height: 22px;
    }
  }
}
</style>