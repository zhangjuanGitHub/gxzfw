<template>
  <div class="visitDetail container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'InterviewList' }">约访列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'InterviewDetails' }">约访详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="detail-cont">
      <div class="detail-head">
        <h2 v-text="interviewDetails.interviewTheme"></h2>
        <p>
          <span>申请人：</span>
          <span class="blue"
                v-text="interviewDetails.applyDepartmentName"></span>
          <span class="blue"
                v-text="interviewDetails.applyUserName"></span>
          <span v-text="interviewDetails.applyTime"></span></p>
        <img v-if="interviewDetails.replyStatus === 2"
             :src="require('@/assets/images/contributions/refuse.png')">
        <img v-else-if="interviewDetails.replyStatus === 1"
             :src="require('@/assets/images/contributions/accept.png')">
      </div>
      <div class="detail-center">
        <p v-text="interviewDetails.interviewDescribe"></p>
      </div>
      <div class="review"
           v-if="interviewDetails.isAllowReply" v-permission="605">
        <el-button type="success"
                   @click="successInterview">同意约访</el-button>
        <el-button type="danger"
                   @click="errorInterview">拒绝约访</el-button>
      </div>
      <div class="company"
           v-if="interviewDetails.replyStatus === 1 || interviewDetails.replyStatus === 2">
        <p class="company-unit">被约访单位: <span v-text="interviewDetails.targetDepartmentName"></span></p>
        <p class="company-unit">约访详情: <span v-html="interviewDetails.replyMessage"></span></p>
        <!--        <ul>-->
        <!--          <li>-->
        <!--            <span>来访时间</span>:-->
        <!--            <span>2019.1.16</span>-->
        <!--          </li>-->
        <!--          <li>-->
        <!--            <span>地址</span>:-->
        <!--            <span>吉林省高级人民法院宣传部</span>-->
        <!--          </li>-->
        <!--          <li>-->
        <!--            <span>对接人</span>:-->
        <!--            <span>张明 12345645645</span>-->
        <!--          </li>-->
        <!--        </ul>-->
      </div>
      <div class="detail-foot"
           v-if="interviewDetails.interviewAppraise">
        <ul>
          <li>
            <div class="foot-left">
              <span>约访评价</span>
            </div>
            <div class="foot-right interviewStatus">
              <h2>
                <el-button v-if="interviewDetails.interviewResult === 0"
                           type="danger"
                           size="small">不满意</el-button>
                <el-button v-else-if="interviewDetails.interviewResult === 1"
                           type="warning"
                           size="small">一般</el-button>
                <el-button v-else-if="interviewDetails.interviewResult === 2"
                           type="primary"
                           size="small">满意</el-button>
                <el-button v-else
                           type="success"
                           size="small">非常满意</el-button>
                <!--                <span>{{comment.time}}</span>-->
              </h2>
              <p>{{interviewDetails.interviewAppraise}}</p>
            </div>
          </li>
        </ul>
      </div>
      <div class="commentBox"
           v-if="interviewDetails.isAllowAppraise">
        <h2>约访评价</h2>
        <div class="evaluation-box">
          <el-input v-model="interviewAppraise"
                    type="textarea"
                    placeholder="请输入约访评价"
                    :rows=6></el-input>
        </div>
        <div class="buttons">
          <el-button type="danger"
                     @click="evaluation(0)">不满意</el-button>
          <el-button type="warning"
                     @click="evaluation(1)">一般</el-button>
          <el-button type="primary"
                     @click="evaluation(2)">满意</el-button>
          <el-button type="success"
                     @click="evaluation(3)">非常满意</el-button>
        </div>
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
    <el-dialog :title="dialogTitle"
               :visible.sync="dialogVisible"
               :modal-append-to-body="false"
               width="30%">
      <div>
        <el-input type="textarea"
                  v-model="replyMessage"
                  :rows="4"
                  :placeholder="replyStatus === 1 ? '请输入约访时间、地点以及对接人' : '请输入拒绝理由'">
        </el-input>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDialog">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="评价"
               :visible.sync="evaluationDialogVisible"
               :modal-append-to-body="false"
               width="30%">
      <span>您确定要执行此操作吗?</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="evaluationDialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="confirmEvalDialog">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      replyStatus: null, // 约访 1同意，2拒绝
      replyMessage: null, // 约访 回复信息
      dialogTitle: '',
      dialogVisible: false, // 同意或拒绝约访弹框
      evaluationDialogVisible: false, // 评价弹框
      interviewAppraise: '', // 评价内容
      interviewGrade: null, // 评价等级
      routeId: null, // 数据id
      adclass: true,
      interviewDetails: {
        interviewTheme: '', // 标题
        interviewDescribe: '', // 内容
        applyDepartmentName: '', // 约访单位
        applyUserName: '', // 申请人
        applyTime: '', // 时间
        targetDepartmentName: '', // 被约访人单位
        interviewResult: '', // 约访人状态
        interviewAppraise: '' // 回显约访评价
      },
      comment: {
        name: '',
        time: '2019.1.15 13:03',
        content: ''
      }
    }
  },
  methods: {
    // 确定评价
    confirmEvalDialog () {
      this.evaluationDialogVisible = false
      let row = {
        id: this.routeId,
        interviewResult: this.interviewGrade,
        interviewAppraise: this.interviewAppraise
      }
      this.$http.post(this.$api.appraiseInterview, row)
        .then(res => {
          this.$message.success('评价成功！')
          this.getInterviewList()
          // this.interviewDetails.interviewResult = this.interviewGrade
          // this.interviewDetails.interviewAppraise = this.interviewAppraise
        })
        .catch(() => { })
    },
    // 点击评价
    evaluation (id) {
      if (!this.interviewAppraise) {
        this.$message.warning('请输入评价内容！')
        return false
      }
      this.evaluationDialogVisible = true
      this.interviewGrade = id // 赋值等级
    },
    // 确认同意或拒绝约访
    confirmDialog () {
      if (this.replyStatus === 1 && !this.replyMessage) {
        this.$message.warning('请输入约访时间、地点以及对接人！')
      } else if (this.replyStatus === 2 && !this.replyMessage) {
        this.$message.warning('请输入拒绝理由！')
      }
      if (!this.replyMessage) {
        return false
      }
      let row = {
        id: this.routeId,
        replyStatus: this.replyStatus,
        replyMessage: this.replyMessage
      }
      this.$http.post(this.$api.replyInterview, row)
        .then(res => {
          this.$message.success('操作成功！')
          this.$router.push({ name: 'InterviewList' })
        })
        .catch(() => { })
    },
    // 同意约访
    successInterview () {
      this.dialogTitle = '同意约访'
      this.replyStatus = 1
      this.dialogVisible = true
    },
    // 拒绝约访
    errorInterview () {
      this.dialogTitle = '拒绝约访'
      this.replyStatus = 2
      this.dialogVisible = true
    },
    // 获取详情
    getInterviewList () {
      this.$http.get(`${this.$api.getInterviewView}?id=${this.routeId}`)
        .then(res => {
          this.interviewDetails = res.data.data
        })
        .catch(() => { })
    }
  },
  created () {
    this.routeId = this.$route.query.id
    this.getInterviewList()
  },
  components: {
  }
}
</script>
<style scoped>
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
.detail-head {
  box-sizing: border-box;
  border-bottom: 1px solid #e9e9e9;
  position: relative;
  padding: 30px;
}
.detail-head img {
  position: absolute;
  right: 0px;
  top: -10px;
}
.detail-head h2 {
  font-size: 24px;
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  margin-bottom: 15px;
  text-align: center;
}
.detail-head p {
  font-size: 16px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 60px;
}
.detail-head p span:last-child {
  color: #ccc;
}
.visitDetail .detail-center {
  box-sizing: border-box;
  width: 1102px;
  font-size: 16px;
  margin: 0 auto;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  padding: 6px 30px 32px 30px;
}
.visitDetail .detail-center p {
  padding: 0 40px 30px 40px;
  font-size: 16px;
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  text-indent: 32px;
  border-bottom: 1px solid #ccc;
  box-sizing: border-box;
}
.visitDetail .detail-foot {
  border-bottom: 3px solid #d1e6f6;
  margin-top: 60px;
}
.visitDetail .detail-foot ul li {
  border-top: 3px solid #d1e6f6;
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}
.visitDetail .detail-foot .foot-left {
  width: 170px;
  height: 146px;
  background: rgba(242, 247, 251, 1);
  font-size: 24px;
  color: rgba(43, 155, 240, 1);
  line-height: 49px;
}
.visitDetail .detail-foot .foot-left span {
  float: right;
  margin-right: 15px;
  font-size: 20px;
}
.visitDetail .foot-right {
  width: 982px;
  box-sizing: border-box;
  padding: 5px 30px 20px 40px;
}
.visitDetail .foot-right h2 {
  border-bottom: 1px solid #ccc;
  margin-top: 7px;
  padding-bottom: 9px;
}
.visitDetail .foot-right h2 span {
  font-weight: normal;
  display: inline-block;
  line-height: 40px;
  font-size: 16px;
}
.visitDetail .foot-right h2 span:first-child {
  width: 84px;
  height: 26px;
  border-radius: 3px;
  color: #ffffff;
  text-align: center;
  line-height: 26px;
}
.blues {
  background-color: #0f85de;
}
.reds {
  background-color: #d63232;
}
.visitDetail .foot-right h2 span:last-child {
  font-size: 14px;
  color: rgba(204, 204, 204, 1);
  float: right;
}
.visitDetail .foot-right p {
  font-size: 16px;
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
}
.visitDetail .commentBox {
  height: 340px;
  padding: 0 30px;
}
.commentBox .el-textarea textarea {
  width: 1010px;
  height: 188px;
  border-radius: 0px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgba(204, 204, 204, 1);
}
.visitDetail .buttons {
  width: 740px;
  display: flex;
  justify-content: space-between;
  margin: 27px auto;
}
.visitDetail .buttons button {
  width: 155px;
  height: 45px;
  border-radius: 5px;
  color: #fff;
  font-size: 20px;
}
.visitDetail .blue {
  color: #346ad7;
}
.visitDetail .blue {
  margin-right: 40px;
}
.commentBox h2 {
  height: 16px;
  font-size: 16px;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 16px;
  padding-left: 10px;
  border-left: 3px solid #3da8f8;
  margin-top: 40px;
}
.company {
  padding: 0 30px;
}
.company .company-unit {
  font-size: 16px;
  line-height: 40px;
}
.company-unit span {
  color: #346ad7;
}
.company h2 {
  font-size: 16px;
  font-family: Adobe Heiti Std R;
  color: rgba(0, 0, 0, 1);
  line-height: 32px;
  margin-left: 30px;
  margin-top: -14px;
}
.company ul {
  width: 787px;
  margin: 36px auto;
}
.company ul li {
  display: flex;
  width: 270px;
}
.company ul span:first-child {
  display: inline-block;
  width: 80px;
  text-align: justify;
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(0, 0, 0, 1);
}
.company ul span:first-child:after {
  content: " ";
  display: inline-block;
  width: 100%;
}
.company ul span:last-child {
  font-size: 14px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
  color: rgba(42, 93, 225, 1);
  margin-left: 13px;
}
.review {
  text-align: center;
  padding-bottom: 20px;
}
.review .el-button {
  width: 155px;
  height: 45px;
  font-size: 20px;
  border-radius: 5px;
}
.evaluation-box {
  margin-top: 20px;
}
</style>
