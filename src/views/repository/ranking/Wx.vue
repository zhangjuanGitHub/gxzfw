<template>
  <div class="content-box new-media">
    <v-search @getSearchList="getSearchList" @exportExcel="exportExcel"></v-search>
    <div>
      <el-table :data="tableData"
                style="width: 100%"
                border
                class="out-summary">
        <el-table-column prop="uploadDate"
                          label="排名"
                          width="60">
          <template slot-scope="scope">
            {{(ruleForm.pageNum - 1) * ruleForm.pageSize + (scope.$index + 1)}}
          </template>
        </el-table-column>
        <el-table-column label="标题"
                          prop="title"
                          show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <p v-html="scope.row.title" @click="targetUrl(scope.row.url)"></p> -->
            <el-link type="primary" v-html="scope.row.title" :href="scope.row.url" target="_blank"></el-link>
          </template>
        </el-table-column>
        <el-table-column prop="screenName"
                          label="来源"
                          width="90">
        </el-table-column>
        <el-table-column prop="releaseTime"
                          label="上传日期"
                          width="100">
        </el-table-column>
        <el-table-column prop="readnum"
                          label="阅读数"
                          width="80">
        </el-table-column>
        <el-table-column prop="dianzannum"
                          label="点赞数"
                          width="80">
        </el-table-column>
        <el-table-column prop="attentionNum"
                          label="关注度"
                          width="80">
        </el-table-column>
        <el-table-column prop="hotnum"
                          label="传播指数"
                          width="90">
        </el-table-column>
      </el-table>
    </div>
    <v-page @pagingChange="pagingChange"
            :total="total" ref="myPage"></v-page>
  </div>
</template>

<script>
import vPage from '@/components/Pagination.vue'
import vSearch from '../components/RankingSearch'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  name: 'Wx',
  data () {
    return {
      ruleForm: {
        source: 1,
        keyword: '',
        function: '全部',
        time: [],
        pageNum: 1,
        pageSize: 20,
        sortDirection: 'desc', // 排序 asc
        sortField: 'hotnum',
        optionSort: ['hotnum', 'desc4']
      },
      total: 0,
      tableData: []
    }
  },
  methods: {
    pagingChange (query) {
      this.ruleForm.pageNum = query.page
      this.ruleForm.pageSize = query.size
      this.getList()
    },
    getSearchList (form) {
      this.ruleForm = form
      this.ruleForm.source = 1
      this.tableData = []
      this.$refs.myPage.handleCurrentChange(1)
      // this.getList()
    },
    exportExcel () {
      var wb = XLSX.utils.table_to_book(document.querySelector('.out-summary'))
      exportTable(XLSX, FileSaver, wb, '微信热点排行')
    },
    getList () {
      this.$http.post(this.$api.findHotRanking, this.ruleForm)
        .then(res => {
          this.tableData = res.data.data.content
          this.total = res.data.data.totalElements
        })
    }
  },
  created () {
  },
  components: {
    vSearch,
    vPage
  }
}
</script>
<style lang="scss">
@import "../repository";
</style>
<style scoped>
.new-media {
  background: #ffffff;
  padding: 20px;
  min-height: 500px;
}
</style>
