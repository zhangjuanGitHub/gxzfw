<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
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
              <el-form-item label="所属单位">
                <el-input v-model="ruleForm.departmentName"
                          placeholder="请输入所属单位"
                          disabled></el-input>
              </el-form-item>
              <el-form-item label="登录账号">
                <el-input v-model="ruleForm.loginName"
                          disabled
                          placeholder="请输入登录账号"></el-input>
              </el-form-item>
              <!--              <el-form-item label="角色">-->
              <!--                <el-input v-model="ruleForm.roleName"-->
              <!--                          placeholder="请输入角色"-->
              <!--                          disabled></el-input>-->
              <!--              </el-form-item>-->
              <el-form-item label="姓名"
                            prop="userName">
                <el-input v-model="ruleForm.userName"
                          placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="手机号"
                            prop="userPhone">
                <el-input v-model="ruleForm.userPhone"
                          placeholder="请输入手机号"></el-input>
              </el-form-item>
              <el-form-item label="微信号">
                <el-input v-model="ruleForm.userWectch"
                          placeholder="请输入微信号"></el-input>
              </el-form-item>
              <el-form-item label="擅长领域"
                            prop="userDomain"
                            class="field">
                <el-checkbox-group v-model="checkList" @change="checked">
                  <el-checkbox label="1">微信</el-checkbox>
                  <el-checkbox label="2">微博</el-checkbox>
                  <el-checkbox label="3">今日头条</el-checkbox>
                  <el-checkbox label="4">一点资讯</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="性别"
                            prop="userGender">
                <el-radio-group v-model="ruleForm.userGender">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="大V描述"
                            v-if="isBigv"
                            prop="userDescribe">
                <el-input type="textarea"
                          :rows="6"
                          placeholder="请输入大V描述"></el-input>
              </el-form-item>
            </el-form>
            <div class="user-upload-box">
              <p>上传头像</p>
              <v-upload @getAttachmentUrl="getAttachmentUrl"
                        :headUrl="ruleForm.headPicture"
                        :listType="listType"
                        :showList="showList"
                        :isMultiple="isMultiple"
                        :acceptType="acceptType"></v-upload>
              <!-- <el-upload class="avatar-uploader"
                         :action="this.$api.upload"
                         :headers="token"
                         drag
                         :show-file-list="false"
                         accept=".jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF"
                         :on-preview="handlePreview"
                         :on-success="handleAvatarSuccess"
                         :before-upload="beforeUpload"
                         :on-error="getError"
                         :on-progress="getProgress">
                <el-image v-if="ruleForm.headPicture && !videoFlag"
                          :src="ruleForm.headPicture"
                          fit="cover"></el-image>
                <el-progress v-if="videoFlag"
                             type="circle"
                             :percentage="videoUploadPercent"
                             style="margin-top:30px;"></el-progress>
                <span v-if="!ruleForm.headPicture" class="el-icon-plus avatar-uploader-icon"></span>
                <div class="el-upload__tip"
                     slot="tip">只能上传jpg/png/gif文件</div>
              </el-upload> -->
            </div>
            <div class="admin-btn-box">
              <el-button type="primary"
                         @click="submit('ruleForm')">保存</el-button>
              <el-button @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/userset/components/UserMenu'
import vUpload from '@/components/UploadAll.vue'
import { validatePhone } from '@/libs/form'
import { mapState } from 'vuex'
export default {
  name: 'User',
  data () {
    return {
      listType: 'text',
      showList: false,
      isMultiple: false,
      headUrl: '',
      acceptType: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      token: { Authorization: '' },
      fileList: [],
      videoUploadPercent: 0, // 进度条
      videoFlag: false, // 控制进度条显示
      radio: [],
      checkList: [],
      ruleForm: {
        type: '',
        headPicture: '',
        departmentName: '', // 单位名称
        userName: '', // 姓名
        loginName: '', // 登录账号
        userPhone: '', // 手机号
        userWectch: '', // 微信号
        userDomain: ['1'], // 擅长领域
        userGender: '男', // 性别
        userDescribe: '' // 大V描述
      },
      rules: {
        userName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }
        ],
        userPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        // userDomain: [
        //   { required: true, message: '请选择擅长领域', trigger: 'blur' }
        // ],
        userGender: [
          { required: true, message: '请选择性别', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    checked () {
      this.ruleForm.userDomain = this.checkList
    },
    // getError (item) {
    //   this.$message.error('上传失败，请稍后重试！')
    //   this.videoFlag = false
    // },
    // getProgress (event, file, fileList) {
    //   this.fileArr = fileList
    //   this.fileArr.forEach(item => {
    //     if (item.percentage === 100) {
    //     } else {
    //       item.progressFlag = true
    //       this.videoUploadPercent = Math.abs(item.percentage.toFixed(0))
    //     }
    //   })
    // },
    // beforeUpload (file) {
    //   this.videoFlag = true
    // },
    // 重置
    resetForm (form) {
      this.ruleForm.headPicture = ''
      this.checkList = []
      this.$refs[form].resetFields()
    },
    // handlePreview (item) {
    // },
    // handleAvatarSuccess (event, file, fileList) {
    //   console.log(file)
    //   this.videoUploadPercent = 100
    //   this.videoFlag = false
    //   this.ruleForm.headPicture = file.response.message
    // },
    getAttachmentUrl (url) {
      this.ruleForm.headPicture = url.response.message
    },
    submit (form) {
      if (this.checkList) {
        this.$refs[form].validate((valid) => {
          if (valid) {
            if (Array.isArray(this.ruleForm.userDomain)) {
              this.ruleForm.userDomain = this.ruleForm.userDomain.join(',')
            }
            this.$http.post(this.$api.updateSelfInfo, this.ruleForm)
              .then(res => {
                if (res.data.code === 200) {
                  this.$message.success('操作成功！')
                  this.ruleForm.userDomain = this.ruleForm.userDomain.split(',')
                  this.$store.commit('user/userInfo', this.ruleForm)
                  this.getUserInfo()
                }
              })
              .catch(() => { })
          }
        })
      } else {
        this.$message.warning('请选择擅长领域')
      }
    },
    getUserInfo () {
      this.$http.get(this.$api.getSelfInfo)
        .then(res => {
          if (res.data.data) {
            var userDomain = []
            if (res.data.data.userDomain) {
              userDomain = res.data.data.userDomain.split(',')
            }
            this.ruleForm = res.data.data
            this.ruleForm.userDomain = userDomain
            this.checkList = this.ruleForm.userDomain
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getUserInfo()
  },
  components: {
    vMenu,
    vUpload
  },
  computed: {
    ...mapState({
      isBigv: state => state.user.userInfo.isBigv
    })
  }
}
</script>
<style scoped>
@import "userset.scss";
.user-form-box {
  background: #fff;
  padding: 20px;
}
.user-upload-box {
  display: flex;
  padding-top: 20px;
}
.user-upload-box p {
  width: 100px;
  font-size: 16px;
  color: #333333;
}
</style>
