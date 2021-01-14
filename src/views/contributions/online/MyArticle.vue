<template>
  <div class="myLsseu container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OnlineArticleList' }">在线征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MyArticle' }">我的征稿</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="newset">
      <el-table :data="myArticleList"
                style="width: 100%"
                border>
        <el-table-column label="标题"
                         prop="solicitTitle">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="articleDetails(scope.row.id)">{{scope.row.solicitTitle}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="solicitStart"
                         label="发起时间"
                         width="220">
        </el-table-column>
        <el-table-column prop="solicitNum"
                         label="稿件数"
                         width="160">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="toArticleList(scope.row.id)">{{scope.row.solicitNum}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="240">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 0">待审理</span>
            <span v-if="scope.row.status == 1">通过</span>
            <span v-if="scope.row.status == 2">退回</span>
          </template>
        </el-table-column>
        <el-table-column prop="time"
                         width="160"
                         label="操作">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="edit-click">
                <span @click="modifyRow(scope.row, scope.$index)">修改</span>
              </div>
              <div class="edit-click">
                <span @click="deleteRow(scope.row, scope.$index)">删除</span>
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
      myArticleList: [],
      dialogVisible: false,
      deleteItem: {},
      deleteId: '',
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
      this.$http.post(this.$api.myArticleList, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.myArticleList.push(...datas)
          if (datas < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 编辑
    modifyRow (row) {
      this.$router.push({ name: 'WriteArticle', query: { id: row.id, isModify: true } })
    },
    // 跳转稿件列表
    toArticleList (id) {
      this.$router.push({ name: 'ArticleList', query: { id: id } })
    },
    // 单个删除
    getConfirmDelete () {
      this.$http.get(`${this.$api.deleteArticle}?id=${this.deleteId}`)
        .then(res => {
          forEachSingleDelete(this.myArticleList, this.deleteId)
          this.$message.success('删除成功！')
        })
        .catch(() => { })
    },
    getCloseModal () {
      this.dialogVisible = false
    },
    // 详情
    articleDetails (id) {
      this.$router.push({ name: 'ArticleDetail', query: { id: id, iscover: true } })
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
.myLsseu .el-table {
  margin-top: 15px;
}
.blue {
  cursor: pointer;
  color: #198ce2;
}
.newset .title {
  cursor: pointer;
}
.myLsseu .message-home-list i img {
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
  text-decoration: underline;
}
.edit-click:last-child{
  color: #f56c6c;
  margin-left: 5px;
}
</style>
