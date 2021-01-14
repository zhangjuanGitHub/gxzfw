<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'AuditList' }">审核稿件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-if="$isPermission(306)">
      <search @ruleForm="getExamine"></search>
      <el-table border
                :data="tableData"
                style="width: 100%"
                class="message-list">
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
              <span v-if="scope.row.publishChannel==='WEIXIN_MATERIAL'">
                微信素材
              </span>
              <span v-if="scope.row.publishChannel==='WEIXIN_XIUMI'">
                秀米
              </span>
              <span v-if="scope.row.publishChannel==='toutiao'">
                头条图文
              </span>
            </template>
        </el-table-column>
        <el-table-column prop="isBase"
                         label="稿件类型"
                         width="100">
          <template slot-scope='scope'>
            <span v-if="scope.row.isBase">
              原始稿件
            </span>
            <span v-else>
              复制稿件
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
        <el-table-column prop="sectionName"
                         label="所属部门"
                         width="170">
        </el-table-column>
        <el-table-column prop="ownerUserName"
                         label="拟稿人"
                         width="110">
        </el-table-column>
        <el-table-column prop="checkStatus"
                         label="流程状态"
                         width="100"
                         class="click-status">
          <template slot-scope="scope">
            <p v-if="scope.row.checkStatus ===-1"
               class="checkStatus color-red"
               @click="openDetail(scope.row, scope.$index)">已撤回</p>
            <p v-if="scope.row.checkStatus ===0" class="color-cyan">待提交</p>
            <p v-if="scope.row.checkStatus ===1"
               class="checkStatus color-yellow"
               @click="openDetail(scope.row, scope.$index)">审核中</p>
            <p v-if="scope.row.checkStatus === 2"
               class="checkStatus color-red"
               @click="openDetail(scope.row, scope.$index)">审核未通过</p>
            <p v-if="scope.row.checkStatus === 3"
               class="checkStatus color-greed"
               @click="openDetail(scope.row, scope.$index)">审核通过</p>
            <p v-if="scope.row.checkStatus === 4"
               class="checkStatus color-yellow"
               @click="openDetail(scope.row, scope.$index)">校对中</p>
            <p v-if="scope.row.checkStatus === 5"
               class="checkStatus color-yellow"
               @click="openDetail(scope.row, scope.$index)">发布中</p>
            <p v-if="scope.row.checkStatus === 6"
               class="checkStatus color-greed"
               @click="openDetail(scope.row, scope.$index)">发布通过</p>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="最后编辑时间"
                         width="185">
        </el-table-column>
      </el-table>
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
          <el-button @click="overClick">取 消</el-button>
          <el-button type="primary"
                     @click="updataClick">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="提交发布"
                 :modal-append-to-body='false'
                 :visible.sync="publicVisible"
                 width="50%">
        <div class="user-list">
          <el-radio-group v-model="getRadio"
                          label-width="100px">
            <el-radio v-for="item in this.publicData"
                      :label="item.id"
                      :key="item.id">{{item.userName}}</el-radio>
          </el-radio-group>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="overClick">取 消</el-button>
          <el-button type="primary"
                     @click="publicClick">确定</el-button>
        </span>
      </el-dialog>
      <div class="detail-dialog">
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
                <p v-if="scope.row.checkStatus ===1"
                   class="checkStatus color-yellow">审核中</p>
                <p v-if="scope.row.checkStatus === 3"
                   class="checkStatus color-greed">审核通过</p>
                <p v-if="scope.row.checkStatus === 2"
                   class="checkStatus color-red">
                  <el-tooltip class="item"
                              effect="dark"
                              :content="scope.row.checkReason"
                              placement="top">
                    <sapn>审核未通过</sapn>
                  </el-tooltip>
                </p>
                <p v-if="scope.row.checkStatus === 4"
                   class="checkStatus color-yellow">校对中</p>
                <p v-if="scope.row.checkStatus === 41"
                   class="checkStatus color-greed">校对完成</p>
                <p v-if="scope.row.checkStatus === 5"
                   class="checkStatus color-yellow">发布中</p>
                <p v-if="scope.row.checkStatus === 6"
                   class="checkStatus color-greed">发布通过</p>
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
      <v-diaing :isDiaingShow="dialogVisible"
                :deleteItem="deleteItem"
                @confirmDelete="getConfirmDelete"
                @closeModal="getCloseModal"></v-diaing>
      <pagination @pagingChange="getPagingChange"
                    :total="total"
                    ref="child"></pagination>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>

