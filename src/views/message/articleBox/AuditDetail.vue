<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'AuditList' }">审核稿件</el-breadcrumb-item>
        <el-breadcrumb-item >审核详情</el-breadcrumb-item>
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
                           :disabled="item.status || userInfo.userName !== articleCheck.ownerUserName">标为已读</el-checkbox>
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
      <div class="audit-detail-box"
            id="toComments"
            v-if="!commentDialogVisible">
        <p class="title" v-if="articleCheck.publishChannel!=='weiboText'">{{articleCheck.articleTitle}}</p>
        <div class="detail-box" v-if="articleCheck.publishChannel!=='weiboText'">
          <div class="detail-box-left">
            <span class="area">{{articleCheck.areaName}}</span>
            <span class="procuratorate">{{articleCheck.departmentName}}</span>
            <span class="time">{{articleCheck.createTime}}</span>
            <p class="contrubute-name">{{articleCheck.originalAuthor}}<span>投稿</span></p>
            <p class="audit">{{articleCheck.checkUserName}}<span v-if="articleCheck.checkUserName">审核</span></p>
          </div>
          <div class="detail-box-right">
            <span class="author">原作者:{{articleCheck.originalAuthor}}</span>
            <span class="photo">摄影:{{articleCheck.cameristName}}</span>
          </div>
        </div>
        <div class="audit-main">
          <div v-html="articleCheck.articleContent"></div>
          <div v-if="articleCheck.publishChannel==='weiboText'" class="list-img">
            <div v-for="(item,index) in articleCheck.files"
                :key="index" class="img-box">
              <img :src="item.filePath">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="left-fix">
      <div class="left-btn">
        <div class="tram-img-box" v-if="checkResult === '0' || checkResult === '-1'">
          <el-tooltip class="item"
                      effect="dark"
                      content="编辑稿件"
                      placement="right">
            <img v-popover:team
                @click="showEditor"
                :src="require('@/assets/images/Editor.png')"
                alt="编辑稿件">
          </el-tooltip>
        </div>
        <div class="tram-img-box">
          <el-tooltip class="item"
                      effect="dark"
                      content="历史记录"
                      placement="right">
            <img v-popover:team
                @click="showMark"
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
        <div class="tram-img-box" v-if="appUrl">
          <el-tooltip class="item"
                      effect="dark"
                      content="查看手机端批注"
                      placement="right">
            <img @click="getMobileComments"
                :src="require('@/assets/images/m_comment.png')"
                alt="查看手机端批注">
          </el-tooltip>
        </div>
      </div>
    </div>
    <!-- APP批注 -->
    <el-dialog :visible.sync="showAppComment"
               :modal-append-to-body='false'
               top
               width="20%">
      <div style="width: 100%; height: 100%; position: relative">
        <img style="width: 100%; height: 100%" ref="appImg" :src="appUrl" alt="" @load="imageLoad">
        <div class="comment-wrap" @click="cancelAppComment($event)" :style="{height: appHeight + 'px'}">
          <div class="comment-box"
                v-for="(item, index) of appComments" :key="index"
                :style="{top: item.postilTop + '%', left: item.postilLeft + '%'}">
            <div class="comment_icon" @click.stop="showOneReply(index)">{{item.postilOrder}}</div>
            <div class="app-postil-box" :style="{display: showReply}">
              <div class="app-content-box app-first">
                <div class="app-header">
                  <div class="app-avatar">
                    <img :src="item.headPicture" alt="">
                    <p class="overHidden">{{item.username}}</p>
                  </div>
                  <p class="header-time" v-html="item.createTime.slice(0, 10)"></p>
                </div>
                <p class="app-content">{{item.postilContent}}</p>
              </div>
              <div class="app-reply-box">
                <div class="app-content-box" v-for="(i, sindex) of item.cikPostilReply" :key="sindex">
                  <div class="app-header">
                    <div class="app-avatar">
                      <img :src="i.headPicture" alt="">
                      <p class="overHidden">{{i.username}}</p>
                    </div>
                    <p class="header-time" v-html="i.createTime.slice(0, 10)"></p>
                  </div>
                  <p class="app-content">{{i.replyContent}}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
    <div class="audit-btn" v-if="this.checkResult==='1'">
      <el-button icon="el-icon-check"
                 type="primary"
                 @click="showAuditPass">审核通过</el-button>
      <el-button icon="el-icon-finished"
                 type="primary"
                 @click="auditPass">继续提交审核</el-button>
      <el-button icon="el-icon-close"
                 type="info"
                 @click="showTeamDialog">审核未通过</el-button>
    </div>
    <!-- <no-permission v-else></no-permission> -->
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal="ismodal"
                 @close="getDialog"
                 center
                 width="30%">
        <el-form :model="formDate"
                 ref="formDate"
                 :rules="rules">
          <el-form-item prop="checkReason">
            <el-input type="textarea"
                      :rows="4"
                      placeholder="未通过的理由是..."
                      v-model="formDate.checkReason">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="setDialogText('formDate')">确 定</el-button>
          <el-button @click="getDialog">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="提交审核"
                 :modal-append-to-body='false'
                 :visible.sync="changeVisible"
                 width="50%">
      <div class="user-list">
        <el-radio-group v-model="getRadio"
                        label-width="100px">
          <el-radio v-for="item in this.checkdData"
                    :label="item.id"
                    :key="item.id">{{item.userName}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <!-- <el-button type="primary"
                   @click="directClick">审核通过</el-button> -->
        <el-button type="primary"
                    @click="updataClick" :disabled="!getRadio">提交审核</el-button>
        <el-button @click="overClick">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提交校对"
               :modal-append-to-body='false'
               :visible.sync="changeShow"
               width="50%">
      <div class="user-list">
        <el-radio-group v-model="getShow"
                        label-width="100px">
          <el-radio v-for="item in this.showData"
                    :label="item.id"
                    :key="item.id">{{item.userName}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="endClick">取 消</el-button>
        <el-button type="primary"
                   @click="showClick">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="历史记录"
               :modal-append-to-body='false'
               :visible.sync="markVisible"
               width="50%">
      <div class="mark-table">
          <el-table
          :data="markData"
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
          <el-table-column
            prop="updateUserName"
            label="编辑人"
            width="180">
          </el-table-column>

          <el-table-column
            prop="updateTime"
            label="编辑时间">
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog title="审核通过"
             :visible.sync="auditpass"
             :modal-append-to-body='false'
             @close="closeDialog"
             width="30%">
      <span>您确定要执行此操作吗?</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary"
                  @click="directClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import html2canvas from 'html2canvas'
export default {
  name: 'AuditDetail',
  data () {
    return {
      showReply: 'none',
      replyCotent: '',
      showAsideComment: 'none',
      commentList: [],
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
      commentIndex: '',
      auditpass: false, // 审核通过弹框
      params: {
        pageNum: 1,
        pageSize: 10
      }, // 获取历史记录参数
      markData: [], // 历史记录数据
      markVisible: false, // 历史记录弹框
      changeShow: false, // 提交校对弹框
      showData: [], // 校对列表
      getShow: '', // 选择校对人
      changeVisible: false,
      checkdData: [],
      getRadio: '', // 选中数据
      formDate: {
        articleId: '',
        checkStatus: '',
        checkReason: ''
      },
      checkResult: '',
      rules: {
        checkReason: [{ required: true, message: '请输入未通过的理由', trigger: 'blur' }]
      },
      dialogVisible: false,
      ismodal: false, // 遮罩
      articleCheck: {},
      sortList: [],
      showAppComment: false,
      appComments: [],
      appUrl: '',
      appHeight: ''
    }
  },
  methods: {
    // 查看某一个手机端批注
    showOneReply (index) {
      let allReply = document.querySelectorAll('.app-postil-box')
      for (let i = 0; i < allReply.length; i++) {
        allReply[i].style.display = 'none'
      }
      allReply[index].style.display = 'block'
    },
    cancelAppComment (e) {
      e.stopPropagation()
      let allReply = document.querySelectorAll('.app-postil-box')
      for (let i = 0; i < allReply.length; i++) {
        allReply[i].style.display = 'none'
      }
    },
    // 查看手机端批注
    getMobileComments () {
      this.showAppComment = !this.showAppComment
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
    showAuditPass () {
      this.auditpass = true
    },
    closeDialog () {
      this.auditpass = false
    },
    // 获取历史数据
    checkRow (row, index) {
      let local = this.$router.resolve({ name: 'AuditDetail', query: { id: row.id, page: '2' } })
      window.open(local.href, '_blank')
    },
    // 获取稿件详情
    getDetail () {
      if (this.page === '2') {
        this.$http.get(`${this.$api.getHistory}` + `?historyId=${this.formDate.articleId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.articleCheck = res.data.data
              this.getCommentsList()
            }
          })
          .catch(() => {
          })
      } else {
        this.$http.get(`${this.$api.articleDetail}` + `?id=${this.formDate.articleId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              this.articleCheck = res.data.data
              this.getCommentsList()
            }
          })
          .catch(() => {
          })
      }
    },
    getSortList () {
      this.$http.get(this.$api.getOrgList)
        .then(res => {
          let datas = res.data.data
          datas.map((val) => {
            this.sortList.push({ 'id': val.user_id, 'userName': val.user_name })
          })
        })
        .catch(() => { })
    },
    auditPass () {
      if (!this.sortList) {
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
        this.checkdData = this.sortList
      }
    },
    auditShow () {
      this.$http.get(this.$api.listVerifyUser).then(res => {
        if (res.data.code === 200) {
          this.changeShow = true
          this.showData = res.data.data
        }
      })
    },
    // 直接提交审核
    directClick () {
      this.$http.get(this.$api.overCheck, { params: { id: this.formDate.articleId } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功!')
            this.getRadio = ''
            this.changeVisible = false
            this.auditpass = false
            this.checkResult = '3'
            this.$router.push({ name: 'AuditList', query: { checkResult: '3' } })
          }
        })
        .catch(() => {
        })
      // this.formDate.checkStatus = 2
      // this.$http.post(this.$api.toCheck, this.formDate)
      //   .then(res => {
      //     if (res.data.code === 200 && res.data) {
      //       this.$message.success('操作成功！')
      //       this.$router.push({ name: 'AuditList', query: { checkResult: this.checkResult } })
      //     }
      //   })
      //   .catch(() => {
      //   })
    },
    // 确认提交
    updataClick () {
      this.$http.get(this.$api.submitToCheck, { params: { id: this.formDate.articleId, userId: this.getRadio } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getRadio = ''
            this.changeVisible = false
          }
        })
        .catch(() => { })
    },
    showClick () {
      if (this.getShow) {
        this.$http.get(this.$api.submitToVerify, { params: { id: this.formDate.articleId, userId: this.getShow } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.getShow = ''
              this.changeShow = false
              this.$router.push({ name: 'AuditList' })
            }
          })
          .catch(() => { })
      } else {
        this.$message.warning('请选择校对人')
      }
    },
    // 取消提交
    endClick () {
      this.showData = []
      this.getShow = ''
      this.changeShow = false
    },
    // 取消提交
    overClick () {
      this.checkdData = []
      this.getRadio = ''
      this.changeVisible = false
    },
    // 关闭弹窗
    getDialog () {
      this.dialogVisible = false
    },
    // 确认
    setDialogText () {
      this.$refs['formDate'].validate((valid) => {
        if (valid) {
          this.dialogVisible = false
          this.formDate.checkStatus = 2
          this.$http.post(this.$api.toCheck, this.formDate)
            .then(res => {
              if (res.data.code === 200 && res.data) {
                this.$message.success('操作成功！')
                this.$router.push({ name: 'AuditList', query: { checkResult: '2' } })
              }
            })
            .catch(() => {
            })
        }
      })
    },
    // 打开审核未通过
    showTeamDialog () {
      this.dialogVisible = true
    },
    // 跳转编辑稿件
    showEditor () {
      this.$router.push({ name: 'Contribute', query: { id: this.formDate.articleId, isArchive: '1', status: this.checkResult } })
    },
    // 查看稿件痕迹
    showMark () {
      this.params.articleId = this.formDate.articleId
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
    // 查询批注
    getCommentsList () {
      this.$http.post(this.$api.getcomments, { postilArticleId: this.formDate.articleId })
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
    },
    getAppList () {
      this.$http.get(`${this.$api.getAppComment}` + `?id=${this.formDate.articleId}`)
        .then(res => {
          this.appComments = res.data.data.cikPostils
          this.appUrl = res.data.data.url
        })
    },
    imageLoad () {
      this.appHeight = this.$refs.appImg.offsetHeight
    }
  },
  created () {
    this.formDate.articleId = this.$route.query.id
    this.comment.postilArticleId = this.$route.query.id
    this.page = this.$route.query.page
    if (this.$route.query.status) {
      this.checkResult = this.$route.query.status.toString()
    }
    this.getDetail()
    this.getSortList()
    this.getAppList()
  },
  mounted () {
    this.cancelComment()
    // this.cancelAppComment()
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  watch: {
    commentList: function () {
      this.$nextTick(function () {
        if (this.commentList && this.commentList.length !== 0 && this.commentDialogVisible === false) {
          this.showCommentsCircle()
        }
      })
    }
  }
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
  // min-height: 60px;
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
.manuscript-detail-box {
  width: 1160px;
  margin: 0 auto;
  background: #fff;
  position: relative;
}
.manuscript-detail-box .title {
  font-size: 16px;
}
.audit-detail-box {
  width: 1100px;
  padding: 33px 30px 65px;
}
.comments {
  position: relative;
  width: 1160px;
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
.audit-main {
  padding: 65px 120px;
  line-height: 22px;
  overflow: hidden;
}
.audit-btn {
  text-align: center;
  margin-top: 22px;
}
.audit-btn button {
  font-size: 20px;
  color: #ffffff;
  font-weight: 500;
}
.left-fix {
  position: fixed;
  z-index: 9;
  top: 206px;
  display: flex;
}
.comment-wrap, .app-content-box, .app-header, .app-content {
  width: 100%;
}
.comment-wrap {
  position: absolute;
  left: 0;
  top: 0;
}
.comment-box {
  width: 260px;
  /* height: 100px; */
  position: absolute;
  display: flex;
  justify-content: space-between;
}
.comment_icon {
  /* position: absolute; */
  color: #fff;
  text-align: center;
  line-height: 30px;
  font-size: 16px;
  border: 1px solid #fff;
  width: 30px;
  height: 30px;
  border-radius: 17px;
  box-shadow: 3px 3px 10px #909090;
  background: rgba(255, 0, 0, 0.6);
}
.app-postil-box {
  width: 225px;
  height: 100%;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 3px 3px 10px #909090;
}
.app-content-box {
  min-height: 75px;
  border-radius: 4px;
}
.app-first {
  background:#FFFFF0;
}
.app-reply-box {
  height: 100%;
}
.app-header {
  height: 45px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.app-avatar {
  width: 145px;
  display: flex;
  align-items: center;
}
.app-avatar img {
  width: 30px;
  height: 30px;
  border-radius: 14px;
  margin: 0 5px;
}
.header-time {
  margin-right: 2px;
}
.app-content {
  min-height: 30px;
  font-size: 14px;
  line-height: 20px;
  text-indent: 10px;
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
}
.tram-img-box {
  background: #2b9bf0;
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
  display: flex;
  height: 30px;
  align-items: center;
  margin-bottom: 10px;
}
.checkbox-detail-box {
  display: flex;
  align-items: center;
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
.title-u{
  color: #2b9bf0;
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
