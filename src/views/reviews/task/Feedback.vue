<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsReceive' }">执行任务</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsFeedback' }">反馈任务</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
          <div>
            <div class="feedback-detail">
              <p class="feedback-title">任务反馈</p>
            </div>
            <issued-view :issuedInfo="issuedInfo"></issued-view>
            <div class="feedback">
              <div class="feedback-detail">
                <p class="feedback-title">反馈信息</p>
                <div v-if="comExecuteTaskList.length > 0" class="feedback-info-box">
                  <div class="view-issued-detalis" :key="item.id" v-for="(item) of comExecuteTaskList">
                    <ul>
                      <li><span>反馈人:</span><span>{{item.feedBackUserName}}</span></li>
                      <li><span>反馈名称:</span><span>{{item.feedbackTitle}}</span></li>
                      <li><span>反馈描述:</span><span>{{item.feedbackContent}}</span></li>
                      <li><span>反馈时间:</span><span>{{item.feedbackTime}}</span></li>
                      <li>
                        <span>附件:</span>
                        <div v-if="item.accessoryList && item.accessoryList.length > 0" class="filelist">
                          <p @click="targetUrl(value.accessoryUrl)" v-for="value of item.accessoryList" :key="value.accessoryName" class="color-primary cursor">{{value.accessoryName}}</p>
                        </div>
                        <span v-else>暂无附件</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div class="feedback-info user-form-box" v-if="this.bottomShow">
                  <el-form
                    :model="ruleForm"
                    ref="ruleForm"
                    :rules="rules"
                    label-position="left"
                    label-width="100px"
                  >
                    <el-form-item label="反馈名称"
                                  prop="feedbackName">
                      <el-input v-model="ruleForm.feedbackName"
                                type="textarea"
                                :rows="2"
                                placeholder="请输入反馈名称"></el-input>
                    </el-form-item>
                    <el-form-item label="反馈描述"
                                  prop="feedbackContent">
                      <el-input v-model="ruleForm.feedbackContent"
                                type="textarea"
                                :rows="5"
                                placeholder="请输入反馈描述"></el-input>
                    </el-form-item>
                    <el-form-item label="反馈时间" prop="feedbackTime">
                      <el-date-picker
                        v-model="ruleForm.feedbackTime"
                        type="date"
                        :clearable="false"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                      </el-date-picker>
                    </el-form-item>
                    <el-form-item label="附件" prop="feedbackList">
                      <el-upload
                        class="upload-demo"
                        :headers="token"
                        :action="this.$api.upload"
                        :on-preview="handlePreview"
                        :on-remove="handleRemove"
                        :on-success="handleSuccess"
                        :on-error="handleError"
                        accept=".jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF,.pptx,.xlsx,.docx,.ppt"
                        :file-list="ruleForm.feedbackList">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif和office文件</div>
                      </el-upload>
                    </el-form-item>
                  </el-form>
                  <div class="admin-btn-box">
                    <el-button type="warning" @click="returnUrl">返回</el-button>
                    <el-button @click="resetForm('ruleForm')" type="info">重置</el-button>
                    <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
    </div>
  </div>
</template>

<script>
import IssuedView from '../components/IssuedView'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      bottomShow: true,
      token: { Authorization: '' },
      ruleForm: {
        executeTaskId: '', // 任务id
        feedbackName: '', // 反馈名称
        feedbackContent: '', // 反馈描述
        feedbackTime: '', // 反馈时间
        feedbackList: [] // 附件
      },
      rules: {
        feedbackName: [
          { required: true, message: '请输入反馈名称', trigger: 'blur' }
        ],
        feedbackContent: [
          { required: true, message: '请输入反馈描述', trigger: 'blur' }
        ],
        feedbackTime: [
          { required: true, message: '请选择反馈时间', trigger: 'blur' }
        ]
      },
      fileList: [],
      issuedInfo: {}, // 任务信息
      comExecuteTaskList: [] // 反馈信息
    }
  },
  methods: {
    targetUrl (url) {
      window.open(url, '_blank')
    },
    // 查看附件
    handlePreview (file) {
      window.open(file.accessoryUrl, '_blank')
    },
    // 返回
    returnUrl () {
      this.$router.push({ name: 'ReviewsReceive' })
    },
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
    },
    // 提交
    submit (ruleForm) {
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.addFeedback, this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$router.push({ name: 'ReviewsReceive' })
              // this.getIssuedInfo()
            })
            .catch(() => {})
        }
      })
    },
    // 上传失败
    handleError () {
      this.$message.error('上传失败，请稍后重试！')
    },
    // 上传附件成功
    handleSuccess (event, file, fileList) {
      this.ruleForm.feedbackList.push({ name: file.name, accessoryName: file.name, accessoryUrl: file.response.message })
    },
    // 删除附件
    handleRemove (file, fileList) {
      this.ruleForm.feedbackList.forEach((item, index) => {
        if (file.accessoryUrl === item.accessoryUrl) {
          this.ruleForm.feedbackList.splice(index, 1)
        }
      })
    },
    getIssuedInfo () {
      this.$http.get(`${this.$api.findOneTask}/${this.ruleForm.executeTaskId}`)
        .then(res => {
          let datas = res.data.data
          this.issuedInfo = datas
          this.comExecuteTaskList = datas.comExecuteTaskList ? datas.comExecuteTaskList : []
          this.comExecuteTaskList.forEach(item => {
            if (item.feedBackUserName === this.userName) {
              console(this.bottomShow = false)
            }
          })
        })
        .catch(() => {})
    }
  },
  created () {
    this.token.Authorization = this.$store.state.user.token
    this.ruleForm.executeTaskId = this.$route.query.id
    this.getIssuedInfo()
  },
  computed: {
    ...mapState({
      userName: state => state.user.userInfo.userName // 用户名
    })
  },
  components: {
    IssuedView
  }
}
</script>
<style scoped>
  .view-issued-detalis li {
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    display: flex;
    padding: 3px 0;
  }
  .view-issued-detalis li span:first-child {
    display: inline-block;
    margin-right: 15px;
  }
  .view-issued-detalis img {
    max-width: 178px;
  }
  .feedback-title {
    height: 50px;
    background: #ebf3fa;
    line-height: 50px;
    padding: 0 12px;
    font-size: 16px;
  }
  .feedback-info {
    padding: 10px 10px 0;
    background: #fff;
  }
  .feedback-info .el-textarea {
    width: 550px;
  }
  .feedback-info-box {
    background: #fff;
    padding: 0 22px;
  }
</style>
