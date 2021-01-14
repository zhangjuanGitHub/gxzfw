<template>
  <div class="manu personal">
    <div class="manu-seach">
      <el-form :inline="true"
               ref="ruleForm"
               :model="ruleForm"
               class="demo-form-inline">
        <el-form-item label="时间"
                      prop="time">
          <el-date-picker v-model="ruleForm.time"
                          size="small"
                          type="month"
                          format="yyyy 年 MM 月"
                          value-format="yyyy-MM"
                          placeholder="请选择年月">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="单位"
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
        <el-table-column prop="userName"
                         label="用户名"
                         width="180">
          <template slot-scope="scope">
            <div>{{scope.row.userName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="province"
                         label="单位"
                         width="180">
          <template slot-scope="scope">
            <el-link @click="showTeamDialog(scope.row)"
                     type="primary">{{scope.row.departmentName}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="本月稿件投稿情况(篇数)">
          <el-table-column prop="anum"
                           label="A稿篇数"
                           width="140">
          </el-table-column>
          <el-table-column prop="bnum"
                           label="B稿篇数"
                           width="140">
          </el-table-column>
          <el-table-column prop="zfNum"
                           label="省院公众号转发篇数"
                           width="160">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="viUseNum"
                         label="视频稿件被采用篇数"
                         width="100">
        </el-table-column>
        <el-table-column prop="totalScore"
                         label="最后得分"
                         width="115">
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
        type: 2,
        time: '',
        company: '',
        keyword: '',
        pageNum: 1,
        pageSize: 32
      },
      listType: [], // 绑定类型
      dialogVisible: false,
      ismodal: false,
      tableData: [],
      dataLess: false
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
            this.tableData.push(...res.data.data)
            if (res.data.data.length < 20) {
              this.dataLess = true
            }
          }
        })
        .catch(() => { })
    },
    // 获取榜单类型
    getShowListType () {
      this.$http.get(this.$api.showListType)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.listType = res.data.data
            this.listType.sort((a, b) => {
              return a.id - b.id
            })
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getShowAocamList()
    this.getShowListType()
  },
  components: {
    dialogTable
  }
}
</script>
<style scoped>
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
.personal .el-input,
.personal .el-select {
  width: 150px;
}
</style>
