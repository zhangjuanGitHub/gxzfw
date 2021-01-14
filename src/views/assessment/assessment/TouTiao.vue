<template>
  <div class="headlines">
    <v-search @ruleForm="getRuleFormSearch"
              @exportExcel="exportExcel"
              @getTotalRank="getTotalRank"></v-search>
    <div class="headlines-table">
      <el-table :data="tableData"
                v-if="!showTotal"
                key="tableData"
                style="width: 100%"
                id="tt-data"
                border>
        <el-table-column label="排名"
                         width="80">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="账号名称"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link @click="showCityAssess(scope.row)">{{scope.row.nick}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="plNum"
                         :label="'评论数 \n (权重' + this.weight.pinglunNumWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="readNum"
                         :label="'阅读数 \n (权重' + this.weight.readNumWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="fansNum"
                         :label="'粉丝数 \n (权重' + this.weight.fansWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="publishNum"
                         :label="'发布数 \n (权重' + this.weight.publishWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="dzNum"
                         :label="'点赞数 \n (权重' + this.weight.dianzanNumWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column label="总分"
                         width="130">
          <template slot-scope="scope">{{scope.row.totalScore}}</template>
        </el-table-column>
      </el-table>
      <el-table :data="totalRank"
                v-else
                key="totalRank"
                style="width: 100%"
                id="tt-all"
                border>
        <el-table-column label="排名"
                         width="80">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="nick"
                         label="账号名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="plNum"
                         :label="'评论数 \n (权重' + this.weight.pinglunNumWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="readNum"
                         :label="'阅读数 \n (权重' + this.weight.readNumWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="fansNum"
                         :label="'粉丝数 \n (权重' + this.weight.fansWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="publishNum"
                         :label="'发布数 \n (权重' + this.weight.publishWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column prop="dzNum"
                         :label="'点赞数 \n (权重' + this.weight.dianzanNumWeight +'%)'"
                         width="120"
                         sortable>
        </el-table-column>
        <el-table-column label="总分"
                         width="130">
          <template slot-scope="scope">{{scope.row.totalScore}}</template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="regionName"
               :modal-append-to-body='false'
               :visible.sync="showAllDialog"
               width="60%"
               :close="closeRegion">
      <div>
        <el-button size="small"
                   type="primary"
                   class="region-export"
                   @click="exportRegion">导出</el-button>
        <el-table :data="regionData"
                  style="width: 100%"
                  id="tt-region"
                  border>
          <el-table-column label="排名"
                          width="80">
            <template slot-scope="scope">
              <p>{{scope.$index + 1}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="nick"
                          label="账号名称"
                          show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="plNum"
                          :label="'评论数 \n (权重' + this.weight.pinglunNumWeight +'%)'"
                          width="130">
          </el-table-column>
          <el-table-column prop="readNum"
                          :label="'阅读数 \n (权重' + this.weight.readNumWeight +'%)'"
                          width="130">
          </el-table-column>
          <el-table-column prop="fansNum"
                          :label="'粉丝数 \n (权重' + this.weight.fansWeight +'%)'"
                          width="130">
          </el-table-column>
          <el-table-column prop="publishNum"
                          :label="'发布数 \n (权重' + this.weight.publishWeight +'%)'"
                          width="130">
          </el-table-column>
          <el-table-column prop="dzNum"
                          :label="'点赞数 \n (权重' + this.weight.dianzanNumWeight +'%)'"
                          width="130">
          </el-table-column>
          <el-table-column label="总分"
                          width="160">
            <template slot-scope="scope">{{scope.row.totalScore}}</template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import vSearch from '../components/Search'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import ScrollData from '@/components/ScrollData'
import { exportTable } from '@/libs/tools'
export default {
  data () {
    return {
      dataLess: false,
      ruleForm: {
        time: '',
        pageNum: 1,
        pageSize: 20
      },
      tableData: [],
      weight: {
        readNumWeight: 0,
        pinglunNumWeight: 0,
        dianzanNumWeight: 0,
        fansWeight: 0,
        publishWeight: 0
      },
      showTotal: false,
      showAllDialog: false,
      regionData: [],
      regionName: '',
      totalRank: [],
      totalRule: {
        id: '',
        time: '',
        pageNum: 1,
        pageSize: 30
      }
    }
  },
  methods: {
    showCityAssess (row) {
      if (row.city) {
        this.showAllDialog = true
        this.regionName = row.city + '头条考核'
        let obj = {
          id: 3, // 头条
          city: row.city,
          time: row.time
        }
        this.$http.post(this.$api.showRegionList, obj)
          .then(res => {
            this.regionData = res.data.data
          })
      }
    },
    closeRegion () {
      this.regionData = []
    },
    getTotalRank (item) {
      this.dataLess = false
      if (item) {
        this.totalRule = item.form
        this.showTotal = item.show
        this.totalRank = []
      }
      this.totalRule.id = 3
      this.$http.post(this.$api.showChannelList, this.totalRule)
        .then(res => {
          let datas = res.data.data
          this.totalRank.push(...datas)
          if (datas.length < 30) {
            this.dataLess = true
          }
        })
    },
    getData () {
      if (this.showTotal) {
        this.totalRule.pageNum++
        this.getTotalRank()
      } else {
        this.ruleForm.pageNum++
        this.getRuleFormSearch()
      }
    },
    getRuleFormSearch (item) {
      this.dataLess = false
      if (item) {
        this.ruleForm = item.form
        this.showTotal = item.show
        this.tableData = []
      }
      this.$http.post(this.$api.showJrttList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            this.tableData.push(...datas)
            if (datas.length < 20) {
              this.dataLess = true
            }
          }
        })
        .catch(() => { })
    },
    getWeight () {
      this.$http.get(this.$api.showJrttSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.weight = res.data.data
          }
        })
        .catch(() => { })
    },
    // 定义导出Excel表格事件
    exportExcel () {
      if (this.showTotal) {
        let wb = XLSX.utils.table_to_book(document.querySelector('#tt-all'))
        exportTable(XLSX, FileSaver, wb, '头条总排行榜单')
      } else {
        let wb = XLSX.utils.table_to_book(document.querySelector('#tt-data'))
        exportTable(XLSX, FileSaver, wb, '头条市级排行榜单')
      }
    },
    exportRegion () {
      let wb = XLSX.utils.table_to_book(document.querySelector('#tt-region'))
      exportTable(XLSX, FileSaver, wb, `${this.regionName}`)
    }
  },
  created () {
    // this.getRuleFormSearch()
    this.getWeight()
  },
  components: {
    vSearch,
    ScrollData
  }
}
</script>
<style>
.headlines-table .el-table th{
  background: #F5F7FA;
}
</style>
<style scoped>
.headlines {
  padding: 20px;
}
.headlines .headlines-table {
  margin-top: 20px;
}
.headlines .headlines-table .el-table .cell {
  padding: 0;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.headlines-foot {
  margin-top: 14px;
  float: right;
}
</style>
