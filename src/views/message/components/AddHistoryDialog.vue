<template>
  <el-dialog @close="closeDialog('historyForm')" title="添加历史事件" :visible="getModal" :modal-append-to-body='false' width="40%">
    <el-form :model="historyForm" :rules="rules" label-position="left" ref="historyForm" label-width="90px">
      <el-form-item label="事件标题:" prop="eventTitle">
        <el-input v-model="historyForm.eventTitle" placeholder="请输入事件标题"></el-input>
      </el-form-item>
      <el-form-item label="事件日期:" prop="monthDay">
        <el-date-picker
          v-model="historyForm.monthDay"
          placeholder="请选择事件日期"
          value-format="MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="上传封面:">
        <div class="user-upload-box">
          <el-upload class="avatar-uploader"
                         :action="this.$api.upload"
                         drag
                         :show-file-list="false"
                         accept=".jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeUpload"
                         :on-error="getError"
                         :on-progress="getProgress">
                <el-image v-if="historyForm.eventThumb && !videoFlag"
                          :src="historyForm.eventThumb"
                          fit="cover"></el-image>
                <el-progress v-if="videoFlag"
                             type="circle"
                             :percentage="videoUploadPercent"
                             style="margin-top:30px;"></el-progress>
                <span v-if="!historyForm.eventThumb" class="el-icon-plus avatar-uploader-icon"></span>
                <div class="el-upload__tip"
                     slot="tip">只能上传jpg/png/gif文件</div>
            </el-upload>
        </div>
      </el-form-item>
      <el-form-item label="事件简介:" prop="eventDescription">
        <el-input v-model="historyForm.eventDescription" resize="none" type="textarea" placeholder="请输入事件简介" :autosize="{ minRows: 10}"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <div class="remarks">* 备注: 多个关键词请用顿号区分</div>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog('historyForm')">取 消</el-button>
      <el-button type="primary" @click="confirmAdd('historyForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: ['historyForm', 'historyVisible'],
  data () {
    return {
      videoFlag: false, // 进度条显示
      videoUploadPercent: 0, // 进度条
      rules: {
        eventTitle: [
          { required: true, message: '请输入事件标题', trigger: 'blur' }
        ],
        monthDay: [
          { required: true, message: '请选择事件日期', trigger: 'blur' }
        ],
        eventDescription: [
          { required: true, message: '请输入事件简介', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 上传成功
    handleAvatarSuccess (event, file, fileList) {
      this.videoUploadPercent = 100
      this.videoFlag = false
      this.historyForm.eventThumb = file.response.message
    },
    // 上传限制
    beforeUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    getError (item) {
      this.$message.error('上传失败，请稍后重试！')
      this.videoFlag = false
    },
    getProgress (event, file, fileList) {
      let fileArr = fileList
      fileArr.forEach(item => {
        if (item.percentage === 100) {
        } else {
          item.progressFlag = true
          this.videoUploadPercent = Math.abs(item.percentage.toFixed(0))
        }
      })
    },
    closeDialog (form) {
      this.$refs[form].resetFields()
      this.historyForm.eventThumb = ''
      this.$emit('closeModal')
    },
    // 确认
    confirmAdd (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.saveHistory, this.historyForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$refs[form].resetFields()
              this.historyForm.eventThumb = ''
              this.$emit('confirmDia')
            })
            .catch(() => {})
        }
      })
    }
  },
  mounted () {
  },
  computed: {
    getModal: {
      get () {
        return this.historyVisible
      },
      set () {}
    }
  },
  watch: {
  }
}
</script>

<style scoped>
  .remarks{
    color: #ff0000;
    font-size: 12px;
  }
</style>