<script>
import pagination from '@/components/Pagination.vue'
import vDiaing from '@/views/system/components/Diaing'
import Search from '@/views/message/components/MessageSearch'
export default {
  name: 'AuditList',
  data () {
    return {
      total: 0,
      details: false, // 审核记录弹框
      detailList: [], // 审核记录数据
      userApi: '',
      getRadio: '', // 选中数据
      publicVisible: false, // 发布弹出框
      publicData: [], // 发布数据
      changeVisible: false, // 变更/提交弹出框
      checkdData: [], // 变更/提交数据
      ruleForm: {
        pageNum: 1,
        pageSize: 20
      },
      dialogVisible: false, // 结束弹框
      deleteItem: '',
      dataLess: false,
      rules: {},
      tableData: []
    }
  },
  methods: {
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
    // 审核详情
    checkRow (row, index) {
      if ((row.materialCount > 1 || !row.materialCount) && row.materialCount !== 0) {
        this.$router.push({ name: 'AuditDetail', query: { id: row.id, status: row.checkStatus } })
      } else {
        window.open(row.materialUrl, '_blank')
      }
    },
    // 获取审核列表
    ExamineList () {
      this.$http.post(this.$api.listCheck, this.ruleForm)
        .then(res => {
          this.tableData = res.data.data.content
          this.total = res.data.data.totalElements
        })
        .catch(() => {
          this.tableData = []
        })
    },
    getExamine (ruleForm) {
      this.ruleForm.checkStatus = parseInt(ruleForm.checkStatus)
      this.ruleForm.publishChannel = ruleForm.publishChannel
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    // 结束审核
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteItem = row
      this.deleteItem.index = index
    },
    // 关闭
    getCloseModal () {
      this.dialogVisible = false
    },
    // 确认结束
    getConfirmDelete () {
      this.$http.get(this.$api.overCheck, { params: { id: this.deleteItem.id } })
        .then(res => {
          if (res.data.code === 200) {
            // this.tableData.splice(this.deleteItem.index, 1)
            this.$message.success('操作成功!')
            this.ruleForm.pageNum = 1
            this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
          }
        })
        .catch(() => {
        })
    },
    getPagingChange (change) {
      this.ruleForm.pageNum = change.page
      this.ruleForm.pageSize = change.size
      this.ExamineList()
    },
    // 发布数据
    submitRow (row, index) {
      this.rowData = row
      this.userApi = this.$api.listPublishUser
      this.publicVisible = true
      this.getUserData()
    },
    // 确认发布
    publicClick () {
      this.$http.get(this.$api.submitToPublish, { params: { id: this.rowData.id, userId: this.getRadio } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getRadio = ''
            this.publicVisible = false
            this.ruleForm.pageNum = 1
            this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
          }
        })
        .catch(() => { })
    },
    updataRow (row, index) {
      this.rowData = row
      this.userApi = this.$api.listCheckUser
      this.changeVisible = true
      this.getUserData()
    },
    // 确认提交
    updataClick () {
      this.$http.get(this.$api.submitToCheck, { params: { id: this.rowData.id, userId: this.getRadio } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getRadio = ''
            this.changeVisible = false
            this.ruleForm.pageNum = 1
            this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
          }
        })
        .catch(() => { })
    },
    // 获取数据
    getUserData () {
      this.checkdData = []
      this.$http.get(this.userApi)
        .then(res => {
          if (res.data.code === 200 && this.changeVisible) {
            this.checkdData = res.data.data
          } else if (this.publicVisible) {
            this.publicData = res.data.data
          }
        })
        .catch(() => { })
    },
    // 取消提交
    overClick () {
      this.checkdData = []
      this.publicData = []
      this.getRadio = ''
      this.changeVisible = false
      this.publicVisible = false
    }
  },
  // created () {
  //   this.getExamine()
  // },
  components: {
    Search,
    vDiaing,
    pagination
  }
}
</script>
<style lang="scss" scoped>
@import '../message';
</style>
<style scoped>
.checkStatus {
  color: #60b4f4;
  cursor: pointer;
  text-decoration: underline;
}
.search-box {
  padding: 9px 8px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form-item {
  margin-bottom: 0;
}
.defaultclass {
  color: #309ade;
}
.title-u {
  color: #60b4f4;
  cursor: pointer;
}
.message-list {
  /* min-height: 600px; */
  background-color: #f5f5f5;
}

.click-status .checkStatus {
  text-decoration: none;
  cursor: auto;
}
.disflex {
  justify-content: space-around;
}
.user-list {
  max-height: 370px;
  overflow: scroll;
}
.detail-dialog .checkStatus {
  cursor: auto;
  text-decoration: none;
}
.errorName{
  color: #f10909;
}
</style>
