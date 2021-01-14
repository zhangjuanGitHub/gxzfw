<template>
  <div class="table-side">
    <!-- 公共稿件 -->
    <el-table startDate
              border
              empty-text
              :data="tableData"
              class="message-list"
              @filter-change="checkTrueChangeInit"
              style="width: 100%">
      <el-table-column prop="departmentName"
                        label="单位名称"
                        width="160">
        <template slot-scope='scope'>
          <span>
            {{scope.row.departmentName}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="articleTitle"
                        label="标题"
                        show-overflow-tooltip>
        <template slot-scope='scope'>
          <span @click="routerWeb(scope.row, scope.$index)"
                class="title-u"
                :class="scope.row.articleStatus === 0? 'err':''">
            {{scope.row.articleTitle}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="ownerUserName"
                        label="所属用户"
                        width="120">
        <template slot-scope="scope">
          <el-popover placement="top"
                      title="用户信息"
                      :ref="`popover-${scope.$index}`"
                      width="200"
                      trigger="click">
            <div class="createUserinfo">
              <p class="phone"
                  v-if="phone">电话:{{phone}}</p>
              <p class="wechat"
                  v-if="wechat">微信号:{{wechat}}</p>
              <el-button size="mini"
                          type="primary"
                          class="sendInfo"
                          @click="showTeamDialog(scope.row, scope.$index)">发送站内信息</el-button>
            </div>
            <div @click="getUserContact(scope.row, scope.$index)"
                  class="ownerUserName"
                  slot="reference">{{scope.row.ownerUserName}}</div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column v-if="head==='关联稿件'"
                        prop="copyNum"
                        column-key="pubTrue"
                        :label="head"
                        width="130"
                        :filters="filTersOption"
                        :filter-method="filterTag"
                        :filter-multiple='false'>
        <template slot-scope="scope">
          <div @click="openCopy(scope.row, scope.$index)"
                :class="[ scope.row.copyNum === 0 ? '' : 'publish' ]">
            {{scope.row.copyNum}}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="head==='发布情况'"
                        prop="publishNum"
                        column-key="pubTrue"
                        :label="head"
                        width="130"
                        :filters="filTersOption"
                        :filter-method="filterTag"
                        :filter-multiple='false'>
        <template slot-scope="scope">
          <div @click="openPublish(scope.row, scope.$index)"
                :class="[ scope.row.publishNum === 0 ? '' : 'publish' ]">
            {{scope.row.publishNum}}
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="head==='外部投稿'"
                        prop="externalNum"
                        column-key="pubTrue"
                        :label="head"
                        width="130"
                        :filters="filTersOption"
                        :filter-method="filterTag"
                        :filter-multiple='false'>
        <template slot-scope="scope">
          <div @click="outPublish(scope.row, scope.$index)"
                :class="[ scope.row.externalNum === 0 ? '' : 'publish' ]">
            {{scope.row.externalNum}}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="likeNum"
                        label="点赞数"
                        width="90">
        <template slot-scope='scope'>
          <span>
            {{scope.row.likeNum}}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="readNum"
                        label="阅读数"
                        width="90">
        <template slot-scope='scope'>
          <span>
            {{scope.row.readNum}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="稿件评定"
                        width="100"
                        v-permission="308">
        <template slot-scope="scope">
          <el-popover placement="top"
                      width="160"
                      transition="fade-in"
                      trigger="click"
                      v-model="scope.row.showRatingPopover"
                      @hide="getHide(scope)">
            <div class="rating-box">
              <el-button class="Aclass"
                          size="mini"
                          @click="setRatingText(scope.row, scope.$index, 'A')">A</el-button>
              <el-button class="Bclass"
                          size="mini"
                          @click="setRatingText(scope.row, scope.$index, 'B')">B</el-button>
            </div>
            <el-button v-if="scope.row.gradeRank === 'A'"
                        class="rating-btn Aclass"
                        size="small"
                        slot="reference">A</el-button>
            <el-button v-else-if="scope.row.gradeRank === 'B'"
                        class="rating-btn Bclass"
                        size="small"
                        slot="reference">B</el-button>
            <el-button v-else
                        size="small"
                        class="rating-btn defaultclass"
                        slot="reference">未评级</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="updateTime"
                        label="报送时间"
                        width="175">
        <template slot-scope='scope'>
          <span>
            {{scope.row.updateTime}}
          </span>
        </template>
      </el-table-column>
      <el-table-column label="操作"
                        width="180">
        <template slot-scope="scope">
          <div class="disflex">
            <div class="edit-click">
              <i class="el-icon-s-operation"></i>
              <span @click="listRecord(scope.row, scope.$index)">流程</span>
            </div>
            <div class="change-click"
                  v-permission="310">
              <i class="el-icon-edit-outline"></i>
              <span @click="aritelEdit(scope.row, scope.$index)">复制</span>
            </div>
            <div class="delete-click"
                  v-permission="311">
              <i class="el-icon-refresh"></i>
              <span @click="recallBack(scope.row, scope.$index)">撤回</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="user-dialog">
      <el-dialog :visible.sync="infoDialog"
                 @close="getDialog()"
                 :modal="ismodal"
                 center
                 title="站内信息"
                 width="50%">
        <el-input type="textarea"
                  v-model="initiateContent"
                  :rows="7"></el-input>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="setDialogText()">提 交</el-button>
          <el-button @click="getDialog()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <div class="detail-dialog status-list">
      <el-dialog title="流程记录"
                 :visible.sync="details"
                 :modal-append-to-body='false'
                 width="35%">
        <el-table :data="detailList"
                  max-height="300px">
          <el-table-column property="checkUserName"
                           label="操作人"></el-table-column>
          <el-table-column property="checkStatus"
                           label="流程状态">
            <template slot-scope="scope">
              <p v-if="scope.row.checkStatus ===-1"
                 class="color-red">已撤回</p>
              <p v-if="scope.row.checkStatus ===1"
                 class="color-yellow">审核中</p>
              <p v-if="scope.row.checkStatus === 3"
                 class="color-greed">审核通过</p>
              <p v-if="scope.row.checkStatus === 2"
                 class="color-red">
                <el-tooltip class="item"
                            effect="dark"
                            :content="scope.row.checkReason"
                            placement="top">
                  <sapn>审核未通过</sapn>
                </el-tooltip>
              </p>
              <p v-if="scope.row.checkStatus === 4"
                 class="color-yellow">校对中</p>
              <p v-if="scope.row.checkStatus === 41"
                 class="color-greed">校对完成</p>
              <p v-if="scope.row.checkStatus === 5"
                 class="color-yellow">发布中</p>
              <p v-if="scope.row.checkStatus === 6"
                 class="color-greed">发布通过</p>
            </template>
          </el-table-column>
          <el-table-column property="checkTime"
                           label="操作时间">
            <template slot-scope="scope">
              <p v-if="!scope.row.checkTime">----</p>
              <p v-else>{{scope.row.checkTime}}</p>
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </div>
    <el-dialog title="选择复制目标渠道"
               :modal-append-to-body='false'
               :visible.sync="copyVisible"
               width="30%">
      <div>
        <el-radio-group v-model="copyData">
          <el-radio label="platform"
                    v-if="copyList.publishChannel!=='weiboText'">平台</el-radio>
          <el-radio label="weixin"
                    v-if="copyList.publishChannel!=='weiboText'">微信</el-radio>
          <el-radio label="weibo"
                    v-if="copyList.publishChannel!=='weiboText'">微博文章</el-radio>
          <el-radio label="weiboText"
                    v-else>微博</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="closeClick">取 消</el-button>
        <el-button type="primary"
                   @click="copyClick">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="稿件撤回"
               :modal-append-to-body='false'
               :visible.sync="recall"
               width="30%">
      <div>您确定要执行此操作吗?</div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="recallVlose">取 消</el-button>
        <el-button type="primary"
                   @click="toRecall">确定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="稿件流程"
               :modal-append-to-body="false"
               :visible.sync="record"
               class="easy-process"
               :before-close="closeEasyFlow"
               width="1200px">
      <div class="easy-wrap">
        <div class="easy-msg">
          <div class="easy-btn">
            <el-button type="primary" size="small" :disabled="showProcess" @click="changeLog">流程图</el-button>
            <el-button type="primary" size="small" :disabled="!showProcess" @click="changeProcess">日志</el-button>
          </div>
          <div class="easy-text">
            <p class="overHidden">流转到：<span>{{currentPeople}}</span></p>
            <p>状态：<span>{{currentStatus}}</span></p>
            <p class="easyWidth">总用时：<span>{{totalTime}}</span></p>
          </div>
        </div>
        <div class="easy-dialog" v-if="showProcess">
          <div class="easy-back">
            <div class="easy-part part-edit">
              <p>编辑稿件</p>
            </div>
            <div class="easy-part part-auit">
              <p>审核稿件</p>
            </div>
            <div class="easy-part part-check">
              <p>校对稿件</p>
            </div>
            <div class="easy-part part-release">
              <p>发布稿件</p>
            </div>
          </div>
          <div v-if="easyFlowVisible" id="efContainer" ref="efContainer" class="lc-container">
            <template v-for="node in easyData.nodeList">
              <flow-node
                      :id="node.id"
                      :key="node.id"
                      :node="node"
              >
              </flow-node>
            </template>
            <!-- 给画布一个默认的宽度和高度 -->
            <div style="position:absolute;top: 20px;left: 20px;">&nbsp;</div>
          </div>
        </div>
        <div class="easy-dialog" v-else>
          <el-timeline :reverse="true">
            <el-timeline-item v-for="(activity, index) in recordList"
                              :key="index"
                              :timestamp="activity.operateTime"
                              placement="top">
              <el-card>
                <h4 class="record-thing">
                  <span>事件:</span>
                  <span class="records"
                        v-html="activity.operateDescribe"></span>
                </h4>
                <p class="record-peo">
                  <span>人物:</span>
                  <span class="record-man records"
                        v-html="activity.operateUserName"></span>
                  <span>时间:</span>
                  <span class="records"
                        v-html="activity.operateTime"></span>
                </p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import ws from '@/libs/socket'
import { easyFlowMixin } from '@/libs/mixins'
import lodash from 'lodash'
import flowNode from './node'
export default {
  props: ['Forms'],
  name: 'MessageList',
  data () {
    return {
      currentStatus: '',
      currentPeople: '',
      totalTime: '',
      nowDate: '',
      easyTimer: '',
      showProcess: true,
      currentPro: {},
      jsPlumb: null, // jsPlumb 实例
      easyFlowVisible: false, // 控制画布销毁
      loadEasyFlowFinish: false, // 是否加载完毕标志位
      easyData: {}, // 数据
      total: 0,
      head: '关联稿件',
      filTersOption: [{ text: '关联稿件', value: '关联稿件' }, { text: '发布情况', value: '发布情况' }, { text: '外部投稿', value: '外部投稿' }],
      restaurants: [],
      state: '',
      recallData: {}, // 撤回数据
      recall: false,
      copyVisible: false,
      copyList: {},
      copyData: '',
      record: false, // 流程弹框
      recordList: [], // 流程数据
      details: false, // 审核记录弹框
      articleId: '', // 文章Id
      detailList: [], // 审核记录数据
      rowData: '', // 当前行数据
      checkdData: [], // 提交数据
      userApi: '',
      // getRadio: '', // 选中数据
      changeVisible: false, // 变更/提交弹出框
      listApi: '',
      initiateContent: '',
      createUserId: '',
      phone: '',
      wechat: '',
      chatId: '',
      dialogVisible: false,
      infoDialog: false,
      ismodal: false, // 遮罩
      loading: true,
      tableData: [],
      ruleForm: {
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
    filterTag (value, row) {
      return this.head === value
    },
    checkFalseChangeInit (filter) {
      this.head = filter.pubArea[0]
      this.getPublicList()
    },
    checkTrueChangeInit (filter) {
      this.head = filter.pubTrue[0]
      this.getPublicList()
    },
    closeEasyFlow () {
      this.record = false
      this.easyTimer && clearInterval(this.easyTimer)
      this.totalTime = ''
    },
    changeLog () {
      this.showProcess = true
      this.easyTimer && clearInterval(this.easyTimer)
      this.getProcess()
    },
    changeProcess () {
      this.showProcess = false
    },
    // 流程弹框
    listRecord (row, index) {
      this.record = true
      this.showProcess = true
      this.currentPro = row
      this.$nextTick(() => {
        this.getProcess()
        this.$http.get(this.$api.listRecordLog, { params: { id: row.id } })
          .then(res => {
            this.recordList = res.data.data
          })
          .catch(() => { })
      })
    },
    getProcess () {
      this.$http.get(this.$api.listRecord, { params: { id: this.currentPro.id } })
        .then(res => {
          this.dataReload(res.data.data)
          this.currentStatus = res.data.data.endTypeName
          this.currentPeople = res.data.data.endUserName
          if (res.data.data.issueStatus) {
            let all = res.data.data.endTime - res.data.data.startTime
            this.calcTotalTime(all)
          } else {
            let that = this
            this.easyTimer = setInterval(() => {
              that.nowDate = new Date().getTime()
              let all = that.nowDate - res.data.data.startTime
              this.calcTotalTime(all)
            }, 1000)
          }
        })
        .catch(() => { })
    },
    calcTotalTime (all) {
      let days = parseInt(all / (1000 * 60 * 60 * 24))
      let hours = parseInt((all % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      let minutes = parseInt((all % (1000 * 60 * 60)) / (1000 * 60))
      let seconds = ((all % (1000 * 60)) / 1000).toFixed(0)
      this.totalTime = days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒 '
    },
    // 撤回弹框
    recallBack (row, index) {
      this.recall = true
      this.recallData = row
      this.recallData.index = index
    },
    // 撤回稿件
    toRecall () {
      this.$http.get(this.$api.toRecall, { params: { id: this.recallData.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.recall = false
            this.$message.success('操作成功')
            this.tableData.splice(this.recallData.index, 1)
          }
        })
        .catch(() => { })
    },
    recallVlose () {
      this.recall = false
      this.recallData = {}
    },
    // 提交数据
    updataRow (row, index) {
      this.rowData = row
      this.changeVisible = true
    },
    // 确认投稿
    updataClick () {
      if (this.state) {
        this.$http.get(this.$api.sendEms, { params: { id: this.rowData.id, toEmail: this.state } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.state = ''
              this.changeVisible = false
              this.ruleForm.pageNum = 1
              this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
            }
          })
          .catch(() => {
            this.$message.error('操作失败')
          })
      } else {
        this.$message.warning('请输入邮箱地址')
      }
    },
    // 取消投稿
    overClick () {
      this.state = ''
      this.changeVisible = false
    },
    // 取消复制
    closeClick () {
      this.copyVisible = false
      this.copyData = ''
    },
    // 获取数据
    getUserData () {
      this.checkdData = []
      this.$http.get(this.userApi)
        .then(res => {
          if (res.data.code === 200) {
            this.changeVisible = true
            this.checkdData = res.data.data
          }
        })
        .catch(() => { })
    },
    routerWeb (row, index) {
      if ((row.materialCount > 1 || !row.materialCount) && row.materialCount !== 0) {
        let local = this.$router.resolve({ name: 'ManuscriptDetail', query: { id: row.id } })
        window.open(local.href, '_blank')
        this.$refs.child.handleCurrentChange(1)
      } else {
        window.open(row.materialUrl, '_blank')
        this.$refs.child.handleCurrentChange(1)
      }
    },
    // 评级失去焦点时隐藏确认
    getHide (scope) {
      scope.row.showRatingPopover = false
    },
    // 设置评级确认文字
    setRatingText (row, index, t) {
      row.showRatingPopover = false
      row.gradeRank = t
      this.$set(this.tableData, index, row)
      this.$http.get(this.$api.articleGrade, { params: { id: row.id, gradeRank: t } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('修改成功')
          }
        })
        .catch(() => {
        })
    },
    // 获取稿件列表
    getPublicList () {
      let api = this.$api.listPublic
      this.$http.post(api, this.ruleForm)
        .then(res => {
          this.tableData = res.data.data.content
          this.total = res.data.data.totalElements
          this.$emit('PublicArticle', res.data.data)
        })
        .catch(() => {
          this.tableData = []
        })
    },
    // 复制
    copyClick () {
      this.$http.get(this.$api.copyPublishChannel, { params: { id: this.copyList.id, publishChannel: this.copyData } })
        .then(res => {
          if (res.data.code === 200) {
            this.tableData = []
            this.ruleForm.pageNum = 1
            this.getPublicList()
            this.copyVisible = false
            this.$message.success('复制成功!请进入我的稿件查看')
          }
        })
        .catch(() => { })
    },
    // 复制弹框
    aritelEdit (row, index) {
      this.copyVisible = true
      this.copyList = row
    },
    // 设置采用
    provinceUse (row, index) {
      // provinceUse
      this.$http.get(this.$api.provinceUse, { params: { id: row.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('设置成功')
          }
        })
        .catch(() => {
          this.$message.warning('设置失败')
        })
    },
    // 跳转发布情况
    openCopy (row, index) {
      if (row.copyNum) {
        this.$router.push({ name: 'CopyDetail', query: { id: row.id } })
      } else {
        this.$message.warning('关联情况为0！')
      }
    },
    // 跳转发布情况
    openPublish (row, index) {
      if (row.publishNum) {
        this.$router.push({ name: 'PublishDetail', query: { id: row.id } })
      } else {
        this.$message.warning('发布情况为0！')
      }
    },
    // 跳转外部投稿信息
    outPublish (row, index) {
      if (row.externalNum) {
        this.$router.push({ name: 'OutPublishDetail', query: { id: row.id } })
      } else {
        this.$message.warning('外部投稿情况为0！')
      }
    },
    // 发送站内信息
    showTeamDialog (row, index) {
      this._self.$refs[`popover-${index}`].doClose()
      this.$router.push({ name: 'Station', query: { id: row.ownerUserId, name: row.ownerUserName, chatId: this.chatId } })
      // this.infoDialog = true
    },
    // 关闭弹框
    getDialog () {
      this.infoDialog = false
    },
    // 确认弹框
    setDialogText () {
      let ruleForm = {
        sendContent: this.initiateContent,
        slaveUserId: this.createUserId
      }
      this.$http.post(this.$api.saveMessageChat, ruleForm)
        .then(res => {
          if (res.data.code === 200) {
            this.infoDialog = false
            ws.sendMessage(JSON.stringify(ruleForm.sendContent))
            this.$message.success(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    // 获取投稿用户信息
    getUserContact (row, index) {
      this.$http.get(this.$api.getUserContact, { params: { id: row.createUserId } })
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.phone = res.data.data.phone
            this.wechat = res.data.data.wechat
            this.chatId = res.data.data.chatId
            this.createUserId = res.data.data.userId
          }
        })
        .catch(() => {
        })
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
    // 加载流程图
    dataReload (data) {
      this.easyFlowVisible = false
      this.easyData.nodeList = []
      this.easyData.lineList = []
      this.$nextTick(() => {
        data = lodash.cloneDeep(data)
        this.easyFlowVisible = true
        this.easyData = data
        this.$nextTick(() => {
          this.jsPlumb = this.$jsPlumb.getInstance()
          this.$nextTick(() => {
            this.jsPlumbInit()
          })
        })
      })
    },
    // 加载流程图
    loadEasyFlow () {
      // 初始化节点
      for (let i = 0; i < this.easyData.nodeList.length; i++) {
        let node = this.easyData.nodeList[i]
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, lodash.merge(this.jsplumbSourceOptions, {}))
        // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions)
      }
      // 初始化连线
      for (let i = 0; i < this.easyData.lineList.length; i++) {
        let line = this.easyData.lineList[i]
        var connParam = {
          source: line.from,
          target: line.to,
          label: line.label ? line.label : '',
          connector: line.connector ? line.connector : '',
          anchors: line.anchors ? line.anchors : undefined,
          paintStyle: line.paintStyle ? line.paintStyle : undefined
        }
        this.jsPlumb.connect(connParam, this.jsplumbConnectOptions)
      }
      this.$nextTick(function () {
        this.loadEasyFlowFinish = true
      })
    },
    jsPlumbInit () {
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting)
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true)
        // 初始化节点
        this.loadEasyFlow()
        this.jsPlumb.setContainer(this.$refs.efContainer)
      })
    }
  },
  created () {
    this.ruleForm = this.Forms
    // this.getPublicList()
  },
  // 一些基础配置移动该文件中
  mixins: [easyFlowMixin],
  components: {
    flowNode
  }
}
</script>
<style lang="scss">
@import '../message';
@import './easyflow';
</style>

<style lang="scss" scoped>
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
  color: #ffffff;
}
.Aclass {
  background: #f56c6c;
  color: #ffffff;
}
.Bclass {
  background: #67c23a;
  color: #ffffff;
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
  background-color: #f5f5f5;
  border: none;
}
.disflex {
  display: flex;
}
.phone,
.wechat {
  margin-bottom: 10px;
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
.ownerUserName {
  color: #2c8ae5;
  text-decoration: underline;
  cursor: pointer;
}
</style>
