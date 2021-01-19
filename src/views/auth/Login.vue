<template>
  <div class="wrap">
    <!--    <svg-icon icon-class="account"></svg-icon>-->
    <div class="form-wrap login">
      <div class="logo-title">
        <img :src="require('@/assets/images/zfw.png')">
        <p class="system-name">
          {{getCaptchaInfo.websiteName}}
        </p>
      </div>
      <el-form :model="ruleForm"
               :rules="rules"
               ref="ruleForm">
        <el-form-item prop="loginName">
          <el-input v-model="ruleForm.loginName"
                    placeholder="请输入账号">
          </el-input>
        </el-form-item>
        <el-form-item prop="loginPass">
          <el-input type="password"
                    v-model="ruleForm.loginPass"
                    placeholder="请输入密码">
          </el-input>
        </el-form-item>
        <el-form-item prop="captchaText" class="captch-input">
          <el-input v-model="ruleForm.captchaText"
                    placeholder="请输入验证码">
            {{getCaptchaInfo.code}}
            <template slot="append">
              <div class="imgCode"
                   @click="getCode"
                   :style="{'background':`url(${getCaptchaInfo.code}) no-repeat center / 100% 100%`}"></div>
            </template>
          </el-input>
          <span @click="getCode" style="color: #aaaaaa; text-decoration: underline; cursor: pointer">看不清？点我换一张</span>
        </el-form-item>
        <!-- <el-form-item prop="checkDepartment" style="textAlign: center">
          <el-radio-group v-model="loginRadio" @change="getLoginRadio">
            <el-radio :label="1">宣传部门</el-radio>
            <el-radio :label="2">其他部门</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-button class="login-btn"
                   :loading="isLoading"
                   @click="submit('ruleForm')"
                   type="primary">登录</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
/**
 * @desc 登录
 * @author weipeng
 * @date 2019-04-18 18:26:26
 */
import { mapState } from 'vuex'
import md5 from 'js-md5'
export default {
  name: 'Login',
  data () {
    return {
      loginRadio: 1,
      captcha: {
        code: '',
        isLoading: false,
        token: '',
        websiteName: ''
      },
      isLoading: false,
      ruleForm: {
        loginName: '', // 账号
        loginPass: '', // 密码
        captchaText: '' // 验证码
        // checkDepartment: 1 // 部门
      },
      rules: {
        loginName: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        loginPass: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        captchaText: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getLoginRadio (val) {
      this.ruleForm.checkDepartment = val
    },
    // 登录
    sendLogin (resolve, reject) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.isLoading = true
          let row = {}
          for (var key in this.ruleForm) {
            row[key] = this.ruleForm[key]
          }
          row.loginPass = md5(md5(row.loginPass) + row.loginName)
          this.$http.post(this.$api.login, row)
            .then(res => {
              if (res.data.data) {
                this.$store.commit('user/userToken', res.data.data)
                this.$http.get(this.$api.queryColumn)
                  .then(res => {
                    if (res.data.code === 200) {
                      this.$store.commit('mutations/columnMenu', res.data.data)
                    }
                  })
                  .catch(() => { })
                resolve()
              }
            })
            .catch(() => {
              this.ruleForm.captchaText = ''
              this.ruleForm.loginPass = ''
              reject()
            })
        }
      })
    },
    // 获取用户信息
    getUserInfo (resolve, reject) {
      this.$http.get(this.$api.info)
        .then(res => {
          if (res.data) {
            if (this.prevUrlName) {
              this.$router.replace({ name: this.prevUrlName })
            } else {
              this.$router.replace({ name: 'Home' })
            }
            this.$message.success('登录成功！')
            this.$store.commit('user/userInfo', res.data.data) // 用户信息
            this.$store.commit('mutations/permissionList', res.data.data.functionIdList) // 权限
            this.$store.commit('mutations/clearPrevUrlName', null)
            this.isLoading = false
            resolve()
          }
        })
        .catch(() => {
          this.ruleForm.captchaText = ''
          reject()
        })
    },
    submit () {
      new Promise(this.sendLogin).then(val => {
        return new Promise(this.getUserInfo)
      }).catch(() => {
        this.isLoading = false
        this.getCode()
      })
    },
    // 获取验证码
    getCode () {
      this.$http.get(this.$api.captcha)
        .then(res => {
          let datas = res.data.data
          this.captcha = datas
          this.$store.commit('user/userToken', this.captcha.token) // 用户信息
          this.$store.commit('mutations/setLoginInfo', this.captcha)
          this.$store.commit('mutations/setWebSiteName', this.captcha.websiteName)
          if (res.data.data.isLogin) {
            this.$router.replace({ name: 'Home' })
          }
        })
        .catch(() => {})
      // this.$store.dispatch('actions/getLoginInfoAction')
    },
    listenerSubmit (e) {
      if (e.keyCode === 13 && !this.isLoading) {
        this.submit('ruleForm')
      }
    }
  },
  mounted () {
    this.getCode()
    if (this.getCaptchaInfo.isLoading) {
      this.$message.error('已经登录！')
      this.$router.replace({ path: 'Home' })
    } else {
      window.addEventListener('keydown', this.listenerSubmit)
    }
  },
  computed: {
    ...mapState({
      prevUrlName: state => state.mutations.prevUrlName,
      getCaptchaInfo: state => state.mutations.captchaInfo // 网站名称
    })
  },
  destroyed () {
    window.removeEventListener('keydown', this.listenerSubmit, false)
  }
}
</script>
<style lang="scss">
@import "login";
</style>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.wrap::after {
  content: "";
  position: absolute;
  z-index: -1;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: url("../../assets/images/true.jpg") no-repeat fixed 100% 100% /
    cover;
}
.form-wrap .el-form {
  width: 320px;
  margin: 0 auto;
  padding-top: 10px;
}
.form-wrap .el-form .el-input input {
  background-color: #ffffff1b;
  color: #fff;
}
.login-btn {
  width: 100%;
}
.imgCode {
  height: 40px;
  border-radius: 0 4px 4px 0;
}
.logo-title {
  display: flex;
  // margin-left: -60px;
  margin-bottom: 20px;
  margin-top: -165px;
}
.logo-title img {
  vertical-align: middle;
  height: 50px;
  align-self: center;
  margin-right: 20px;
}
.logo-title .system-name {
  font-size: 40px;
  line-height: 114px;
  color: #f5f5f5;
}
</style>
