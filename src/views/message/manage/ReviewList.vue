<template>
  <div class="review-box">
    <div class="review-num">
      <el-page-header @back="goBack"
                      :content="`等待审核账号${total}`">
      </el-page-header>
      <!--      <span class="account-num-span">等待审核账号<i class="cursor-p">{{total}}</i>个</span>-->
    </div>
    <div class="review-num-search">
      <el-form :inline="true"
               ref="ruleForm"
               :model="ruleForm"
               class="demo-form-inline">
        <el-form-item label="职能:"
                      prop="organizationType">
          <el-select size="small"
                     v-model="ruleForm.organizationType">
            <el-option label="全部"
                       value="0"></el-option>
            <el-option label="政法委"
                       value="1"></el-option>
            <el-option label="公安"
                       value="2"></el-option>
            <el-option label="检察院"
                       value="3"></el-option>
            <el-option label="法院"
                       value="4"></el-option>
            <el-option label="司法"
                       value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号类型:"
                      prop="accountType">
          <el-select size="small"
                     v-model="ruleForm.accountType">
            <el-option label="全部"
                       value=""></el-option>
            <el-option label="微信"
                       value="weixin"></el-option>
            <el-option label="微博"
                       value="weibo"></el-option>
            <el-option label="网站"
                       value="website"></el-option>
            <el-option label="头条号"
                       value="toutiao"></el-option>
            <el-option label="一点号"
                       value="yidian"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字:"
                      prop="searchParam">
          <el-input v-model="ruleForm.searchParam"
                    size="small"
                    placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchList"
                     size="small"
                     type="primary">筛选</el-button>
          <el-button @click="resetForm('ruleForm')"
                     size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <el-table :data="tableList"
                border>
        <el-table-column label="单位名称"
                         width="235"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.unitName }}</template>
        </el-table-column>
        <el-table-column label="职能"
                         width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.organizationType === 1">政法委</p>
            <p v-else-if="scope.row.organizationType === 2">公安</p>
            <p v-else-if="scope.row.organizationType === 3">检察院</p>
            <p v-else-if="scope.row.organizationType === 4">法院</p>
            <p v-else>司法</p>
          </template>
        </el-table-column>
        <el-table-column label="名称"
                         width="235"
                         show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.accountName }}</template>
        </el-table-column>
        <el-table-column label="账号"
                         prop="accountNumber"
                         width="155">
        </el-table-column>
        <el-table-column label="地区"
                         prop="provinceDistrict"
                         width="100">
        </el-table-column>
        <el-table-column label="账号类型"
                         prop="accountType"
                         width="235">
          <template slot-scope="scope">
            <p v-if="scope.row.accountType === 'weixin'">微信</p>
            <p v-else-if="scope.row.accountType === 'weibo'">微博</p>
            <p v-else-if="scope.row.accountType === 'website'">网站</p>
            <p v-else-if="scope.row.accountType === 'toutiao'">头条号</p>
            <p v-else>一点号</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
import ScrollData from '@/components/ScrollData'
export default {
  name: 'ReList',
  data () {
    return {
      dataLess: false,
      tableList: [],
      total: '', // 总数
      ruleForm: {
        organizationType: '0',
        accountType: '',
        searchParam: '',
        pageNum: 1,
        pageSize: 32
      }
    }
  },
  methods: {
    goBack () {
      this.$router.push({ name: 'ManageAccountList' })
    },
    // 滚动加载
    getData () {
      this.ruleForm.pageNum++
      this.getUnCheckAccountList()
    },
    // 重置
    resetForm (form) {
      this.$refs[form].resetFields()
      this.getUnCheckAccountList()
    },
    // 筛选
    searchList () {
      this.accountList = []
      this.ruleForm.pageNum = 1
      this.getUnCheckAccountList()
    },
    // 获取未审核列表
    getUnCheckAccountList () {
      this.$http.post(this.$api.listUnCheckAccount, this.ruleForm)
        .then(res => {
          this.tableList = res.data.data.content
          this.total = res.data.data.totalElements
          if (this.tableList.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getUnCheckAccountList()
  },
  components: {
    ScrollData
  }
}
</script>
<style lang="scss" scoped>
@import "../resour";
</style>
<style scoped>
.review-num {
  margin-bottom: 15px;
}
</style>
