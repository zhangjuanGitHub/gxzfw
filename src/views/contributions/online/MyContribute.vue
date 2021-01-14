<template>
  <div class="myLsseu container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OnlineArticleList' }">在线征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MyContribute' }">我的投稿</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="newset">
      <el-table :data="myContributeList"
                style="width: 100%"
                border>
        <el-table-column label="投稿标题"
                         prop="articleTitle">
          <!-- <template slot-scope="scope">
            <el-link type="primary"
                     @click="contributeDetails(scope.row.id)">{{scope.row.articleTitle}}</el-link>
          </template> -->
        </el-table-column>
        <el-table-column prop="userName"
                         width="220"
                         label="投稿人">
        </el-table-column>
        <el-table-column prop="departmentName"
                         width="200"
                         label="投稿人单位">
        </el-table-column>
        <el-table-column width="160"
                         label="操作">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="edit-click">
                <span @click="editRow(scope.row, scope.$index)">修改</span>
              </div>
              <div class="delete-click">
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
      myContributeList: [],
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
      this.getContributeList()
    },
    // 获取列表
    getContributeList () {
      this.$http.post(this.$api.myContributeList, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.myContributeList.push(...datas)
          if (datas < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 编辑
    editRow (row) {
      this.$router.push({ name: 'WriteContribute', query: { id: row.id, isModify: true } })
    },
    // 单个删除
    getConfirmDelete () {
      this.$http.get(`${this.$api.deleteContribute}?id=${this.deleteId}`)
        .then(res => {
          forEachSingleDelete(this.myContributeList, this.deleteId)
          this.$message.success('删除成功！')
        })
        .catch(() => { })
    },
    getCloseModal () {
      this.dialogVisible = false
    },
    // 详情
    contributeDetails (id) {
      this.$router.push({ name: 'WriteContribute', query: { id: id } })
    },
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteId = row.id
      // this.tableNews.splice(index, 1)
    }
  },
  created () {
    this.getContributeList()
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
}
.edit-click span{
  margin-left: 8px;
}
.delete-click {
  font-size: 14px;
  cursor: pointer;
  color: #f56c6c;
  margin-left: 10px;
}
</style>
