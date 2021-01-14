<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemMessage' }">全部消息</el-breadcrumb-item>
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
                  <el-button class="new"
                             size="medium"
                             type="primary"
                             @click="readMessage">标记为已读</el-button>
                  <el-button class="delete"
                             size="medium"
                             type="danger"
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
                  <el-table-column label="消息标题"
                                   prop="messageTitle"
                                   width="280"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column label="消息内容"
                                   prop="messageContent"
                                   width="480"
                                   show-overflow-tooltip>
                    <template slot-scope="scope">
                      <p class="title-u cursor"
                        @click="targetUrl(scope.row.messageType, scope.row.id, scope.row.extraParam, scope.row.readStatus, scope.row)"
                        :class="scope.row.readStatus? '':'err'">{{scope.row.messageContent}}</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="readStatus"
                                   label="是否已读"
                                   width="100">
                    <template slot-scope="scope">
                      <p v-if="scope.row.readStatus === true"
                         class="activeClass">已读</p>
                      <p v-else
                         class="errorClass">未读</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="pushTime"
                                   label="接收时间"
                                   width="195"
                                   show-overflow-tooltip>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <no-permission v-else></no-permission> -->
    <diaing :isDiaingShow="isDiaingShow"
            @closeModal="getCloseModal"
            @confirmDelete="getConfirmDelete"
            :deleteItem="deleteItem"></diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
import diaing from '@/components/Diaing'
import vMenu from '@/views/userset/components/NewsMenu'
const action = new Map([
  [0, 'reload'],
  [1, 'TeamMessage'],
  [2, 'IssueDetails'],
  [3, 'InterviewDetails'],
  [4, 'Station'],
  [5, 'Forward'],
  [6, 'PublishDetail'],
  [7, 'videoOnline'],
  [8, 'ArticleDetail']
])
export default {
  name: 'System',
  data () {
    return {
      dataLess: false,
      isDiaingShow: false,
      routeName: '',
      keyword: '',
      tableData: [],
      selection: [],
      page: {
        pageNum: 1,
        pageSize: 32
      },
      deleteItem: {}
    }
  },
  methods: {
    // 点击内容跳转相应类型页面
    targetUrl (type, id, articleId, status, row) {
      this.$http.get(`${this.$api.readMessage}?ids=${id}`)
        .then(res => {
          if (!status) { // 如果是未读状态，改变header数量
            row.readStatus = true
            this.$store.commit('user/messageNumMinus')
          }
        })
        .catch(() => {})
      switch (type) {
        case 0:
          this.$router.go(0)
          break
        case 1:
          this.$router.push({ name: action.get(type), query: { data: row.pushTime } })
          break
        case 2:
          articleId = JSON.parse(articleId).issueId
          this.$router.push({ name: action.get(type), query: { id: articleId } })
          break
        case 3:
          articleId = JSON.parse(articleId).interviewId
          this.$router.push({ name: action.get(type), query: { id: articleId } })
          break
        case 4:
          this.$router.push({ name: action.get(type) })
          break
        case 5:
          this.$router.push({ name: action.get(type) })
          break
        case 6:
          articleId = JSON.parse(articleId).articleId
          this.$router.push({ name: action.get(type), query: { id: articleId, type: 1 } })
          break
        case 601:
          if (JSON.parse(row.extraParam).isFinish) {
            this.$router.push({ name: 'MyMessageList' })
          } else {
            this.$router.push({ name: 'RoughList' })
          }
          break
        case 602:
          this.$router.push({ name: 'AuditList' })
          break
        case 603:
          this.$router.push({ name: 'MyMessageList' })
          break
        case 604:
          this.$router.push({ name: 'MyMessageList' })
          break
        case 605:
          this.$router.push({ name: 'MyMessageList' })
          break
        case 606:
          this.$router.push({ name: 'RoughList' })
          break
        case 607:
          this.$router.push({ name: 'Release' })
          break
        case 7:
          window.open(articleId)
          break
        case 8:
          articleId = JSON.parse(articleId).solicitId
          this.$router.push({ name: action.get(type), query: { id: articleId, iscover: true } })
      }
    },
    getData () {
      this.page.pageNum++
      this.getDataList()
    },
    // 取消删除
    getCloseModal () {
      this.isDiaingShow = false
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
    // 点击单个删除
    deleteSingle (item, index) {
      this.deleteItem = item
      this.deleteItem.index = index
      this.isDiaingShow = true
    },
    getConfirmDelete (item) {
      let arr = []
      item.forEach(item => {
        arr.push(item.id)
      })
      this.$http.get(`${this.$api.deleteMessage}?ids=${arr.join(',')}`)
        .then(res => {
          item.forEach((sitem) => {
            this.tableData.forEach((val, index) => {
              if (sitem.id === val.id) {
                this.tableData.splice(index, 1)
                if (!sitem.readStatus) { // 如果是未读状态，改变header数量
                  this.$store.commit('user/messageNumMinus')
                }
              }
            })
          })
          this.$message.success('删除成功!')
          this.page.pageNum = 1
          this.tableData = []
          this.getDataList()
        })
        .catch(() => { })
    },
    // 获取消息列表
    getDataList () {
      this.$http.post(this.$api.systemMessage, this.page)
        .then(res => {
          if (res.data.data.content) {
            let datas = res.data.data.content
            this.tableData.push(...datas)
            if (datas.length < 20) {
              this.dataLess = true
            }
          }
        })
        .catch(() => { })
    },
    // 已读/批量删除
    handleSelectionChange (change) {
      this.selection = change
    },
    // 确认已读
    readMessage () {
      if (this.selection.length !== 0) {
        let arr = []
        this.selection.forEach(item => {
          arr.push(item.id)
        })
        this.$http.get(`${this.$api.readMessage}?ids=${arr.join(',')}`)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功！')
              this.selection.forEach(item => {
                this.tableData.forEach((val, index) => {
                  if (item.id === val.id) {
                    if (!val.readStatus) { // 如果是未读状态，改变header数量
                      this.$store.commit('user/messageNumMinus')
                      val.readStatus = true
                    }
                    this.$refs.multipleTable.clearSelection()
                  }
                })
              })
            }
          })
          .catch(() => { })
      } else {
        this.$message.warning('请勾选消息！')
      }
    }
  },
  created () {
    this.routeName = this.$route.name
    this.getDataList()
  },
  components: {
    vMenu,
    diaing
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
.activeClass {
  color: #67c23a;
}
.errorClass {
  color: #f56c6c;
}
.err {
  color: #60b4f4;
  font-weight: bold;
}
.title-u {
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
