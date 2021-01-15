<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsAdmin' }">各平台账号备忘录</el-breadcrumb-item>
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
          <div class="reviews-admin-box">
            <div class="summary-seach online-reviews-search">
              <el-form :inline="true"
                       ref="ruleForm"
                       :model="ruleForm"
                       class="demo-form-inline">
                <el-form-item label="平台类型"
                              class="form-source"
                              prop="platformLevel">
                  <el-input size="small"
                            v-model="ruleForm.platformLevel"
                            placeholder="请输入平台类型"></el-input>
                </el-form-item>
                <el-form-item label="关键字"
                              class="form-keyword"
                              prop="keyword">
                  <el-input size="small"
                            v-model="ruleForm.keyword"
                            placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small"
                             @click="searchList"
                             type="primary">筛选</el-button>
                  <el-button size="small"
                             type="warning"
                             @click="resetForm('ruleForm')">重置</el-button>
                  <el-button size="small"
                             @click="addAdmin">添加</el-button>
                </el-form-item>
              </el-form>
              <div>
                <el-button type="primary"
                           @click="downTemp"
                           size="small">下载表格</el-button>
                <el-button size="small"
                           type="info"
                           @click="importExcel">批量导入</el-button>
                <el-button size="small"
                           type="danger"
                           @click="batchDelete">批量删除</el-button>
              </div>
            </div>
            <div class="summary-table">
              <el-table :data="tableData"
                        style="width: 100%"
                        ref="clearSelect"
                        border
                        @selection-change="handleSelectionChange"
                        class="out-summary">
                <el-table-column type="selection"
                                 width="30">
                </el-table-column>
                <el-table-column prop="name"
                                 label="姓名"
                                 width="95">
                </el-table-column>
                <el-table-column label="手机号"
                                 prop="phone"
                                 show-overflow-tooltip
                                 width="160">
                  <!--                <template slot-scope="scope">-->
                  <!--                  <el-link type="primary" v-html="scope.row.title" :href="scope.row.url" target="_blank"></el-link>-->
                  <!--                </template>-->
                </el-table-column>
                <el-table-column prop="department"
                                 label="单位名称"
                                 width="208">
                </el-table-column>
                <el-table-column prop="platformNumber"
                                 label="网络账号"
                                 width="140">
                </el-table-column>
                <el-table-column prop="platformName"
                                 label="账号昵称"
                                 width="140">
                </el-table-column>
                <el-table-column prop="platformLevel"
                                 label="平台类型"
                                 width="130">
                </el-table-column>
                <el-table-column prop="hotnum"
                                 label="操作"
                                 width="150">
                  <template slot-scope="scope">
                    <div class="disflex">
                      <el-button size="small"
                                 type="warning"
                                 @click="editItem(scope.row.id)">修改</el-button>
                      <el-button size="small"
                                 type="danger"
                                 @click="deleteItem(scope.row)">删除</el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess" />
    <delete-admin :deleteAdminDia="deleteAdminDia"
                  @deleteAdminsDiaClose="deleteAdminsDiaClose"
                  @confirmDeleteDia="confirmDeleteDia">
    </delete-admin>
    <el-dialog title="新增/修改账号"
               :visible="addAdminDia"
               :modal-append-to-body="false"
               class="add-admin-dia"
               @close="closeAddAdmin">
      <el-form :model="adminInfo"
               label-position="left"
               label-width="100px"
               ref="adminInfo"
               :rules="rules">
        <el-form-item label="姓名"
                      prop="name">
          <el-input v-model="adminInfo.name"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机号"
                      prop="phone">
          <el-input v-model="adminInfo.phone"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="单位名称"
                      prop="department">
          <el-input v-model="adminInfo.department"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="网络账号"
                      prop="platformNumber">
          <el-input v-model="adminInfo.platformNumber"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="账号名称"
                      prop="platformName">
          <el-input v-model="adminInfo.platformName"
                    autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="平台类型"
                      prop="platformLevel">
          <el-select v-model="adminInfo.platformLevel"
                     filterable
                     placeholder="请选择平台类型">
            <el-option :key="item.id"
                       v-for="item of platformLevelList"
                       :label="item.name"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="addAdminDia = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmAddAdmin('adminInfo')">确 定</el-button>
      </div>
    </el-dialog>
    <!--    导入-->
    <down-temp :downTempDia="downTempDia"
               :importApi="'importAddress'"
               @confirmImport="confirmImport"
               @closeImport="closeImport">
    </down-temp>
  </div>
