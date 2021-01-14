<template>
  <div class="website">
    <div class="website-search">
      <el-form :inline="true"
               ref="ruleForm"
               :model="ruleForm"
               class="demo-form-inline">
        <!-- <el-form-item label="职能:"
                      prop="function">
          <el-select v-model="ruleForm.function"
                     size="small"
                     placeholder="请选择职能">
            <el-option v-for="(item, index) of functionList"
                       :label="item"
                       :value="item"
                       :key="index"></el-option>
          </el-select>
        </el-form-item> -->
       <!-- <el-form-item label="地区:"
                     prop="region">
         <el-select v-model="ruleForm.region"
                    placeholder="请选择地区"
                    size="small">
           <el-option :value="item"
                      :label="item"
                      v-for="(item, index) of region"
                      :key="index"></el-option>
         </el-select>
       </el-form-item> -->
        <el-form-item label="关键字"
                      prop="keyword">
          <el-input size="small"
                    placeholder="请输入单位名称"
                    v-model="ruleForm.keyword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small"
                     @click="searchList"
                     type="primary">筛选</el-button>
          <el-button size="small"
                     @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button size="small"
                     type="primary"
                     @click="exportExcel">导出</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="website-table">
      <el-table :data="tableData"
                style="width: 100%"
                id="out-website">
        <el-table-column prop="rank"
                         label="排名"
                         width="60">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <!-- <el-table-column prop="func"
                         label="职能"
                         width="65">
        </el-table-column> -->
        <el-table-column prop="departmentName"
                         label="单位名称"
                         show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="每月更新篇数">
          <el-table-column label="1月"
                           width="60"
                           prop="january"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '01')">{{scope.row.january}}</div>
            </template>
          </el-table-column>
          <el-table-column label="2月"
                           width="60"
                           prop="february"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '02')">{{scope.row.february}}</div>
            </template>
          </el-table-column>
          <el-table-column label="3月"
                           width="60"
                           prop="march"
                           sortable="custom">
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '03')">{{scope.row.march}}</div>
            </template>
          </el-table-column>
          <el-table-column label="4月"
                           width="60"
                           prop="april"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '04')">{{scope.row.april}}</div>
            </template>
          </el-table-column>
          <el-table-column label="5月"
                           width="60"
                           prop="may"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '05')">{{scope.row.may}}</div>
            </template>
          </el-table-column>
          <el-table-column label="6月"
                           width="60"
                           prop="june"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '06')">{{scope.row.june}}</div>
            </template>
          </el-table-column>
          <el-table-column label="7月"
                           width="60"
                           prop="july"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '07')">{{scope.row.july}}</div>
            </template>
          </el-table-column>
          <el-table-column label="8月"
                           width="60"
                           prop="august"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '08')">{{scope.row.august}}</div>
            </template>
          </el-table-column>
          <el-table-column label="9月"
                           width="60"
                           prop="september"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '09')">{{scope.row.september}}</div>
            </template>
          </el-table-column>
          <el-table-column label="10月"
                           width="60"
                           prop="october"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '10')">{{scope.row.october}}</div>
            </template>
          </el-table-column>
          <el-table-column label="11月"
                           width="60"
                           prop="november"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '11')">{{scope.row.november}}</div>
            </template>
          </el-table-column>
          <el-table-column label="12月"
                           width="60"
                           prop="december"
                           sortable>
            <template slot-scope="scope">
              <div class="checkBox"
                   @click="showTeamDialog(scope.row, '12')">{{scope.row.december}}</div>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
    <div v-if="total>30">
      <pagination @pagingChange="getPagingChange"
                  :total="total"></pagination>
    </div>
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal="ismodal"
                 center>
        <diagram v-bind:echartsData="echartsData"></diagram>
      </el-dialog>
    </div>
    <!--    <scroll-data @getData="getData" :dataLess="dataLess"></scroll-data>-->
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import diagram from '../components/Diagram'
import { exportTable } from '@/libs/tools'
import pagination from '@/components/Pagination'
export default {
  data () {
    return {
      echartsData: {
        eid: 1,
        year: new Date().getFullYear(),
        month: 1
      },
      total: 1,
      dataLess: false,
      functionList: [], // 职能
      region: [], // 地区
      ruleForm: {
        keyword: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      dialogVisible: false,
      ismodal: false,
      tableData: []
    }
  },
  methods: {
    // 分页
    getPagingChange (change) {
      this.ruleForm.pageNum = change.page
      this.$router.push({ name: 'AssessmentWebsite', query: { page: change.page } })
    },
    getData () {
      this.ruleForm.pageNum++
      this.getWzList()
    },
    resetForm (form) {
      this.$refs[form].resetFields()
      this.ruleForm.pageNum = 1
      this.getWzList()
    },
    searchList () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.getWzList()
    },
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-website'))
      exportTable(XLSX, FileSaver, wb, '门户网站考核榜单')
    },
    // 点击月份查看
    showTeamDialog (row, month) {
      console.log(row)
      let rows = {
        eid: row.eid,
        year: new Date().getFullYear(),
        month: month
      }
      if (new Date().getMonth() + 1 === 1) {
        rows.year = new Date().getFullYear() - 1
      }
      console.log(new Date().getMonth())
      this.echartsData = rows
      this.dialogVisible = !this.dialogVisible
    },
    getWzList () {
      this.$http.post(this.$api.showWzList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            this.tableData = datas.count
            this.total = datas.total
            if (datas.count < 20) {
              this.dataLess = true
            }
          }
        })
        .catch(() => { })
    },
    // 获取职能
    getShowFunction () {
      this.$http.get(this.$api.showFunction)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.functionList = res.data.data
          }
        })
        .catch(() => { })
    },
    // 获取地区
    getQueryArea () {
      this.$http.get(this.$api.wzAreaList)
        .then(res => {
          this.region = res.data.data
        })
        .catch(() => { })
    }
  },
  created () {
    this.ruleForm.pageNum = this.$route.query.page || 1
    this.getWzList()
    // this.getShowFunction()
    // this.getQueryArea() // 获取地区
  },
  components: {
    diagram,
    pagination
  },
  watch: {
    '$route' () {
      this.getWzList()
    }
  }
}
</script>
<style scoped>
.website {
  padding: 20px;
}
.website-search {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 12px;
}
.website-table {
  margin-top: 18px;
}
#pagin button {
  background-color: transparent;
}
.website .cell .checkBox {
  text-decoration: underline;
  color: #f63;
  cursor: pointer;
}
.website .user-dialog .el-dialog__body {
  height: 478px;
  box-sizing: border-box;
  padding: 25px 30px 38px 42px;
}

.website .el-icon-close {
  display: inline-block;
  position: absolute;
  width: 20px;
  height: 20px;
  font-size: 20px;
  color: #ccc;
  top: 30px;
  right: 30px;
  cursor: pointer;
}
.website .el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.3);
}
.website .el-form-item {
  margin-bottom: 0px;
}
</style>
