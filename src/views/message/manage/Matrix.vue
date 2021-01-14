<template>
  <div class="Matrix">
    <h2>新建响应任务通告</h2>
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
                      placeholder="请输入需要响应任务的文章题目"></el-input>
          </el-form-item>
          <el-form-item label="文章链接:"
                        prop="articleUrl">
            <el-input size="small"
                      v-model="ruleForm.articleUrl"
                      placeholder="请输入需要响应任务的文章链接"></el-input>
          </el-form-item>
          <el-form-item label="响应范围:"
                        prop="departmentId">
            <el-select size="small"
                       v-model="ruleForm.departmentId"
                       placeholder="请选择响应范围">
              <el-option v-for="item in listType"
                         :key="item.id"
                         :label="item.departmentName"
                         :value="item.id"></el-option>
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
      <h2>响应任务通告列表</h2>
      <div class="table-search">
        <el-form ref="form"
                 :model="form"
                 inline="inline"
                 @submit.native.prevent
                 label-position="left">
          <el-form-item label="时间:"
                        prop="times">
            <el-date-picker v-model="form.times"
                            size="small"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="文章题目:"
                        prop="articleTitle">
            <el-input size="small"
                      v-model="form.articleTitle"
                      placeholder="请输入文章题目"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="tableSarch('form')">筛选</el-button>
            <el-button size="small"
                       @click="resetTable('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
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
            <!--                           label="任务进度">-->
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
</template>
<script>
import '@/libs/date_format.js'
let validaStr = (rule, value, callback) => {
  if (value.substring(0, 4) !== 'http') {
    callback(new Error('请输入正确的地址链接!'))
  } else {
    callback()
  }
}
export default {
  data () {
    return {
      dataLess: false,
      ruleForm: {
        articleTitle: '', // 标题
        articleUrl: '', // 链接
        departmentId: '' // 响应范围
      },
      listType: [], // 响应范围列表
      form: {
        times: [],
        articleTitle: '',
        pageNum: 1,
        pageSize: 32
      },
      tableMatrix: [],
      rules: {
        articleTitle: [
          { required: true, message: '请输入文章题目', trigger: 'blur' }
        ],
        articleUrl: [
          { required: true, message: '请输入文章链接', trigger: 'blur' },
          { min: 8, message: '最低长度为8个字符', trigger: 'blur' },
          { validator: validaStr, trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择响应范围', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 列表筛选
    tableSarch () {
      this.emptyParams()
    },
    emptyParams () {
      this.dataLess = false
      this.form.pageNum = 1
      this.tableMatrix = []
      this.getList()
    },
    // 列表重置
    resetTable (form) {
      this.$refs[form].resetFields()
      this.emptyParams()
    },
    // 新建任务通告重置
    resetList (form) {
      this.$refs[form].resetFields()
    },
    // 点击文章链接
    blankUrl (url) {
      window.open(url, '_blank')
    },
    // 分页
    getData () {
      this.form.pageNum++
      this.getList()
    },
    // 点击查看
    viewDatas (row) {
      this.$router.push({ name: 'MatrixDetail', query: { id: row.id, title: row.articleTitle } })
    },
    // 发送form.pageNum
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
      this.form.startDate = this.form.times[0] || ''
      this.form.endDate = this.form.times[1] || ''
      this.$http.post(this.$api.listForward, this.form)
        .then(res => {
          let content = res.data.data.content
          if (content.length) {
            this.tableMatrix = content
            if (content.length < 20) {
              this.dataLess = true
            }
          } else {
            this.tableMatrix = []
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 获取响应范围
    getlistAll () {
      this.$http.get(this.$api.listAll)
        .then(res => {
          this.listType = res.data.data
          let splice = {
            departmentName: '全部',
            id: 0
          }
          this.listType.splice(0, 0, splice)
        })
    }
  },
  created () {
    this.getList()
    this.getlistAll()
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
  padding: 20px;
}
.Matrix h2 {
  font-weight: 400;
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
.table-box {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
.overflow-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-search {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
  padding: 3px 12px;
}
</style>
