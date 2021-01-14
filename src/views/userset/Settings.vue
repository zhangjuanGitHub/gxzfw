<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>安全设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-box">
      <el-row :gutter="10">
        <el-col :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu></v-menu>
        </el-col>
        <el-col :xs="21"
                :sm="21"
                :md="21"
                :lg="20"
                :xl="20">
          <div class="user-form-box">
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-position="left"
                     label-width="90px">
              <el-form-item label="旧密码"
                            prop="currentLoginPass">
                <el-input v-model="ruleForm.currentLoginPass"
                          type="password"
                          placeholder="请输入旧密码"></el-input>
              </el-form-item>
              <el-form-item label="新密码"
                            prop="loginPass">
                <el-input v-model="ruleForm.loginPass"
                          type="password"
                          placeholder="请输入新密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop="confirmLoginPass">
                <el-input v-model="ruleForm.confirmLoginPass"
                          type="password"
                          placeholder="请再次输入密码"></el-input>
              </el-form-item>
              <el-form-item label="绑定邮箱">
                <el-input v-model="ruleForm.userMail"
                          placeholder="请输入邮箱账号"></el-input>
              </el-form-item>
            </el-form>
            <div class="admin-btn-box">
              <el-button type="primary"
                         @click="submit('ruleForm')">确认</el-button>
              <el-button class="back-btn"
                         @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
<!--    import { checkfirstPass } from '@/libs/form'-->
  </div>
</template>

<script>
import vMenu from '@/views/userset/components/UserMenu'
import md5 from 'js-md5'
export default {
  name: 'Settings',
  data () {
    var checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.loginPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loginName: '',
      ruleForm: {
        currentLoginPass: '',
        loginPass: '',
        confirmLoginPass: '',
        userMail: ''
      },
      rules: {
        currentLoginPass: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        loginPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度最低为6个字符', trigger: 'blur' }
        ],
        confirmLoginPass: [
          { required: true, message: '请确认新密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit (form) {
      if (this.ruleForm.userMail) {
        let reg = /^\w+@[0-9a-z]+\.[a-z]+$/i
        if (!reg.test(this.ruleForm.userMail)) {
          this.$message.warning('邮箱格式不正确！')
          return false
        }
      }
      delete this.ruleForm.confirmLoginPass
      this.$refs[form].validate((valid) => {
        if (valid) {
          let row = {
            currentLoginPass: md5(md5(this.ruleForm.currentLoginPass) + this.loginName),
            loginPass: md5(md5(this.ruleForm.loginPass) + this.loginName),
            confirmLoginPass: this.ruleForm.confirmLoginPass,
            userMail: this.ruleForm.userMail
          }
          this.$http.post(this.$api.updateSelfSecurity, row)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success('操作成功！')
                this.ruleForm.confirmLoginPass = ''
                this.ruleForm.userMail = ''
                this.$refs[form].resetFields()
              }
            })
            .catch(() => {
              this.$refs['ruleForm'].resetFields()
            })
        }
      })
    },
    // 重置
    resetForm (form) {
      this.$refs[form].resetFields()
    }
  },
  created () {
    this.loginName = this.$store.state.user.userInfo.loginName
  },
  components: {
    vMenu
  }
}
</script>

<style scoped>
@import "userset.scss";
.user-form-box {
  background: #fff;
  padding: 20px;
}
</style>
