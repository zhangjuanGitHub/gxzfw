<template>
  <div class="achievement">
    <el-form :model="ruleForm"
             ref="ruleForm"
             label-width="90px"
             class="achievement-form"
             :rules="rules">
      <el-form-item class="bordno"
                    label="主题类型:"
                    prop="activityType">
        <el-radio-group v-model="ruleForm.activityType">
          <el-radio label="培训">培训</el-radio>
          <el-radio label="专题策划">专题策划</el-radio>
          <el-radio label="线下宣传">线下宣传</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="typtext"
                    prop="activityDate"
                    label="举办日期">
        <el-date-picker type="date"
                        placeholder="请选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        v-model="ruleForm.activityDate"></el-date-picker>
      </el-form-item>
      <el-form-item class="typtext"
                    prop="activitySubject"
                    label="主题名称">
        <el-input v-model="ruleForm.activitySubject"
                  placeholder="请输入主题名称"></el-input>
      </el-form-item>
      <el-form-item label="举办地点"
                    class="typtext"
                    prop="activityPlace">
        <el-input v-model="ruleForm.activityPlace"
                  placeholder="请输入举办地点"></el-input>
      </el-form-item>
      <el-form-item label="活动介绍"
                    class="typtext"
                    prop="activityDescribe">
        <el-input type="textarea"
                  :rows="6"
                  v-model="ruleForm.activityDescribe"
                  placeholder="请输入活动介绍"></el-input>
      </el-form-item>
      <el-form-item label="相关附件" prop="activityResultsFiles" class="achive-upload">
        <div class="upload-box contri-file-list">
          <v-upload @getAttachmentUrl="successFileLists"
                    @removeAttachmentFiles="removeUploadAnnex"
                    :listType="listType"
                    :showList="showList"
                    :isMultiple="isMultiple"
                    :limitList="limitList"
                    :isPlatform="isPlatform"
                    :fileTip="fileTip"></v-upload>
        </div>
      </el-form-item>
      <el-form-item class="footer">
        <el-button type="primary"
                   @click="onSubmit('ruleForm')">提交</el-button>
        <el-button type="info"
                   @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script scoped>
import vUpload from '@/components/UploadAll.vue'
export default {
  data () {
    return {
      listType: 'text',
      showList: true,
      isMultiple: true,
      limitList: 5,
      fileTip: '附件最多上传数量为5个',
      isPlatform: true,
      ruleForm: {
        activityType: '培训', // 主题类型
        activityDate: '', // 举办日期
        activitySubject: '', // 主题名称
        activityPlace: '', // 举办地点
        activityDescribe: '', // 活动介绍
        activityResultsFiles: [], // 附件
        pageNum: 1,
        pageSize: 32
      },
      rules: {
        activityDate: [
          { required: true, message: '请选择举办日期', trigger: 'blur' }
        ],
        activitySubject: [
          { required: true, message: '请输入主题名称', trigger: 'blur' }
        ],
        activityPlace: [
          { required: true, message: '请输入举办地点', trigger: 'blur' }
        ],
        activityDescribe: [
          { required: true, message: '请输入活动介绍', trigger: 'blur' }
        ],
        activityResultsFiles: [
          { required: true, message: '请上传附件！' }
        ]
      }
    }
  },
  components: {
    vUpload
  },
  created () {
  },
  methods: {
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.saveActivityResults, this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$router.push({ name: 'Summary' })
            })
            .catch(() => { })
        }
      })
    },
    // 上传成功附件列表
    successFileLists (file) {
      let getFile = {
        fileName: file.name,
        filePath: file.response.message,
        uid: file.uid
      }
      this.ruleForm.activityResultsFiles.push(getFile)
      this.$refs['ruleForm'].validate(valid => {})
    },
    // 删除附件
    removeUploadAnnex (file) {
      if (this.ruleForm.activityResultsFiles.length) {
        this.ruleForm.activityResultsFiles.forEach((item, index) => {
          if (item.uid === file.uid) {
            this.ruleForm.activityResultsFiles.splice(index, 1)
          }
        })
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.ruleForm.activityResultsFiles = []
      this.$refs['upload'].clearFiles()
      console.log(this.ruleForm)
    }
  }
}
</script>
<style>
.contri-file-list .avatar-uploader .el-upload-dragger {
  width: 80px;
  height: 32px;
}
.achive-upload .el-form-item__content {
  line-height: 1;
}
</style>
<style scoped>
.achievement {
  padding: 20px;
}
.achievement .el-radio-group img {
  vertical-align: middle;
  margin-right: 13px;
}
.bordno {
  border-bottom: 1px solid #ddd;
}

.achievement-form .el-input,
.achievement-form .el-select {
  width: 360px;
}
.achievement .el-button {
  width: 100px;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
}
.achievement .footer {
  margin-top: 20px;
}
.achievement .el-textarea {
  width: 360px;
}
.achievement .el-button {
  border-radius: 0;
}
.achievement .abstract {
  display: block;
  margin-bottom: 20px;
}
</style>
