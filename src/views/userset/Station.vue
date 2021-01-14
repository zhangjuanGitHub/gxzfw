<template>
  <div class="container station-box">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Station' }">在线沟通</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
      <el-row :gutter="10">
        <el-col :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu></v-menu>
        </el-col>
        <el-col :xs="21"
                :sm="21"
                :md="21"
                :lg="20"
                :xl="20">
          <div class="admin-right-box">
            <div class="admin-table">
              <div class="admin-search">
                <div class="public-btn">
                  <el-button class="delete"
                             size="medium"
                             type="danger"
                             @click="deleteRow">批量删除</el-button>
                  <!-- <el-button class="delete"
                             size="medium"
                             @click="backof">返回上一页面</el-button> -->
                </div>
              </div>
              <div class="admin-table-box">
                <el-table ref="multipleTable"
                          :data="tableData"
                          border
                          style="width: 100%"
                          @selection-change="handleSelectionChange">
                  <el-table-column type="selection"
                                   width="30">
                  </el-table-column>
                  <el-table-column label="用户名"
                                   prop="slaveUserName"
                                   width="130"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="slaveDepartmentName"
                                   label="用户单位名称"
                                   width="400">
                  </el-table-column>
                  <el-table-column label="消息状态"
                                   prop="isHasNew"
                                   width="140">
                    <template slot-scope="scope">
                      <p v-if="scope.row.isHasNew"
                         class="new-message">您有新消息</p>
                      <p v-else>暂无新消息</p>
                    </template>
                  </el-table-column>
                  <el-table-column prop="lastTime"
                                   label="最新时间"
                                   width="240"
                                   show-overflow-tooltip>
                  </el-table-column>
                  <el-table-column prop="操作"
                                   label="操作"
                                   width="150">
                    <template slot-scope="scope">
                      <div class="disflex">
                        <div class="edit-click">
                          <i class="el-icon-edit-outline"></i><span @click="reply(scope.row, scope.$index)">查看详情</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- <no-permission v-else></no-permission> -->
    <diaing :isDiaingShow="isDiaingShow"
            @closeModal="getCloseModal"
            @confirmDelete="getConfirmDelete"
            :deleteItem="deleteItem"></diaing>
    <div class="details-dialog">
      <transition name="el-zoom-in-center">
        <el-dialog v-show="messageDialog"
                   :title="detailsRow.slaveUserName"
                   :visible.sync="messageDialog"
                   :modal-append-to-body="false"
                   :close-on-click-modal="false"
                   @close="closeMessage"
                   width="40%">
          <div class="station-message"
               ref="get-scroll">
            <ul class="message-ul"
                v-if="messageList.length > 0">
              <p class="view-more"
                 v-if="chatMessageNum > 20"
                 @click="getMessageMore">查看更多</p>
              <li class="message-li"
                  v-for="(item, index) of messageList"
                  :key="index">
                <div class="chat-contain info-clear"
                     v-if="item.position === 'right'">
                  <div class="info-right">
                    <div class="massge-round">
                      <span class="time-right">{{item.sendTime}}</span>
                      <span class="pMassgae-right">{{item.sendContent}}</span>
                    </div>
                    <div>
                      <el-image :src="headPicture">
                        <div slot="error"
                             class="el-image__error">
                          暂无头像
                        </div>
                      </el-image>
                    </div>
                  </div>
                </div>
                <div class="chat-contain info-clear"
                     v-else-if="item.position === 'left' && (item.sendUserId === detailsRow.slaveUserId)">
                  <div class="info-left">
                    <div>
                      <el-image :src="item.headPicture">
                        <div slot="error"
                             class="el-image__error">
                          暂无头像
                        </div>
                      </el-image>
                    </div>
                    <div class="massge-round">
                      <span class="time-left">{{item.sendTime}}</span>
                      <span class="pMassgae-left">{{item.sendContent}}</span>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
            <div class="message-null"
                 v-else>
              <p>暂无消息</p>
            </div>
          </div>
          <div class="reply-box">
            <el-input type="textarea"
                      :rows="4"
                      resize="none"
                      v-model="replyMessage"
                      placeholder="请输入回复消息"></el-input>
          </div>
          <span slot="footer"
                class="dialog-footer">
            <el-button @click="closeMessage">关 闭</el-button>
            <el-button type="primary"
                       @click="saveMessageChat">回 复</el-button>
          </span>
        </el-dialog>
      </transition>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
