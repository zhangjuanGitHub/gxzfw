<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemUser' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemUserAdd' }">添加用户-基本信息</el-breadcrumb-item>
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
          <div class="admin-tabs-box">
            <div class="admin-form-box">
              <el-tabs v-model="tabActiveName"
                       @tab-click="handleClick">
                <el-tab-pane label="基本信息"
                             name="SystemUserAdd"></el-tab-pane>
                <!-- <el-tab-pane label="可访问数据"
                             v-if="routerId"
                             name="SystemUserAddData"></el-tab-pane> -->
                <el-tab-pane label="修改密码"
                             v-if="routerId"
                             name="SystemUserAddPass"></el-tab-pane>
              </el-tabs>
              <!--      <p class="info-p"><span class="info-span">基本信息</span></p>-->
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForm"
                       label-position="left"
                       label-width="100px">
                <el-form-item label="所属单位"
                              prop="departmentId">
                  <!--          <el-select v-model="ruleForm.departmentId"-->
                  <!--                     filterable-->
                  <!--                     placeholder="请选择所属部门">-->
                  <!--            <el-option v-for="(item, index) of listSelect"-->
                  <!--                       :key="index"-->
                  <!--                       :label="item.departmentName"-->
                  <!--                       :value="item.id"></el-option>-->
                  <!--          </el-select>-->
                  <el-cascader v-model="ruleForm.departmentId"
                               placeholder="请选择所属单位"
                               :options="listSelect"
                               @change="departmentChange"
                               :show-all-levels="false"
                               :props="{ checkStrictly: true, emitPath: false, label: 'label', value: 'value', children: 'children' }"
                               clearable></el-cascader>
                </el-form-item>
                <el-form-item label="所属部门" prop="sectionId">
                  <el-cascader v-model="ruleForm.sectionId"
                               placeholder="请选择所属部门"
                               :options="sectionSelect"
                               :show-all-levels="false"
                               :props="{ checkStrictly: true, emitPath: false, label: 'label', value: 'value', children: 'children' }"
                               clearable></el-cascader>
                </el-form-item>
                <el-form-item label="管理角色"
                              prop="roleId">
                  <el-select v-model="ruleForm.roleId"
                             placeholder="请选择管理角色">
                    <el-option v-for="(item, index) of roleSelect"
                               :label="item.roleName"
                               :value="item.id"
                               :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="姓名"
                              prop="userName">
                  <el-input v-model="ruleForm.userName"
                            placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="登录账号"
                              prop="loginName">
                  <el-input v-model="ruleForm.loginName"
                            autocomplete="off"
                            placeholder="请输入登录账号" :disabled="isEdit"></el-input>
                </el-form-item>
                <el-form-item :label="routerId ? '编辑密码' : '登录密码'"
                              v-if="!routerId"
                              :prop="routerId ? '' : 'loginPass'">
                  <el-input v-model="ruleForm.loginPass"
                            type="password"
                            autocomplete="new-password"
                            placeholder="请输入登录密码"></el-input>
                </el-form-item>
                <el-form-item label="确认密码"
                              v-if="!routerId"
                              :prop="routerId ? '' : 'checkPassword'">
                  <el-input v-model="ruleForm.checkPassword"
                            type="password"
                            placeholder="请输入确认密码"></el-input>
                </el-form-item>
                <el-form-item label="职务"
                              prop="userJob">
                  <el-input v-model="ruleForm.userJob"
                            placeholder="请输入确认职务"></el-input>
                </el-form-item>
                <el-form-item label="手机号"
                              prop="userPhone">
                  <el-input v-model="ruleForm.userPhone"
                            placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="电子邮箱"
                              prop="userMail">
                  <el-input v-model="ruleForm.userMail"
                            placeholder="请输入电子邮箱"></el-input>
                </el-form-item>
                <el-form-item label="兴趣标签"
                              prop="interestTag">
                  <el-input v-model="ruleForm.interestTag"
                            placeholder="请输入兴趣标签"></el-input>
                </el-form-item>
                <el-form-item label="性别"
                              prop="userGender">
                  <el-radio-group v-model="ruleForm.userGender">
                    <el-radio label='男'>男</el-radio>
                    <el-radio label='女'>女</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="是否启用"
                              prop="inUse">
                  <el-radio-group v-model="ruleForm.inUse">
                    <el-radio :label='true'>是</el-radio>
                    <el-radio :label='false'>否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-form>
              <!--              <p class="info-p margin-p"><span class="info-span">可访问数据</span></p>-->
              <!--              <div class="data-tree-box">-->
              <!--                <el-tree-->
              <!--                  :data="treeData"-->
              <!--                  show-checkbox-->
              <!--                  node-key="id"-->
              <!--                  ref="tree"-->
              <!--                  :default-expanded-keys="expanded"-->
              <!--                  :props="defaultProps">-->
              <!--                </el-tree>-->
              <!--              </div>-->
              <div class="admin-btn-box">
                <el-button type="primary"
                           @click="debouncedGetAnswer('ruleForm')">保存</el-button>
                <el-button type="info"
                           @click="resetForm('ruleForm')">重置</el-button>
                <el-button class="back-btn"
                           @click="backHome">返回</el-button>
              </div>
            </div>
          </div>
          <!-- <no-permission v-else></no-permission> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import md5 from 'js-md5'
