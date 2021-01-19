<template>
  <div class="plat-from">
    <div class="plat-seach">
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
    <div class="plat-table">
      <el-table :data="tableData"
                style="width: 100%"
                id="out-plat">
        <el-table-column prop="rank"
                         label="排名"
                         width="55">
          <template slot-scope="scope">{{scope.$index + 1}}</template>
        </el-table-column>
        <el-table-column prop="departmentName"
                         label="单位"
                         width="150">
        </el-table-column>
        <el-table-column :label="'信息报送 \n (权重' + this.weight.basicWeight +'%)'">
          <el-table-column prop="baseScore"
                           :label="'基础分 \n (权重' + this.weight.addFullScore +'%)'"
                           width="130"
                           sortable>
          </el-table-column>
          <el-table-column prop="bonus"
                           :label="'加分项 \n (权重' + this.weight.basicFullScore +'%)'"
                           width="130"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column :label="'统筹新媒体建设 \n (权重' + this.weight.xmtjzWeight +'%)'">
          <el-table-column prop="wxScore"
                           :label="'微信榜得分 \n (权重' + this.weight.wxWeight +'%)'"
                           width="130"
                           sortable>
          </el-table-column>
          <el-table-column prop="wbScore"
                           :label="'微博榜得分 \n (权重' + this.weight.wbWeight +'%)'"
                           width="130"
                           sortable>
          </el-table-column>
          <el-table-column prop="ttScore"
                           :label="'头条榜得分 \n (权重' + this.weight.ttWeight +'%)'"
                           width="130"
                           sortable>
          </el-table-column>
          <!-- <el-table-column prop="zxScore"
                           label="一点榜得分"
                           width="110">
          </el-table-column> -->
          <el-table-column prop="chScore"
                           :label="'采访报道策划活动 \n (权重' + this.weight.chWeight +'%)'"
                           width="140"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="totalScore"
                         label="总分"
                         sortable
                         width="90">
        </el-table-column>
      </el-table>
      <!-- <div class="tooltip-box"
           v-if="tableData.length > 0">
        <p>注：微信、微博、头条满分为 <span class="blue-color">{{xmtjz}}</span>，采访报道策划活动可输入最大分值为：<span class="blue-color">100</span></p>
      </div> -->
    </div>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  data () {
    return {
      xmtjz: '', // 微信微博等榜单最大值
      cfbdch: '', // 报道最大值
      ruleForm: {
        type: '',
        time: ''
      },
      tableData: [],
      weight: {
        basicWeight: 0,
        addFullScore: 0,
        basicFullScore: 0,
        xmtjzWeight: 0,
        wxWeight: 0,
        wbWeight: 0,
        ttWeight: 0,
        chWeight: 0
      } // 权重
    }
  },
  methods: {
    // 重置
    resetForm (form) {
      this.$refs[form].resetFields()
      this.getTotalList()
    },
    // 筛选
    searchList () {
      this.getTotalList()
    },
    // 获取榜单类型
    getShowListType () {
      this.$http.get(this.$api.showListType)
        .then(res => {
        })
        .catch(() => { })
    },
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-plat'))
      exportTable(XLSX, FileSaver, wb, '总体排行')
    },
    getTotalList () {
      this.$http.get(`${this.$api.queryGenList}?time=${this.ruleForm.time}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            this.tableData = datas
          }
        })
        .catch(() => { })
    },
    getWeight () {
      this.$http.get(this.$api.showMaaGenSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.weight = res.data.data
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
    // this.getShowListType() // 绑定类型
    this.getTotalList()
    this.getWeight()
  }
}
</script>
<style scoped>
.plat-from {
  padding: 20px;
}
.plat-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 12px;
}
.plat-seach > span {
  font-size: 14px;
  font-family: SimSun;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
}
.plat-table {
  margin-top: 18px;
}
.plat-foot div {
  width: 350px;
  height: 160px;
  background-color: #eeeff0;
}
.plat-foot div p {
  font-size: 20px;
  font-family: PingFang-SC-Regular;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 18px;
  float: right;
  margin-right: 17px;
  margin-top: 17px;
}
.plat-foot div p span {
  color: #2f9ff3;
  cursor: pointer;
}
.plat-foot .el-table td {
  padding: 14px 0;
}
.tooltip-box {
  margin-top: 25px;
}
.blue-color {
  color: #409eff;
}
</style>
