<template>
  <div class="IaunchLssue container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'IssueList' }">议题列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'WriteIssue' }">发起议题</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="Issue-form">
        <el-form label-width="100px"
                 :model="ruleForm"
                 ref="ruleForm"
                 :rules="rules"
                 label-position='left'>
          <el-form-item label="议题名称"
                        prop="issueTitle">
            <el-input type="text"
                      placeholder="请输入议题名称"
                      v-model="ruleForm.issueTitle"
                      maxlength="35"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="issueDescribe">
            <el-input v-model="ruleForm.issueDescribe"
                      type='textarea'
                      :rows="6"
                      placeholder="为了能获得更多答复，请描述一下议题！辛苦了"></el-input>
          </el-form-item>
          <!-- <el-form-item label="邀请"
                        class="issueInvite"
                        prop="issueInvite">
            <el-select v-model="ruleForm.organizationType"
                       placeholder="全省用户">
              <el-option label="全省用户"
                         :value="0"></el-option>
              <el-option label="全省政法委用户"
                         :value="1"></el-option>
              <el-option label="全省公安用户"
                         :value="2"></el-option>
              <el-option label="全省检察院用户"
                         :value="3"></el-option>
              <el-option label="全省法院用户"
                         :value="4"></el-option>
              <el-option label="全省司法用户"
                         :value="5"></el-option>
            </el-select>
          </el-form-item> -->
        </el-form>
        <div class="buttons">
          <el-button @click="saveDatas('ruleForm')"
                     type="primary">发表</el-button>
          <el-button @click="conBack">取消</el-button>
        </div>
      </div>
      <!-- <no-permission v-else></no-permission> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      routeId: null,
      ruleForm: {
        issueTitle: '',
        issueDescribe: '',
        organizationType: 0
      },
      rules: {
        issueTitle: [
          { required: true, message: '请输入议题名称', trigger: 'blur' }
        ],
        issueDescribe: [
          { required: true, message: '请输入议题描述', trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    if (this.$route.query.id) {
      this.routeId = this.$route.query.id
      this.$http.get(`${this.$api.getIssus}?id=${this.routeId}`)
        .then(res => {
          this.ruleForm = res.data.data
        })
        .catch(() => { })
    }
  },
  methods: {
    saveDatas (form) {
      let apiName = null
      this.routeId ? apiName = 'updateIssus' : apiName = 'saveIssus'
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api[apiName], this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$router.push({ name: 'MyIssueList' })
            })
            .catch(() => { })
        }
      })
    },
    conBack () {
      this.$router.back(-1)
    }
  }
}
</script>
<style scoped>
@import "../contributions.scss";
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.IaunchLssue .Issue-form {
  width: 1100px;
  height: 621px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.38);
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 36px 0 34px;
}
.buttons {
  padding-top: 50px;
}
.buttons {
  text-align: center;
}
.buttons .el-button {
  width: 150px;
}
</style>
