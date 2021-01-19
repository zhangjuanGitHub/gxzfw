<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemUser' }">用户管理</el-breadcrumb-item>
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
          <div>
            <div class="admin-right-box" >
              <div class="admin-tree">
                <div class="admin-tree-title">
                  <p><span class="admin-title-span">单位列表</span></p>
                </div>
                <div class="tree-box">
                  <!-- default-expanded-keys="[this.treeFirstDataId]" -->
                  <el-tree :data="treeData"
                           :props="defaultProps"
                           node-key="value"
                           :expand-on-click-node="false"
                           @node-click="handleNodeClick"></el-tree>
                </div>
              </div>
              <div class="admin-table">
                <div class="admin-search">
                  <div class="public-btn">
                    <el-button class="new"
                               size="medium"
                               type="primary"
                               @click="addInfo">添加用户</el-button>
                    <el-button class="delete"
                               size="medium"
                               type="danger"
                               @click="deleteRowList">批量删除</el-button>
                  </div>
                  <div class="search-input border-radius search-box">
                    <span>关键字：</span>
                    <el-input v-model="params.searchParam"
                              size="small"
                              placeholder="请输入姓名或账号名称"
                              class="admin-keyword">
                    </el-input>
                    <div class="btn-box">
                      <el-button size="small"
                                 type="primary"
                                 @click="getKeyword">筛选</el-button>
                      <el-button size="small"
                                 @click="resetBtnForm">重置</el-button>
                    </div>
                  </div>
                </div>
                <div class="admin-table-box">
                  <el-table ref="multipleTable"
                            :data="tableList"
                            border
                            style="width: 100%"
                            @selection-change="handleSelectionChange">
                    <el-table-column type="selection"
                                     width="30">
                    </el-table-column>
                    <el-table-column label="姓名"
                                     width="85"
                                     show-overflow-tooltip>
                      <template slot-scope="scope">{{ scope.row.userName }}</template>
                    </el-table-column>
                    <el-table-column prop="loginName"
                                     label="账号名称"
                                     width="100"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="departmentName"
                                     label="单位"
                                     width="125"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="sectionName"
                                     label="部门"
                                     width="125"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="roleName"
                                     label="角色"
                                     width="70"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="userPhone"
                                     label="电话"
                                     width="110"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="name"
                                     label="状态"
                                     width="65">
                      <template slot-scope="scope">
                        <div v-if="scope.row.inUse">启用</div>
                        <div v-else>停用</div>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="130">
                      <template slot-scope="scope">
                        <div class="disflex">
                          <div class="edit-click">
                            <i class="el-icon-edit-outline"></i><span @click="editInfo(scope.row.id)">编辑</span>
                          </div>
                          <div class="delete-click">
                            <i class="el-icon-delete"></i><span @click="deleteRow(scope.$index, scope.row)">删除</span>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <!-- <no-permission v-else></no-permission> -->
            <v-diaing :isDiaingShow="dialogVisible"
                      :deleteItem="deleteItem"
                      @confirmDelete="getConfirmDelete"
                      @closeModal="getCloseModal"></v-diaing>
            <scroll-data @getData="getData"
                         :dataLess="dataLess"></scroll-data>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vDiaing from '@/views/system/components/Diaing'
import ScrollData from '@/components/ScrollData'
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'SystemUser',
  data () {
    return {
      treeFirstDataId: '',
      dataLess: false, // 数据小于32
      dialogVisible: false,
      deleteItem: {}, // 需要删除的数据
      deleteSelection: [], // 选择删除的数据
      total: '',
      treeData: [], // 树形
      tableList: [], // 数据列表
      routeName: '',
      keyword: '',
      params: {
        pageNum: 1,
        pageSize: 32,
        departmentId: '',
        searchParam: '',
        startDate: '',
        endDate: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    // 点击重置
    resetBtnForm () {
      this.params.searchParam = ''
      this.params.departmentId = ''
      this.resetForm()
    },
    resetForm () {
      this.params.pageNum = 1
      this.tableList = []
      this.getUserList()
    },
    // 搜索
    getKeyword () {
      if (this.params.searchParam.trim()) {
        this.resetForm()
      } else {
        this.$message.warning('请输入账号名称！')
      }
    },
    // 批量删除
    deleteRowList () {
      if (this.deleteSelection.length >= 1) {
        this.dialogVisible = true
        this.deleteItem = this.deleteSelection
      } else {
        this.$message.warning('请至少选择一条需要删除的数据！')
      }
    },
    // 确认删除
    getConfirmDelete (item) {
      if (!Array.isArray(item)) {
        this.$http.get(`${this.$api.userDelete}/${item.id}`)
          .then(res => {
            this.$message.success('删除成功！')
            this.tableList.splice(item.index, 1)
          })
          .catch(() => {
          })
      } else {
        let ids = []
        for (let i = 0; i < item.length; i++) {
          ids.push(item[i].id)
        }
        this.$http.post(this.$api.userDeleteBatch, { ids: ids })
          .then(res => {
            if (res.data.code === 200) {
              item.forEach(item => {
                this.tableList.forEach((val, index) => {
                  if (item.id === val.id) {
                    this.tableList.splice(index, 1)
                  }
                })
              })
              this.$message.success('删除成功！')
            }
          })
          .catch(() => {
            this.$refs['multipleTable'].clearSelection()
          })
      }
    },
    // 弹出模态框
    deleteRow (index, row) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 添加信息
    addInfo () {
      this.$router.push({ name: 'SystemUserAdd' })
    },
    // 编辑
    editInfo (id) {
      this.$router.push({ name: 'SystemUserAdd', query: { id: id } })
    },
    handleNodeClick (data) {
      this.params.departmentId = data.value
      this.params.pageNum = 1
      this.resetForm()
    },
    // 滚动加载
    getData () {
      this.params.pageNum++
      this.getUserList()
    },
    // 勾选删除数据
    handleSelectionChange (change) {
      this.deleteSelection = change
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 获取单位列表
    getDepartmentList () {
      this.$http.get(this.$api.listLevel)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.treeData = res.data.data
            this.treeFirstDataId = res.data.data[0].value
          }
        })
        .catch(() => {
        })
    },
    // 获取用户列表
    getUserList () {
      this.dataLess = false
      this.$http.post(this.$api.userList, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.tableList.push(...datas)
          this.total = res.data.data.totalElements
          if (datas.length < 31) {
            this.dataLess = true
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.routeName = this.$route.name
    this.getDepartmentList()
    this.getUserList()
    // new Promise(this.getDepartmentList)
    //   .then(this.userList)
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    vDiaing,
    ScrollData,
    vMenu
  }
}
</script>
<style lang="scss">
@import "system";
</style>
<style scoped>
.admin-right-box {
  display: flex;
  min-height: 400px;
}
.admin-tree {
  width: 220px;
  border-left: 1px solid #dbdbdb;
  padding: 0 12px;
}
.admin-tree-title p {
  color: #2f9ff3;
}
.admin-title-span {
  margin-left: 12px;
  font-size: 16px;
  line-height: 18px;
}
.admin-tree-title p::before {
  width: 4px;
  height: 16px;
  content: "";
  background: #309ade;
  position: absolute;
}
.tree-box {
  margin-top: 15px;
}
.admin-table {
  flex: 1;
}
.admin-table-box {
  margin-top: 22px;
}
.admin-keyword {
  width: 200px;
}
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.margin-10 {
  margin: 5px 0;
}
.btn-box {
  margin-left: 20px;
}
</style>
