<template>
  <div class="manu">
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
        <el-table-column prop="departmentName"
                         label="单位">
        </el-table-column>
        <el-table-column label="本月稿件投稿情况(篇数)">
          <el-table-column prop="anum"
                           :label="'A稿篇数 \n (系数' + this.weight.aaCoe +')'"
                           width="180"
                           sortable>
          </el-table-column>
          <el-table-column prop="bnum"
                           :label="'B稿篇数 \n (系数' + this.weight.bbCoe +')'"
                           width="180"
                           sortable>
          </el-table-column>
          <el-table-column prop="zfNum"
                           :label="'被自治区院公众号转发篇数 \n (系数' + this.weight.zfCoe +')'"
                           width="180"
                           sortable>
          </el-table-column>
        </el-table-column>
        <el-table-column prop="totalScore"
                         label="最后得分"
                         width="160"
                         sortable>
        </el-table-column>
      </el-table>
    </div>
    <div class="user-dialog">
      <el-dialog :title="departmentName + '区县榜'"
                 :visible.sync="dialogVisible"
                 :modal-append-to-body="false">
        <dialog-table :datas="propDatas"></dialog-table>
      </el-dialog>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
import dialogTable from '@/views/assessment/components/DialogTable'
export default {
  data () {
    return {
      departmentName: '', // 单位名称
      propDatas: {}, // 向子组件传值
      ruleForm: {
        time: '',
        pageNum: 1,
        pageSize: 32
      },
      listType: [], // 绑定类型
      dialogVisible: false,
      ismodal: false,
      tableData: [],
      dataLess: false,
      weight: {
        aaCoe: 0,
        bbCoe: 0,
        zfCoe: 0
        // viWeight: 0
      } // 权重
    }
  },
  methods: {
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
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-manu'))
      exportTable(XLSX, FileSaver, wb, '稿件贡献考核')
    },
    showTeamDialog (rows) {
      this.departmentName = rows.departmentName
      let row = {
        areaId: rows.id,
        time: this.ruleForm.time,
        pageNum: 1,
        pageSize: 32
      }
      this.propDatas = row
      this.dialogVisible = !this.dialogVisible
    },
    // 获取列表
    getShowAocamList () {
      this.$http.post(this.$api.showAocamList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            this.tableData.push(...datas.data)
            if (datas.data.length < 20) {
              this.dataLess = true
            }
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
    },
    // 获取榜单类型
    getShowListType () {
      this.$http.get(this.$api.showListType)
        .then(res => {
          this.listType = res.data.data
          this.listType.sort((a, b) => {
            return a.id - b.id
          })
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
    this.getShowAocamList()
    this.getWeight()
  },
  components: {
    dialogTable
  }
}
</script>
<style scoped>
.manu {
  padding: 20px;
}
.manu-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 12px;
}
.manu-table {
  margin-top: 18px;
}
.manu .manu-table .el-table .cell {
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

.manu .cell .checkBox {
  text-decoration: underline;
  color: #f63;
  cursor: pointer;
}

.manu .el-icon-close {
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
.manu .el-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.3);
}
.manu .caret-wrapper {
  position: absolute;
  top: -6px;
  right: -3px;
}
</style>
