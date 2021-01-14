<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'RoughList' }">稿件校对</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="search-box">
        <el-form size="small"
                 :model="ruleForm"
                 :inline="true"
                 label-position="left"
                 ref="froms">
          <el-form-item class="item-style"
                        label="稿件渠道:"
                        prop="publishChannel">
            <el-select v-model="ruleForm.publishChannel"
                       placeholder="全部">
              <el-option label="平台"
                         value="platform"></el-option>
              <el-option label="微信"
                         value="weixin"></el-option>
              <el-option label="微博文章"
                         value="weibo"></el-option>
              <el-option label="微博"
                     value="weiboText"></el-option>
          <!-- <el-option label="网站"
                     value="website"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item class="item-style"
                        label="流程状态:"
                        prop="checkStatus">
            <el-select v-model="ruleForm.checkStatus"
                       placeholder="全部">
              <!-- <el-option label="已撤回"
                         :value="-1"></el-option>
              <el-option label="待提交"
                         :value="0"></el-option> -->
              <!-- <el-option label="审核中"
                         :value="1"></el-option>
              <el-option label="审核通过"
                         :value="2"></el-option> -->
              <el-option label="校对中"
                         :value="4"></el-option>
              <el-option label="发布中"
                         :value="5"></el-option>
              <el-option label="已发布"
                         :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="public-btn">
            <div class=" btn-box-style image-search-box">
              <el-button size="small"
                         class="new"
                         type="primary"
                         @click="screen">筛选</el-button>
              <el-button size="small"
                         class="delete"
                         @click="resetForm('froms')">重置</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
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
            <!-- <span v-if="scope.row.publishChannel==='website'">
              网站
            </span> -->
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
              @click="openDetail(scope.row, scope.$index)">已发布</p>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="最后编辑时间"
                         width="185">
        </el-table-column>
        <!-- <el-table-column prop="address"
                         label="操作" width="230">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="edit-click">
                <i class="el-icon-edit-outline"></i><span @click="aritelEdit(scope.$index, scope.row)">继续</span>
              </div>
              <div class="delete-click">
                <i class="el-icon-delete"></i><span @click="deleteRow(scope.row, scope.$index)">删除</span>
              </div>
              <div class="change-click">
                <i class="el-icon-refresh"></i><span @click="changeRow(scope.row, scope.$index)">变更</span>
              </div>
              <div class="updata-click">
                <i class="el-icon-finished"></i><span @click="updataRow(scope.row, scope.$index)">完成</span>
              </div>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <!-- <no-permission v-else></no-permission> -->
    <el-dialog title="选择变更目标"
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
                   @click="changeClick">确定</el-button>
      </span>
    </el-dialog>
    <div class="detail-dialog status-list">
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
                 class="checkStatus color-red">已撤回</p>
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
                 class="checkStatus color-greed">已发布</p>
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
export default {
  name: 'List',
  data () {
    return {
      total: 0,
      details: false,
      detailList: [], // 审核记录数据
      rowData: {},
      dialogTitle: '',
      getRadio: '', // 选中数据
      changeVisible: false, // 变更/提交弹出框
      checkdData: [], // 变更/提交数据
      dialogVisible: false, // 弹出框
      deleteItem: {}, // 需要删除的数据
      data: '',
      tableData: [],
      dataLess: false,
      ruleForm: {
        publishChannel: '',
        checkStatus: '',
        pageNum: 1,
        pageSize: 20
      }
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
    // 关闭
    getCloseModal () {
      this.dialogVisible = false
    },
    // 确认删除
    getConfirmDelete (item) {
      this.$http.get(this.$api.deleteFinishFalse, { params: { id: item.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.tableData.splice(item.index, 1)
            this.$message.success(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    routerWeb (row, index) {
      if ((row.materialCount > 1 || !row.materialCount) && row.materialCount !== 0) {
        let local = this.$router.resolve({ name: 'ManuscriptDetail', query: { id: row.id, status: row.checkStatus, page: '1' } })
        window.open(local.href, '_blank')
        this.$refs.child.handleCurrentChange(1)
      } else {
        window.open(row.materialUrl, '_blank')
        this.$refs.child.handleCurrentChange(1)
      }
    },
    // routerWeb (row, index) {
    //   let local = this.$router.resolve({ name: 'ManuscriptDetail', query: { id: row.id, status: row.checkStatus, page: '1' } })
    //   window.open(local.href, '_blank')
    // },
    // 删除当前行数据
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 获取校对列表
    getlistDraft () {
      this.$http.post(this.$api.listInsideVerify, this.ruleForm)
        .then(res => {
          this.tableData = res.data.data.content
          this.total = res.data.data.totalElements
        })
        .catch(() => {
        })
    },
    // 变更数据
    changeRow (row, index) {
      this.rowData = row
      this.rowData.index = index
      this.$http.get(this.$api.listByDepartment)
        .then(res => {
          if (res.data.code === 200) {
            this.changeVisible = true
            this.checkdData = res.data.data
          }
        })
        .catch(() => { })
    },
    // 确认变更
    changeClick () {
      this.$http.get(this.$api.ownerChange, { params: { id: this.rowData.id, userId: this.getRadio } })
        .then(res => {
          if (res.data.code === 200) {
            this.tableData.splice(this.rowData.index, 1)
            this.$message.success('操作成功')
            this.getRadio = ''
            this.changeVisible = false
          }
        })
        .catch(() => { })
    },
    // 取消变更/提交
    overClick () {
      this.checkdData = []
      this.getRadio = ''
      this.changeVisible = false
    },
    // 完成
    updataRow (row, index) {
      this.$http.get(this.$api.finishFalseToTrue, { params: { id: row.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.$router.push({ name: 'MyMessageList' })
          }
        })
        .catch(() => {
        })
    },
    aritelEdit (index, row) {
      this.$router.push({ name: 'Contribute', query: { id: row.id, isArchive: '3' } })
    },
    // 筛选
    screen () {
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.tableData = []
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
    },
    getPagingChange (change) {
      this.ruleForm.pageNum = change.page
      this.ruleForm.pageSize = change.size
      this.getlistDraft()
    }
  },
  created () {
    this.getlistDraft()
  },
  components: {
    vDiaing,
    pagination
  }
}
</script>
<style lang="scss" scoped>
@import '../message';
</style>
<style scoped>

.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f10909;
}
.delete-row {
  position: relative;
}
.delete-row-a {
  text-decoration: underline;
  line-height: 1;
  color: #70ade4;
  font-size: 14px;
}
.delete-row:last-child .delete-row-a {
  color: #f56c6c;
}
.delete-row:last-child {
  margin-top: 5px;
}
.icon-edit-color {
  color: #70ade4;
}
.icon-delete-color {
  color: #f56c6c;
}
.search-box {
  padding: 9px 15px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form-item {
  margin-bottom: 0;
}
.message-list {
  /* min-height: 600px; */
  background-color: #f5f5f5;
  border: none;
}
.message-list::before {
  content: none;
}
.title-u {
  color: #60b4f4;
  cursor: pointer;
  text-decoration: underline;
}
.disflex i {
  margin-right: 5px;
}
.user-list {
  max-height: 370px;
  overflow: scroll;
}
.search-box {
  padding: 9px 15px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form {
  display: flex;
}
.search-box .el-form .el-form-item {
  margin-right: 20px;
  display: flex;
  margin-bottom: 0px;
}
.search-box .public-btn {
  margin-left: auto;
}
.message-list .checkStatus{
 text-decoration: underline;
 cursor: pointer;
}

</style>
