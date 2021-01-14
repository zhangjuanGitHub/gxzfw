<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ArticleDetail' }">稿件详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="manuscript-detail-box">
      <h2 v-if="isEdit || isArticle" >{{fromDate.articleTitle}}</h2>
      <h2 v-else>{{fromDate.solicitTitle}}</h2>
      <div class="detail-box">
        <div class="detail-box-left">
          <span class="area">{{fromDate.areaName}}</span>
          <span class="procuratorate">{{fromDate.departmentName}}</span>
          <span class="time">{{fromDate.createTime}}</span>
          <p v-if="isEdit" class="contrubute-name">{{fromDate.userName}}</p>
          <p v-else-if="isArticle" class="contrubute-name">{{fromDate.originalAuthor}}</p>
          <p v-else class="contrubute-name">{{fromDate.createUserName}}</p>
          <p class="contrubute-name"><span>投稿</span></p>
          <p class="audit">{{fromDate.checkUserName}}<span v-if="fromDate.checkUserName">审核</span></p>
        </div>
      </div>
      <div class="manuscript-main">
        <div v-if="isEdit || isArticle" v-html="fromDate.articleContent"></div>
        <div else v-html="fromDate.solicitContent"></div>
      </div>
      <div class="file-list" v-if="isEdit || isArticle">
        <p class="title">附件列表</p>
        <div v-for="(item,index) in fromDate.files"
             :key="index">
          <p class="file-detail"
             v-text="item.name"
             @click="fileDetail(item,index)"></p>
        </div>
      </div>
      <div class="file-list"
           v-if="iscover">
        <div class="annex-image-box"
             v-if="iscover">
          <p class="title">封面:</p>
          <div class="annex-margin annex-details">
            <el-image :src="fromDate.url"
                      style="max-height:230px; max-width:230px"></el-image>
          </div>
        </div>
      </div>
    </div>
    <div class="manuscript-btn" v-if="isEdit && hasPass === 0">
      <el-button icon="el-icon-check"
                 type="primary"
                 @click="articletoUse" v-if="!fromDate.self">通过</el-button>
      <el-button icon="el-icon-close"
                 type="info"
                 @click="articlenoUse" v-if="!fromDate.self">退回</el-button>
    </div>
    <div class="manuscript-btn" v-if="iscover">
      <el-button type="primary" v-if="!fromDate.self"
                 @click="articletoContribute">我要投稿</el-button>
    </div>
    <div class="left-fix">
      <!-- <div class="tram-img-box">
        <el-popover placement="right"
                    width="400"
                    ref="team"
                    @hide="setTeamHide()"
                    v-model="showTeamPopover">
          <div class="checkbox-box">
            <p class="checkbox-box-p">稿件适用于：</p>
            <div class="checkbox-detail">
              <div class="checkbox-detail-box">
                <el-checkbox-group v-model="manuscriptTypeBox">
                  <div class="checkbox-img-box"
                       v-for="item in manuscriptType"
                       :key="item.label">
                    <el-checkbox :label="item.label">
                      <img :src="item.img">
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </div>
            <el-input type="textarea"
                      :rows="5"
                      v-model="manuscriptTextarea"></el-input>
            <div class="text-right checkbox-btn">
              <el-button type="info"
                         size="small"
                         @click="setTeamCancel">取消</el-button>
              <el-button type="primary"
                         size="small"
                         @click="setTeamConfirm">确认</el-button>
            </div>
          </div>
        </el-popover>
        <el-tooltip class="item"
                    effect="dark"
                    content="团队推荐"
                    placement="right">
          <img v-popover:team
               :src="require('@/assets/images/message/td.png')"
               alt="团队推荐">
        </el-tooltip>
      </div> -->
      <div class="tram-img-box">
        <el-tooltip class="item"
                    effect="dark"
                    content="发起在线沟通"
                    placement="right">
          <img @click="showTeamDialog"
               :src="require('@/assets/images/message/iconfont-huifu.png')"
               alt="发起在线沟通">
        </el-tooltip>
      </div>
      <div class="user-dialog">
        <el-dialog :visible.sync="dialogVisible"
                   :modal-append-to-body='false'
                   :modal="ismodal"
                   @close="getDialog()"
                   center
                   :title="fromDate.createUserName"
                   width="50%">
          <el-input type="textarea"
                    v-model="initiateContent"
                    placeholder="请输入发送内容"
                    :rows="7"></el-input>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="getDialog()">取 消</el-button>
            <el-button type="primary"
                       @click="setDialogText()">提 交</el-button>
          </span>
        </el-dialog>
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
  </div>