import diaing from '@/components/Diaing'
import vMenu from '@/views/userset/components/NewsMenu'
import { mapState, mapGetters } from 'vuex'
import '@/libs/date_format.js'
import ws from '@/libs/socket'
export default {
  name: 'System',
  data () {
    return {
      messageDialog: false, // 消息弹框
      isDiaingShow: false, // 删除弹框
      detailsRow: {}, // 聊天详情行数据
      replyMessage: '', // 回复消息
      routeName: '',
      keyword: '',
      tableData: [],
      selection: [],
      messagePage: { // 外层列表分页
        pageNum: 1,
        pageSize: 32
      },
      detailsPage: { // 聊天弹框分页
        pageNum: 1,
        pageSize: 32,
        chatId: '', // 查看聊天记录id
        messageType: 'batch' // 单次发送消息or拉取历史消息
      },
      deleteItem: [],
      dataLess: false
    }
  },
  methods: {
    // 回复消息
    saveMessageChat () {
      if (this.replyMessage) {
        let params = {
          sendContent: this.replyMessage,
          slaveUserId: this.detailsRow.slaveUserId, // 消息接收方id
          messageType: 'single'
        }
        ws.sendMessage(JSON.stringify(params))
        this.scrollBottom()
        this.replyMessage = ''
      } else {
        this.$message.warning('请输入回复内容！')
      }
    },
    // 关闭聊天弹框
    closeMessage () {
      // 关闭时，改变消息状态
      this.tableData.forEach((item, index) => {
        if (item.id === this.detailsRow.id) {
          item.isHasNew = 0
          this.$set(this.tableData, index, item)
        }
      })
      this.messageDialog = false
      this.detailsPage.pageNum = 1 // 分页重置
      this.$store.commit('user/clearChatMessageList')
    },
    // 点击查看更多消息
    getMessageMore () {
      this.detailsPage.pageNum++
      this.getReplyList(this.detailsPage)
    },
    // 滚动加载外层列表
    getData () {
      this.messagePage.pageNum++
      this.getMessageList()
    },
    // 滚动到底部
    scrollBottom () {
      setTimeout(() => {
        let el = this.$refs['get-scroll']
        if (el.scrollHeight > el.scrollTop) {
          el.scrollTop = el.scrollHeight
        }
      }, 300)
    },
    // 点击查看聊天详情/回复
    reply (row, index, sTop) {
      row.isHasNew = 0 // 修改为已读
      this.$set(this.tableData, index, row)
      this.detailsRow = row
      this.detailsPage.chatId = row.id
      this.$store.commit('user/clearChatMessageList') // 每次点击先清空
      this.getReplyList(this.detailsRow)
      this.scrollBottom()
    },
    // 获取聊天列表
    getReplyList () {
      ws.sendMessage(JSON.stringify(this.detailsPage))
      this.messageDialog = true
    },
    // 返回上一页面
    // backof () {
    //   this.$router.go(-1)
    // },
    // 取消删除
    getCloseModal () {
      this.isDiaingShow = false
    },
    // 批量删除
    deleteRow () {
      if (this.selection.length >= 1) {
        this.deleteItem = this.selection
        this.isDiaingShow = true
      } else {
        this.$message.warning('请至少选择一条需要删除的数据！')
      }
    },
    // 确认删除
    getConfirmDelete (item) {
      let arr = []
      item.forEach(item => {
        arr.push(item.id)
      })
      this.$http.get(`${this.$api.deleteMessageChat}?ids=${arr.join(',')}`)
        .then(res => {
          item.forEach((sitem) => {
            this.tableData.forEach((val, index) => {
              if (sitem.id === val.id) {
                this.tableData.splice(index, 1)
              }
            })
          })
          this.$message.success('删除成功!')
          this.messagePage.pageNum = 1
          this.tableData = []
          this.getMessageList()
        })
        .catch(() => { })
    },
    // 批量删除
    handleSelectionChange (change) {
      this.selection = change
    },
    // 获取列表
    getMessageList () {
      this.$http.post(this.$api.listMessageCha, this.messagePage)
        .then(res => {
          let datas = res.data.data.content
          this.tableData.push(...datas)
          if (datas.length && datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    }
  },
  mounted () {
    this.routeName = this.$route.name
    if (this.$route.query.id && this.$route.query.name) {
      this.detailsRow.slaveUserId = this.$route.query.id
      this.detailsRow.slaveUserName = this.$route.query.name
      this.detailsPage.chatId = this.$route.query.chatId
      ws.sendMessage(JSON.stringify(this.detailsPage))
      this.messageDialog = true
    }
    this.getMessageList()
  },
  components: {
    vMenu,
    diaing
  },
  computed: {
    ...mapState({
      headPicture: state => state.user.userInfo.headPicture, // 用户头像
      userName: state => state.user.userInfo.userName, // 用户名
      chatMessageNum: state => state.user.chatMessageNum, // 聊天数量
      getScrollBottom: state => state.user.singleScrollBottom, // 单人消息触发最底部
      getMessageChat: state => state.user.messageChat // 跟谁聊天，对应外层列表
    }),
    ...mapGetters('user', {
      messageList: 'getChatMessageList'
    })
    // ...mapMutations()
  },
  watch: {
    // 控制单发聊天框处于最底部(接收新消息时)
    getScrollBottom (newVal, oldVal) {
      if (newVal && this.messageDialog) {
        this.scrollBottom()
      }
    },
    // 监听外层列表是否有新消息,有相同用户改变消息状态，没有则视为新消息，添加
    getMessageChat (newVal, oldVal) {
      let arr = []
      this.tableData.forEach((item, index) => {
        if (item.id === newVal.id) {
          item.isHasNew = 1
          this.$set(this.tableData, index, item)
        }
        arr.push(item.id)
      })
      if (!arr.includes(newVal.id)) {
        this.tableData.unshift(newVal)
      }
    }
  }
}
</script>
<style lang="scss">
@import "userset";
</style>
<style scoped>
.admin-right-box {
  display: flex;
}
.admin-table {
  flex: 1;
}
.admin-table-box {
  margin-top: 22px;
}
.role-p span {
  margin-left: 12px;
}
.info-right,
.info-left {
  max-width: 70%;
  padding-bottom: 20px;
  min-height: 60px;
  display: flex;
}
.info-right {
  float: right;
}
.info-left {
  float: left;
}
.info-clear:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
}
.message-li,
.reply-box {
  padding: 0 26px;
}
.message-ul {
  font-size: 16px;
  padding-top: 30px;
}
.reply-box {
  margin-top: 20px;
}
.station-message {
  background: #f7f7f7;
  height: 380px;
  overflow-x: hidden;
}
.massge-round {
  flex: 1;
}
.pMassgae-right:after {
  background: #ebebeb;
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  position: absolute;
  right: -3px;
  top: 7px;
  transform: rotate(-45deg) scaleY(1);
  z-index: 3;
}
.user-img {
  width: 38px;
  height: 38px;
  border: none;
  border-radius: 50%;
}
.pMassgae-right,
.pMassgae-left {
  display: inline-block;
  position: relative;
  top: 0;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 4px;
  line-height: 22px;
  font-weight: 400;
  word-break: break-all;
  white-space: pre-wrap;
  padding: 6px 10px;
  letter-spacing: 1px;
  font-size: 12px;
  text-align: justify;
  font-family: PingFangSC-Regular, Helvetica Neue, HelveticaNeue, Helvetica,
    Arial, sans-serif;
}
.pMassgae-right {
  right: 10px;
  color: #222;
  background: #ebebeb;
  float: right;
}
.pMassgae-left {
  background: #fff;
  left: 10px;
  color: #222;
  float: left;
}
.pMassgae-left:after {
  content: "";
  display: inline-block;
  width: 7px;
  height: 7px;
  position: absolute;
  left: -3px;
  top: 7px;
  transform: rotate(-45deg) scaleY(1);
  z-index: 3;
  background: #fff;
}
.time-left,
.time-right {
  font-family: PingFangSC-Regular, Helvetica Neue, HelveticaNeue, Helvetica,
    Arial, sans-serif;
  color: #999;
  letter-spacing: 0;
  line-height: 18px;
  font-size: 12px;
  padding-bottom: 3px;
  display: block;
}
.time-left {
  padding-left: 10px;
  font-weight: 400;
}
.time-right {
  text-align: right;
  padding-right: 10px;
}
.view-more {
  text-align: center;
  color: #f56c6c;
  cursor: pointer;
}
.new-message {
  color: #f56c6c;
}
.message-null {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.message-null p {
  font-size: 16px;
}
</style>
