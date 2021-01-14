<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Interview' }">约访消息</el-breadcrumb-item>
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
                  <!--                  <el-button class="new" size="small" @click="addInfo">删除</el-button>-->
                  <el-button class="delete"
                             type="danger"
                             size="medium"
                             @click="deleteRow">批量删除</el-button>
                </div>
              </div>
              <div class="admin-table-box">
                <el-table v-if="isMediaUser"
                          ref="multipleTable"
                          :data="tableData"
                          border
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection"
                                   width="30">
                  </el-table-column>
                  <el-table-column label="约访对象"
                                   width="220">
                    <template slot-scope="scope">{{ scope.row.applyUserName }}</template>
                  </el-table-column>
                  <el-table-column prop="interviewTheme"
                                   label="约访主题"
                                   width="445">
                    <template slot-scope="scope">
                      <el-link type="primary"
                               @click="jumpUrl(scope.row.id)">{{scope.row.interviewTheme}}</el-link>
                    </template>
                  </el-table-column>
                  <el-table-column label="状态"
                                   width="120"
                                   show-overflow-tooltip>
                    <template slot-scope="scope">
                      <p v-if='scope.row.replyStatus === 1'
                         class='activeClass'>已接受</p>
                      <p v-else-if='scope.row.replyStatus === 2'
                         class='errorClass'>已拒绝</p>
                      <p v-else>未回复</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="applyTime"
                                   label="发送时间"
                                   width="270"
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
                <el-table v-else
                          ref="multipleTable"
                          :data="tableData"
                          border
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection"
                                   width="30">
                  </el-table-column>
                  <el-table-column label="申请人"
                                   width="140">
                    <template slot-scope="scope">{{ scope.row.applyUserName }}</template>
                  </el-table-column>
                  <el-table-column prop="applyDepartmentName"
                                   label="申请人单位"
                                   width="200"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="interviewTheme"
                                   label="申请主题"
                                   width="395"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="状态"
                                   width="100"
                                   show-overflow-tooltip>
                    <template slot-scope="scope">
                      <p v-if='scope.row.replyStatus === 1'
                         class='activeClass'>已同意</p>
                      <p v-else-if='scope.row.replyStatus === 2'
                         class='errorClass'>已拒绝</p>
                      <p v-else>未回复</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="receiveTime"
                                   label="接收时间"
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
import { mapState } from 'vuex'
import vDiaing from '@/components/Diaing'
import { forEachSingleDelete, forEachMoreDelete } from '@/libs/tools'
export default {
  name: 'System',
  data () {
    return {
      dataLess: false,
      selection: [],
      deleteItem: null,
      isDiaingShow: false,
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 32
      }
    }
  },
  methods: {
    getData () {
      this.page.pageNum++
      this.getList()
    },
    // 跳转详情
    jumpUrl (id) {
      this.$http.get(`${this.$api.readMessage}?ids=${id}`)
        .then(res => {
          this.$store.commit('user/messageNumMinus')
        })
        .catch(() => {})
      this.$router.push({ name: 'InterviewDetails', query: { id: id } })
    },
    // 取消删除
    getCloseModal () {
      this.isDiaingShow = false
    },
    // 确认删除 批量/单删
    getConfirmDelete () {
      let arr = []
      if (Array.isArray(this.deleteItem)) {
        this.deleteItem.forEach(item => {
          arr.push(item.id)
        })
      } else {
        arr.push(this.deleteItem.id)
      }
      this.$http.post(this.$api.deleteInterviewMessage, { ids: arr })
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
      this.$http.post(this.$api.listInterviewMessage, this.page)
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
    this.getList()
  },
  components: {
    vMenu,
    vDiaing
  },
  computed: {
    ...mapState({
      isMediaUser: state => state.user.userInfo.isMediaUser // 是否是媒体用户
    })
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
.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f10909;
}
</style>
