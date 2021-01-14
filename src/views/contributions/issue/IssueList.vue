<template>
  <div class="issueList container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'IssueList' }">议题列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="buttons">
      <el-button @click="myissue"
                 round
                 type="warning"
                 size="medium">我的议题</el-button>
      <el-button @click="launchissue"
                 round
                 size="medium"
                 type="primary">发起议题</el-button>
    </div>
    <div class="newset">
      <el-table :data="issueList"
                style="width: 100%"
                border>
        <el-table-column label="标题"
                         width="480">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="issuedetail(scope.row.id)">{{scope.row.issueTitle}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName"
                         label="发起人"
                         width="160">
        </el-table-column>
        <el-table-column prop="createDepartmentName"
                         label="发起单位"
                         width="250px">
        </el-table-column>
        <el-table-column prop="createTime"
                         label="发起时间"
                         width="190">
        </el-table-column>
        <el-table-column label="回复数/阅读人数">
          <template slot-scope="scope">
            {{scope.row.replyNum}}/{{scope.row.readNum}}
          </template>
        </el-table-column>
      </el-table>
      <!-- <no-permission v-else></no-permission> -->
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
export default {
  data () {
    return {
      issueList: [],
      params: {
        pageNum: 1,
        pageSize: 32
      },
      dataLess: false
    }
  },
  methods: {
    getData () {
      this.params.pageNum++
      this.getIssueList()
    },
    // 获取议题列表
    getIssueList () {
      this.$http.post(this.$api.listIssus, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.issueList.push(...datas)
          if (datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 跳转议题详情
    issuedetail (id) {
      this.$router.push({ name: 'IssueDetails', query: { id: id } })
    },
    myissue () {
      this.$router.push({ name: 'MyIssueList' })
    },
    launchissue () {
      this.$router.push({ name: 'WriteIssue' })
    }
  },
  created () {
    this.getIssueList()
  }
}
</script>
<style scoped>
@import "../contributions.scss";
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.issueList .buttons .el-button span {
  display: inline-block;
  font-size: 14px;
  font-family: Adobe Heiti Std R;
  font-weight: bold;
  background-color: transparent;
}
.newset {
  margin-top: 15px;
}
</style>
