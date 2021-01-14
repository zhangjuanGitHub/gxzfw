<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">单位管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemDepartmentAdd' }">{{this.$route.query.id ? '编辑单位' : '添加单位'}}</el-breadcrumb-item>
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
                <el-form-item label="所属单位"
                              prop="parentId">
                  <!--          <el-cascader v-model="ruleForm.parentId"-->
                  <!--                       disabled-->
                  <!--                       placeholder="请选择所属单位"-->
                  <!--                       :options="listSelect"-->
                  <!--                       :props="{ checkStrictly: true, emitPath: false, label: 'departmentName', value: 'id', children: 'childList' }"-->
                  <!--                       clearable>-->
                  <!--          </el-cascader>-->
                  <el-input v-model="ruleForm.unitName"
                            placeholder="请输入所属单位"
                            disabled>
                  </el-input>
                </el-form-item>
                <el-form-item label="所属地区"
                              prop="areaId">
                  <!-- <el-select v-model="ruleForm.areaId"
                             placeholder="请选择所属地区">
                    <el-option v-for="(item, index) of areaList"
                               :key="index"
                               :label="item.areaName"
                               :value="item.id"></el-option>
                  </el-select> -->
                  <el-cascader :options="areaList"
                              v-model="ruleForm.areaId"
                              placeholder="请选择所属地区"
                              :props="{ checkStrictly: true, emitPath: false }"
                              clearable></el-cascader>
                </el-form-item>
                <el-form-item label="单位名称"
                              prop="departmentName">
                  <el-input v-model="ruleForm.departmentName"
                            placeholder="请选择单位名称"></el-input>
                </el-form-item>
                <!--        <el-form-item label="单位级别"-->
                <!--                      prop="departmentLevel">-->
                <!--          <el-select v-model="ruleForm.departmentLevel"-->
                <!--                     placeholder="请选择单位级别">-->
                <!--            <el-option label="省/直辖市级院"-->
                <!--                       :value="1"></el-option>-->
                <!--            <el-option label="地市级院"-->
                <!--                       :value="2"></el-option>-->
                <!--            <el-option label="区县级院"-->
                <!--                       :value="3"></el-option>-->
                <!--          </el-select>-->
                <!--        </el-form-item>-->
                <el-form-item label="单位地址"
                              prop="departmentAddress">
                  <el-input v-model="ruleForm.departmentAddress"
                            placeholder="请选择单位地址"></el-input>
                </el-form-item>
                <!-- <el-form-item label="行政编码"
                              prop="postalCode">
                  <el-input v-model="ruleForm.postalCode"
                            placeholder="请选择行政编码"></el-input>
                </el-form-item> -->
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
        areaId: null, // 地区ID
        parentId: null, // 单位id
        departmentLevel: '', // 单位级别
        departmentAddress: '', // 单位地址
        postalCode: '', // 行政编码
        departmentName: '' // 单位名称
      },
      rules: {
        departmentName: [
          { required: true, message: '请输入单位名称', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        areaId: [
          { required: true, message: '请选择所属地区', trigger: 'blur' }
        ],
        departmentAddress: [
          { required: true, message: '请输入单位地址', trigger: 'blur' },
          { min: 2, max: 30, message: '长度在 2 到 30 个字符', trigger: 'blur' }
        ],
        // postalCode: [
        //   { required: true, message: '请输入行政编码', trigger: 'blur' },
        //   { min: 12, max: 12, message: '长度必须为12个字符', trigger: 'blur' }
        // ],
        parentId: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ],
        departmentLevel: [
          { required: true, message: '请选择单位级别', trigger: 'change' }
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
      this.$router.push({ name: 'SystemDepartment', query: { page: route.page, size: route.size } })
    },
    save () {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let row = {}
          for (var key in this.ruleForm) {
            row[key] = this.ruleForm[key]
          }
          row.parentId = parseFloat(row.parentId)
          row.departmentLevel = parseFloat(row.departmentLevel)
          let departmentApi = 'null'
          // 判断是否是编辑
          if (this.ruleForm.hasOwnProperty('id')) {
            departmentApi = this.$api.departmentUpdate
          } else {
            departmentApi = this.$api.departmentSave
          }
          this.$http.post(departmentApi, row)
            .then(res => {
              if (res.data.code === 200) {
                this.$message.success('保存成功！')
                let route = this.$route.query
                this.$router.push({ name: 'SystemDepartment', query: { page: route.page, size: route.size } })
              } else {
                this.$message.error(res.data.message)
              }
            })
            .catch(err => {
              this.$message.error(err.data.message)
            })
        }
      })
    },
    // 获取单位列表
    getSelectList () {
      this.$http.get(this.$api.depListSelect)
        .then(res => {
          if (res.data.data.length) {
            this.deleteEmptyChildren(res.data.data)
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
      // arr.push({ areaCode: null, areaLevel: 2, areaName: '暂无父级', childList: [], id: 2, parentId: 0 })
      this.listSelect = arr
      return this.listSelect
    },
    getAreaList () {
      this.$http.get(`${this.$api.listAreaLevelByUser}?departmentId=${this.depid}`)
        .then(res => {
          this.areaList = res.data.data
        })
        .catch(() => { })
    }
  },
  created () {
    this.debouncedGetAnswer = this.$debounce(this.save, 500)
  },
  mounted () {
    this.getSelectList()
    let routeNameQuery = this.$route.query
    // 是编辑编辑
    if (routeNameQuery.id) {
      this.depid = parseInt(routeNameQuery.id)
      this.$http.get(`${this.$api.getDepartment}?id=${routeNameQuery.id}`)
        .then(res => {
          let datas = res.data.data
          this.ruleForm = datas
          console.log(datas)
          this.ruleForm.unitName = datas.parentDepartmentName
        })
        .catch(() => { })
    } else {
      // 是新增子部门,
      // 1.传递当前部门名称赋值，不可改变
      // 2.获取当前id值给后台，用于所属地区
      // 3.获取当前id值给后台，用于赋值parentId
      this.ruleForm.unitName = routeNameQuery.depname
      this.ruleForm.parentId = parseInt(routeNameQuery.depid)
      this.depid = parseInt(routeNameQuery.depid)
    }
    this.getAreaList()
  },
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
