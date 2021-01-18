<template>
  <div class="media container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/contributions' }">策划征稿</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="newset">
      <h2>
        <span>最新议题</span>
        <span class="roter"
              @click="handleIssueList">全部议题+</span>
      </h2>
      <el-table :data="issueList"
                style="width: 100%"
                border>
        <el-table-column label="标题"
                         show-overflow-tooltip
                         width="550">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="iussedetail(scope.row.id)">{{scope.row.issueTitle}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName"
                         label="发起人"
                         width="160">
        </el-table-column>
        <el-table-column prop="createDepartmentName"
                         label="发起人单位"
                         width="250">
        </el-table-column>
        <el-table-column prop="createTime"
                         width="190"
                         label="发起时间">
        </el-table-column>
        <el-table-column label="回复数/阅读人数">
          <template slot-scope="scope">
            {{scope.row.replyNum}}/{{scope.row.readNum}}
          </template>
        </el-table-column>
      </el-table>
      <!-- <no-permission v-else></no-permission> -->
    </div>
    <div class="visit">
      <h2>
        <span>最新约访</span>
        <span class="roter"
              @click="visitList">全部约访+</span>
      </h2>
      <el-table :data="interviewList"
                style="width: 100%"
                border>
        <el-table-column prop="interviewTheme"
                         width="515"
                         label="约访主题"
                         show-overflow-tooltip>
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="interviewDetails(scope.row.id)">{{scope.row.interviewTheme}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="applyUserName"
                         label="申请人"
                         width="120">
        </el-table-column>
        <el-table-column prop="applyTime"
                         label="申请时间"
                         width="170">
        </el-table-column>
        <el-table-column prop="applyDepartmentName"
                         label="约访单位"
                         width="130">
        </el-table-column>
        <el-table-column prop="targetDepartmentName"
                         label="约访对象"
                         width="236">
        </el-table-column>
        <el-table-column prop="replyStatus"
                         label="状态">
          <template slot-scope="scope">
            <p v-if='scope.row.replyStatus === 1'
               class='activeClass'>已同意</p>
            <p v-else-if='scope.row.replyStatus === 2'
               class='errorClass'>已拒绝</p>
            <p v-else>未回复</p>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="inter">
      <h2>
        <span>在线征稿</span>
        <span class="roter"
              @click="OnlineArticleList">全部征稿+</span>
      </h2>
      <el-table :data="articleList"
                style="width: 100%"
                border>
        <el-table-column prop="solicitTitle"
                         label="主题">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="articleDetails(scope.row.id)">{{scope.row.solicitTitle}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName"
                         width="280"
                         label="征稿单位">
        </el-table-column>
        <el-table-column width="250"
                         label="起止日期">
          <template slot-scope="scope">{{scope.row.solicitStart}}-{{scope.row.solicitEnd}}</template>
        </el-table-column>
        <el-table-column prop="solicitReadNum"
                         width="120"
                         label="阅读数">
        </el-table-column>
        <el-table-column prop="solicitNum"
                         width="120"
                         label="稿件数">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="toArticleList(scope.row.id)">{{scope.row.solicitNum}}</el-link>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      articleList: [],
      page: {
        pageNum: 1,
        pageSize: 10
      },
      issueList: [],
      interviewList: []
    }
  },
  methods: {
    // 获取议题列表
    getIssueList () {
      this.$http.post(this.$api.listIssus, this.page)
        .then(res => {
          this.issueList = res.data.data.content
        })
        .catch(() => { })
    },
    // 获取约访列表
    getInterviewList () {
      this.$http.post(this.$api.listInterview, this.page)
        .then(res => {
          this.interviewList = res.data.data.content
        })
        .catch(() => { })
    },
    // 获取征稿列表
    getArticleList () {
      this.$http.post(this.$api.listArticle, this.page)
        .then(res => {
          this.articleList = res.data.data.content
        })
        .catch(() => { })
    },
    // 跳转议题详情
    iussedetail (id) {
      this.$router.push({ name: 'IssueDetails', query: { id: id } })
    },
    // 跳转约访详情
    interviewDetails (id) {
      this.$router.push({ name: 'InterviewDetails', query: { id: id } })
    },
    // 跳转稿件列表
    toArticleList (id) {
      this.$router.push({ name: 'ArticleList', query: { id: id } })
    },
    articleDetails (id) {
      this.$router.push({ name: 'ArticleDetail', query: { id: id, iscover: true } })
    },
    // 全部约访
    visitList () {
      this.$router.push({ name: 'InterviewList' })
    },
    // 全部议题
    handleIssueList () {
      this.$router.push({ name: 'IssueList' })
    },
    // 全部征稿
    OnlineArticleList () {
      this.$router.push({ name: 'OnlineArticleList' })
    }
  },
  created () {
    this.getIssueList()
    this.getInterviewList()
    this.getArticleList()
  }
}
</script>
<style scoped>
@import "./contributions.scss";
.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f10909;
}
.domain-p img {
  margin-right: 25px;
}
.media-table {
  min-height: 539px;
}
</style>
