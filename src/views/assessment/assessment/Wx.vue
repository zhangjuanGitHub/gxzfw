<template>
  <div class="wechat">
    <v-search @ruleForm="getRuleFormSearch"
              @exportExcel="exportExcel"
              @getTotalRank="getTotalRank"></v-search>
    <div class="wechat-table">
      <el-table :data="tableData"
                v-if="!showTotal"
                key="tableData"
                style="width: 100%"
                id="wx-data">
        <el-table-column label="排名"
                         width="63">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="账号名称"
                         prop="nick"
                         width="170">
          <template slot-scope="scope">
            <el-link @click="showCityAssess(scope.row)">{{scope.row.nick}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="活跃度">
          <el-table-column prop="articlesNum"
                           :label="'文章数 \n (权重' + this.weight.artNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="releasesNum"
                           :label="'发布次数 \n (权重' + this.weight.pubNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="传播力">
          <el-table-column prop="aveReadNum"
                           :label="'平均阅读数 \n (权重' + this.weight.aveReadNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="maxReadNum"
                           :label="'最高阅读数 \n (权重' + this.weight.maxReadNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="认可度">
          <el-table-column prop="avePointNum"
                           :label="'平均点赞数 \n (权重' + this.weight.aveDzWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="maxPointNum"
                           :label="'最高点赞数 \n (权重' + this.weight.highestDzWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总分"
                         width="110">
          <template slot-scope="scope">{{scope.row.totalScore}}</template>
        </el-table-column>
      </el-table>
      <el-table :data="totalRank"
                v-else
                key="totalRank"
                style="width: 100%"
                id="wx-all">
        <el-table-column label="排名"
                         width="63">
          <template slot-scope="scope">
            <p>{{scope.$index + 1}}</p>
          </template>
        </el-table-column>
        <el-table-column label="账号名称"
                         prop="nick"
                         width="170">
        </el-table-column>
        <el-table-column label="活跃度">
          <el-table-column prop="articlesNum"
                           :label="'文章数 \n (权重' + this.weight.artNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="releasesNum"
                           :label="'发布次数 \n (权重' + this.weight.pubNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="传播力">
          <el-table-column prop="aveReadNum"
                           :label="'平均阅读数 \n (权重' + this.weight.aveReadNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="maxReadNum"
                           :label="'最高阅读数 \n (权重' + this.weight.maxReadNumWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="认可度">
          <el-table-column prop="avePointNum"
                           :label="'平均点赞数 \n (权重' + this.weight.aveDzWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column prop="maxPointNum"
                           :label="'最高点赞数 \n (权重' + this.weight.highestDzWeight +'%)'"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column label="总分"
                         width="110">
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
                  id="wx-region">
          <el-table-column label="排名"
                          width="63">
            <template slot-scope="scope">
              <p>{{scope.$index + 1}}</p>
            </template>
          </el-table-column>
          <el-table-column label="账号名称"
                          prop="nick"
                          show-overflow-tooltip>
          </el-table-column>
          <el-table-column label="活跃度">
            <el-table-column prop="articlesNum"
                            :label="'文章数 \n (权重' + this.weight.artNumWeight +'%)'"
                            width="110">
            </el-table-column>
            <el-table-column prop="releasesNum"
                            :label="'发布次数 \n (权重' + this.weight.pubNumWeight +'%)'"
                            width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column label="传播力">
            <el-table-column prop="aveReadNum"
                            :label="'平均阅读数 \n (权重' + this.weight.aveReadNumWeight +'%)'"
                            width="110">
            </el-table-column>
            <el-table-column prop="maxReadNum"
                            :label="'最高阅读数 \n (权重' + this.weight.maxReadNumWeight +'%)'"
                            width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column label="认可度">
            <el-table-column prop="avePointNum"
                            :label="'平均点赞数 \n (权重' + this.weight.aveDzWeight +'%)'"
                            width="110">
            </el-table-column>
            <el-table-column prop="maxPointNum"
                            :label="'最高点赞数 \n (权重' + this.weight.highestDzWeight +'%)'"
                            width="110">
            </el-table-column>
          </el-table-column>
          <el-table-column label="总分"
                          width="100">
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
        function: '政法委',
        region: '',
        time: '',
        pageNum: 1,
        pageSize: 30
      },
      tableData: [],
      weight: {
        artNumWeight: 0,
        pubNumWeight: 0,
        aveReadNumWeight: 0,
        maxReadNumWeight: 0,
        aveDzWeight: 0,
        highestDzWeight: 0
      }, // 权重
      showTotal: false,
      showAllDialog: false,
      regionData: [],
      regionName: '',
      totalRank: [],
      totalRule: {
        id: '',
        time: '',
        function: '政法委',
        pageNum: 1,
        pageSize: 30
      }
    }
  },
  mounted () {
  },
  methods: {
    showCityAssess (row) {
      if (row.city) {
        this.showAllDialog = true
        console.log('💖💖🎨🧶')
        this.regionName = row.city + '微信考核'
        let obj = {
          id: 1, // 微信
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
      this.totalRule.id = 1
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
      this.$http.post(this.$api.showWxList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            this.tableData.push(...datas)
            if (datas.length < 30) {
              this.dataLess = true
            }
          }
        })
        .catch(() => { })
    },
    getWeight () {
      this.$http.get(this.$api.showWxSettings)
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
        let wb = XLSX.utils.table_to_book(document.querySelector('#wx-all'))
        exportTable(XLSX, FileSaver, wb, '微信总排行榜单')
      } else {
        let wb = XLSX.utils.table_to_book(document.querySelector('#wx-data'))
        exportTable(XLSX, FileSaver, wb, '微信市级排行榜单')
      }
    },
    exportRegion () {
      let wb = XLSX.utils.table_to_book(document.querySelector('#wx-region'))
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
<style scoped>
.wechat {
  padding: 20px;
}
.wechat-table {
  margin-top: 18px;
}
.wechat .wechat-table .el-table .cell {
  padding: 0;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.wechat-foot {
  margin-top: 14px;
  float: right;
}
#pagin button {
  background-color: transparent;
}
</style>
