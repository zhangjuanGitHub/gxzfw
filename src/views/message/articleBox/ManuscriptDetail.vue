<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item v-if="page==='2'">历史稿件</el-breadcrumb-item>
        <el-breadcrumb-item v-else>稿件详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="manuscript-detail-box"
         id="pdfCentent">
      <!-- 批注 -->
      <div class="comments"
           id="comments"
           v-if="commentDialogVisible">
        <el-image :src="imgUrl"
                  class="comment-img"></el-image>
        <div class="active_box"
             v-for="(item, index) of commentList"
             :key="index"
             :style="{top: item.postilTop + 'px', left: item.postilLeft + 'px', display: 'block'}">
          <div class="circle_div"
               @click.stop="showComment(index)"
               :style="{'background': (item.status ? '#9fa2a8' : 'rgba(255, 0, 0, 0.6)')}">{{item.postilOrder}}</div>
          <div class="comment_list"
               :style="{display: showAsideComment}">
            <div class="checkbox_div"
                 @change.stop="changeCommentStatus(item)">
              <el-checkbox v-model="item.status"
                           :disabled="item.status || userInfo.userName !== fromDate.ownerUserName">标为已读</el-checkbox>
            </div>
            <div class="list_container">
              <div class="list_div">
                <div class="list_head">
                  <div>
                    <el-avatar size="small"
                               :src="item.headPicture || circleUrl"></el-avatar>
                  </div>
                  <div>{{item.username}}</div>
                  <div>{{item.createTime}}</div>
                  <div v-if="userInfo.userName === item.username"><i class="el-icon-delete"
                       @click.stop="deleteComment(item.id)"></i></div>
                </div>
                <div class="list_content">{{item.postilContent}}</div>
              </div>
              <div class="list_div"
                   v-for="(i, sindex) of item.cikPostilReply"
                   :key="sindex">
                <div class="list_head">
                  <div>
                    <el-avatar size="small"
                               :src="i.headPicture || circleUrl"></el-avatar>
                  </div>
                  <div>{{i.username}}</div>
                  <div>{{i.createTime}}</div>
                  <div v-if="userInfo.userName === i.username"><i class="el-icon-delete"
                       @click.stop="deleteReply(i.id)"></i></div>
                </div>
                <div class="list_content">{{i.replyContent}}</div>
              </div>
              <div class="replay-container"
                   :style="{display: showAsideComment}">
                <div class="reply_main"
                     @click.stop="smallClick">
                  <el-input type="textarea"
                            placeholder="回复内容"
                            v-model="replyCotent"></el-input>
                </div>
                <div class="comment_btn">
                  <el-button type="primary"
                             size="small"
                             @click.stop="submitReply(item.id)">确认</el-button>
                  <el-button size="small"
                             style="margin-right: 10px"
                             @click.stop="cancelReply(index)">取消</el-button>
                </div>
              </div>
              <div class="list_reply"
                   @click.stop="openReplyContainer(index)">回复</div>
            </div>
          </div>
        </div>
        <div class="create_box">
          <div class="create_circle_div"
               :style="{display: showAsideComment}"></div>
          <div class="create_aside_comment"
               :style="{display: showAsideComment}">
            <div class="comment_container"
                 @click.stop="smallClick">
              <el-input type="textarea"
                        placeholder="批注内容"
                        v-model="comment.postilContent"></el-input>
            </div>
            <div class="comment_btn">
              <el-button type="primary"
                         size="small"
                         @click.stop="submitComments">确认</el-button>
              <el-button size="small"
                         style="margin-right: 10px"
                         @click.stop="cancelComments">取消</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- HTML正文 -->
      <div class="manuscript-detail"
           id="toComments"
           v-if="!commentDialogVisible">
        <p class="title" v-if="fromDate.publishChannel!=='weiboText'">{{fromDate.articleTitle}}</p>
        <div class="detail-box" v-if="fromDate.publishChannel!=='weiboText'">
          <div class="detail-box-left">
            <span class="area">{{fromDate.areaName}}</span>
            <span class="procuratorate">{{fromDate.departmentName}}</span>
            <span class="time">{{fromDate.createTime}}</span>
            <p class="contrubute-name" v-if="fromDate.originalAuthor">{{fromDate.originalAuthor}}<span>投稿</span></p>
            <p class="audit">{{fromDate.checkUserName}}<span v-if="fromDate.checkUserName">审核</span></p>
          </div>
          <div class="detail-box-right">
            <span class="author">原作者：{{fromDate.originalAuthor || '无'}}</span>
            <span class="photo">摄影摄像：{{fromDate.cameristName || '无'}}</span>
          </div>
        </div>
        <div class="manuscript-main">
          <div v-html="fromDate.articleContent"></div>
          <div v-if="fromDate.publishChannel==='weiboText'" class="list-img">
            <div v-for="(item,index) in fromDate.files"
               :key="index" class="img-box">
              <img :src="item.filePath">
            </div>
          </div>
        </div>
        <div class="file-list" v-if="fromDate.publishChannel!=='weiboText'">
          <p class="title">附件列表</p>
          <div v-for="(item,index) in fromDate.files"
               :key="index">
            <p class="file-detail"
               v-text="item.fileName"
               @click="fileDetail(item,index)"></p>
          </div>
        </div>
        <div class="file-list"
             v-if="fromDate.coverImage">
          <div class="annex-image-box"
               v-if="fromDate.coverImage">
            <p class="title">封面:</p>
            <div class="annex-margin annex-details">
              <el-image :src="fromDate.coverImage"
                        style="max-height:230px; max-width:230px"></el-image>
            </div>
          </div>
        </div>
        <div class="file-list"
             v-if="fromDate.coverImage">
          <div class="annex-image-box"
               v-if="fromDate.articleSummary">
            <p class="title">文章摘要:</p>
            <div class="articleSummary"
                 v-text="fromDate.articleSummary">
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="manuscript-btn"
         v-if="status==='-1'">
      <el-button type="primary"
                 @click="recovery">恢复稿件</el-button>
    </div> -->
    <div class="manuscript-btn"
         v-if="status==='0'">
      <el-button type="primary"
                 @click="submitToCheck">提交审核</el-button>
    </div>
    <div class="manuscript-btn"
         v-if="this.$route.query.changeSide==='true'">
      <el-button type="primary"
                 @click="articletoUse">点赞</el-button>
    </div>
    <div class="manuscript-btn"
         v-if="status==='3'">
      <el-button type="primary"
                 @click="submitToVerify">提交校对</el-button>
    </div>
    <div class="manuscript-btn"
         v-if="page==='1'&&status==='4'">
      <el-button type="primary"
                 @click="overToVerify"
                 v-if="history">校对完成</el-button>
    </div>
    <div class="left-fix"
         v-if="history">
      <div class="tram-img-box"
           v-if="status&&status <'2'">
        <el-tooltip effect="dark"
                    content="编辑稿件"
                    placement="right">
          <img @click="showEditor"
               :src="require('@/assets/images/Editor.png')"
               alt="编辑稿件">
        </el-tooltip>
      </div>
      <div class="tram-img-box">
        <el-tooltip effect="dark"
                    content="历史记录"
                    placement="right">
          <img @click="showMark"
               :src="require('@/assets/images/mark.png')"
               alt="历史记录">
        </el-tooltip>
      </div>
      <div class="tram-img-box">
        <el-tooltip class="item"
                    effect="dark"
                    content="添加批注"
                    placement="right">
          <img @click="showCommentsDialog"
               :src="require('@/assets/images/message/pizhu.png')"
               alt="添加批注">
        </el-tooltip>
      </div>
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
      <div class="tram-img-box">
        <el-popover placement="right"
                    width="400"
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
          <el-tooltip class="item"
                      effect="dark"
                      content="团队推荐"
                      placement="right"
                      slot="reference">
            <img :src="require('@/assets/images/message/td.png')"
                 alt="团队推荐">
          </el-tooltip>
        </el-popover>
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
    <el-dialog :title="activeTitle"
               :modal-append-to-body='false'
               :visible.sync="changeVisible"
               width="50%">
      <div class="user-list">
        <el-radio-group v-model="getRadio"
                        label-width="100px">
          <!-- <el-radio v-for="item in this.checkdData"
                    :label="item.id"
                    :key="item.id">{{item.userName}}</el-radio> -->
          <div v-if="!this.checkdData.length && activeTitle === '提交审核'">
            <div class="change_sort">
              <el-radio v-for="item in this.sortList[0]"
                        :label="item.id"
                        :key="item.id">{{item.userName}}</el-radio>
            </div>
            <div class="change_sort">
              <el-radio v-for="item in this.sortList[1]"
                        :label="item.id"
                        :key="item.id">{{item.userName}}</el-radio>
            </div>
            <div class="change_sort">
              <el-radio v-for="item in this.sortList[2]"
                        :label="item.id"
                        :key="item.id">{{item.userName}}</el-radio>
            </div>
          </div>
          <div v-else>
            <el-radio v-for="item in this.checkdData"
                      :label="item.id"
                      :key="item.id">{{item.userName}}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="overClick">取 消</el-button>
        <el-button type="primary"
                   @click="updataClick">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="历史记录"
               :modal-append-to-body='false'
               :visible.sync="markVisible"
               width="50%">
      <div class="mark-table">
        <el-table :data="markData"
                  border
                  stripe
                  height="450"
                  style="width: 100%">
          <el-table-column prop="publishChannel"
                           label="稿件渠道"
                           width="140">
            <template slot-scope='scope'>
              <span v-if="scope.row.publishChannel==='platform'">
                平台
              </span>
              <span v-if="scope.row.publishChannel==='weixin'">
                微信
              </span>
              <span v-if="scope.row.publishChannel==='weibo'">
                微博文章
              </span>
              <span v-if="scope.row.publishChannel==='weiboText'">
                微博
              </span>
              <span v-if="scope.row.publishChannel==='toutiao'">
                头条
              </span>
              <span v-if="scope.row.publishChannel==='website'">
                网站
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="articleTitle"
                           label="标题">
            <template slot-scope='scope'>
              <div @click="checkRow(scope.row, scope.$index)"><u class="lin-clamp-1 title-u"
                   v-text="scope.row.articleTitle"></u></div>
            </template>
          </el-table-column>
          <el-table-column prop="updateUserName"
                           label="编辑人"
                           width="180">
          </el-table-column>

          <el-table-column prop="updateTime"
                           label="编辑时间">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="提交发布"
               :modal-append-to-body='false'
               :visible.sync="submitVisible"
               width="50%">
      <div class="user-list">
        <el-radio-group v-model="getPublic"
                        label-width="100px">
          <el-radio v-for="item in this.publicData"
                    :label="item.id"
                    :key="item.id">{{item.userName}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="overPublic">取 消</el-button>
        <el-button type="primary"
                   @click="submitPublic">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'
export default {
  name: 'ManuscriptDetail',
  data () {
    return {
      history: true,
      submitVisible: false,
      getPublic: '', // 发布人id
      publicData: [], // 发布人数据
      params: {
        pageNum: 1,
        pageSize: 10
      }, // 获取历史记录参数
      page: '', // 校对展示参数
      api: '',
      markData: [], // 历史记录数据
      markVisible: false, // 历史记录弹框
      activeTitle: '',
      getRadio: '', // 选中数据
      checkdData: [],
      sortList: [[], [], []],
      changeVisible: false,
      status: '', // 稿件状态
      toLike: true,
      replyCotent: '',
      showAsideComment: 'none',
      commentList: [],
      pngData: '',
      userId: '', // userId
      manuscriptType: [
        { label: '1', img: require('@/assets/images/message/wx.png') },
        { label: '2', img: require('@/assets/images/message/wb.png') },
        { label: '3', img: require('@/assets/images/message/toutiao.png') },
        { label: '4', img: require('@/assets/images/message/waiwang.png') }
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
      commentDialogVisible: false, // 批注
      imgUrl: '',
      readchecked: false,
      comment: {
        postilOrder: '',
        postilLeft: '',
        postilTop: '',
        postilContent: '',
        postilArticleId: '',
        status: ''
      },
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      commentIndex: ''
    }
  },
  methods: {
    // 撤回恢复
    recovery () {
      console.log('撤回恢复')
    },
    // 取消提交
    overClick () {
      this.checkdData = []
      this.getRadio = ''
      this.changeVisible = false
    },
    // 确定提交
    updataClick () {
      if (this.getRadio) {
        // this.contDetail.checkUserIds = this.getRadio
        this.$http.get(this.api, { params: { id: this.articleDetailId, userId: this.getRadio } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.$router.push({ name: 'MyMessageList' })
              this.getRadio = ''
              this.changeVisible = false
              // this.tableData = []
              // this.myArticle()
            }
          })
          .catch(() => { })
      } else {
        this.$message.warning('请选择提交用户')
      }
    },
    getSortList () {
      this.$http.get(this.$api.getOrgList)
        .then(res => {
          let datas = res.data.data
          datas.map((val) => {
            if (val.level === '1') {
              this.sortList[0].push({ 'id': val.user_id, 'userName': val.user_name })
            } else if (val.level === '2') {
              this.sortList[1].push({ 'id': val.user_id, 'userName': val.user_name })
            } else {
              this.sortList[2].push({ 'id': val.user_id, 'userName': val.user_name })
            }
          })
        })
        .catch(() => { })
    },
    // 打开提交审核弹框 获取审核人数据
    submitToCheck () {
      this.activeTitle = '提交审核'
      this.api = this.$api.submitToCheck
      this.checkdData = []
      if (!this.sortList[0].length && !this.sortList[1].length && !this.sortList[2].length) {
        this.$http.get(this.$api.listCheckUser)
          .then(res => {
            if (res.data.code === 200) {
              this.changeVisible = true
              this.checkdData = res.data.data
            }
          })
          .catch(() => { })
      } else {
        this.changeVisible = true
        // this.checkdData = this.sortList
      }
    },
    // 打开提交校对弹框 获取校对人数据
    submitToVerify () {
      this.activeTitle = '提交校对'
      this.checkdData = []
      this.api = this.$api.submitToVerify
      this.$http.get(this.$api.listVerifyUser)
        .then(res => {
          if (res.data.code === 200) {
            this.changeVisible = true
            this.checkdData = res.data.data
          }
        })
        .catch(() => { })
    },
    // 展示某一条批注
    showComment (id) {
      let num = document.getElementsByClassName('circle_div')
      let com = document.getElementsByClassName('comment_list')
      let activeBox = document.getElementsByClassName('active_box')
      for (let i = 0; i < num.length; i++) {
        com[i].style.display = 'none'
        activeBox[i].style.zIndex = 0
      }
      com[id].style.display = 'block'
      activeBox[id].style.zIndex = 999
      this.commentIndex = id
    },
    // 取消展示批注或者回复
    cancelComment () {
      let that = this
      document.body.onclick = function (e) {
        let bod = document.querySelector('body')
        bod.style.overflow = 'auto'
        e.stopPropagation()
        let activeBox = document.getElementsByClassName('active_box')
        for (let i = 0; i < activeBox.length; i++) {
          activeBox[i].style.zIndex = 0
        }
        let comment = document.getElementsByClassName('comment_list')
        if (comment[that.commentIndex]) {
          comment[that.commentIndex].style.display = 'none'
        }
        let replyBtn = document.getElementsByClassName('list_reply')
        let replyBox = document.getElementsByClassName('replay-container')
        for (let i = 0; i < replyBtn.length; i++) {
          replyBtn[i].style.display = 'block'
          replyBox[i].style.display = 'none'
        }
      }
    },
    // HTML转成图片
    showCommentsCircle () {
      var htmlDom = document.getElementById('toComments')
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      html2canvas(htmlDom, { useCORS: true }).then(canvas => {
        let dataURL = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
        this.imgUrl = dataURL
        if (this.imgUrl !== '') {
          this.commentDialogVisible = true
        }
      })
    },
    // 添加批注
    showCommentsDialog () {
      let com = document.getElementsByClassName('comment_list')
      for (let i = 0; i < com.length; i++) {
        com[i].style.display = 'none'
      }
      if (this.commentDialogVisible) {
        this.dragDiv()
      } else {
        new Promise((resolve, reject) => {
          this.showCommentsCircle()
          resolve()
        }).then(() => {
          this.dragDiv()
        })
      }
    },
    // 绘制div
    dragDiv (e) {
      let that = this
      e = event || window.event
      var startX, startY
      var clickArea = document.getElementById('pdfCentent')
      clickArea.style.cursor = 'crosshair'
      clickArea.onclick = function (e) {
        let bod = document.querySelector('body')
        bod.style.overflow = 'auto'
        let bbox = clickArea.getBoundingClientRect()
        if (bbox.top < 116) {
          startX = e.pageX - bbox.left
          startY = e.clientY - bbox.top
        } else {
          startX = e.pageX - bbox.left
          startY = e.pageY - bbox.top
        }
        that.comment.postilLeft = startX - 17
        that.comment.postilTop = startY - 17
        let newBox = document.getElementsByClassName('create_box')[0]
        let numberComment = document.getElementsByClassName('create_circle_div')[0]
        let writeComment = document.getElementsByClassName('create_aside_comment')[0]
        numberComment.innerHTML = that.comment.postilOrder + 1
        newBox.style.top = startY - 17 + 'px'
        newBox.style.left = startX - 17 + 'px'
        newBox.style.zIndex = 999
        numberComment.style.display = 'block'
        writeComment.style.display = 'block'
      }
    },
    smallClick () {
      console.log(11)
    },
    // 确认添加批注
    submitComments () {
      if (this.comment.postilContent) {
        this.comment.postilOrder += 1
        this.$http.post(this.$api.addPostil, this.comment).then(res => {
          if (res.data.code === 200) {
            this.comment.postilContent = ''
            let numberComment = document.getElementsByClassName('create_circle_div')[0]
            let writeComment = document.getElementsByClassName('create_aside_comment')[0]
            let clickArea = document.getElementById('pdfCentent')
            clickArea.style.cursor = 'auto'
            numberComment.style.display = 'none'
            writeComment.style.display = 'none'
            this.$message.success('操作成功！')
            this.getCommentsList()
            clickArea.onclick = null
          }
        })
      } else {
        this.$message.error('批注内容不能为空！')
      }
    },
    // 取消添加批注
    cancelComments () {
      this.comment.postilContent = ''
      let numberComment = document.getElementsByClassName('create_circle_div')[0]
      let writeComment = document.getElementsByClassName('create_aside_comment')[0]
      let clickArea = document.getElementById('pdfCentent')
      numberComment.style.display = 'none'
      writeComment.style.display = 'none'
      clickArea.style.cursor = 'auto'
      clickArea.onclick = null
    },
    // 提交批注回复
    submitReply (id) {
      let msg = {
        postilId: id,
        replyContent: this.replyCotent
      }
      this.$http.post(this.$api.addPostilReply, msg).then(res => {
        if (res.data.code === 200) {
          this.replyCotent = ''
          // let replyBtn = document.getElementsByClassName('list_reply')
          // replyBtn[id].style.display = 'block'
          let replyBox = document.getElementsByClassName('replay-container')
          for (let i = 0; i < replyBox.length; i++) {
            replyBox[i].style.display = 'none'
          }
          this.getCommentsList()
          this.$message.success('操作成功！')
        }
      })
    },
    // 删除批注回复
    deleteReply (id) {
      let ids = []
      ids.push(id)
      this.$http.post(this.$api.deleteReply, { ids: ids })
        .then(res => {
          if (res.data.code === 200) {
            this.getCommentsList()
            this.$message.success('操作成功！')
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(() => {
          this.$message.error('删除失败！')
        })
    },
    // 取消批注回复
    cancelReply (id) {
      this.replyCotent = ''
      let replyBtn = document.getElementsByClassName('list_reply')
      replyBtn[id].style.display = 'block'
      let replyBox = document.getElementsByClassName('replay-container')
      for (let i = 0; i < replyBox.length; i++) {
        replyBox[i].style.display = 'none'
      }
    },
    // 展示批注回复
    openReplyContainer (id) {
      let replyBtn = document.getElementsByClassName('list_reply')
      replyBtn[id].style.display = 'none'
      let replyBox = document.getElementsByClassName('replay-container')
      for (let i = 0; i < replyBox.length; i++) {
        replyBox[i].style.display = 'none'
      }
      replyBox[id].style.display = 'block'
    },
    // 删除批注
    deleteComment (id) {
      let ids = []
      ids.push(id)
      this.$http.post(this.$api.deleteComments, { ids: ids })
        .then(res => {
          if (res.data.code === 200) {
            this.getCommentsList()
            this.$message.success('操作成功！')
            let com = document.getElementsByClassName('comment_list')
            for (let i = 0; i < com.length; i++) {
              com[i].style.display = 'none'
            }
          } else {
            this.$message.error('删除失败！')
          }
        })
        .catch(() => {
          this.$message.error('删除失败！')
        })
    },
    // 标为已读
    changeCommentStatus (item) {
      let box = {
        id: item.id,
        status: item.status
      }
      this.$http.post(this.$api.getCommentStatus, box)
        .then(res => {
          if (res.data.code === 200) {
            this.getCommentsList()
            this.$message.success('操作成功！')
          }
        })
        .catch(() => {
        })
    },
    // 打开推荐弹框
    showTeam () {
      this.showTeamPopover = true
    },
    // 查看附件详情
    fileDetail (item, index) {
      window.open(item.filePath, '_blank')
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
      if (this.manuscriptTextarea === '') {
        this.$message.warning('请输入推荐理由')
      } else if (this.manuscriptTypeBox.length < 1) {
        this.$message.warning('请选择稿件适用渠道')
      } else {
        this.$http.post(this.$api.advise, listcread)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.$router.push({ name: 'TeamMessage' })
              this.showTeamPopover = false
            }
          })
          .catch(() => {
          })
      }
    },
    // 点赞
    articletoUse () {
      this.$http.get(this.$api.articletoUse, { params: { id: this.articleDetailId } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.$router.push({ name: 'MessageArticleBox', query: { changeSide: true } })
          }
        })
        .catch(() => {
        })
    },
    // 不采用
    articlenoUse () {
      this.$http.get(this.$api.articlenoUse, { params: { id: this.articleDetailId } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.$router.push({ name: 'MessageArticleBox', query: { changeSide: false } })
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
    // 获取稿件详情
    articleDetail () {
      if (this.page === '2') {
        this.$http.get(`${this.$api.getHistory}` + `?historyId=${this.articleDetailId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.markVisible = false
              this.history = false
              this.fromDate = res.data.data
              this.getCommentsList()
            }
          })
          .catch(() => {
          })
      } else {
        this.$http.get(`${this.$api.articleDetail}` + `?id=${this.articleDetailId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.fromDate = res.data.data
              this.getCommentsList()
            }
          })
          .catch(() => {
          })
      }
    },
    // 获取历史数据
    checkRow (row, index) {
      let local = this.$router.resolve({ name: 'ManuscriptDetail', query: { id: row.id, page: '2' } })
      window.open(local.href, '_blank')
    },
    // 跳转编辑稿件
    showEditor () {
      // WEIXIN_MATERIAL 微信平台
      // weibo 微博文章
      // weixin 微信
      // WEIXIN_XIUMI 秀米
      // weiboText 微博
      // platform 融媒体平台
      if (this.fromDate.publishChannel === 'WEIXIN_XIUMI') {
        this.$http.get(this.$api.xiumi, { params: { id: this.articleDetailId } })
          .then(res => {
            if (res.data.code === 200) {
              window.open(res.data.data.authorizeUrl, '_black')
            }
          })
          .catch(() => {
          })
      } else {
        this.$router.push({ name: 'Contribute', query: { id: this.fromDate.id, isArchive: '4', status: this.status, page: this.page } })
      }
    },
    // 查看稿件痕迹数据
    showMark () {
      this.params.articleId = this.articleDetailId
      this.$http.post(this.$api.history, this.params)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.markVisible = true
            this.markData = res.data.data.content
          }
        })
        .catch(() => {
        })
    },
    // 校对完成弹框
    overToVerify () {
      this.$http.get(this.$api.listPublishUser)
        .then(res => {
          if (res.data.code === 200) {
            this.submitVisible = true
            this.publicData = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 确定提交到发布
    submitPublic () {
      if (this.getPublic) {
        // this.contDetail.checkUserIds = this.getRadio
        this.$http.get(this.$api.submitToPublish, { params: { id: this.articleDetailId, userId: this.getPublic } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.$router.push({ name: 'RoughList' })
              this.getPublic = ''
              this.submitVisible = false
            }
          })
          .catch(() => { })
      } else {
        this.$message.warning('请选择提交用户')
      }
    },
    // 取消提交
    overPublic () {
      this.getPublic = ''
      this.submitVisible = false
    },
    // 查询批注
    getCommentsList () {
      this.$http.post(this.$api.getcomments, { postilArticleId: this.articleDetailId })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.commentList = res.data.data
            this.comment.postilOrder = this.commentList.length
            let replyBtn = document.getElementsByClassName('list_reply')
            for (let i = 0; i < replyBtn.length; i++) {
              replyBtn[i].style.display = 'block'
            }
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.userId = this.$store.state.user.userInfo.id
    this.articleDetailId = this.$route.query.id
    this.comment.postilArticleId = this.$route.query.id
    this.status = this.$route.query.status
    this.page = this.$route.query.page
    this.articleDetail()
    if (this.status === '0') {
      this.getSortList()
    }
  },
  mounted () {
    this.cancelComment()
  },
  watch: {
    commentList: function () {
      this.$nextTick(function () {
        if (this.commentList && this.commentList.length !== 0 && this.commentDialogVisible === false) {
          this.showCommentsCircle()
        }
      })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  }
  // destroyed () { // 去除头部meta
  //   var metas = document.getElementsByTagName('meta')
  //   var haeds = document.getElementsByTagName('head')[0]
  //   var length = metas.length
  //   for (var i = 0; i < length; i++) {
  //     if (metas[i] && metas[i].getAttribute('name') === 'referrer') {
  //       haeds.removeChild(metas[i])
  //     }
  //   }
  // }
}
</script>
<style lang="scss">
@import '../message';
.active_box,
.create_box {
  position: absolute;
  width: 390px;
}
.circle_div,
.create_circle_div {
  color: #fff;
  text-align: center;
  line-height: 30px;
  border: 2px solid #fff;
  width: 30px;
  height: 30px;
  border-radius: 18px;
  box-shadow: 3px 3px 10px #909090;
  float: left;
}
.create_circle_div {
  // background: linear-gradient(180deg, #ff8181 0%, #ef1010 100%);
  background: rgba(255, 0, 0, 0.6);
}
.create_aside_comment {
  width: 300px;
  height: 180px;
  padding: 24px;
}
.comment_list {
  width: 348px;
  min-height: 210px;
  z-index: 999;
}
.create_aside_comment,
.comment_list {
  float: left;
  margin-left: 8px;
  margin-top: -25px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 3px 3px 10px #909090;
}
.comment_container {
  width: 100%;
  min-height: 130px;
}
.comment_container textarea,
.reply_main textarea {
  width: 100%;
  font-size: 15px;
  padding: 1%;
  outline: none;
}
.comment_container textarea {
  height: 123px;
}
.reply_main textarea {
  height: 90px;
}
.comment_btn {
  width: 100%;
  height: 35px;
  margin-top: 15px;
}
.comment_btn .el-button {
  float: right;
}
.checkbox_div {
  width: 100%;
  height: 50px;
  line-height: 50px;
  border-radius: inherit;
  color: rgb(73, 72, 72);
  background-color: rgb(241, 243, 243);
}
.checkbox_div .el-checkbox {
  margin-left: 10px;
}
.list_container {
  width: 100%;
}
.list_container .list_div {
  width: 94%;
  min-height: 100px;
  margin: 10px auto;
}
.replay-container {
  width: 94%;
  margin: 2px auto;
}
.list_container .list_div .list_head {
  width: 100%;
  height: 30px;
}
.list_div .list_head div:nth-of-type(1) {
  height: 100%;
  float: left;
}
.list_div .list_head div:nth-of-type(2) {
  float: left;
  font-size: 12px;
  line-height: 25px;
  margin-left: 10px;
  color: rgba(0, 0, 0, 0.87);
}
.list_div .list_head div:nth-of-type(3) {
  float: left;
  font-size: 12px;
  line-height: 25px;
  margin-left: 10px;
  color: #6e747d;
}
.list_div .list_head div:nth-of-type(4) {
  float: right;
  line-height: 25px;
  cursor: pointer;
  color: #6e747d;
}
.list_container .list_div .list_content {
  width: 97%;
  height: 60px;
  padding: 10px 5px;
  font-size: 14px;
  line-height: 20px;
  color: rgba(0, 0, 0, 0.87);
  overflow: scroll;
}
.list_reply {
  width: 94%;
  height: 20px;
  margin: 0 auto 10px;
  line-height: 20px;
  text-align: right;
  font-size: 14px;
  color: #6e747d;
  cursor: pointer;
}
</style>
<style scoped>
.mobile-preview {
  width: 365px;
  height: 630px;
  position: absolute;
  right: -50px;
  bottom: 0;
}
.preview-box {
  width: 315px;
  height: 630px;
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 50px;
  float: left;
}
.preview-container {
  width: 269px;
  height: 545px;
  margin: 43px 23px 10px 23px;
  overflow: scroll;
}
.preview-btn {
  width: 50px;
  height: 630px;
  float: left;
}
.close-preview {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  border-radius: 20px;
  background-color: #a7a5a5;
  margin-left: 10px;
  margin-top: 30px;
  cursor: pointer;
  color: #fff;
}
.manuscript-detail-box {
  width: 1160px;
  margin: 0 auto;
  background: #fff;
  position: relative;
}
.manuscript-detail {
  width: 1100px;
  padding: 33px 30px 65px;
}
.comments {
  position: relative;
  width: 1160px;
}
.manuscript-detail-box .title {
  font-size: 16px;
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
/* .manuscript-main div {
  line-height: 22px;
} */
.manuscript-btn {
  text-align: center;
  margin-top: 22px;
}
.left-fix {
  position: fixed;
  z-index: 9;
  top: 206px;
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
.preview {
  cursor: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAWCAYAAAArdgcFAAACUElEQVRIS7WVzWsTQRjGn5ndfJQkBTWJh1rBHpJWoijYgx4UPFT0II1UPeTmB1T0puaPiHpTLPhx68EPTPFgsYigBy8KSg39OkRo7cFsqmASTNPNjLzpTljbhCyJHRhmd5j9vc+8O+8zDFvYmI2tnmm0zzsNLwFQp1YbNwJ53+XZPubpDklhOg7AuC7l6m8j+2AgC0BYcKlU0qj3J8t3wD3XnErdtE6s3p1Lea8DMCmAgmvB04/CwYEL38HaSolKhszPPt6Vf3kxB6BKcE6qe8+/jvj2DH1tW7X1Yenb1L6lJycWSL2Cu3viL6KBaPwLrfG6gKEYwB1kXUhgKgOU19bphfn0geX0mXkAFfpcA+DuGX4aDfSf/UwLtvuA0eOA5gBelcDYW+BnyYLPPTu4PHGuObyT1BRawbu7gMThxmmZnAayRvPwLeF+DzAy2Bj+ZgZYXOkAvqVp+Z9wOufu0NFU744jN+l8dtRWPtyKGO+TS+ooEtwFoCtyozjOdd+pdunCLL1auO1PAPgDYE2Vv07q4d/p2x1/foxp/hCESUEhIZg3vH+U6969KqgwyzPl3PQYA193Qa4LWS0ai+mRdyj+oBNfURVatwBrB7QLKiyC14psW+xSMHzy3jjT3DFZrWRyk1cTvzIP8+QflgOSE9Iz1Sl1Mi5ht1yCUSew2pGacwUOXQmGBpPDxsfUROHTfQIThKB1i7UC1OdaXRb2XVHq6J1SQcpq6jZcEA0vi2b/0O73tCPVVDrst88mhgNr+sfflXIFUkobinMCb/dk4i/3gOM1rheS1AAAAABJRU5ErkJggg==),
    crosshair;
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  left: 0;
  z-index: 9;
}
.title-u {
  color: #60b4f4;
  cursor: pointer;
}
.list-img{
  display: flex;
  flex-wrap: wrap;
}
.list-img:after {
    content:"";
    display:block;
    width:258px;
 }
.img-box{
  width: 30%;
  height: 258px;
  margin-top: 20px;
  margin-left: 20px;
  border: 1px solid #f5f5f5;
}
.img-box img{
  width: 100%;
  height: 100%;
}
</style>
