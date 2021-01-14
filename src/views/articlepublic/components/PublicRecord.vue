<!--
 * @Author: MaiChao
 * @Date: 2020-11-11 09:58:28
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-11 16:03:36
-->
<template>
  <div class="record">
    <!-- 搜索框 -->
    <div class="search-box">
      <el-form size="small"
               :model="fromData"
               :inline="true"
               ref="froms"
               class="dis-flex">
        <el-form-item prop="publishSuccess"
                      class="item-style"
                      label="发布状态:">
          <el-select class="item-style"
                     v-model="fromData.publishSuccess"
                     placeholder="全部">
            <el-option label="发布失败"
                       :value="false"></el-option>
            <el-option label="发布成功"
                       :value="true"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item-style"
                      label="发布时间:"
                      prop="times">
          <el-date-picker v-model="fromData.times"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="item-style"
                      label="标题关键字:"
                      prop="articleTitle">
          <el-input placeholder="请输入关键字"
                    v-model="fromData.articleTitle"></el-input>
        </el-form-item>
        <el-form-item class="item-style last-button">
          <el-button size="small"
                     type="primary"
                     @click="queryAll">筛选</el-button>
          <el-button size="small"
                     class="search_reset"
                     @click="resetForm('froms')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border
              max-height="615px"
              :data="tableData"
              style="width: 99.9%"
              class="message-list">
      <el-table-column prop="publishTime"
                       label="发布时间"
                       width="185">
      </el-table-column>
      <el-table-column prop="articleTitle"
                       label="标题">
        <template slot-scope='scope'>
          <div v-text="scope.row.articleTitle"></div>
        </template>
      </el-table-column>
      <el-table-column prop="departmentName"
                       label="投稿单位"
                       width="150">
      </el-table-column>
      <el-table-column prop="publishUserName"
                       label="投稿用户"
                       width="110">
      </el-table-column>
      <el-table-column prop="accountName"
                       label="发布账号"
                       width="110">
      </el-table-column>
      <el-table-column prop="publishSuccess"
                       label="发布状态"
                       width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.publishSuccess"
             class="color-greed">发布成功</p>
          <p v-if="!scope.row.publishSuccess"
             class="color-red">发布失败</p>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                       width="140">
        <template slot-scope="scope">
          <div class="dis-flex operation">
            <div class="change-click color-green pointer text-click" v-if="!scope.row.publishSuccess">
              <span @click="againRow(scope.row, scope.$index)">重新发布</span>
            </div>
            <!-- <div class="delete-click color-red pointer text-click">
              <span @click="deleteRow(scope.row, scope.$index)">删除</span>
            </div> -->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="content_page">
      <pagination @pagingChange="getPagingChange"
                  :total="total"
                  ref="child"></pagination>
    </div>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
    <!-- 确认发布弹框 -->
    <el-dialog title="确认重新发布文章?"
               :visible.sync="publicShow"
               :modal="false"
               width="35%"
               :before-close="pubClose">
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="publishWeixin">确定</el-button>
        <el-button @click="pubClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vDiaing from '@/components/Diaing'
import pagination from '@/components/Pagination.vue'
// import { watch } from 'fs'
export default {
  data () {
    return {
      total: 100,
      publicShow: false, // 重新发布弹框
      dialogVisible: false, // 删除弹出框
      deleteItem: {}, // 删除数据
      recordApi: '', // 列表接口
      punlicApi: '', // 重新发布接口
      fromData: {
        name: '', // 所属人
        times: [], // 日期数组
        publishSuccess: '', // 流程状态
        articleTitle: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      tableData: []
    }
  },
  methods: {
    // 分页
    getPagingChange (change) {
      this.fromData.pageNum = change.page
      this.fromData.pageSize = change.size
      this.getMyarticle()
    },
    // 筛选
    queryAll () {
      this.$refs.child.handleCurrentChange(1)
    },
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.fromData.pageNum = 1
      this.$refs.child.handleCurrentChange(1)
    },
    // 获取列表信息
    getMyarticle () {
      this.$http.post(this.recordApi, this.fromData)
        .then(res => {
          if (res.data.data) {
            this.tableData = res.data.data.content
            this.total = res.data.data.totalElements
          }
        })
        .catch(() => { })
    },
    // 跳转组合页面
    combination () {

    },
    // 跳转稿件详情
    checkRow (row, index) {
      window.open(row.url, '_blank')
    },
    // 重新发布
    againRow (row, index) {
      this.publicShow = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确认发布
    publishWeixin () {
      this.$http.get(this.publicApi, { params: { id: this.deleteItem.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.publicShow = false
            this.$message.success('发布成功!')
            this.getMyarticle()
          }
        })
        .catch(() => {
          this.publicShow = false
          this.getMyarticle()
        })
    },
    // 取消发布
    pubClose () {
      this.deleteItem = {}
      this.publicShow = false
    },
    // 删除当前行数据
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确认删除
    getConfirmDelete (item) {
      this.$http.get(this.$api.articleDelete, { params: { id: item.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.tableData.splice(item.index, 1)
            this.$message.success('操作成功!')
          }
        })
        .catch(() => {
        })
    },
    // 关闭
    getCloseModal () {
      this.deleteItem = {}
      this.dialogVisible = false
    }
  },
  components: {
    vDiaing,
    pagination
  },
  created () {
    if (this.$route.name === 'PublicRecordWx') {
      this.recordApi = this.$api.wxHistory
      this.publicApi = this.$api.wxrepublish
    } else if (this.$route.name === 'PublicRecordWb') {
      this.recordApi = this.$api.wbHistory
      this.publicApi = this.$api.wbrepublish
    }
    this.getMyarticle()
  },
  watch: {
    $route (to, from) {
      console.log(this.$route.name)
      if (this.$route.name === 'PublicRecordWx') {
        this.recordApi = this.$api.wxHistory
        this.publicApi = this.$api.wxrepublish
      } else if (this.$route.name === 'PublicRecordWb') {
        this.recordApi = this.$api.wbHistory
        this.publicApi = this.$api.wbrepublish
      }
      this.getMyarticle()
    }
  }
}
</script>
<style scoped>
/* .content_page {
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 0px;
  padding-bottom: 10px;
  z-index: 999;
} */
.delete-click {
  margin-left: 5px;
}
.search-box {
  padding: 9px 8px;
  background: #e8ebf2;
  overflow: hidden;
  margin-bottom: 15px;
}
.search-box .el-form{
  flex-wrap: wrap;
}
.item-style {
  display: flex;
  margin-bottom: 0px;
}
.item-style .el-select {
  width: 160px;
}
.item-style .el-input {
  width: 160px;
}
.item-style .el-date-editor {
  width: 270px;
}
</style>
