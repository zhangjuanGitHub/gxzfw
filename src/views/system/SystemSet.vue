<template>
  <div class="admin-tabs-box container"
       v-if="$isPermission(704) || $isPermission(704)">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemSet' }">系统设置</el-breadcrumb-item>
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
          <div class="admin-right-box">
            <div class="admin-table">
              <!-- <div class="admin-log">
          <p class="admin-log-p"><span class="admin-log-span">系统设置</span></p>
        </div> -->
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForm"
                       label-position="left"
                       label-width="100px">
                <el-form-item label="网站名称"
                              prop="websiteName">
                  <el-input v-model="ruleForm.websiteName"
                            placeholder="请输入网站名称"></el-input>
                </el-form-item>
                <el-form-item label="网站域名"
                        prop="websiteDomain">
                    <el-input v-model="ruleForm.websiteDomain"
                      placeholder="请输入网站域名"></el-input>
                </el-form-item>
                <el-form-item label='所属机构'
                              prop='organizationName'>
                  <el-input v-model="ruleForm.organizationName"
                            placeholder="请输入所属机构"></el-input>
                </el-form-item>
                <el-form-item label="机构地址"
                              prop="organizationAddress">
                  <el-input v-model="ruleForm.organizationAddress"
                            placeholder="请输入机构地址"></el-input>
                </el-form-item>
                <el-form-item label="联系电话"
                              prop="organizationPhone">
                  <el-input v-model="ruleForm.organizationPhone"
                            placeholder="请输入联系电话"></el-input>
                </el-form-item>
                <!-- <el-form-item label="传真号码"
                        prop="FaxNumber">
            <el-input v-model="ruleForm.FaxNumber"
                      placeholder="请输入传真号码"></el-input>
          </el-form-item> -->
                <el-form-item label="机构传真"
                              prop="organizationFax">
                  <el-input v-model="ruleForm.organizationFax"
                            placeholder="请输入机构传真"></el-input>
                </el-form-item>
                <el-form-item label="机构邮箱"
                              prop="organizationEmail">
                  <el-input v-model="ruleForm.organizationEmail"
                            placeholder="请输入机构邮箱"></el-input>
                </el-form-item>
              </el-form>
              <div class="admin-btn-box">
                <el-button type="primary"
                           @click="debouncedGetAnswer('ruleForm')">保存</el-button>
                <el-button type="info"
                           @click="resetForm('ruleForm')">重置</el-button>
                <!-- <el-button class="back-btn"
                   @click="backHome">返回</el-button> -->
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <no-permission v-else></no-permission>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
import { mapGetters } from 'vuex'
export default {
  name: 'UserAdd',
  data () {
    return {
      routerId: '',
      roleSelect: [],
      listSelect: [],
      ruleForm: {
        websiteName: '', // 网站名称
        websiteDomain: '', // 网站域名
        websiteNumber: '', // 网站备案号
        organizationName: '', // 所属机构
        organizationAddress: '', // 机构地址
        organizationPhone: '', // 联系电话
        organizationFax: '', // 机构传真
        organizationEmail: '' // 机构邮箱
      },
      rules: {
        websiteName: [
          { required: true, message: '请输入网站名称', trigger: 'blur' }
          // { max: 8, message: '最多输入八个字符', trigger: 'blur' }
        ],
        websiteDomain: [
          { required: true, message: '请输入网站域名', trigger: 'blur' }
        ],
        websiteNumber: [
          { required: true, message: '请输入备案号', trigger: 'blur' }
        ],
        organizationName: [
          { required: true, message: '请输入所属机构', trigger: 'blur' }
        ],
        organizationAddress: [
          { required: true, message: '请输入机构地址', trigger: 'blur' }
        ],
        organizationPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' }
        ],
        organizationFax: [
          { required: true, message: '请输入机构传真', trigger: 'blur' }
        ],
        organizationEmail: [
          { required: true, message: '请输入机构邮箱', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    resetForm (form) {
      this.$refs[form].resetFields()
    },
    getInfo () {
      this.$http.get(this.$api.get_base)
        .then(res => {
          let datas = res.data.data
          if (datas) {
            this.ruleForm = datas
          }
        })
        .catch(() => {})
    },
    submit (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          if (this.ruleForm.organizationEmail) {
            var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
            if (!reg.test(this.ruleForm.organizationEmail)) {
              this.$message.warning('邮箱格式不正确！')
              return false
            }
          }
          this.$http.post(this.$api.save_base, this.ruleForm)
            .then(res => {
              this.$message.success('保存成功！')
              this.$store.commit('mutations/setWebSiteName', this.ruleForm.websiteName)
            })
            .catch(() => {
            })
        }
      })
    }
  },
  created () {
    this.debouncedGetAnswer = this.$debounce(this.submit, 500)
    this.getInfo()
  },
  mounted () {
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    vMenu
  }
}
</script>

<style scoped>
.margin-p {
  margin-top: 30px;
}
.admin-right-box {
  display: flex;
  padding: 0 12px;
  min-height: 400px;
}
.admin-table {
  flex: 1;
  padding: 15px;
  background-color: #fff;
}
.admin-tabs-box .admin-btn-box {
  padding: 50px 0 50px 76px;
}
.admin-table .el-input {
  width: 350px
}
</style>
