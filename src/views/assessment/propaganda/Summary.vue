<template>
  <div class="summary">
    <div class="summary-seach">
      <el-form :inline="true"
               ref="ruleForm"
               :model="ruleForm"
               class="demo-form-inline">
        <el-form-item label="主题日期"
                      prop="activityDate">
          <el-date-picker v-model="ruleForm.activityDate"
                          size="small"
                          type="date"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          placeholder="请选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="上报单位"
                      prop="departmentId">
          <el-select v-model="ruleForm.departmentId"
                     size="small"
                     placeholder="请选择上报单位">
            <el-option :label="item.departmentName"
                       :value="item.id"
                       v-for="(item, index) of listDep"
                       :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="主题名称"
                      prop="activitySubject">
          <el-input size="small"
                    v-model="ruleForm.activitySubject"
                    placeholder="请输入主题名称"></el-input>
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
    <div class="summary-table">
      <el-table :data="tableData"
                style="width: 100%"
                border
                id="out-summary">
        <el-table-column prop="activityDate"
                         label="举办日期"
                         width="95">
        </el-table-column>
        <el-table-column prop="departmentName"
                         label="上报单位"
                         width="150">
        </el-table-column>
        <el-table-column prop="activityType"
                         label="主题类型"
                         width="80">
        </el-table-column>
        <el-table-column prop="activitySubject"
                         label="主题名称"
                         width="200">
          <template slot-scope="scope">
            <div v-html="scope.row.activitySubject"
                 class="describe"></div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime"
                         label="上传日期"
                         width="100">
        </el-table-column>
        <el-table-column prop="activityDescribe"
                         label="活动介绍"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-tooltip :content="scope.row.activityDescribe" placement="top" v-if="scope.row.activityDescribe.length > 57">
              <div v-html="scope.row.activityDescribe"
                 class="describe"></div>
            </el-tooltip>
            <div v-else v-html="scope.row.activityDescribe"></div>
          </template>
        </el-table-column>
        <el-table-column prop="annex"
                         label="附件"
                         width="140">
          <template slot-scope="scope">
            <ul class="describe">
              <li v-for="(item, index) of scope.row.activityResultsFiles"
                  :key="index">
                <p class="targetUrl cursor"
                   @click="targetUrl(item.filePath)">{{item.fileName}}</p>
              </li>
            </ul>
          </template>
        </el-table-column>
        <!--        <el-table-column prop="operation"-->
        <!--                         label="操作">-->
        <!--          <template slot-scope=""></template>-->
        <!--        </el-table-column>-->
      </el-table>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  data () {
    return {
      listDep: '',
      ruleForm: {
        activityDate: '', // 上传日期
        departmentId: '', // 上报单位
        activitySubject: '', // 关键词
        pageNum: 1,
        pageSize: 32
      },
      dialogVisible: false,
      ismodal: false,
      tableData: [],
      dataLess: false
    }
  },
  methods: {
    targetUrl (url) {
      window.open(url, '_blank')
    },
    getCloseModal () {
      this.dialogVisible = false
    },
    // 重置
    resetForm (form) {
      this.$refs[form].resetFields()
      this.reset()
    },
    reset () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.getShowAocamList()
    },
    // 筛选
    searchList () {
      this.reset()
    },
    // 分页
    getData () {
      this.ruleForm.pageNum++
      this.getShowAocamList()
    },
    // 定义导出Excel表格事件
    exportExcel () {
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-summary'))
      exportTable(XLSX, FileSaver, wb, '上报汇总')
    },
    // 获取列表
    getShowAocamList () {
      this.$http.post(this.$api.listActivityResults, this.ruleForm)
        .then(res => {
          let datas = res.data.data.content
          if (datas.length) {
            this.tableData.push(...datas)
            if (datas.length < 20) {
              this.dataLess = true
            }
          } else {
            this.tableData = []
          }
        })
        .catch(() => { })
    },
    // 获取上报单位
    getDepType () {
      this.$http.get(this.$api.listAll)
        .then(res => {
          this.listDep = res.data.data
        })
        .catch(() => { })
    }
  },
  created () {
    this.getShowAocamList()
    this.getDepType()
  },
  components: {
  }
}
</script>
<style>
.summary-table .el-table th {
  background: #f5f7fa;
}
</style>
<style scoped>
.summary {
  padding: 20px;
}
.summary-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 12px;
}
.summary-table {
  margin-top: 18px;
}
.summary .summary-table .el-table .cell {
  padding: 0;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.summary-foot {
  margin-top: 14px;
  float: right;
}

.summary .cell .checkBox {
  text-decoration: underline;
  color: #f63;
  cursor: pointer;
}

.summary .el-icon-close {
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
.summary .el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.3);
}
.summary .caret-wrapper {
  position: absolute;
  top: -6px;
  right: -3px;
}
.summary-seach .el-select {
  width: 190px;
}
.targetUrl {
  color: #2c8ae5;
  margin-top: 10px;
  border-bottom: 1px solid #2c8ae5;
}
.describe {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
</style>
