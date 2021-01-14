<template>
  <div class="upload-all">
    <el-upload class="avatar-uploader"
                :action="this.$api.upload"
                drag
                :headers="headToken"
                :list-type="listType"
                :show-file-list="showList"
                :multiple="isMultiple"
                :limit="limitList"
                :file-list="fileList"
                :accept="acceptType"
                :on-preview="handlePreview"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-error="getError"
                :on-progress="getProgress"
                :on-remove="handleRemove">
      <el-image v-if="headUrl && !videoFlag"
                :src="headUrl"
                fit="cover"></el-image>
      <el-progress v-if="videoFlag && !showList"
                    type="circle"
                    :percentage="videoUploadPercent"
                    style="margin-top:30px;"></el-progress>
      <span v-if="!headUrl && !isPlatform" class="el-icon-plus avatar-uploader-icon"></span>
      <el-button size="small" type="primary" v-if="fileTip && showList && limitList !== 9">上传附件</el-button>
      <div class="el-upload__tip" slot="tip">
        <span v-if="fileTip && showList">{{fileTip}}</span>
        <span v-else>只能上传jpg/jpeg/png/gif文件</span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :modal-append-to-body="false">
      <img width="100%"
           :src="dialogImageUrl"
           alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  props: ['headUrl', 'listType', 'showList', 'isMultiple', 'headToken', 'limitList', 'fileTip', 'acceptType', 'isPlatform'],
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      fileList: [], // 默认列表
      videoUploadPercent: 0, // 进度条
      videoFlag: false, // 控制进度条显示
      fileArr: []
    }
  },
  methods: {
    handlePreview (item) {
      this.dialogImageUrl = item.url
      this.dialogVisible = true
    },
    handleSuccess (event, file, fileList) {
      this.videoUploadPercent = 100
      this.videoFlag = false
      this.$emit('getAttachmentUrl', file)
    },
    // 删除
    handleRemove (file, fileList) {
      this.$emit('removeAttachmentFiles', file)
    },
    beforeUpload (file) {
      this.videoFlag = true
    },
    getError (item) {
      this.$message.error('上传失败，请稍后重试！')
      this.videoFlag = false
    },
    getProgress (event, file, fileList) {
      this.fileArr = fileList
      this.fileArr.forEach(item => {
        if (item.percentage === 100) {
          this.videoFlag = false
        } else {
          item.progressFlag = true
          this.videoUploadPercent = Math.abs(item.percentage.toFixed(0))
        }
      })
    }
  },
  created () {
  },
  components: {},
  computed: {}
}
</script>

<style>
.avatar-uploader .el-upload-dragger {
  width: 178px;
  height: 178px;
  border: none;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.user-upload-box .avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>
<style scoped>

.upload-all .el-image {
  height: 178px;
}
</style>
