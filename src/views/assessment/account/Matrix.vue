<template>
  <div class="Matrix">
    <h2>新建转发通告</h2>
    <div class="headCont">
      <div class="form-box">
        <el-form :inline="true"
                 ref="ruleForm"
                 :model="ruleForm"
                 :rules="rules"
                 class="demo-form-inline margin-none">
          <el-form-item label="文章题目:"
                        prop="articleTitle">
            <el-input size="small"
                      v-model="ruleForm.articleTitle"
                      placeholder="请输入需要转发的文章题目"></el-input>
          </el-form-item>
          <el-form-item label="文章链接:"
                        prop="articleUrl">
            <el-input size="small"
                      v-model="ruleForm.articleUrl"
                      placeholder="请输入需要转发的文章链接"></el-input>
          </el-form-item>
          <el-form-item label="响应范围:"
                        prop="organizationType">
            <el-select size="small"
                       v-model="ruleForm.organizationType"
                       placeholder="请选择响应范围">
              <el-option label="全部"
                         :value="0"></el-option>
              <el-option label="政法委"
                         :value="1"></el-option>
              <el-option label="公安"
                         :value="2"></el-option>
              <el-option label="检察院"
                         :value="3"></el-option>
              <el-option label="法院"
                         :value="4"></el-option>
              <el-option label="司法"
                         :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="forwardSave('ruleForm')">发送</el-button>
            <el-button size="small"
                       @click="resetList('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="table-box">
      <h2>转发结果筛选</h2>
      <div class="tableList">
        <div class="matrix-table">
          <el-table :data="tableMatrix"
                    border
                    style="width: 100%">
            <el-table-column prop="createTime"
                             label="通告时间"
                             width="200px">
            </el-table-column>
            <el-table-column prop="articleTitle"
                             label="文章题目"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="overflow-text"
                     v-html="scope.row.articleTitle"></div>
              </template>
            </el-table-column>
            <el-table-column prop="articleUrl"
                             label="文章链接"
                             width="360">
              <template slot-scope="scope">
                <el-link type="primary"
                         @click="blankUrl(scope.row.articleUrl)">{{scope.row.articleUrl}}</el-link>
              </template>
            </el-table-column>
            <el-table-column prop="release"
                             label="响应范围"
                             width="100">
              <template slot-scope="scope">
                {{scope.row.departmentName}}
              </template>
            </el-table-column>
            <!--          <el-table-column prop="totime"-->
            <!--                           label="转发进度">-->
            <!--          </el-table-column>-->
            <el-table-column prop="totime"
                             width="130"
                             label="操作">
              <template slot-scope="scope">
                <el-button type="primary"
                           size="small"
                           @click="viewDatas(scope.row)">查看</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import '@/libs/date_format.js'
export default {
  data () {
    return {
      dataLess: false,
      ruleForm: {
        articleTitle: '', // 标题
        articleUrl: '', // 链接
        organizationType: 0 // 响应范围
      },
      tableMatrix: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      rules: {
        articleTitle: [
          { required: true, message: '请输入文章题目', trigger: 'blur' }
        ],
        articleUrl: [
          { required: true, message: '请输入文章链接', trigger: 'blur' }
        ],
        organizationType: [
          { required: true, message: '请选择响应范围', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    resetList (form) {
      this.$refs[form].resetFields()
      this.page.pageNum = 1
      this.tableMatrix = []
      this.getList()
    },
    // 点击文章链接
    blankUrl (url) {
      window.open(url, '_blank')
    },
    // 分页
    getData () {
      this.page.pageNum++
      this.getList()
    },
    // 点击查看
    viewDatas (row) {
      this.$router.push({ name: 'MatrixDetails', query: { id: row.id, title: row.articleTitle } })
    },
    // 发送转发
    forwardSave (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.forwardSave, this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$refs['ruleForm'].resetFields()
              this.getList()
            })
            .catch(() => { })
        }
      })
    },
    // 获取列表
    getList () {
      this.$http.post(this.$api.listForward, this.page)
        .then(res => {
          let datas = res.data.data.content
          this.tableMatrix = datas
          if (datas.length < 9) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getList()
  },
  filters: {
    getFilterRange (value) {
      switch (value) {
        case 0:
          return '全部'
        case 1:
          return '政法委'
        case 2:
          return '公安'
        case 3:
          return '检察院'
        case 4:
          return '法院'
        case 5:
          return '司法'
      }
    }
  }
}
</script>
<style>
.el-tooltip__popper {
  max-width: 30%;
}
</style>
<style scoped>
.Matrix {
  font-size: 14px;
  font-family: DengXian-Bold;
}
.Matrix h2 {
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 13px;
  border-left: 3px solid #2f9ff3;
  padding-left: 8px;
  margin-bottom: 17px;
  font-size: 16px;
}
.Matrix .headCont {
  background-color: #eff1f4;
  border-radius: 10px;
  padding: 3px 12px;
  box-sizing: border-box;
}
.Matrix p span {
  display: inline-block;
  height: 29px;
  line-height: 29px;
}
.Matrix h2:nth-of-type(2) {
  margin-top: 14px;
}
.matrix-table {
  margin-top: 18px;
}
.matrix-table .el-table thead tr th {
  background: linear-gradient(to top, #f3f2f2, #fff);
}
#pagin button {
  background-color: transparent;
}
.headCont .el-input {
  width: 350px;
}
.headCont .el-select {
  width: 220px;
}
.margin-none .el-form-item {
  margin-bottom: 15px;
}
.table-box {
  margin-top: 20px;
}
.overflow-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