import { validatePhone } from '@/libs/form'
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'UserAdd',
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
      tabActiveName: 'SystemUserAdd',
      value: [],
      routerId: 0,
      expanded: [1],
      treeData: [],
      defaultProps: {
        children: 'childList',
        label: 'departmentName'
      },
      roleSelect: [],
      listSelect: [],
      sectionSelect: [],
      ruleForm: {
        sectionId: '', // 所属部门
        departmentId: '', // 所属单位
        roleId: '', // 管理角色
        inUse: true, // 是否启用
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
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        checkPassword: [
          { required: true, validator: checkPassword, trigger: 'blur' }
        ]
      },
      isEdit: false,
      userId: 0
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name, query: { id: this.routerId } })
    },
    resetForm (form) {
      this.$refs[form].resetFields()
    },
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
          // this.ruleForm.loginPass = md5(md5(this.ruleForm.loginPass) + this.ruleForm.loginName)
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
    // 获取部门列表
    departmentChange () {
      if (this.ruleForm.departmentId) {
        this.ruleForm.sectionId = ''
        this.getSectionList()
      }
    },
    getSectionList () {
      this.sectionSelect = []
      this.$http.get(`${this.$api.branchListLevel}?departmentId=${this.ruleForm.departmentId}`)
        .then(res => {
          if (res.data.data.length) {
            this.sectionSelect = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 获取单位列表
    getDepartmentList () {
      this.$http.get(this.$api.listLevel)
        .then(res => {
          if (res.data.data.length) {
            this.listSelect = res.data.data
            // this.deleteEmptyChildren(res.data.data)
          }
        })
        .catch(() => {
        })
    },
    // 删除空childList
    deleteEmptyChildren (arr) {
      arr.forEach((item, index) => {
        if (item.childList.length) {
          this.deleteEmptyChildren(item.childList)
        } else {
          delete item.childList
        }
      })
      this.listSelect = arr
      return this.listSelect
    },
    // 获取可访问数据列表
    // getDepartmentTreeList () {
    //   this.$http.get(this.$api.listLevel)
    //     .then(res => {
    //       if (res.data.data && res.data.code === 200) {
    //         this.treeData = res.data.data
    //       } else {
    //         this.$message.error(res.data.message)
    //       }
    //     })
    //     .catch(err => {
    //       this.$message.error(err.data.message)
    //     })
    // },
    // 获取管理角色列表
    ruleUserList () {
      this.$http.get(`${this.$api.ruleUserList}?userId=${this.userId}`)
        .then(res => {
          if (res.data.data.length) {
            this.roleSelect = res.data.data
          }
        })
        .catch(() => { })
    },
    backHome () {
      this.$router.push({ name: 'SystemUser' })
    }
  },
  created () {
    this.loginName = this.$store.state.user.userInfo.loginName
    // this.ruleUserList() // 获取管理角色列表
    this.getDepartmentList() // 获取部门列表
    // this.getDepartmentTreeList() // 获取可访问数据列表
    this.debouncedGetAnswer = this.$debounce(this.submit, 500)
  },
  mounted () {
    if (this.$route.query.id) {
      this.userId = parseInt(this.$route.query.id)
    }
    this.routerId = this.$route.query.id
    if (this.routerId) {
      this.isEdit = true
      this.$http.get(`${this.$api.getUserDetails}?id=${this.routerId}`)
        .then(res => {
          res.data.data.loginPass = ''
          this.ruleForm = res.data.data
          this.getSectionList()
        })
        .catch(() => { })
    }
    this.ruleUserList() // 获取管理角色列表
  },
  components: {
    vMenu
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>
<style lang="scss">
  @import "system";
</style>
<style scoped>
  .info-p {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .info-p::before {
    content: "";
    width: 5px;
    height: 16px;
    background: #2c8ae5;
    position: absolute;
  }
  .info-span {
    margin-left: 12px;
  }
  .margin-p {
    margin-top: 30px;
  }
  .admin-form-box {
    padding: 10px 20px;
  }
</style>
