<template>
  <div class="search-box">
    <el-form size="small"
             :model="fromData"
             :inline="true"
             label-position="left"
             ref="froms">
      <!-- <el-form-item prop="areaId"
                    class="item-style"
                    label="地 区:"
                    v-if="this.$route.name === 'AuditList'">
        <el-cascader :options="screenData"
                     v-model="areaList"
                     placeholder="全部"
                     :show-all-levels="false"
                     :props="{ checkStrictly: true }"
                     clearable></el-cascader>
      </el-form-item> -->
      <el-form-item class="item-style"
                    label="稿件渠道:"
                    prop="publishChannel">
        <el-select v-model="fromData.publishChannel"
                   placeholder="全部">
          <el-option label="平台"
                     value="platform"></el-option>
          <el-option label="微信"
                     value="weixin"></el-option>
          <el-option label="微信素材"
                     value="WEIXIN_MATERIAL"></el-option>
          <el-option label="微博文章"
                     value="weibo"></el-option>
          <el-option label="微博"
                     value="weiboText"></el-option>
          <el-option label="秀米"
                     value="WEIXIN_XIUMI"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item-style"
                    label="流程状态:"
                    prop="checkResult">
        <el-select v-model="fromData.checkResult"
                   placeholder="全部">
          <el-option label="已撤回"
                     :value="-1" v-if="this.$route.name !== 'AuditList'"></el-option>
          <el-option label="待提交"
                     :value="0" v-if="this.$route.name !== 'AuditList'"></el-option>
          <el-option label="审核中"
                     :value="1"></el-option>
          <el-option label="审核未通过"
                     :value="2"></el-option>
          <el-option label="审核通过"
                     :value="3"></el-option>
          <el-option label="校对中"
                     :value="4"></el-option>
          <el-option label="发布中"
                     :value="5"></el-option>
          <el-option label="发布通过"
                     :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="item-style"
                    label="时间:"
                    prop="function"
                    v-if="this.$route.name === 'MyMessageList'">
        <el-date-picker v-model="fromData.function"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item class="item-style"
                    label="关键字:"
                    prop="searchParam"
                    v-if="this.$route.name === 'MyMessageList'">
        <el-input placeholder="请输入标题关键字"
                  v-model="fromData.searchParam"></el-input>
      </el-form-item>
    </el-form>
    <div class="public-btn btn-box-style image-search-box">
      <el-button size="small"
                 v-if="this.$route.name==='MyMessageList'"
                 class="new"
                 type="primary"
                 @click="getMyarticle">筛选</el-button>
      <el-button v-else
                 size="small"
                 class="new"
                 type="primary"
                 @click="getExamine">筛选</el-button>
      <el-button size="small"
                 class="delete"
                 @click="resetForm('froms')">重置</el-button>
    </div>
  </div>
</template>

<script>
import '@/libs/date_format.js'
export default {
  name: '',
  data () {
    return {
      date: '',
      areaList: [],
      departmentList: [],
      fromData: {
        checkResult: '',
        publishChannel: '', // 渠道
        areaId: '', // 地区id
        function: [],
        departmentId: '', // 单位名称
        articleStatus: '', // 稿件状态
        articleGrade: '', // 稿件级别
        provinceUse: 0, // 采用
        // praise: '', // 表扬
        searchParam: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      ruleForm: {},
      tableData: [],
      examineData: [],
      screenData: [],
      showData: true
    }
  },
  mounted () {
    if (this.$route.name === 'Release') {
      this.showData = false
    }
    this.getMyarticle()
    this.getExamine()
  },
  created () {
    if (this.$route.query.checkResult) {
      this.fromData.checkResult = parseInt(this.$route.query.checkResult)
    } else {
      this.fromData.readStatus = ''
      this.fromData.function = []
    }
    if (this.$route.query.date) {
      this.fromData.function[0] = new Date().Format('yyyy-MM-01')
      this.fromData.function[1] = new Date().Format('yyyy-MM-30')
    }
  },
  methods: {
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.fromData.function[0] = ''
      this.fromData.function[1] = ''
      this.fromData.checkResult = ''
      this.getMyarticle()
      this.getExamine()
    },
    getMyarticle () {
      // 发送我的稿件参数
      this.ruleForm.keyword = this.fromData.searchParam
      if (this.fromData.checkResult) {
        this.ruleForm.checkStatus = parseInt(this.fromData.checkResult)
      } else if (this.fromData.checkResult === 0) {
        this.ruleForm.checkStatus = '0'
      } else {
        this.ruleForm.checkStatus = ''
      }
      this.ruleForm.publishChannel = this.fromData.publishChannel
      if (this.fromData.function) {
        this.ruleForm.date = this.fromData.function
      } else {
        this.ruleForm.date = []
      }
      if (this.$route.name === 'MyMessageList') {
        this.$emit('ruleForm', this.ruleForm)
      }
    },
    getExamine () {
      // 发送待审核稿件参数
      if (this.fromData.checkResult) {
        this.ruleForm.checkStatus = parseInt(this.fromData.checkResult)
      } else if (this.fromData.checkResult === 0) {
        this.ruleForm.checkStatus = '0'
      } else {
        this.ruleForm.checkStatus = ''
      }
      this.ruleForm.publishChannel = this.fromData.publishChannel
      if (this.$route.name === 'AuditList') {
        this.$emit('ruleForm', this.ruleForm)
      }
    },
    // 获取地区列表
    getScreenlist () {
      this.$http.get(this.$api.listLevelChildIncludeSelf)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}

</script>
<style scoped>
.search-box {
  padding: 9px 8px;
  background: #ffffff;
  margin-bottom: 20px;
  overflow: hidden;
}
.search-box .el-form {
  width: 90%;
  display: flex;
  float: left;
}
.search-box .public-btn {
  float: right;
}
.item-style {
  display: flex;
  margin-bottom: 0px;
}
.item-style .el-select {
  width: 150px;
}
.item-style .el-cascader {
  width: 150px;
}
.item-style .el-date-editor {
  width: 270px;
}
</style>
