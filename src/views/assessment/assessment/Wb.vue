<template>
  <div class="microblog">
    <v-search @ruleForm="getRuleFormSearch"
              @exportExcel="exportExcel"
              @getTotalRank="getTotalRank"></v-search>
    <div class="microblog-table">
      <el-table :data="tableData"
                v-if="!showTotal"
                key="tableData"
                style="width: 100%"
                id="out-microblog">
        <el-table-column prop="rank"
                         label="排名"
                         width="64">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="账号名称">
          <template slot-scope="scope">
            <el-link @click="showCityAssess(scope.row)">{{scope.row.nick}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="影响力">
          <el-table-column prop="funsNum"
                           :label="'粉丝数 \n (权重' + this.weight.fansNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="活跃度">
          <el-table-column prop="microblogsNum"
                           :label="'发微博数 \n (权重' + this.weight.pubNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="originalNum"
                           :label="'原创微博数 \n (权重' + this.weight.originalNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="传播度">
          <el-table-column prop="plNum"
                           :label="'评论数 \n (权重' + this.weight.pinglunNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="zfNum"
                           :label="'转发数 \n (权重' + this.weight.zhuanfaNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="dzNum"
                           :label="'点赞数 \n (权重' + this.weight.dianzanNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="totalScore"
                         label="总分"
                         width="110">
        </el-table-column>
      </el-table>
      <el-table :data="totalRank"
                v-else
                key="totalRank"
                style="width: 100%"
                id="wb-all">
        <el-table-column prop="rank"
                         label="排名"
                         width="64">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="nick"
                         label="账号名称"
                         width="170">
        </el-table-column>
        <el-table-column label="影响力">
          <el-table-column prop="funsNum"
                           :label="'粉丝数 \n (权重' + this.weight.fansNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="活跃度">
          <el-table-column prop="microblogsNum"
                           :label="'发微博数 \n (权重' + this.weight.pubNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="originalNum"
                           :label="'原创微博数 \n (权重' + this.weight.originalNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="传播度">
          <el-table-column prop="plNum"
                           :label="'评论数 \n (权重' + this.weight.pinglunNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="zfNum"
                           :label="'转发数 \n (权重' + this.weight.zhuanfaNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="dzNum"
                           :label="'点赞数 \n (权重' + this.weight.dianzanNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="totalScore"
                         label="总分"
                         width="110">
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
                  id="wb-region">
          <el-table-column prop="rank"
                          label="排名"
                          width="64">
            <template slot-scope="scope">
              <p>{{scope.$index + 1}}</p>
            </template>
          </el-table-column>
          <el-table-column prop="nick"
                          label="账号名称"
                          show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="影响力">
            <el-table-column prop="funsNum"
                            :label="'粉丝数 \n (权重' + this.weight.fansNumWeight +'%)'"
                            width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column label="活跃度">
            <el-table-column prop="microblogsNum"
                            :label="'发微博数 \n (权重' + this.weight.pubNumWeight +'%)'"
                            width="110">
            </el-table-column>
            <el-table-column prop="originalNum"
                            :label="'原创微博数 \n (权重' + this.weight.originalNumWeight +'%)'"
                            width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column label="传播度">
            <el-table-column prop="plNum"
                            :label="'评论数 \n (权重' + this.weight.pinglunNumWeight +'%)'"
                            width="110">
            </el-table-column>
            <el-table-column prop="zfNum"
                            :label="'转发数 \n (权重' + this.weight.zhuanfaNumWeight +'%)'"
                            width="110">
            </el-table-column>
            <el-table-column prop="dzNum"
                            :label="'点赞数 \n (权重' + this.weight.dianzanNumWeight +'%)'"
                            width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column prop="totalScore"
                          label="总分"
                          width="110">
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
import ScrollData from '@/components/ScrollData'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  data () {
    return {
      ruleForm: {
        function: '全部',
        region: '',
        time: '',
        pageNum: 1,
        pageSize: 30
      },
      tableData: [],
      dataLess: false,
      weight: {
        fansNumWeight: 0,
        pubNumWeight: 0,
        originalNumWeight: 0,
        pinglunNumWeight: 0,
        zhuanfaNumWeight: 0,
        dianzanNumWeight: 0
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
        this.regionName = row.city + '微博考核'
        let obj = {
          id: 2, // 微博
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
      this.totalRule.id = 2
      this.$http.post(this.$api.showChannelList, this.totalRule)
        .then(res => {
          let datas = res.data.data
          this.totalRank.push(...datas)
          if (datas.length < 30) {
            this.dataLess = true
          }
        })
    },
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      if (this.showTotal) {
        let wb = XLSX.utils.table_to_book(document.querySelector('#wb-all'))
        exportTable(XLSX, FileSaver, wb, '微博总排行榜单')
      } else {
        let wb = XLSX.utils.table_to_book(document.querySelector('#out-microblog'))
        exportTable(XLSX, FileSaver, wb, '微博市级排行榜单')
      }
    },
    exportRegion () {
      let wb = XLSX.utils.table_to_book(document.querySelector('#wb-region'))
      exportTable(XLSX, FileSaver, wb, `${this.regionName}`)
    },
    getRuleFormSearch (item) {
      this.dataLess = false
      if (item) {
        this.ruleForm = item.form
        this.showTotal = item.show
        this.tableData = []
      }
      this.$http.post(this.$api.showWbList, this.ruleForm)
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
      this.$http.get(this.$api.showWbSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.weight = res.data.data
          }
        })
        .catch(() => { })
    },
    getData () {
      if (this.showTotal) {
        this.totalRule.pageNum++
        this.getTotalRank()
      } else {
        this.ruleForm.pageNum++
        this.getRuleFormSearch()
      }
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
<style scoped>
.microblog {
  padding: 20px;
}
.microblog-table {
  margin-top: 18px;
}
.microblog .microblog-table .el-table .cell {
  padding: 0;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.microblog-foot {
  margin-top: 14px;
  float: right;
}
#pagin button {
  background-color: transparent;
}
</style>