</template>
<script>
export default {
  name: 'ManuscriptDetail',
  data () {
    return {
      userId: '', // userId
      manuscriptType: [
        { label: '1', img: require('@/assets/images/message/wx.png') },
        { label: '2', img: require('@/assets/images/message/wb.png') },
        { label: '3', img: require('@/assets/images/message/waiwang.png') },
        { label: '4', img: require('@/assets/images/message/toutiao.png') }
      ],
      initiateContent: '', // 发送站内信息内容
      manuscriptTypeBox: [],
      manuscriptTextarea: '',
      articleDetailId: '',
      showTeamPopover: false, // 团队气泡
      showReplyPopover: false, // 回复气泡
      dialogVisible: false, // 回复弹框
      ismodal: false, // 遮罩
      fromDate: {},
      hasPass: '', // 是否审核过
      isArticle: false, // 是稿件
      iscover: false, // 征稿主题
      isEdit: false // 审核时
    }
  },
  methods: {
    // 查看附件详情
    fileDetail (item, index) {
      window.open(item.url, '_blank')
    },
    // 取消推荐
    setTeamCancel () {
      this.showTeamPopover = false
    },
    // 团队推荐
    setTeamConfirm () {
      let listcread = {
        articleId: this.fromDate.id,
        suitRange: this.manuscriptTypeBox.toString(),
        adviseReason: this.manuscriptTextarea
      }
      this.$http.post(this.$api.advise, listcread)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.$router.push({ name: 'TeamMessage' })
          }
        })
        .catch(() => {
        })
      this.showTeamPopover = false
    },
    // 我要投稿
    articletoContribute () {
      // this.$router.push({ name: 'WriteContribute', query: { id: this.fromDate.id } })
      this.$router.push({ name: 'SelectContribute', query: { id: this.fromDate.id } })
    },
    // 通过
    articletoUse () {
      let useArticle = {
        id: this.articleDetailId,
        status: 1
      }
      this.$http.post(this.$api.checkArticle, useArticle)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.$router.push({ name: 'ArticleList' })
          }
        })
        .catch(() => {
        })
    },
    // 退回
    articlenoUse () {
      let noUseArticle = {
        id: this.articleDetailId,
        status: 2
      }
      this.$http.post(this.$api.checkArticle, noUseArticle)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.$router.push({ name: 'ArticleList' })
          }
        })
        .catch(() => {
        })
    },
    // 关闭弹框
    getDialog () {
      this.dialogVisible = false
    },
    // 确认弹框
    setDialogText () {
      if (this.initiateContent) {
        let ruleForm = {
          sendContent: this.initiateContent,
          slaveUserId: this.fromDate.createUserId
        }
        this.$http.post(this.$api.saveMessageChat, ruleForm)
          .then(res => {
            if (res.data.code === 200) {
              this.dialogVisible = false
              this.$message.success(res.data.message)
            }
          })
          .catch(() => {
          })
      } else {
        this.$message.warning('消息内容不能为空!')
      }
    },
    // 发送站内信息
    showTeamDialog () {
      this.dialogVisible = true
    },
    // 阅读征稿
    readDetail () {
      this.$http.get(`${this.$api.getReadDetail}?id=${this.articleDetailId}`)
        .then(res => {
          this.articleDetail()
        })
        .catch(() => {
        })
    },
    // 获取征稿详情
    articleDetail () {
      this.$http.get(`${this.$api.getArticleDetail}?id=${this.articleDetailId}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.fromDate = res.data.data
          }
        })
        .catch(() => {
        })
    },
    getCheckDetail () {
      this.$http.get(`${this.$api.editDetail}?id=${this.articleDetailId}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.fromDate = res.data.data
          }
        })
        .catch(() => {
        })
    },
    getArticle () {
      this.$http.get(`${this.$api.articleDetail}?id=${this.articleDetailId}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.fromDate = res.data.data
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.userId = this.$store.state.user.userInfo.id
    this.articleDetailId = this.$route.query.id
    this.isEdit = this.$route.query.isEdit
    this.isArticle = this.$route.query.isArticle
    this.iscover = this.$route.query.iscover
    this.hasPass = this.$route.query.status
    if (this.isArticle) {
      this.getArticle()
    } else if (this.isEdit) {
      this.getCheckDetail()
    } else {
      this.readDetail()
    }
  },
  components: {}
}
</script>
<style lang="scss">
// @import "../message";
</style>
<style scoped>
.manuscript-detail-box {
  width: 1100px;
  margin: 0 auto;
  padding: 33px 30px 65px;
  background: #fff;
}
.manuscript-detail-box h2 {
  font-size: 24px;
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: rgba(51, 51, 51, 1);
  line-height: 32px;
  margin-bottom: 15px;
  text-align: center;
}
.detail-box {
  margin-top: 22px;
  font-size: 13px;
  color: #aaaaaa;
  display: flex;
  justify-content: space-between;
  padding-bottom: 22px;
  border-bottom: 1px solid rgba(233, 233, 233, 1);
}
.procuratorate,
.contrubute-name {
  margin-left: 15px;
  margin-right: 20px;
}
.photo {
  margin-left: 20px;
}
.manuscript-main {
  padding: 65px 120px;
  word-break: break-all;
  min-height: 500px;
}
.manuscript-main div {
  line-height: 22px;
}
.manuscript-btn {
  text-align: center;
  margin-top: 22px;
}
.left-fix {
  position: fixed;
  z-index: 9;
  top: 266px;
}
.tram-img-box,
.message-img-box {
  width: 54px;
  height: 54px;
  position: relative;
}
.tram-img-box img,
.message-img-box img {
  width: 30px;
  position: absolute;
  top: 12px;
  left: 12px;
  cursor: pointer;
}
.tram-img-box {
  background: #2b9bf0;
  margin-bottom: 5px;
}
.message-img-box {
  background: #a0c3ff;
}
.user-box {
  padding: 0 15px;
}
.user-detail-box {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.user-detail {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.user-img-box {
  width: 30px;
  height: 30px;
  background: #45aaf6;
  position: relative;
}
.user-img-box img {
  width: 16px;
}
.user-detail p {
  margin-left: 10px;
}
.text-center .el-button {
  width: 100%;
}
.checkbox-box {
  padding: 5px 15px;
}
.checkbox-box-p {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}
.checkbox-detail {
  margin-bottom: 10px;
}
.el-checkbox-group {
  display: flex;
  align-items: center;
}
.el-checkbox-group .el-checkbox {
  margin-right: 0px;
}
.checkbox-img-box {
  display: flex;
  align-items: center;
  margin-left: 10px;
}
.checkbox-img-box:first-child {
  margin-left: 0;
}
.checkbox-img-box img {
  width: 22px;
  height: 16px;
  margin-left: 5px;
  vertical-align: middle;
}
.checkbox-btn {
  margin-top: 20px;
}
.contrubute-name,
.audit {
  display: inline-block;
}
.contrubute-name span,
.audit span {
  margin-left: 5px;
}
.file-list {
  margin-bottom: 10px;
}
.file-list .title {
  margin-bottom: 10px;
}
.file-list .file-detail {
  text-indent: 20px;
  color: #2b9bf0;
  cursor: pointer;
  text-decoration: underline;
  line-height: 20px;
}
.articleSummary {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
