<template>
  <div class="assessment-seach">
    <el-form :inline="true"
             ref="ruleForm"
             :model="ruleForm"
             class="demo-form-inline">
      <el-form-item label="选择日期:"
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
    <div class="admin-log">
      <el-button type="success"
                 size="small"
                 @click="searchList"
                 :disabled="!showTotal">市排行</el-button>
      <el-button type="warning"
                 size="small"
                 @click="getTotalRank"
                 :disabled="showTotal">总排行</el-button>
    </div>
  </div>
</template>

<script>
const getApi = new Map().set('wx', 'queryWxArea').set('wb', 'queryWbArea')
export default {
  name: 'Search',
  data () {
    return {
      functionList: [], // 职能
      getMapVal: '',
      region: [], // 地区
      ruleForm: {
        function: '全部',
        region: '',
        time: '',
        pageNum: 1,
        pageSize: 30
      },
      totalRule: {
        id: '',
        time: '',
        pageNum: 1,
        pageSize: 30
      },
      showTotal: false
    }
  },
  methods: {
    resetForm () {
      this.ruleForm.function = '全部'
      this.ruleForm.region = ''
      this.ruleForm.pageNum = 1
      this.totalRule.pageNum = 1
      this.getCurrent()
      this.searchList()
    },
    // 搜索
    searchList () {
      this.totalRule.time = this.ruleForm.time
      this.showTotal = false
      let row = {
        form: this.ruleForm,
        show: this.showTotal
      }
      this.$emit('ruleForm', row)
    },
    getTotalRank () {
      this.showTotal = true
      let row = {
        form: this.totalRule,
        show: this.showTotal
      }
      this.$emit('getTotalRank', row)
    },
    // 导出
    exportExcel () {
      this.$emit('exportExcel')
    },
    // 获取地区
    getQueryWxArea () {
      if (this.getMapVal === 'wx' || this.getMapVal === 'wb') {
        this.$http.get(this.$api[getApi.get(this.getMapVal)])
          .then(res => {
            this.region = res.data.data
          })
          .catch(() => { })
      }
    },
    // 获取职能
    getShowFunction () {
      this.$http.get(this.$api.showFunction)
        .then(res => {
          this.functionList = res.data.data
        })
        .catch(() => { })
    },
    getCurrent () {
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
      this.ruleForm.time = tYear + '-' + m
      this.totalRule.time = tYear + '-' + m
    }
  },
  created () {
    this.getCurrent()
    this.getQueryWxArea() // 获取地区
    this.searchList()
  },
  components: {}
}
</script>

<style scoped>
.assessment-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 12px;
  display: flex;
  justify-content: space-between;
}
.assessment-seach .el-form-item {
  margin-bottom: 0px;
}
</style>
