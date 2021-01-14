<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemUser' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemUserAddPass' }">添加用户-修改密码</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
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
          <div class="admin-form-box admin-tabs-box">
            <el-tabs v-model="tabActiveName"
                     @tab-click="handleClick">
              <el-tab-pane label="基本信息"
                           name="SystemUserAdd"></el-tab-pane>
              <!-- <el-tab-pane label="可访问数据"
                           name="SystemUserAddData"></el-tab-pane> -->
              <el-tab-pane label="修改密码"
                           name="SystemUserAddPass"></el-tab-pane>
            </el-tabs>
            <el-form :model="ruleForm"
                     :rules="rules"
                     ref="ruleForm"
                     label-position="left"
                     label-width="100px">
              <el-form-item label='编辑密码'
                            prop='loginPass'>
                <el-input v-model="ruleForm.loginPass"
                          type="password"
                          placeholder="请输入登录密码"></el-input>
              </el-form-item>
              <el-form-item label="确认密码"
                            prop='checkPassword'>
                <el-input v-model="ruleForm.checkPassword"
                          type="password"
                          placeholder="请输入确认密码"></el-input>
              </el-form-item>
            </el-form>
            <div class="btn-box">
              <el-button type="primary"
                         @click="debouncedGetAnswer('ruleForm')">保存</el-button>
              <el-button type="info"
                         @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
import { validatePhone } from '@/libs/form'
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'UserAddPass',
  data () {
    let checkPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.loginPass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      tabActiveName: 'SystemUserAddPass',
      routerId: '',
      ruleForm: {
        departmentId: '', // 所属单位
        roleId: '', // 管理角色
        inUse: 1, // 是否启用
        userName: '', // 姓名
        loginName: '', // 登录账号
        loginPass: '', // 登录密码
        userGender: '男', // 性别
        userJob: '', // 职务
        userPhone: '', // 手机号
        userMail: '', // 电子邮箱
        interestTag: '', // 标签
        checkPassword: '', // 确认密码
        dataDepartmentIds: '' // 数据绑定
      },
      rules: {
        departmentId: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        roleId: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ],
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '请输入登录账号', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        loginPass: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 30, message: '长度在 6 到 30 个字符', trigger: 'blur' }
        ],
        userPhone: [
          { validator: validatePhone, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: checkPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.userMail) {
            var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
            if (!reg.test(this.userMail)) {
              this.$message.warning('邮箱格式不正确！')
            }
          }
          let departmentApi = 'null'
          // 判断是否是编辑
          if (this.routerId) {
            departmentApi = this.$api.userUpdate
          } else {
            departmentApi = this.$api.userSave
          }
          let row = {}
          for (var key in this.ruleForm) {
            row[key] = this.ruleForm[key]
          }
          let pass = this.ruleForm.loginPass
          if (pass && pass.trim()) {
            row.loginPass = md5(md5(row.loginPass) + row.loginName)
          }
          this.$http.post(departmentApi, row)
            .then(res => {
              this.$message.success('保存成功！')
              this.$router.push({ name: 'SystemUser' })
            })
            .catch(() => {
            })
        }
      })
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    },
    handleClick (tab) {
      this.$router.push({ name: tab.name, query: { id: this.routerId } })
    }
  },
  created () {
    this.routerId = this.$route.query.id
    this.debouncedGetAnswer = this.$debounce(this.submit, 500)
  },
  mounted () {
    this.routerId = this.$route.query.id
    if (this.routerId) {
      this.$http.get(`${this.$api.getUserDetails}?id=${this.routerId}`)
        .then(res => {
          res.data.data.loginPass = ''
          this.ruleForm = res.data.data
        })
        .catch(() => { })
    }
  },
  components: {
    vMenu
  }
}
</script>
<style lang="scss">
  @import "system";
</style>
<style scoped>
.btn-box {
  margin-top: 30px;
  margin-left: 25px;
}
.admin-form-box {
  padding: 10px 20px;
}
</style>
