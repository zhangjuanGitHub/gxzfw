<template>
  <div class="container assessment">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'AssessmentWx' }">管理与考核</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Response' }">响应性评估</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="assessment-box">
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
          <div class="response">
            <div class="manu-seach">
              <el-form :inline="true"
                       ref="ruleForm"
                       :model="ruleForm"
                       class="demo-form-inline">
                <el-form-item label="选择日期"
                              prop="time">
                  <el-date-picker v-model="ruleForm.time"
                                  size="small"
                                  type="month"
                                  format="yyyy 年 MM 月"
                                  value-format="yyyy-MM"
                                  placeholder="请选择年月">
                  </el-date-picker>
                </el-form-item>
                <!-- <el-form-item label="单位"
                              prop="company">
                  <el-select v-model="ruleForm.company"
                             size="small"
                             placeholder="请选择单位">
                    <el-option label="市检一分院"
                               value="1"></el-option>
                    <el-option label="市检二分院"
                               value="2"></el-option>
                    <el-option label="市检三分院"
                               value="3"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字"
                              prop="keyword">
                  <el-input size="small"
                            v-model="ruleForm.keyword"
                            placeholder="请输入关键字"></el-input>
                </el-form-item> -->
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
            <div class="manu-table">
              <el-table :data="tableData"
                        style="width: 100%"
                        id="out-manu">
                <el-table-column prop="rank"
                                 label="排名"
                                 width="65">
                  <template slot-scope="scope">
                    {{scope.$index + 1}}
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="userName"
                                 label="用户名"
                                 width="180">
                  <template slot-scope="scope">
                    <div>{{scope.row.userName}}</div>
                  </template>
                </el-table-column> -->
                <el-table-column prop="departmentName"
                                 label="单位"
                                 width="310">
                </el-table-column>
                <el-table-column label="本月响应任务完成情况">
                  <el-table-column prop="totalNum"
                                   label="响应任务数"
                                   width="330"
                                   sortable>
                  </el-table-column>
                  <el-table-column prop="answerNum"
                                   label="实际完成数"
                                   width="330"
                                   sortable>
                  </el-table-column>
                  <!-- <el-table-column prop="zfNum"
                                   label="点赞评论任务数"
                                   width="170">
                  </el-table-column>
                  <el-table-column prop="zfNum"
                                   label="实际完成总数"
                                   width="170">
                  </el-table-column> -->
                </el-table-column>
                <!-- <el-table-column prop="viUseNum"
                                 label="视频稿件被采用篇数"
                                 width="100">
                </el-table-column> -->
                <el-table-column prop="fraction"
                                 label="最后得分"
                                 width="310"
                                 sortable>
                </el-table-column>
              </el-table>
            </div>
            <!-- <scroll-data @getData="getData"
                         :dataLess="dataLess"></scroll-data> -->
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
import vMenu from '@/views/assessment/components/Menu'
export default {
  name: 'Construct',
  data () {
    return {
      ruleForm: {
        time: ''
      },
      tableData: [],
      dataLess: false
    }
  },
  methods: {
    // 重置
    resetForm (form) {
      this.$refs[form].resetFields()
      this.reset()
    },
    reset () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.getResponeList()
    },
    // 筛选
    searchList () {
      this.reset()
    },
    // 分页
    getData () {
      this.ruleForm.pageNum++
      this.getResponeList()
    },
    // 定义导出Excel表格事件
    exportExcel () {
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-manu'))
      exportTable(XLSX, FileSaver, wb, '稿件贡献考核')
    },
    // 获取列表
    getResponeList () {
      this.$http.get(`${this.$api.gatherForwardMessage}?yearMonth=${this.ruleForm.time}`)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            this.tableData.push(...datas)
            if (datas.length < 20) {
              this.dataLess = true
            }
          } else {
            this.tableData = []
          }
        })
        .catch(() => { })
    }
  },
  created () {
    let myDate = new Date()
    let tYear = myDate.getFullYear()
    let tMonth = myDate.getMonth()
    if (tMonth === 0) {
      tYear = tYear - 1
      tMonth = 12
    }
    let m = tMonth
    if (m.toString().length === 1) {
      m = '0' + m
    }
    // this.ruleForm.time = tYear + '-' + m
    if (tMonth !== 0) {
      this.ruleForm.time = tYear + '-' + m
    } else {
      this.ruleForm.time = tYear - 1 + '-' + 12
    }
    this.getResponeList()
  },
  components: {
    vMenu
  }
}
</script>

<style lang="scss">
@import "./assessment";
</style>
<style lang="scss" scoped>
.assessment-span {
  display: flex;
  align-items: center;
}
.assessment-span img {
  margin-right: 5px;
}
.response {
  width: 100%;
  min-height: 500px;
  background-color: #fff;
  padding: 15px;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 2px 4px 0px,
    rgba(0, 0, 0, 0.04) 0px 0px 6px 0px;
}
.response .manu-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 12px;
}
.manu-table {
  margin-top: 18px;
}
.response .manu-table .el-table .cell {
  padding: 0;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.manu-foot {
  margin-top: 14px;
  float: right;
}

.response .cell .checkBox {
  text-decoration: underline;
  color: #f63;
  cursor: pointer;
}

.response .el-icon-close {
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
.response .el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.3);
}
.response .caret-wrapper {
  position: absolute;
  top: -6px;
  right: -3px;
}
.response .el-input,
.response .el-select {
  width: 250px;
}
</style>
