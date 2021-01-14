<template>
  <div class="issuedetail container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'IssueList' }">议题列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'IssueDetails' }">{{issueDetails.issueTitle}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="detail-cont">
      <div class="detail-head">
        <h2 v-text="issueDetails.issueTitle">无</h2>
        <p class="dep-name">{{issueDetails.createDepartmentName}}<span class="issue-user-name"
                v-text="issueDetails.createUserName">无</span><span v-text="issueDetails.createTime">无</span></p>
      </div>
      <div class="detail-center">
        <p v-text="issueDetails.issueDescribe">无</p>
      </div>
      <div class="detail-foot"
           v-if="mdiIssueDetailsList.length">
        <ul>
          <li v-for="(item,index) in mdiIssueDetailsList"
              :key="index">
            <div class="foot-left">
              <span>{{index + 1}}楼</span>
            </div>
            <div class="foot-right">
              <div class="user-details">
                <span class="user-name">{{item.userName}}</span>
                <span class="user-unit">{{item.departmentName}}</span>
                <span class="time">{{item.replyTime}}</span>
              </div>
              <p>{{item.replyContent}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="commentBox">
        <el-input v-model="issueContent"
                  type="textarea"
                  resize="none"
                  :rows='8'></el-input>
        <div class="buttons">
          <el-button type="primary"
                     @click="reply">回复</el-button>
          <el-button @click="handleCancel">取消</el-button>
        </div>
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      mdiIssueDetailsList: [],
      issueDetails: {
        issueTitle: '', // 标题
        issueDescribe: '', // 内容
        createTime: '', // 创建时间
        createDepartmentName: '', // 单位
        createUserName: '' // 创建人
      },
      routeId: null,
      issueContent: ''
    }
  },
  created () {
    this.routeId = this.$route.query.id
  },
  mounted () {
    this.getIssueDetails()
  },
  methods: {
    handleCancel () {
      this.$router.go(-1)
    },
    // 获取详情
    getIssueDetails () {
      this.$http.get(`${this.$api.getIssusWithDetails}?id=${this.routeId}`)
        .then(res => {
          if (res.data.data) {
            this.issueDetails = res.data.data
            this.mdiIssueDetailsList.push(...res.data.data.mdiIssueDetailsList)
          }
        })
        .catch(() => { })
    },
    // 回复
    reply () {
      if (this.issueContent.trim()) {
        let row = {
          issueId: this.routeId,
          replyContent: this.issueContent
        }
        this.$http.post(this.$api.saveIssusDetails, row)
          .then(res => {
            this.$message.success('操作成功！')
            this.mdiIssueDetailsList.push(res.data.data)
            this.issueContent = ''
          })
          .catch(() => { })
      } else {
        this.$message.warning('请输入回复内容！')
      }
    }
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
.detail-cont {
  width: 1102px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 1);
  margin: 0 auto;
}
.issuedetail .detail-head {
  box-sizing: border-box;
  margin: 30px;
  border-bottom: 1px solid #e9e9e9;
}
.issuedetail .detail-head h2 {
  font-size: 24px;
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  text-align: center;
}
.issuedetail .detail-head p {
  font-size: 13px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(170, 170, 170, 1);
  line-height: 32px;
}
.issuedetail .detail-head p span:last-child {
  float: right;
}
.issuedetail .detail-center {
  box-sizing: border-box;
  width: 1102px;
  font-size: 16px;
  margin: 0 auto;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  padding: 18px 42px 30px 42px;
}
.issuedetail .detail-center p {
  padding: 0 130px 30px 130px;
  font-size: 16px;
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  text-indent: 32px;
  box-sizing: border-box;
  border-bottom: 1px solid rgba(209, 230, 246, 1);
}
.issuedetail .detail-foot {
  border-bottom: 3px solid #d1e6f6;
  margin-top: 60px;
}
.issuedetail .detail-foot ul li {
  border-top: 3px solid #d1e6f6;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}
.issuedetail .detail-foot .foot-left {
  width: 170px;
  min-height: 146px;
  background: rgba(242, 247, 251, 1);
  font-size: 24px;
  color: rgba(43, 155, 240, 1);
  padding: 15px;
  box-sizing: border-box;
}
.issuedetail .detail-foot .foot-left span {
  float: right;
  margin-right: 15px;
}
.issuedetail .foot-right {
  width: 935px;
  box-sizing: border-box;
  padding: 5px 30px 20px 40px;
}
.user-details {
  border-bottom: 1px dotted #ccc;
  margin-bottom: 15px;
}
.user-details span {
  line-height: 40px;
  font-weight: normal;
  font-size: 16px;
}
.user-name {
  color: #2e9ef2;
  margin-right: 77px;
}
.time {
  color: rgba(204, 204, 204, 1);
  float: right;
}
.issuedetail .foot-right p {
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
}
.issuedetail .commentBox {
  margin-top: 12px;
  height: 340px;
}
.buttons {
  text-align: center;
}
.buttons .el-button {
  width: 150px;
}
.issue-user-name {
  margin-left: 15px;
}
</style>
