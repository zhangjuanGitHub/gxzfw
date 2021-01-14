<template>
  <div class="container">
    <div class="video-box">
      <div class="my-img-list">
        <p class="my-img-title" v-text="mrGroup.groupName"></p>
      </div>
      <div class="video-wrap">
        <video id="video" ref="video"
               :src="mrFile.uploadPath"
               @timeupdate="onTimeupdate"
               @error="getError"
               @loadedmetadata="onLoadedmetadata"
        >
<!--          <source-->
<!--            src="http://192.168.1.163/static-home/video&audio/1d74c0c39be84f39afc085ae48e3ec63/c3f77dafc3a2449d879e400c0630131b.mp4" type="video/mp4"-->
<!--          >-->
        </video>
      </div>
      <div class="slider-box" :style="{width: sliderboxWidth}" v-if="!edidShow">
        <el-slider
          v-model="sliderTime"
          range
          :format-tooltip="formatProcessToolTip" @change="changeCurrentTime"
        >
        </el-slider>
        <div class="img-box">
          <img v-for="(item, index) of imgList" :src="item" :key="index">
          <div class="left-box" :style="{width: leftValue}"></div>
          <div class="right-box" :style="{width: rightValue}"></div>
        </div>
      </div>
      <div class="btn-box" v-if="!edidShow">
        <el-button type="primary" v-if="!confirmEditImg" @click="editImg">截取图片</el-button>
        <el-button type="primary" v-if="confirmEditImg" @click="confirmEdit('img')">确认截取</el-button>
        <el-button type="warning" v-if="!confirmEditVideo" @click="editVideo">剪辑视频</el-button>
        <el-button type="warning" v-if="confirmEditVideo" @click="confirmEdit('video')">确认剪辑</el-button>
      </div>
      <div class="text-center btn-box" v-if="edidShow && !videoError">
        <el-button type="primary" @click="operate">操作视频</el-button>
<!--        <el-button style="width: 98px" @click="back">返回</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
import { realFormatSecond } from '@/libs/tools'
export default {
  name: 'PlayVideo',
  data () {
    return {
      videoError: false, // 视频错误
      sliderboxWidth: '',
      confirmEditImg: false, // 确认截取图片
      confirmEditVideo: false, // 确认剪辑视频
      edidShow: true, // 剪辑视频box
      video: {
        currentTime: 0, // 当前时间
        maxTime: 0, // 视频时长
        playing: false // 是否播放
      },
      sliderTime: null, // 滑块绑定值 0-100
      leftValue: '', // 蒙层左
      rightValue: '', // 蒙层右
      routeId: '', // 视频id
      mrFile: '', // 视频对象
      mrGroup: {}, // 类别
      imgList: [] // 缩略图列表
    }
  },
  methods: {
    getError () {
      this.videoError = true
      this.$message.error('视频加载失败！')
    },
    back () {
      if (this.mrGroup.isPublic === 1) {
        this.$router.replace({ name: 'Assessment' })
      } else {
        this.$router.replace({ name: 'Personal' })
      }
    },
    // 确认截取
    confirmEdit (item) {
      // ssTime 一个值是图片截取，有toTime 是视频截取
      let row = {
        fileId: this.routeId,
        ssTime: realFormatSecond(this.video.maxTime / 100 * this.sliderTime[0] || 1),
        toTime: item === 'video' ? realFormatSecond(this.video.maxTime / 100 * this.sliderTime[1]) : ''
      }
      this.$http.get(this.$api.updateNewFile, { params: row })
        .then(res => {
          if (res.data.code === 200) {
            if (item === 'img') {
              this.$message.success('图片截取成功！')
              this.$router.replace({ name: 'personImage' })
            } else {
              this.$message.success('视频剪辑成功！')
              this.$router.replace({ name: 'personVideo' })
            }
          }
        })
        .catch(() => {})
    },
    // 截取图片
    editImg () {
      this.confirmEditImg = true
    },
    editVideo () {
      this.confirmEditVideo = true
    },
    // 进度条格式化toolTip
    formatProcessToolTip (index = 0) {
      index = parseFloat(this.video.maxTime / 100 * index)
      return '进度条: ' + realFormatSecond(index)
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime (index) {
      this.$refs['video'].currentTime = parseFloat(index[0] / 100 * this.video.maxTime)
    },
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate (res) {
      this.video.currentTime = res.target.currentTime
      // this.$set(this.sliderTime, 0, res.target.currentTime * 10)
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数。语音元数据主要是语音的长度之类的数据
    onLoadedmetadata (res) {
      this.video.maxTime = parseFloat(res.target.duration)
    },
    // 剪辑视频
    operate () {
      this.$http.get(this.$api.getVideoThumbnails, { params: { fileId: this.routeId } })
        .then(res => {
          this.imgList = res.data.data
          this.sliderboxWidth = this.imgList.length * 48 + 'px'
          this.edidShow = false
        })
    },
    // 获取视频信息
    getVideoDetails () {
      this.$http.get(this.$api.getFileDetails, { params: { fileId: this.routeId } })
        .then(res => {
          if (res.data.data.mrFile.uploadPath) {
            this.mrFile = res.data.data.mrFile
            this.mrGroup = res.data.data.mrGroup
            this.$refs['video'].controls = true // 设置控件
          }
        })
        .catch(() => {})
    }
  },
  watch: {
    // 蒙层
    sliderTime (newValue) {
      this.leftValue = (1 * newValue[0]) + '%'
      this.rightValue = (100 - (1 * newValue[1])) + '%'
    }
  },
  mounted () {
    this.routeId = this.$route.query.id
    if (this.routeId) {
      this.getVideoDetails()
    } else {
      this.$message.error('参数错误，请稍后重试！')
    }
  }
}
</script>

<style scoped>
  .my-img-list {
    padding: 48px 5px 15px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(221, 221, 221, 1);
    margin-bottom: 32px;
  }
  .my-img-title {
    font-size: 22px;
    color: #333333;
  }
  .my-img-date {
    font-size: 16px;
    color: #39a3f2;
  }
  .my-img-name {
    margin-right: 30px;
  }
  .video-wrap {
    height: 400px;
    text-align: center;
  }
  #video {
    max-height: 100%;
  }
  .btn-box {
    text-align: center;
    margin-top: 30px;
  }
  .right-box {
    right: 0;
  }
  .left-box,
  .right-box {
    height: 40px;
    position: absolute;
    top: 0;
    background-color: rgba(25, 30, 64, 0.8);
  }
  .img-box {
    margin: 0 auto;
    position: relative;
    top: -38px;
  }
  .img-box img {
    width: 48px;
    height: 38px;
  }
  .slider-box {
    max-width: 1250px;
    margin: 0 auto;
    height: 38px;
    position: relative;
  }
</style>
