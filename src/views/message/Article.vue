<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox'}">中央信息厨房</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="message-list-box">
        <div class="tabs-box">
          <ul class="right-img">
            <li class="right-li">
              <router-link :to="{name: 'TeamMessage'}">
                <img :src="require('@/assets/images/message/team.png')">
                <span>团队推荐</span>
              </router-link>
            </li>
            <li class="right-li">
              <router-link :to="{name: 'Contribute'}">
                <img :src="require('@/assets/images/message/tougao.png')">
                <span>我要投稿</span>
              </router-link>
            </li>
            <li class="right-li">
              <router-link :to="{name: 'MyMessageList'}">
                <img :src="require('@/assets/images/message/file.png')">
                <span>我的稿件</span>
              </router-link>
            </li>
            <li class="right-li"
                v-permission="306">
              <router-link :to="{name: 'AuditList'}">
                <img :src="require('@/assets/images/message/check.png')">
                <span>审核稿件</span>
              </router-link>
            </li>
            <li class="right-li"
                v-permission="305">
              <router-link :to="{name: 'RoughList'}">
                <img :src="require('@/assets/images/message/draft.png')">
                <span>稿件校对</span>
              </router-link>
            </li>
            <li class="right-li"
                v-permission="307">
              <router-link :to="{name: 'LocalArticleWx'}">
                <img :src="require('@/assets/images/message/publish.png')">
                <span>发布稿件</span>
              </router-link>
            </li>
            <li class="right-li">
              <router-link :to="{name: 'IntelligenceEditor'}">
                <img :src="require('@/assets/images/message/help.png')">
                <span>智能辅助</span>
              </router-link>
            </li>
            <li class="right-li">
              <router-link :to="{name: 'ManageMatrix'}">
                <img :src="require('@/assets/images/message/media.png')">
                <span>新媒体矩阵</span>
              </router-link>
            </li>
          </ul>
        </div>
        <div class="searth-box">
          <el-form size="small"
                   :model="ruleForm"
                   label-position="left"
                   ref="ruleForm">
            <div class="search-box">
              <div class="dis-flex">
                <el-form-item label="职能:"
                              prop="function"
                              v-if="changeSide">
                  <el-select v-model="ruleForm.function"
                            size="small"
                            placeholder="全部">
                    <el-option v-for="(item, index) of functionList"
                              :label="item"
                              :value="item"
                              :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="label-box text-center"
                              prop="publishChannel"
                              v-if="!changeSide">
                  <span class="public-span-style">稿件渠道:</span>
                  <el-select v-model="ruleForm.publishChannel"
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
                <el-form-item prop="checkStatus"
                              v-if="!changeSide"
                              class="label-box text-center">
                  <span class="public-span-style">流程状态:</span>
                  <el-select v-model="ruleForm.checkStatus"
                             placeholder="全部">
                    <el-option label="已撤回"
                               :value="-1"></el-option>
                    <el-option label="待提交"
                               :value="0"></el-option>
                    <el-option label="审核中"
                               :value="1"></el-option>
                    <el-option label="审核通过"
                               :value="3"></el-option>
                    <el-option label="审核未通过"
                               :value="2"></el-option>
                    <el-option label="校对中"
                               :value="4"></el-option>
                    <el-option label="发布中"
                               :value="5"></el-option>
                    <el-option label="发布通过"
                               :value="6"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="departmentId"
                              v-if="changeSide"
                              class="label-box text-center">
                  <span class="public-span-style">单位名称:</span>
                  <el-cascader :options="department"
                               v-model="ruleForm.departmentId"
                               placeholder="全部"
                               :show-all-levels="false"
                               :props="{ checkStrictly: true }"
                               clearable></el-cascader>
                </el-form-item>
                <el-form-item prop="date">
                  <span class="public-span-style">报送时间:</span>
                  <el-date-picker v-model="ruleForm.date"
                                  type="daterange"
                                  value-format="yyyy-MM-dd"
                                  range-separator="-"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item prop="keyword">
                  <span class="public-span-style">关键字:</span>
                  <el-input class="keyword-input"
                            v-model="ruleForm.keyword"
                            placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item class="burron-box">
                  <el-button type="primary"
                             size="small"
                             @click="screen">筛选</el-button>
                  <el-button size="small"
                             @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
              </div>
            </div>
          </el-form>
        </div>
      </div>
      <div class="message-title">
        <span></span>
        <p class="article-title">
          <span class="message-title-span"
                v-if="changeSide">公共稿件池</span>
          <span class="message-title-span"
                v-else>单位稿件池</span>
          <span class="change-side">
            <el-button type="primary"
                       size="small"
                       :disabled='!changeSide'
                       @click="checkFalse()">单位稿件</el-button>
            <el-button type="primary"
                       size="small"
                       :disabled='changeSide'
                       @click="checkTrue()">公共稿件</el-button>
          </span>
        </p>
      </div>
      <div class="table-side">
        <div v-show="changeSide">
          <pubarticle @PublicArticle="getList"
                      ref="public"
                      :Forms="ruleForm"></pubarticle>
        </div>
        <div v-show="!changeSide">
          <company @CompanyArticle="getList"
                   ref="company"
                   :Forms="ruleForm"></company>
        </div>
      </div>
      <pagination @pagingChange="getPagingChange"
                  :total="total"
                  ref="child"></pagination>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/Pagination.vue'
