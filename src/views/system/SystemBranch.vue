<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemBranch' }">部门管理</el-breadcrumb-item>
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
          <div class="test-box" >
            <div class="admin-right-box">
              <!-- <div class="admin-tree">
                <div class="admin-tree-title">
                  <p><span class="admin-title-span">地区列表</span></p>
                </div>
                <div class="tree-box">
                  <el-tree :data="treeData"
                           :props="defaultProps"
                           node-key="value"
                           :default-expanded-keys="[this.treeFirstDataId]"
                           :expand-on-click-node="false"
                           @node-click="handleNodeClick"></el-tree>
                </div>
              </div> -->
              <div class="admin-table department-table">
                <div class="admin-search">
                  <div class="public-btn">
                    <el-button class="delete"
                               size="medium"
                               type="primary"
                               @click="addRowList">添加部门</el-button>
                  </div>
                  <!-- <div class="search-input border-radius search-box">
                    <span>单位名称：</span>
                    <el-input v-model="params.departmentName"
                              size="small"
                              placeholder="请输入单位名称"
                              class="admin-keyword">
                    </el-input>
                    <div class="btn-box">
                      <el-button size="small"
                                 @click="resetBtnForm">重置</el-button>
                      <el-button size="small"
                                 type="primary"
                                 @click="getKeyword">筛选</el-button>
                    </div>
                  </div> -->
                </div>
                <div class="admin-table-box">
                  <el-table ref="multipleTable"
                            :data="tableList"
                            border
                            row-key="id"
                            :tree-props="{children: 'childList', hasChildren: 'hasChildren'}"
                            style="width: 100%">
                            <!-- :expand-row-keys="[expends]" -->
                    <!-- <el-table-column type="selection"
                                     width="32">
                    </el-table-column> -->
                    <el-table-column label="部门名称"
                                     width="370"
                                     show-overflow-tooltip>
                      <template slot-scope="scope">{{ scope.row.sectionName }}</template>
                    </el-table-column>
                    <el-table-column prop="sectionDescribe"
                                     label="部门描述"
                                     width="450"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="270">
                      <template slot-scope="scope">
                        <div class="disflex-bet">
                          <div class="edit-click"
                               @click="editInfo(scope.row.id)">
                            <i class="el-icon-edit-outline"></i><span>编辑</span>
                          </div>
                          <div class="delete-click"
                               @click="deleteRow(scope.row, scope.$index)"
                               >
                            <i class="el-icon-delete"></i><span>删除</span>
                          </div>
                          <div class="edit-click"
                               @click="addChildrenDep(scope.row, scope.$index)">
                            <i class="el-icon-plus"></i><span>添加子部门</span>
                          </div>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <v-diaing :isDiaingShow="dialogVisible"
                        :deleteItem="deleteItem"
                        @confirmDelete="getConfirmDelete"
                        @closeModal="getCloseModal">
              </v-diaing>
              <!-- <scroll-data @getData="getData"
                           :dataLess="dataLess"></scroll-data> -->
            </div>
            <!-- <no-permission v-else></no-permission> -->
          </div>
          <!--          <div v-else class="text-center no-permission">-->
          <!--            <img :src="require('@/assets/images/error-page/noPermission.png')" alt="">-->
          <!--            <p>很抱歉，您没有访问此页面的权限</p>-->
          <!--          </div>-->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vDiaing from '@/components/Diaing'
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'SystemDepartment',
  data () {
    return {
      expends: '',
      treeFirstDataId: '',
      params: {
        pageNum: 1,
        pageSize: 20
      },
      dataLess: false, // 数量小于20
      tableList: [], // 部门列表
      treeData: [], // 地区列表
      dialogVisible: false,
      deleteItem: {}, // 需要删除的数据
      deleteSelection: [] // 勾选删除的数据
    }
  },
  methods: {
    // 确认删除
    getConfirmDelete (item) {
      // if (!Array.isArray(item)) {
      this.$http.get(`${this.$api.deleteBranch}?id=${item.id}`)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功！')
            this.ruleForm()
          }
        })
        .catch(() => {
        })
      // } else {
      //   let ids = []
      //   for (let i = 0; i < item.length; i++) {
      //     ids.push(item[i].id)
      //   }
      //   this.$http.post(this.$api.deleteBatch, { ids: ids })
      //     .then(res => {
      //       this.$message.success('删除成功！')
      //       this.ruleForm()
      //     })
      //     .catch(() => {
      //       this.$refs['multipleTable'].clearSelection()
      //     })
      // }
    },
    // 弹出模态框
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    ruleForm () {
      this.dataLess = true
      this.params.pageNum = 1
      this.tableList = []
      this.getList()
    },
    // 添加子部门
    addChildrenDep (item) {
      this.$router.push({ name: 'SystemBranchAdd', query: { braname: item.sectionName, braid: item.id } })
    },
    // 编辑部门
    editInfo (id) {
      this.$router.push({ name: 'SystemBranchAdd', query: { id: id } })
    },
    // 添加部门
    addRowList () {
      this.$router.push({ name: 'SystemBranchAdd' })
    },
    // 勾选删除数据
    handleSelectionChange (selection) {
      this.deleteSelection = selection
    },
    // 滚动加载
    getData () {
      this.params.pageNum++
      this.getList()
    },
    // 获取部门列表
    getList () {
      this.$http.get(this.$api.getBranchList)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            if (datas.length < 20) {
              this.dataLess = true
            }
            this.tableList.push(...datas)
            this.expends = String(this.tableList[0].id)
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.getList()
  },
  components: {
    vDiaing,
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
}
.admin-tree {
  width: 200px;
  border-left: 1px solid #dbdbdb;
  padding: 0 12px;
  overflow: hidden;
}
.admin-tree-title p {
  color: #309ade;
}
.admin-title-span {
  margin-left: 12px;
  font-size: 16px;
  line-height: 19px;
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
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.btn-box {
  margin-left: 20px;
}
.disflex-bet {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.admin-keyword {
  width: 200px;
}
</style>
