<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemRole' }">角色管理</el-breadcrumb-item>
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
            <div class="admin-right-box">
              <div class="admin-table">
                <div class="admin-search">
                  <div class="public-btn">
                    <el-button class="new"
                               type="primary"
                               size="medium"
                               @click="addInfo">添加角色</el-button>
                    <el-button class="delete"
                               size="medium"
                               type="danger"
                               @click="deleteRowList">批量删除</el-button>
                  </div>
                  <div class="search-input border-radius search-box">
                    <span style="width:70px">角色名称: </span>
                    <el-input v-model="params.roleName"
                              size="small"
                              placeholder="请输入角色名称"
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
                    <el-table-column label="角色名称"
                                     width="300">
                      <template slot-scope="scope">{{ scope.row.roleName }}</template>
                    </el-table-column>
                    <el-table-column prop="roleDescribe"
                                     label="权限"
                                     width="615"
                                     show-overflow-tooltip
                                     class="text-left">
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="140">
                      <template slot-scope="scope">
                        <div class="disflex">
                          <div class="edit-click">
                            <i class="el-icon-edit-outline"></i><span @click="editRole(scope.row.id)">编辑</span>
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
              <!-- <no-permission v-else></no-permission> -->
            </div>
            <scroll-data @getData="getData"
                         :dataLess="dataLess"></scroll-data>
            <!-- <v-pagination v-if="tableList.length > 20"
                          @pagingChange="getPagingChange"
                          :total="total"></v-pagination> -->
            <v-diaing :isDiaingShow="dialogVisible"
                      :deleteItem="deleteItem"
                      @confirmDelete="getConfirmDelete"
                      @closeModal="getCloseModal"></v-diaing>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import vPagination from '@/components/Pagination'
import vDiaing from '@/components/Diaing'
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'SystemRole',
  data () {
    return {
      dataLess: false, // 控制加载
      deleteItem: {}, // 被删除列表
      dialogVisible: false, // 弹框
      total: '', // 分页总条数
      routeName: '', // 路由名
      tableList: [], // 列表
      deleteSelection: [], // 勾选列表
      params: {
        pageNum: 1,
        pageSize: 32,
        roleName: ''
      }
    }
  },
  methods: {
    // 重置
    resetBtnForm () {
      this.params.roleName = ''
      this.resetForm()
    },
    resetForm () {
      this.dataLess = false
      this.params.pageNum = 1
      this.tableList = []
      this.getTableList()
    },
    // 编辑
    editRole (id) {
      this.$router.push({ name: 'SystemRoleAdd', query: { id: id } })
    },
    // 获取关键词
    getKeyword () {
      if (this.params.roleName.trim()) {
        this.resetForm()
      } else {
        this.$message.warning('请输入角色名称！')
      }
    },
    // 获取子组件传递分页参数
    getPagingChange (change) {
      this.$router.push({ name: 'AdminRole', query: { page: change.page, size: change.size } })
    },
    // 滚动加载
    getData () {
      this.params.pageNum++
      this.getTableList()
    },
    // 获取角色列表
    getTableList () {
      this.dataLess = false
      this.$http.post(this.$api.roleList, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.tableList.push(...datas)
          this.total = res.data.data.totalElements
          if (datas.length < 31) {
            this.dataLess = true
          }
        })
        .catch(() => {
          this.tableList = []
          this.dataLess = true
        })
    },
    handleSelectionChange (change) {
      this.deleteSelection = change
    },
    deleteRowList () {
      if (this.deleteSelection.length >= 1) {
        this.dialogVisible = true
        this.deleteItem = this.deleteSelection
      } else {
        this.$message.warning('请至少选择一条需要删除的数据！')
      }
    },
    addInfo () {
      this.$router.push({ name: 'SystemRoleAdd' })
    },
    deleteRow (index, row) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确认删除
    getConfirmDelete (item) {
      if (!Array.isArray(item)) {
        this.$http.get(`${this.$api.roleDelete}/${item.id}`)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功！')
              this.tableList.splice(item.index, 1)
              this.total--
            } else {
              this.$message.warning(res.data.message)
            }
          })
          .catch(() => {
          })
      } else {
        let ids = []
        for (let i = 0; i < item.length; i++) {
          ids.push(item[i].id)
        }
        this.$http.post(this.$api.roleDeleteBatch, { ids: ids })
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
    getCloseModal () {
      this.dialogVisible = false
    }
  },
  created () {
    this.routeName = this.$route.name
    this.getTableList()
  },
  components: {
    vDiaing,
    // vPagination,
    vMenu
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  watch: {
    '$route' () {
      this.getTableList()
    }
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
.admin-table {
  flex: 1;
}
.admin-table-box {
  margin-top: 22px;
}
.admin-role-name {
  display: flex;
  align-items: center;
}
.admin-btn {
  margin-bottom: 10px;
}
.admin-btn:last-child {
  margin-bottom: 0;
}
.admin-date {
  width: 220px;
  margin-right: 30px;
}
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.btn-box {
  margin-left: 20px;
}
.admin-keyword {
  width: 200px;
}
</style>
