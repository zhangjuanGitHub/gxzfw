<template>
  <div class="myissue container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'IssueList' }">议题列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MyIssueList' }">我的议题</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="newset">
      <el-table :data="myList"
                style="width: 100%"
                border>
        <el-table-column label="标题"
                         width="670">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="lussedetail(scope.row.id)">{{scope.row.issueTitle}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="发起时间"
                         width="240">
        </el-table-column>
        <el-table-column label="回复数/阅读人数"
                         width="200">
          <template slot-scope="scope">
            {{scope.row.replyNum}}/{{scope.row.readNum}}
          </template>
        </el-table-column>
        <el-table-column prop="time"
                         label="操作">
          <template slot-scope="scope">
            <div class="disflex"
                 v-if="scope.row.answerStatus !== 1">
              <div class="edit-click">
                <i class="el-icon-edit-outline"></i><span @click="editRow(scope.row, scope.$index)">修改</span>
              </div>
              <div class="delete-click">
                <i class="el-icon-delete"></i><span @click="deleteRow(scope.row, scope.$index)">删除</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <no-permission v-else></no-permission> -->
    </div>
    <v-diaing :isDiaingShow="dialogVisible"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import vDiaing from '@/components/Diaing'
import { forEachSingleDelete } from '@/libs/tools'
export default {
  data () {
    return {
      dialogVisible: false,
      deleteItem: {},
      deleteId: '',
      myList: [],
      params: {
        pageNum: 1,
        pageSize: 32
      },
      dataLess: false
    }
  },
  methods: {
    getData () {
      this.params.pageNum++
      this.getMyList()
    },
    // 获取列表
    getMyList () {
      this.$http.post(this.$api.listSelfIssus, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.myList.push(...datas)
          if (datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 编辑
    editRow (row) {
      this.$router.push({ name: 'WriteIssue', query: { id: row.id } })
    },
    // 单个删除
    getConfirmDelete () {
      this.$http.get(`${this.$api.deleteIssus}?id=${this.deleteId}`)
        .then(res => {
          forEachSingleDelete(this.myList, this.deleteId)
          this.$message.success('删除成功！')
        })
        .catch(() => { })
    },
    getCloseModal () {
      this.dialogVisible = false
    },
    lussedetail (id) {
      this.$router.push({ name: 'IssueDetails', query: { id: id } })
    },
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteId = row.id
      // this.tableNews.splice(index, 1)
    }
  },
  created () {
    this.getMyList()
  },
  components: {
    vDiaing
  }
}
</script>
<style scoped>
.myissue .el-table {
  margin-top: 15px;
}
.blue {
  cursor: pointer;
  color: #198ce2;
}
.newset .title {
  cursor: pointer;
}
.myissue .message-home-list i img {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 7px;
  margin-top: -3px;
}
.disflex {
  display: flex;
}
.edit-click {
  font-size: 14px;
  color: #70ade4;
  cursor: pointer;
}
.delete-click {
  font-size: 14px;
  cursor: pointer;
  color: #f56c6c;
  margin-left: 20px;
}
</style>
