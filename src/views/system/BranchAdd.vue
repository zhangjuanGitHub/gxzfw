
<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemBranch' }">部门管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemBranchAdd' }">{{this.$route.query.id ? '编辑部门' : '添加部门'}}</el-breadcrumb-item>
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
          <div class="admin-box">
            <div class="admin-form-box">
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForm"
                       label-position="left"
                       label-width="100px">
                <el-form-item label="所属部门"
                              prop="parentId">
                  <el-input v-model="ruleForm.unitName"
                            placeholder="无所属部门"
                            disabled>
                  </el-input>
                </el-form-item>
                <el-form-item label="部门名称"
                              prop="sectionName">
                  <el-input v-model="ruleForm.sectionName"
                            placeholder="请输入部门名称"></el-input>
                </el-form-item>
                <el-form-item label="部门描述"
                              prop="sectionDescribe">
                  <el-input v-model="ruleForm.sectionDescribe"
                            placeholder="请输入部门描述"></el-input>
                </el-form-item>
                <div class="admin-btn-box">
                  <el-button type="primary"
                             @click="debouncedGetAnswer('ruleForm')">保存</el-button>
                  <el-button type="info"
                             @click="resetFields('ruleForm')">重置</el-button>
                  <el-button class="back-btn"
                             @click="backHome">返回</el-button>
                </div>
              </el-form>
            </div>
            <!--          <div v-else class="text-center no-permission">-->
            <!--            <img :src="require('@/assets/images/error-page/noPermission.png')" alt="">-->
            <!--            <p>很抱歉，您没有访问此页面的权限</p>-->
            <!--          </div>-->
          </div>
          <!-- <no-permission v-else></no-permission> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'DepartmentAdd',
  data () {
    return {
      depid: '', // 新增时用于获取地区列表的部门id
      apiName: '', // api
      listSelect: [], // 单位层级
      areaList: [], // 地区列表
      ruleForm: {
        parentId: null, // 单位id
        sectionDescribe: '', // 部门描述
        sectionName: '' // 部门名称
      },
      rules: {
        sectionName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        sectionDescribe: [
          { required: true, message: '请输入部门描述', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        parentId: [
          { required: true, message: '请选择部门', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 重置
    resetFields (form) {
      this.$refs[form].resetFields()
    },
    backHome () {
      let route = this.$route.query
      this.$router.push({ name: 'SystemBranch', query: { page: route.page, size: route.size } })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let row = {}
          console.log(this.ruleForm)
          for (var key in this.ruleForm) {
            row[key] = this.ruleForm[key]
          }
          row.parentId = parseFloat(row.parentId)
          // row.sectionLevel = parseFloat(row.sectionLevel)
          let departmentApi = 'null'
          // 判断是否是编辑
          if (this.ruleForm.hasOwnProperty('id')) {
            departmentApi = this.$api.updateBranch
          } else {
            departmentApi = this.$api.createBranch
          }
          this.$http.post(departmentApi, row)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success('保存成功！')
                let route = this.$route.query
                this.$router.push({ name: 'SystemBranch', query: { page: route.page, size: route.size } })
              } else {
                this.$message.error(res.data.message)
              }
            })
            .catch(err => {
              this.$message.error(err.data.message)
            })
        }
      })
    }
  },
  created () {
    this.debouncedGetAnswer = this.$debounce(this.save, 500)
    let routeQuery = this.$route.query
    // 是编辑
    if (routeQuery.id) {
      this.id = parseInt(routeQuery.id)
      this.$http.get(`${this.$api.getOneBranch}?id=${this.id}`)
        .then(res => {
          let datas = res.data.data
          this.ruleForm = datas
          console.log(datas)
          this.ruleForm.unitName = datas.parentSectionName
        })
        .catch(() => { })
    } else {
      this.ruleForm.unitName = routeQuery.braname
      this.ruleForm.parentId = parseInt(routeQuery.braid)
    }
  },
  mounted () {},
  components: {
    vMenu
  }
}
</script>

<style scoped>
.admin-box .el-input,
.admin-box .el-select,
.admin-box .el-cascader {
  width: 350px;
}
</style>
