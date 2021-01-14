<template>
  <div class="general">
    <div class="general-table">
      <el-table :data="tableData"
                id="out-general">
        <el-table-column prop="rank"
                         label="排名"
                         width="65">
          <template slot-scope="scope">
            {{scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column prop="departmentName"
                         label="单位"
                         width="210">
        </el-table-column>
        <el-table-column :label="'信息报送 \n (系数' + this.weight.basicWeight +'%)'">
          <el-table-column :label="'基础分 \n (系数' + this.weight.addFullScore +'%)'"
                           prop="baseScore"
                           width="120"
                           sortable>
          </el-table-column>
          <el-table-column :label="'加分项 \n (系数' + this.weight.basicFullScore +'%)'"
                           prop="bonus"
                           width="120"
                           sortable>
          </el-table-column>
        </el-table-column>
        <!--        weight: {-->
        <!--        basicWeight: 0,-->
        <!--        addFullScore: 0,-->
        <!--        basicFullScore: 0,-->
        <!--        xmtjzWeight: 0,-->
        <!--        wxWeight: 0,-->
        <!--        wbWeight: 0,-->
        <!--        ttWeight: 0,-->
        <!--        chWeight: 0-->
        <!--        } // 权重-->
        <el-table-column :label="'统筹新媒体建设 \n (系数' + this.weight.xmtjzWeight +'%)'">
          <el-table-column :label="'微信榜得分 \n (系数' + this.weight.wxWeight +'%)'"
                           prop="wxScore"
                           width="140"
                           sortable>
          </el-table-column>
          <el-table-column :label="'微博榜得分 \n (系数' + this.weight.wbWeight +'%)'"
                           width="140"
                           sortable
                           prop="wbScore">
          </el-table-column>
          <el-table-column :label="'头条榜得分 \n (系数' + this.weight.ttWeight +'%)'"
                           width="140"
                           sortable
                           prop="ttScore">
          </el-table-column>
          <el-table-column :label="'采访报道策划活动 \n (系数' + this.weight.chWeight +'%)'"
                           width="140">
            <template slot-scope="scope">
              <div slot="reference">
                <el-input @input="getBlur(scope.row)"
                          v-model="scope.row.chScore"
                          placeholder="请输入分值0~100"></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table-column>
<!--        <el-table-column prop="totalScore"-->
<!--                         label="总分"-->
<!--                         width="80">-->
<!--        </el-table-column>-->
      </el-table>
    </div>
    <div class="general-foot"
         v-if="tableData.length > 0">
      <!-- <span>注：微信、微博、头条满分为 <span class="blue-color">{{wxwbFullScore}}</span>，采访报道策划活动可输入最大分值为：<span class="blue-color">{{reportScore}}</span></p> -->
      <el-button type="primary"
                 @click="submitForm">发布</el-button>
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
      reportScore: 0, // 输入采访报道分超过这个分值则按此分值计算
      wxwbFullScore: 0, // 计算总分时，微信、微博、一点、头条四项值超过此值则按此值计算
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
    submitForm () {
      for (let row in this.tableData) {
        this.tableData[row].chScore = parseInt(this.tableData[row].chScore)
        if (this.tableData[row].chScore > 100) {
          this.$message.warning('采访报道策划活动最大值为100!')
          return false
        }
      }
      this.$http.post(this.$api.genListAcc, this.tableData)
        .then(res => {
          this.$message.success('操作成功！')
          this.$router.push({ name: 'AssessmentTotal' })
        })
        .catch(() => { })
    },
    // 失去焦点验证类型
    getBlur (row) {
      var reg = /^[0-9][0-9]*$/
      if (!reg.test(row.chScore)) {
        this.$message.warning('请输入数字!')
      }
      if (row.chScore > 100) {
        this.$message.warning('采访报道策划活动最大值为100!')
      }
    },
    // 计算总分
    getChange (row, index) {
      // let calaNum = null
      // let calaWx = row.wxScore + row.wbScore + row.ttScore + row.zxScore
      // // if (row.wxScore)
      // // 计算微博、微信、一点、头条
      // if (calaWx >= this.wxwbFullScore) {
      //   calaNum = this.wxwbFullScore
      // } else {
      //   calaNum = calaWx
      // }
      // // 计算采访报道输入值
      // if (parseFloat(row.interviewScore) >= this.reportScore) {
      //   row.interviewScore = 50
      // }
      // row.totalScore = calaNum + parseFloat(row.interviewScore || 0) + row.baseScore + row.bonus
      // this.$set(this.tableData, index, row)
    },
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-general'))
      exportTable(XLSX, FileSaver, wb, '总榜考核')
    },
    getGenList () {
      this.$http.get(this.$api.showGenList)
        .then(res => {
          // let datas = res.data.data
          // this.wxwbFullScore = res.data.data.wxwbFullScore
          // this.reportScore = res.data.data.reportScore
          // if (datas.length >= 1) {
          //   datas.forEach((item, index) => {
          //     let calaNum = null
          //     let calaWx = item.wxScore + item.wbScore + item.ttScore + item.zxScore
          //     if (calaWx >= this.wxwbFullScore) {
          //       calaNum = this.wxwbFullScore
          //     } else {
          //       calaNum = calaWx
          //     }
          //     item.totalScore = calaNum + item.baseScore + item.bonus
          //   })
          // }
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            this.weight = datas.qz
            this.tableData = datas.data
            this.tableData.forEach(item => {
              if (!item.chScore) {
                item.chScore = 0
              }
            })
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getGenList()
  }
}
</script>
<style scoped>
.general .el-table .el-table__row td {
  padding: 0;
}
.general .cell div {
  display: flex;
  justify-content: space-around;
  text-align: center;
}
.general .cell div span {
  display: inline-block;
  height: 43px;
  line-height: 43px;
}
.general .cell .el-input input {
  box-sizing: border-box;
  padding: 0;
  border-radius: 0;
  text-align: center;
}
.general .general-table .el-table .cell {
  padding: 0px;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
  box-sizing: border-box;
}
.general-foot {
  float: right;
  margin: 10px 0;
}
.blue-color {
  color: #409eff;
}
.general .el-table tr {
  height: 49px;
}
.general {
  padding: 20px;
}
</style>
