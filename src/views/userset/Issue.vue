<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemIssue' }">议题消息</el-breadcrumb-item>
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
              <div class="admin-search">
                <div class="public-btn">
                  <el-button type="danger"
                             size="medium"
                             @click="deleteRow">批量删除</el-button>
                </div>
              </div>
              <div class="admin-table-box">
                <el-table ref="multipleTable"
                          :data="tableData"
                          border
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection"
                                   width="30">
                  </el-table-column>
                  <el-table-column label="发起人"
                                   width="140">
                    <template slot-scope="scope">{{ scope.row.createUserName }}</template>
                  </el-table-column>
                  <el-table-column prop="createDepartmentName"
                                   label="发起单位"
                                   width="200"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="issueTitle"
                                   label="议题"
                                   width="395">
                    <template slot-scope="scope">
                      <el-link type="primary"
                               @click="jumpUrl(scope.row.id)">{{scope.row.issueTitle}}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="replyNum"
                                   label="回复数"
                                   width="100"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="lastReplyTime"
                                   label="最后回复时间"
                                   width="220"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <!--                  <el-table-column label="操作"-->
                  <!--                                   width="140">-->
                  <!--                    <template slot-scope="scope">-->
                  <!--                      <div class="disflex">-->
                  <!--                        <div class="delete-click">-->
                  <!--                          <i class="el-icon-delete"></i><span @click="deleteSingle(scope.row, scope.$index)">删除</span>-->
                  <!--                        </div>-->
                  <!--                      </div>-->
                  <!--                    </template>-->
                  <!--                  </el-table-column>-->
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <no-permission v-else></no-permission> -->
    <v-diaing :isDiaingShow="isDiaingShow"
              @closeModal="getCloseModal"
              @confirmDelete="getConfirmDelete"
              :deleteItem="deleteItem"></v-diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
import vMenu from '@/views/userset/components/NewsMenu'
import vDiaing from '@/components/Diaing'
import { forEachSingleDelete, forEachMoreDelete } from '@/libs/tools'
export default {
  name: 'Issue',
  data () {
    return {
      dataLess: false,
      selection: [],
      isDiaingShow: false,
      page: {
        pageNum: 1,
        pageSize: 32
      },
      tableData: [],
      deleteItem: null
    }
  },
  methods: {
    getData () {
      this.page.pageNum++
      this.getList()
    },
    // 跳转详情
    jumpUrl (id) {
      // this.$http.get(`${this.$api.readMessage}?ids=${id}`)
      //   .then(res => {
      //     this.$store.commit('user/messageNumMinus')
      //   })
      //   .catch(() => {})
      this.$router.push({ name: 'IssueDetails', query: { id: id } })
    },
    // 取消删除
    getCloseModal () {
      this.isDiaingShow = false
    },
    // 确认删除
    getConfirmDelete () {
      let arr = []
      if (Array.isArray(this.deleteItem)) {
        this.deleteItem.forEach(item => {
          arr.push(item.id)
        })
      } else {
        arr.push(this.deleteItem.id)
      }
      this.$http.post(this.$api.deleteIssueMessage, { ids: arr })
        .then(res => {
          if (Array.isArray(this.deleteItem)) {
            forEachMoreDelete(arr, this.tableData)
          } else {
            forEachSingleDelete(this.tableData, this.deleteItem.id)
          }
          this.$message.success('操作成功！')
          this.page.pageNum = 1
          this.tableData = []
          this.getList()
        })
        .catch(() => { })
    },
    // 已读/批量删除
    handleSelectionChange (change) {
      this.selection = change
    },
    // 批量删除
    deleteRow () {
      if (this.selection.length >= 1) {
        this.deleteItem = this.selection
        this.isDiaingShow = true
      } else {
        this.$message.warning('请至少选择一条需要删除的数据！')
      }
    },
    // 单个删除
    deleteSingle (row) {
      this.deleteItem = row
      this.isDiaingShow = true
    },
    getList () {
      this.$http.post(this.$api.listIssueMessage, this.page)
        .then(res => {
          let datas = res.data.data.content
          this.tableData.push(...datas)
          if (datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.routeName = this.$route.name
    this.getList()
  },
  components: {
    vMenu,
    vDiaing
  }
}
</script>

<style scoped>
.admin-right-box {
  display: flex;
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
.role-p {
  font-size: 16px;
  color: #333333;
}
.role-p:before {
  content: "";
  width: 4px;
  height: 16px;
  background: #309ade;
  position: absolute;
}
.role-p span {
  margin-left: 12px;
}
.role-name-input {
  width: 280px;
  margin-left: 20px;
}
.admin-role-box {
  padding: 0 12px;
}
.admin-role-name {
  margin-bottom: 22px;
}
.admin-role-table {
  margin-top: 20px;
}
.admin-role-btn {
  text-align: right;
  padding-top: 70px;
}
</style>