import company from '@/views/message/components/CompanyArticle.vue'
import pubarticle from '@/views/message/components/PublicArticle.vue'
export default {
  name: 'MessageList',
  data () {
    return {
      functionList: [],
      total: 0,
      changeSide: false,
      ismodal: false, // 遮罩
      tableData: [],
      ruleForm: {
        function: '',
        publishChannel: '', // 渠道
        date: [], // 日期数组
        departmentId: [], // 单位名称
        checkStatus: '', // 审核状态
        keyword: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      department: [] // 单位
    }
  },
  methods: {
    // 筛选
    screen () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    // 获取稿件列表
    getList (data) {
      if (data) {
        this.total = data.totalElements
        this.tableData = data.content
      }
    },
    getPagingChange (change) {
      this.ruleForm.pageNum = change.page
      this.ruleForm.pageSize = change.size
      if (this.changeSide) {
        this.$refs.public.getPublicList(this.ruleForm)
      } else {
        this.$refs.company.getCompanyLists(this.ruleForm)
      }
      // console.log(this.$refs.CompanyArticle)
      // console.log(this.$refs.PublicArticle)
      // this.changeSide ? this.$refs.PublicArticle.getLists(this.ruleForm) : this.$refs.CompanyArticle.getLists(this.ruleForm)
    },
    // 重置
    resetForm () {
      this.tableData = [] // 数据置空
      this.departmentId = []
      this.ruleForm.publishChannel = '' // 渠道
      this.ruleForm.date = [] // 日期数组
      this.ruleForm.departmentId = []
      this.ruleForm.checkStatus = '' // 审核状态
      this.ruleForm.keyword = '' // 关键字
      this.ruleForm.function = ''
      this.ruleForm.pageNum = 1
      this.ruleForm.pageSize = 20
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    // 获取单位列表
    getDepartment () {
      this.$http.get(this.$api.listSelect)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.department = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 切换内/外部稿件
    checkFalse () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.ruleForm.date = [] // 日期数组
      this.ruleForm.departmentId = []
      this.ruleForm.checkStatus = '' // 审核状态
      this.ruleForm.keyword = '' // 关键字
      this.changeSide = false
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    checkTrue () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.ruleForm.date = [] // 日期数组
      this.ruleForm.departmentId = []
      this.ruleForm.checkStatus = '' // 审核状态
      this.ruleForm.keyword = '' // 关键字
      this.changeSide = true
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    // 打开审核记录弹框
    openDetail (row, index) {
      this.details = true
      this.$http.get(this.$api.listCheckRecord, { params: { id: row.id } })
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.detailList = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 获取职能
    getShowFunction () {
      this.$http.get(this.$api.showFunction)
        .then(res => {
          this.functionList = res.data.data
        })
        .catch(() => { })
    }
  },
  mounted () {
    setInterval(function () {
      document.querySelectorAll('.el-cascader-node__label').forEach(el => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    }, 1000)
  },
  created () {
    // this.getList()
    this.getDepartment()
    this.getShowFunction()
  },
  components: {
    pagination,
    company,
    pubarticle
  }
}
</script>
<style lang="scss">
@import './message';
</style>

<style lang="scss" scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.search-box {
  padding: 3px;
  background: #fff;
  border-radius: 4px;
  position: relative;
  .el-form-item {
    margin-bottom: 4px;
    margin-top: 6px;
    margin-right: 10px;
  }
}
.el-select {
  width: 115px;
}
.el-cascader {
  width: 160px;
}

.el-form-item {
  span {
    color: #666666;
    font-size: 14px;
  }
}
.public-span-style {
  width: 70px;
  display: inline-block;
  text-align: center;
  margin-right: 0px;
}
.checkbox-box {
  display: flex;
  align-items: center;
}
.right-img {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.right-li {
  width: 150px;
  height: 150px;
  background: #fff;
  border-radius: 4px;
  text-align: center;
  a {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 100px;
    height: 100px;
  }
  span {
    width: 100%;
    font-size: 14px;
  }
}
.message-title {
  display: flex;
  align-items: center;
  margin: 22px 0;
  p {
    width: 100%;
    font-size: 16px;
    line-height: 32px;
    color: #4395e1;
    &::before {
      content: '';
      width: 4px;
      height: 16px;
      background: #2c8ae5;
      position: absolute;
      z-index: -1;
      margin-top: 7px;
    }
  }
}
.message-title-span {
  font-size: 16px;
  color: #4395e1;
  margin-left: 12px;
  line-height: 16px;
}
.rating-p {
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
}
.rating-box {
  text-align: center;
}
.defaultclass {
  background: #60b4f4;
}
.Aclass {
  background: #f56c6c;
  color: #ffffff;
}
.Bclass {
  background: #67c23a;
  color: #ffffff;
}
.keyword-input {
  width: 150px;
}
.private-span {
  text-align: right;
}
.title-u {
  color: #60b4f4;
  text-decoration: underline;
  cursor: pointer;
}
.checkStatus {
  color: #60b4f4;
  cursor: pointer;
  text-decoration: underline;
}
.dis-flex {
  display: flex;
  align-items: center;
  padding-right: 10px;
}
.fl-right {
  position: absolute;
  right: 15px;
  top: 8px;
  .el-button {
    margin-top: 16px;
  }
}
.publish {
  text-decoration: underline;
  color: #2c8ae5;
  cursor: pointer;
}
.message-list {
  // min-height: 600px;
  background-color: #f5f5f5;
  border: none;
}
.choice {
  width: 168px;
}
.disflex {
  display: flex;
}
.errorClass,
.errorName {
  color: #f56c6c;
}
.province .el-checkbox {
  white-space: normal;
}
.checkbox-span {
  display: inline-block;
  width: 80px;
  vertical-align: middle;
  white-space: normal;
}
.createUserName {
  cursor: pointer;
  color: #4395e1;
  text-decoration: underline;
}
.sendInfo {
  display: block;
  width: 105px;
  margin: 0 auto;
}

.activeClass,
.activeName {
  color: #67c23a;
}
.err {
  color: #60b4f4;
}
.rating-btn {
  width: 66px;
  color: #fff;
  border: none;
}
.burron-box {
  margin-left: 10px;
}
.change-side {
  float: right;
  margin-right: 10px;
}
.btn-article {
  cursor: pointer;
  text-decoration: underline;
}

.record-peo {
  margin-top: 10px;
}
.record-man {
  margin-right: 10px;
}
.records {
  color: #2c8ae5;
}
.ownerUserName {
  color: #2c8ae5;
  text-decoration: underline;
  cursor: pointer;
}
.status-list .checkStatus {
  text-decoration: none;
  cursor: auto;
}
</style>
