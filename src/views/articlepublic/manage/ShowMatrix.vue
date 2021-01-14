<template>
  <div class="right-conten">
    <div class="sperad-conten article-conten">
      <div class="tab-head dis-flex pad020">
        <div class="page-title">
          稿件发布
        </div>
        <div class="tab-right dis-flex">
          <span>当前所在位置:</span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name:'LocalArticleWx'}">稿件发布</el-breadcrumb-item>
            <el-breadcrumb-item>新媒体矩阵管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="sperad-data pad20">
        <div class="tabs-card">
          <div class="card-name"
               :class="{ 'is-active': activeName==='ManageMatrix'}"
               @click="getData('ManageMatrix')">
            <img :src="require('@/assets/images/manage/midsa.png')">
            <span>矩阵管理</span>
          </div>
          <div class="card-name"
               :class="{ 'is-active': activeName==='ManageAddAccount'}"
               @click="getData('ManageAddAccount')">
            <img :src="require('@/assets/images/manage/account.png')">
              <span>授权账号管理</span>
          </div>
        </div>
        <div class="Matrix">
          <el-page-header @back="goBack"
                          content="通告任务响应结果">
          </el-page-header>
          <div class="headCont">
            <p class="title">文章题目：<span v-text="title || '空'"></span></p>
            <el-button size="small"
                       type="primary"
                       @click="exportExcel">导出</el-button>
          </div>
          <el-table :data="matrixDetailsList"
                    border
                    class="show-table"
                    style="width: 100%"
                    id="out-Matrix">
            <el-table-column prop="areaName"
                             label="地区"
                             width="400">
            </el-table-column>
            <el-table-column prop="departmentName"
                             label="单位名称"
                             width="400">
            </el-table-column>
            <el-table-column prop="userName"
                             label="账号名称"
                             width="400">
            </el-table-column>
            <el-table-column prop="answerTime"
                             label="响应结果时间"
                             width="400">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
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
      activeName: 'ManageMatrix',
      routerId: '',
      title: '',
      matrixDetailsList: []
    }
  },
  methods: {
    getData (activeName) {
      this.$router.push({ name: activeName })
    },
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
        .catch(() => { })
    },
    // 返回
    goBack () {
      this.$router.go(-1)// 返回上一层
    },
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-Matrix'))
      exportTable(XLSX, FileSaver, wb, '响应结果')
    }
  },
  created () {
    this.routerId = this.$route.query.id
    this.title = this.$route.query.title
    this.getList()
  },
  components: {
  }
}
</script>
<style scoped>
.Matrix {
  padding: 20px;
}
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
  color: #409eff;
}
.tabs-card .is-active {
    color: #fff;
    background-color: #00afff;
    border-bottom-color: transparent;
}
</style>
