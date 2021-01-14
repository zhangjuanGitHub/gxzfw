<template>
  <div class="Matrix">
    <div class="headCont">
      <el-button size="small" type="primary" @click="exportExcel">导出</el-button>
    </div>
    <el-table :data="matrixDetailsList"
              border
              class="show-table"
              style="width: 100%"
              id="out-Matrix">
      <el-table-column prop="region"
                       label="地区"
                       width="200px">
      </el-table-column>
      <el-table-column prop="uint"
                       label="单位名称"
                       width="200">
      </el-table-column>
      <el-table-column prop="function"
                       label="职能"
                       width="200">
      </el-table-column>
      <el-table-column prop="name"
                       label="账号名称"
                       width="360">
      </el-table-column>
      <el-table-column prop="pubtime"
                       label="转发时间"
                       width="240">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  name: 'ShowMatrix',
  data () {
    return {
      ruleForm: {
        title: ''
      },
      matrixDetailsList: []
    }
  },
  methods: {
    resetForm (form) {
      this.$refs[form].resetFields()
    },
    searchList () {
      this.getList()
    },
    getList () {
      this.$http.get(`${this.$api.listForwardResult}?id=${this.routerId}`)
        .then(res => {
          this.matrixDetailsList = res.data.data
        })
        .catch(() => {})
    },
    // 返回
    goBack () {
      this.$router.push({ name: 'AccountMatrix' })
    },
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-Matrix'))
      exportTable(XLSX, FileSaver, wb, '转发结果')
    }
  },
  created () {
    this.routerId = this.$route.query.id
    this.getList()
  }
}
</script>
<style lang="scss">
  @import "../assessment";
</style>
<style scoped>
  .headCont {
    background-color: #eff1f4;
    border-radius: 10px;
    padding: 9px 12px;
    box-sizing: border-box;
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .margin-none .el-form-item {
    margin-bottom: 0;
  }
  #out-Matrix {
    margin-top: 20px;
  }
  .title {
    font-size: 16px;
    color: #333;
  }
  .title span {
    font-weight: 700;
    color: #409EFF;
  }
</style>
