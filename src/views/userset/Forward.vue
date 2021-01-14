<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Forward' }">响应消息</el-breadcrumb-item>
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
              <div class="admin-table-box">
                <el-table ref="multipleTable"
                          :data="tableData"
                          border
                          style="width: 100%">
                  <el-table-column label="文章标题"
                                   prop="articleTitle"
                                   width="440">
                    <template slot-scope="scope">
                      <div class="title-u cursor " @click="openUrl(scope.row, scope.$index)">
                        {{scope.row.articleTitle}}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="发布单位"
                                   prop="publishDepartmentName"
                                   width="200">
                  </el-table-column>
                  <el-table-column prop="createTime"
                                   label="通告时间"
                                   width="210">
                  </el-table-column>
                  <el-table-column prop="createTime"
                                   label="是否已读"
                                   width="100">
                    <template slot-scope="scope">
                      <p v-if="scope.row.answerStatus"
                         class="activeClass">已读</p>
                      <p v-else
                         class="errorClass">未读</p>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作"
                                   width="140">
                    <template slot-scope="scope">
                      <el-button type="primary"
                                 size="small"
                                 v-if="!scope.row.answerStatus"
                                 @click="targetUrl(scope.row, scope.$index)">接受任务</el-button>
                      <p v-else
                         class="activeClass">已接受</p>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import vMenu from '@/views/userset/components/NewsMenu'
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
    targetUrl (item, index) {
      this.$http.get(`${this.$api.answerForwardMessage}?id=${item.id}`)
        .then(res => {
          item.answerStatus = 1
          this.$set(this.tableData, index, item)
          window.open(item.articleUrl, '_blank')
        })
        .catch(() => { })
    },
    openUrl (item, index) {
      window.open(item.articleUrl, '_blank')
    },
    getData () {
      this.page.pageNum++
      this.getList()
    },
    // 跳转详情
    jumpUrl (id) {
      this.$router.push({ name: 'InterviewDetails', query: { id: id } })
    },
    // 取消删除
    getCloseModal () {
      this.isDiaingShow = false
    },
    // 已读/批量删除
    handleSelectionChange (change) {
      this.selection = change
    },
    getList () {
      this.$http.post(this.$api.listForwardMessage, this.page)
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
    vMenu
  },
  computed: {
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
.activeClass {
  color: #67c23a;
}
.errorClass {
  color: #f56c6c;
}
.title-u {
color: #60b4f4;
  text-decoration: underline;
  cursor: pointer;
}
</style>
