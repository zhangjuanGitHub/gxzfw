<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome' }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageVideo' }">视频池</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'UploadVideo' }">新建视频</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="upload-video-box">
      <div class="upload-video-detail">
        <span class="video-title">视频标题：</span>
        <el-input placeholder="请输入视频标题"
                  v-model="videoTitle"
                  size="small"></el-input>
      </div>
      <div class="upload-video-detail">
        <span class="video-title">视频链接：</span>
        <el-input placeholder="请输入视频链接"
                  v-model="videoLink"
                  size="small"></el-input>
      </div>
      <div class="upload-video-detail">
        <span class="video-title video-cover">视频封面：</span>
        <el-upload :action="this.$api.upload"
                   list-type="picture-card"
                   :on-success="videoUp"
                   :on-preview="handlePictureCardPreview"
                   :on-remove="handleRemove"
                   :before-upload="beforeAvatarUpload"
                   :limit="1"
                   :v-if="exhibit">
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </div>
      <div class="upload-btn">
        <el-button type="primary"
                   @click="videoUpload">确定</el-button>
        <el-button type="info"
                   @click="goBack">取消</el-button>
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
  </div>
</template>

<script>
export default {
  name: 'UploadVideo',
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      exhibit: false,
      videoTitle: '',
      videoLink: '',
      videoThumbnail: ''
    }
  },
  methods: {
    // 上传限制
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 移除附件
    handleRemove (file, fileList) {
      document.querySelector('.el-upload--picture-card').style.display = 'inline-block'
    },
    // 附件列表
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功
    videoUp (response, file) {
      this.videoThumbnail = response.message
      document.querySelector('.el-upload--picture-card').style.display = 'none'
    },
    // 确定上传视频
    videoUpload () {
      let row = {
        videoTitle: this.videoTitle,
        videoLink: this.videoLink,
        videoThumbnail: this.videoThumbnail
      }
      this.$http.post(this.$api.videoSave, row)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.$message.success(res.data.message)
            this.$router.push({ name: 'MyVideoList' })
          }
        })
        .catch(() => {
        })
    },
    goBack () {
      this.$router.go(-1)
    }
  },
  created () { },
  components: {}
}
</script>

<style scoped>
.upload-video-box {
  width: 1000px;
  padding: 70px 50px;
  margin: 0 auto;
  background: #ffffff;
}
.upload-video-detail {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.upload-video-detail span {
  display: inline-block;
}
.upload-video-detail .el-input {
  width: 50%;
}
.upload-btn {
  text-align: right;
  margin-top: 80px;
}
.video-cover {
  height: 148px;
}
</style>
