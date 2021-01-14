<template>
  <div class="container assessment">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MatrixDetail' }">响应结果</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="assessment-box">
      <v-menu></v-menu>
      <div class="manage-cont">
        <div class="tabs-card">
          <div class="card-name">
            <router-link :to="{name:'ManageMatrix'}">
              <img :src="require('@/assets/images/manage/midsa.png')">
              <span>矩阵管理</span>
            </router-link>
          </div>
          <!-- <div class="card-name">
            <router-link :to="{name:'ManageAddAccount'}">
              <img :src="require('@/assets/images/manage/account.png')">
              <span>授权账号管理</span>
            </router-link>
          </div> -->
        </div>
        <div class="Matrix">
          <el-page-header @back="goBack"
                          content="通告任务响应结果">
          </el-page-header>
          <div class="headCont">
            <p class="title">文章题目：<span v-text="title || '空'"></span></p>
            <div>
              <el-button size="small"
                        type="primary"
                        @click="hasFinish"
                        :disabled="isFinished">已响应结果</el-button>
              <el-button size="small"
                        type="warning"
                        @click="hasNoFinish"
                        :disabled="!isFinished">未响应结果</el-button>
              <el-button size="small"
                        type="primary"
                        @click="exportExcel">导出</el-button>
            </div>
          </div>
          <el-table :data="matrixDetailsList"
                    border
                    class="show-table"
                    style="width: 100%"
                    id="out-Matrix"
                    v-if="isFinished">
            <el-table-column label="序号"
                             width="80">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column prop="areaName"
                             label="地区"
                             width="220">
            </el-table-column>
            <el-table-column prop="departmentName"
                             label="单位名称">
            </el-table-column>
            <el-table-column prop="userName"
                             label="账号名称"
                             width="250">
            </el-table-column>
            <el-table-column prop="answerTime"
                             label="响应结果时间"
                             width="250">
            </el-table-column>
          </el-table>
          <el-table :data="noForwardList"
                    border
                    class="show-table"
                    style="width: 100%"
                    id="out-Matrix"
                    v-else>
            <el-table-column label="序号"
                             width="80">
              <template slot-scope="scope">
                {{scope.$index + 1}}
              </template>
            </el-table-column>
            <el-table-column prop="areaName"
                             label="地区"
                             width="400px">
            </el-table-column>
            <el-table-column prop="departmentName"
                             label="单位名称">
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
import vMenu from '@/views/message/components/sidebar'
export default {
  name: 'ShowMatrix',
  data () {
    return {
      routerId: '',
      title: '',
      isFinished: true,
      matrixDetailsList: [],
      noForwardList: []
    }
  },
  methods: {
    hasFinish () {
      this.isFinished = true
    },
    hasNoFinish () {
      this.isFinished = false
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
    getNoForward () {
      this.$http.post(`${this.$api.listNoForward}?id=${this.routerId}`)
        .then(res => {
          this.noForwardList = res.data.data
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
    this.getNoForward()
  },
  components: {
    vMenu
  }
}
</script>
<style lang="scss">
@import "../resour";
</style>
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
</style>