</template>
<script>
import vMenu from '@/views/reviews/components/Menu'
import DeleteAdmin from './components/DeleteAdmin'
import { validatePhone } from '@/libs/form'
import { forEachMoreDelete } from '@/libs/tools'
import DownTemp from './components/DownTemp'
export default {
  data () {
    return {
      addAdminDia: false, // 新增编辑弹框
      deleteList: [], // 批量删
      deleteAdminDia: false, // 删除弹框
      dataLess: false,
      platformLevelList: [], // 平台
      adminInfo: {
        id: '',
        name: '',
        phone: '',
        department: '',
        platformNumber: '', // 网络账号
        platformName: '', // 账号名称
        platformLevel: '' // 平台类型
      }, // 新增/修改信息
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: validatePhone, trigger: 'blur' }
        ],
        department: [
          { required: true, message: '请输入单位名称', trigger: 'blur' }
        ],
        platformNumber: [
          { required: true, message: '请输入网络账号', trigger: 'blur' }
        ],
        platformName: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        platformLevel: [
          { required: true, message: '请选择平台类型', trigger: 'blur' }
        ]
      },
      listType: [
        {
          id: 1,
          label: '微博'
        },
        {
          id: 2,
          label: '微信公众号'
        },
        {
          id: 4,
          label: '百度'
        },
        {
          id: 5,
          label: '网易'
        }
      ],
      ruleForm: {
        keyword: '',
        pageNum: 1,
        pageSize: 32,
        sortDirection: '', // 排序 asc
        sortField: ''
      },
      tableData: [],
      token: '',
      downTempDia: false
    }
  },
  methods: {
    // 取消导入
    closeImport () {
      this.downTempDia = false
    },
    // 确认导入
    confirmImport () {
      this.downTempDia = false
      this.tableData = []
      this.getTableList()
    },
    importExcel () {
      this.downTempDia = true
    },
    // 下载模板
    downTemp () {
      window.location.href = `${this.$api.getAddress}?authCode=${this.token}`
    },
    // 取消新增/修改
    closeAddAdmin () {
      this.addAdminDia = false
      this.$nextTick(() => {
        this.$refs['adminInfo'].resetFields()
      })
    },
    // 确认新增/修改
    confirmAddAdmin (adminInfo) {
      let apiName = null
      apiName = this.adminInfo.id ? 'updateAddressBook' : 'insertAddressBook'
      this.$refs[adminInfo].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api[apiName], this.adminInfo)
            .then(res => {
              this.$message.success('操作成功！')
              this.addAdminDia = false
              this.tableData = []
              this.getTableList()
            })
            .catch(() => { })
        }
      })
    },
    // 编辑
    editItem (id) {
      this.addAdminDia = true
      this.$http.post(this.$api.findOneAddressBook, id)
        .then(res => {
          let datas = res.data.data
          if (datas) {
            this.adminInfo = datas
          }
        })
        .catch(() => { })
      this.getPlatformType()
    },
    // 获取平台类型列表
    getPlatformType () {
      this.$http.get(this.$api.findComPlatformType)
        .then(res => {
          this.platformLevelList = res.data.data
        })
        .catch(() => { })
    },
    // 点击添加
    addAdmin () {
      this.getPlatformType()
      this.addAdminDia = true
    },
    // 取消删除
    deleteAdminsDiaClose () {
      this.deleteAdminDia = false
      this.deleteList = []
      this.$refs['clearSelect'].clearSelection()
    },
    // 确认删除
    confirmDeleteDia () {
      let arr = []
      for (let i = 0; i < this.deleteList.length; i++) {
        arr.push(this.deleteList[i].id)
      }
      this.$http.post(this.$api.deleteAddressBook, arr)
        .then(res => {
          forEachMoreDelete(this.deleteList, this.tableList)
          this.deleteList = []
          this.$message.success('操作成功！')
          this.tableData = []
          this.getTableList()
        })
        .catch(() => { })
      this.deleteAdminDia = false
    },
    // 勾选
    handleSelectionChange (change) {
      this.deleteList = change
    },
    // 点击批量删除
    batchDelete () {
      if (this.deleteList.length > 0) {
        this.deleteAdminDia = true
      } else {
        this.$message.warning('请勾选需要删除的数据！')
      }
    },
    // 单个删除
    deleteItem (item) {
      this.deleteList.push(item)
      this.deleteAdminDia = true
    },
    // 跳转
    targetUrl (url) {
      window.open(url, '_blank')
    },
    // 平台类型
    getPlatformLevel (value) {
      this.ruleForm.platformLevel = value
    },
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.ruleForm.pageNum = 1
      this.tableList = []
      this.searchList()
    },
    // 获取列表
    getTableList () {
      this.dataLess = false
      this.$http.post(this.$api.findAddressBook, this.ruleForm)
        .then(res => {
          let datas = res.data.data
          this.tableData.push(...datas)
          if (datas.length < 31) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 分页
    getData () {
      this.ruleForm.pageNum++
      this.getTableList()
    },
    // 筛选
    searchList () {
      this.ruleForm.pageNum = 1
      this.tableData = []
      this.getTableList()
    }
  },
  created () {
    this.getTableList()
    this.token = this.$store.state.user.token
  },
  components: {
    vMenu,
    DeleteAdmin,
    DownTemp
  }
}
</script>
<style scoped>
.reviews-admin-box {
  background: #fff;
  padding: 12px 15px 30px;
}
.summary-seach {
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.summary-table {
  margin-top: 16px;
}
.add-admin-dia .el-input {
  width: 350px;
}
</style>
