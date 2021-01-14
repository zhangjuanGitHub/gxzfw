<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome' }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageImage' }">图片池</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'CreateImage' }">新建相册</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="my-img-list">
      <span class="image-box">相册名称:</span>
      <el-input v-model="imgName"
                ref="setFocus"
                placeholder="请输入相册名称"
                autofocus></el-input>
      <!-- <p class="my-img-date">2018/12/27 13:03</p> -->
    </div>
    <div>
      <div class="upload-min-height">
        <el-upload :action="this.$api.upload"
                   list-type="picture-card"
                   :file-list="fileList"
                   :on-success="success"
                   :before-upload="beforeAvatarUpload"
                   multiple
                   :on-preview="handlePictureCardPreview">
          <i class="el-icon-plus"></i>
          <div class="el-upload__tip"
               slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%"
               :src="dialogImageUrl"
               alt="">
        </el-dialog>
      </div>
      <div class="upload-btn-box">
        <el-button type="primary"
                   @click="remember"
                   v-if="this.detail">保存</el-button>
        <el-button type="primary"
                   @click="getKeyword"
                   v-else>确定</el-button>
        <el-button @click="backRouter"
                   type="info">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateImage',
  data () {
    return {
      imgName: '',
      fileList: [],
      fliesinfor: [],
      detail: '',
      dialogImageUrl: '',
      dialogVisible: false
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
    // 获取我的相册详情
    getImgdetail () {
      this.$http.get(this.$api.photoDetail, { params: { id: this.detail } })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.imgName = res.data.data.albumName
            this.fliesinfor = res.data.data.pictures
            res.data.data.pictures.forEach(item => {
              this.fileList.push({ name: item.pictureName, url: item.pictureLink })
            })
          }
        })
        .catch(() => {
        })
    },
    // 获取焦点
    getFocus () {
      this.$refs['setFocus'].focus()
    },
    // 预览
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 确定上传
    getKeyword () {
      let row = {}
      row.albumName = this.imgName
      row.pictures = this.fliesinfor
      if (this.imgName) {
        this.$http.post(this.$api.SaveList, row)
          .then(res => {
            this.$router.push({ name: 'MyImageList' })
          })
          .catch(() => {
          })
      } else {
        this.$message.error('请输入相册名称！')
      }
    },
    // 回显图片
    success (response, file) {
      this.fliesinfor.push({ pictureName: file.name, pictureLink: response.message })
    },
    // 保存
    remember () {
      let row = {}
      row.id = this.detail
      row.albumName = this.imgName
      row.pictures = this.fliesinfor
      this.$http.post(this.$api.photoUpdate, row)
        .then(res => {
          if (res.data.code === 200) {
            this.$router.push({ name: 'ImageDetails', query: { id: this.detail } })
          }
        })
        .catch(() => {
        })
    },
    // 返回
    backRouter () {
      this.$router.go(-1)
    }
  },
  created () {
    this.detail = this.$route.query.id
    this.getImgdetail()
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>

<style scoped>
.my-img-list {
  padding: 48px 5px 15px;
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
.my-img-list .el-input {
  width: 300px;
  margin-left: 5px;
}
.upload-btn-box {
  text-align: right;
}
.upload-min-height {
  min-height: 300px;
}
</style>
