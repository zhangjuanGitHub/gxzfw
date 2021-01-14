<template>
  <div class="container my-message">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MyMessageList' }"> 我的稿件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <search @ruleForm="getMyarticle"></search>
      <el-table border
                :data="tableData"
                style="width: 100%;"
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
                         label="标题"
                         show-overflow-tooltip>
          <template slot-scope='scope'>
            <span @click="routerWeb(scope.row, scope.$index)"
                  class="title-u">
              {{scope.row.articleTitle}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="createUserName"
                         label="创建人"
                         width="110">
        </el-table-column>
        <el-table-column prop="checkStatus"
                         label="流程状态"
                         width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.checkStatus ===-1"
               class="checkStatus color-red"
               @click="openDetail(scope.row, scope.$index)">被撤回</p>
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
        <el-table-column label="操作"
                         width="220">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="delete-click" v-if="scope.row.checkStatus===-1||scope.row.checkStatus===0">
                <i class="el-icon-delete"></i><span @click="deleteRow(scope.row, scope.$index)">删除</span>
              </div>
              <div class="change-click">
                <i class="el-icon-refresh"></i><span @click="changeRow(scope.row, scope.$index)">变更</span>
              </div>
              <div class="check-click" v-if="scope.row.checkStatus === 1">
                <i class="el-icon-refresh"></i><span @click="changeCheckRow(scope.row, scope.$index)">审核变更</span>
              </div>
              <div class="change-click color-greed pointer" v-if="(scope.row.materialCount&&scope.row.materialCount===1)&&(scope.row.checkStatus===-1||scope.row.checkStatus===0)">
                  <i class="el-icon-finished"></i><span @click="updataRow(scope.row, scope.$index)">提交审核</span>
                </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :title="dialogTitle"
                 :modal-append-to-body='false'
                 :visible.sync="changeVisible"
                 width="50%">
        <div class="user-list">
          <el-radio-group v-model="getRadio"
                          label-width="100px" class="dis-flex">
            <el-radio v-for="item in this.submitData"
                      :label="item.id"
                      :key="item.id">{{item.userName}}</el-radio>
          </el-radio-group>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="overChange">取 消</el-button>
          <el-button type="primary"
                     @click="changeClick"
                     v-if="dialogTitle==='选择变更目标'">确定</el-button>
          <el-button type="primary"
                     @click="updataClick"
                     v-else>确定</el-button>
        </span>
      </el-dialog>
    <el-dialog title="选择审核变更目标"
               :modal-append-to-body='false'
               :visible.sync="checkVisible"
               width="50%">
      <div class="user-list">
        <el-radio-group v-model="getCheckRadio"
                        label-width="100px">
          <div v-if="!this.checkedData.length">
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
            <el-radio v-for="item in this.checkedData"
                      :label="item.id"
                      :key="item.id">{{item.userName}}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="overCheck">取 消</el-button>
        <el-button type="primary"
                   @click="checkClick">确定</el-button>
      </span>
    </el-dialog>
    <div class="detail-dialog">
      <el-dialog title="流程记录"
                 :visible.sync="details"
                 :modal-append-to-body='false' width="35%">
        <el-table :data="detailList"
                  max-height="300px">
          <el-table-column property="checkUserName"
                           label="操作人"></el-table-column>
          <el-table-column property="checkStatus"
                           label="流程状态">
            <template slot-scope="scope">
              <p v-if="scope.row.checkStatus ===-1"
                 class="checkStatus color-red">被撤回</p>
              <p v-if="scope.row.checkStatus ===1"
                 class="checkStatus color-yellow">审核中</p>
              <p v-if="scope.row.checkStatus === 3"
                 class="checkStatus color-greed">审核通过</p>
              <p v-if="scope.row.checkStatus === 2"
                 class="checkStatus color-red">
                <el-tooltip class="item" effect="dark" :content="scope.row.checkReason" placement="top">
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
</template>

<script>
import pagination from '@/components/Pagination.vue'
import vDiaing from '@/views/system/components/Diaing'
import Search from '@/views/message/components/MessageSearch'
export default {
  name: 'List',
  data () {
    return {
      total: 0,
      details: false, // 审核记录弹框
      detailList: [], // 审核记录数据
      rowChangeData: '', // 当前行数据
      rowCheckData: '',
      dialogTitle: '',
      userApi: '',
      data: '',
      getRadio: '', // 选中数据
      getCheckRadio: '',
      changeVisible: false, // 变更/提交弹出框
      checkVisible: false,
      dialogVisible: false, // 删除弹出框
      checkedData: [], // 变更/提交数据
      submitData: [],
      deleteItem: {}, // 删除数据
      dataLess: false,
      ruleForm: {
        pageNum: 1,
        pageSize: 20
      },
      rules: {},
      tableData: [],
      sortList: [[], [], []]
    }
  },
  methods: {
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
    // 提交数据
    updataRow (row, index) {
      this.rowData = row
      this.dialogTitle = '选择提交目标'
      this.userApi = this.$api.listCheckUser
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
            this.tableData = []
            this.myArticle()
          }
        })
        .catch(() => { })
    },
    // 审核人数据
    changeCheckRow (row, index) {
      this.rowCheckData = row
      this.checkedData = []
      if (!this.sortList[0].length && !this.sortList[1].length && !this.sortList[2].length) {
        this.$http.get(this.$api.listCheckUser)
          .then(res => {
            this.checkVisible = true
            this.checkedData = res.data.data
          })
          .catch(() => { })
      } else {
        this.checkVisible = true
        // this.checkedData = this.sortList
      }
    },
    // 确认变更审核人
    checkClick () {
      this.$http.get(this.$api.changeCheck, { params: { id: this.rowCheckData.id, userId: this.getCheckRadio } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.getCheckRadio = ''
            this.checkVisible = false
            this.tableData = []
            this.ruleForm.pageNum = 1
            this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
            this.myArticle()
          }
        })
        .catch(() => { })
    },
    // 取消审核变更
    overCheck () {
      this.checkedData = []
      this.getCheckRadio = ''
      this.checkVisible = false
    },
    // 变更数据
    changeRow (row, index) {
      this.rowChangeData = row
      this.rowChangeData.index = index
      this.dialogTitle = '选择变更目标'
      this.submitData = []
      this.userApi = this.$api.listByDepartment
      this.getUserData()
    },
    // 获取数据
    getUserData () {
      this.submitData = []
      this.$http.get(this.userApi)
        .then(res => {
          if (res.data.code === 200) {
            this.changeVisible = true
            this.submitData = res.data.data
          }
        })
        .catch(() => { })
    },
    // 确认变更
    changeClick () {
      this.$http.get(this.$api.ownerChange, { params: { id: this.rowChangeData.id, userId: this.getRadio } })
        .then(res => {
          if (res.data.code === 200) {
            this.tableData.splice(this.rowChangeData.index, 1)
            this.$message.success('操作成功')
            this.getRadio = ''
            this.changeVisible = false
          }
        })
        .catch(() => { })
    },
    // 取消变更
    overChange () {
      this.submitData = []
      this.getRadio = ''
      this.changeVisible = false
    },
    // 删除当前行数据
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确认删除
    getConfirmDelete (item) {
      this.$http.get(this.$api.articleDelete, { params: { id: item.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.tableData.splice(item.index, 1)
            this.$message.success('操作成功!')
          }
        })
        .catch(() => {
        })
    },
    // 关闭
    getCloseModal () {
      this.dialogVisible = false
    },
    routerWeb (row, index) {
      if ((row.materialCount > 1 || !row.materialCount) && row.materialCount !== 0) {
        let local = this.$router.resolve({ name: 'ManuscriptDetail', query: { id: row.id, status: row.checkStatus } })
        window.open(local.href, '_blank')
        this.$refs.child.handleCurrentChange(1)
      } else {
        window.open(row.materialUrl, '_blank')
        this.$refs.child.handleCurrentChange(1)
      }
    },
    // 重新编辑
    aritelEdit (index, row) {
      this.$router.push({ name: 'Contribute', query: { id: row.id, isArchive: '4' } })
    },
    // 获取我的稿件
    getMyarticle (ruleForm) {
      this.ruleForm = ruleForm
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
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
    myArticle () {
      this.$http.post(this.$api.articleSelf, this.ruleForm)
        .then(res => {
          this.tableData = res.data.data.content
          this.total = res.data.data.totalElements
        })
        .catch(() => {
        })
    },
    getPagingChange (change) {
      this.ruleForm.pageNum = change.page
      this.ruleForm.pageSize = change.size
      this.myArticle()
    }
  },
  created () {
    this.getSortList()
  },
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
.search-box {
  padding: 9px 15px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form-item {
  margin-bottom: 0;
}
.title-u {
  color: #60b4f4;
  cursor: pointer;
  text-decoration: underline;
}
.message-list {
  background-color: #f5f5f5;
  border: none;
}
.disflex i {
  margin-right: 5px;
}
.checkStatus {
  color: #60b4f4;
  cursor: pointer;
  text-decoration: underline;
}
.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f10909;
}
.false-click {
  margin-left: 5px;
}
.user-list {
  max-height: 370px;
  overflow: scroll;
}
.detail-dialog .checkStatus {
  cursor: auto;
  text-decoration: none;
}
</style>
