<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Release' }">发布稿件</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-if="$isPermission(307)">
      <div class="search-box">
        <el-form size="small"
                 :model="fromData"
                 :inline="true"
                 label-position="left"
                 ref="froms">
          <el-form-item class="item-style"
                        label="稿件渠道:"
                        prop="publishChannel">
            <el-select v-model="fromData.publishChannel"
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
            <el-select v-model="fromData.checkStatus"
                       placeholder="全部">
              <!-- <el-option label="已撤回"
                         :value="-1"></el-option>
              <el-option label="待提交"
                         :value="0"></el-option> -->
              <!-- <el-option label="审核中"
                         :value="1"></el-option>
              <el-option label="审核通过"
                         :value="2"></el-option>
              <el-option label="审核未通过"
                         :value="3"></el-option> -->
              <el-option label="发布中"
                         :value="5"></el-option>
              <el-option label="发布通过"
                         :value="7"></el-option>
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
      <el-table :header-cell-style="getRowClass"
                :row-class-name="tableRowClassName"
                border
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
            <router-link :to="{name: 'ManuscriptDetail', query: {id: scope.row.id}}"
                         tag="a"
                         target="_blank"><u class="lin-clamp-1 title-u"
                 v-text="scope.row.articleTitle"></u></router-link>
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
               class="checkStatus"
               @click="openDetail(scope.row, scope.$index)">已撤回</p>
            <p v-if="scope.row.checkStatus ===0"
               class="color-cyan">待提交</p>
            <p v-if="scope.row.checkStatus ===1"
               class="checkStatus"
               @click="openDetail(scope.row, scope.$index)">审核中</p>
            <p v-if="scope.row.checkStatus === 2"
               class="checkStatus activeClass"
               @click="openDetail(scope.row, scope.$index)">审核通过</p>
            <p v-if="scope.row.checkStatus === 3"
               class="checkStatus errorClass"
               @click="openDetail(scope.row, scope.$index)">审核未通过</p>
            <p v-if="scope.row.checkStatus === 5"
               class="checkStatus activeClass"
               @click="openDetail(scope.row, scope.$index)">发布中</p>
            <p v-if="scope.row.checkStatus === 6"
               class="checkStatus activeClass"
               @click="openDetail(scope.row, scope.$index)">发布通过</p>
          </template>
        </el-table-column>
        <el-table-column prop="publishNum"
                         label="发布情况"
                         width="80">
          <template slot-scope="scope">
            <div @click="openPublish(scope.row, scope.$index)"
                 :class="[ scope.row.publishNum === 0 ? '' : 'publish' ]">
              {{scope.row.publishNum}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="最后编辑时间"
                         width="185">
        </el-table-column>
        <el-table-column prop="address"
                         label="操作"
                         width="180">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="edit-click" v-if="scope.row.publishChannel !=='platform'">
                <i class="el-icon-position"></i><span @click="aritelEdit(scope.$index, scope.row)">发布</span>
              </div>
              <div class="updata-click">
                <i class="el-icon-finished"></i>
                <span @click="updataRow(scope.row, scope.$index)">外部投稿</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <no-permission v-else></no-permission>
    <!-- <div
         class="text-center no-permission">
      <img :src="require('@/assets/images/error-page/noPermission.png')"
           alt="">
      <p>很抱歉，您没有访问此页面的权限</p>
    </div> -->
    <el-dialog title="输入投稿地址"
               :modal-append-to-body='false'
               :visible.sync="changeVisible"
               width="30%">
      <div class="demo-dynamic">
        <el-form :model="dateForm"
                 ref="dateForm"
                 label-width="100px">
          <el-form-item prop="email"
                        label="邮箱地址">
            <el-autocomplete v-model="dateForm.email"
              :fetch-suggestions="querySearch"
              placeholder="请输入邮箱地址"
              :trigger-on-focus="false"
              ></el-autocomplete>
          </el-form-item>
          <el-form-item v-for="(domain, index) in dateForm.toEmailList"
                        :label="'新增地址' + index"
                        :key="domain.key"
                        :prop="'toEmailList.' + index + '.value'" class="dynamic-list"
                        :rules="{
                        required: true, message: '地址不能为空', trigger: 'blur'
                      }">
            <el-autocomplete v-model="domain.value"
              :fetch-suggestions="querySearch"
              placeholder="请输入邮箱地址"
              :trigger-on-focus="false"
              ></el-autocomplete>
            <el-button @click.prevent="removeDomain(domain)">删除</el-button>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="success"
                     @click="addDomain">新增地址</el-button>
          <el-button type="primary"
                     @click="updataClick">确定</el-button>
          <el-button @click="overClick('dateForm')">取 消</el-button>
        </span>
      </div>
    </el-dialog>
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal-append-to-body='false'
                 @close="getDialog()"
                 center
                 width="50%">
        <div v-if="!disabled">
          <p class="modal-title">
            <span class="modal-span">一键发布：</span>
          </p>
          <div class="table-form">
            <div class="table-head table-box">
              <span>平台名称</span>
              <span>已授权账号</span>
            </div>
            <div class="table-weibo table-box"
                 v-if="weibo">
              <span>微博</span>
              <span>
                <el-checkbox-group v-model="weiboForm">
                  <el-checkbox v-for="name in weibo"
                               :label="name.id"
                               :key="name.nickName">{{name.nickName}}</el-checkbox>
                </el-checkbox-group>
              </span>
            </div>
            <div class="table-weixin table-box"
                 v-if="weixin">
              <span>微信</span>
              <span>
                <el-checkbox-group v-model="weixinForm">
                  <el-checkbox v-for="name in weixin"
                               :label="name.id"
                               :key="name.nickName">{{name.nickName}}</el-checkbox>
                </el-checkbox-group>
              </span>
            </div>
          </div>
          <div slot="footer"
               class="dialog-footer">
            <el-button type="primary"
                       @click="confirm()">发布</el-button>
            <!-- <el-button type="primary" @click="route()" v-else>
              添加授权账号
            </el-button> -->
            <el-button @click="getDialog()">取 消</el-button>
          </div>
        </div>
        <div v-else
             class="addBox">
          <img :src="require('@/assets/images/empty-data.png')">
          <p class="addPush"
             @click="route()">没有授权账号？去授权</p>
        </div>
      </el-dialog>
    </div>
    <el-dialog title="撤回操作"
               :visible.sync="getModal"
               :modal-append-to-body='false'
               @close="getClose"
               width="30%">
      <span>您确定要执行此操作吗?</span>
      <div slot="footer"
           class="dialog-footer">
        <el-button @click="getClose">取 消</el-button>
        <el-button type="primary"
                   @click="confirmDialogVisible">确 定</el-button>
      </div>
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
    <pagination @pagingChange="getPagingChange"
                :total="total"
                ref="child"></pagination>
  </div>
</template>

<script>
import pagination from '@/components/Pagination.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'AuditList',
  data () {
    return {
      total: 0,
      restaurants: [],
      dateForm: {
        email: '',
        toEmailList: [{
          value: ''
        }]
      },
      changeVisible: false, // 变更/提交弹出框
      details: false, // 审核记录弹框
      detailList: [], // 审核记录数据
      rowData: '', // 当前行数据
      weiboForm: [],
      weixinForm: [],
      disabled: true,
      weibo: [],
      weixin: [],
      dialogVisible: false, // 发布模态框
      getModal: false, // 撤回模态框
      dataLess: false,
      deleteItem: {}, // 撤回的数据
      tableData: [], // 表格数据
      screenData: [], // 下拉选择框数据
      areaList: [],
      departmentList: [],
      fromData: {
        publishChannel: '',
        checkStatus: '',
        pageNum: 1,
        pageSize: 20
      },
      showData: true,
      showID: ''
    }
  },
  methods: {
    // 删除新增
    removeDomain (item) {
      var index = this.dateForm.toEmailList.indexOf(item)
      this.dateForm.toEmailList[index].value = ''
      if (index !== -1) {
        this.dateForm.toEmailList.splice(index, 1)
      }
    },
    // 新增地址
    addDomain () {
      this.dateForm.toEmailList.push({
        value: '',
        key: Date.now()
      })
    },
    // 跳转发布情况
    openPublish (row, index) {
      if (row.publishNum) {
        this.$router.push({ name: 'PublishDetail', query: { id: row.id, changeSide: this.changeSide } })
      } else {
        this.$message.warning('发布情况为0！')
      }
    },
    querySearch (queryString, callback) {
      let restaurants = this.restaurants
      let results = JSON.parse(JSON.stringify(restaurants)) // 把数组的浅复制换成深复制
      for (let item in results) {
        results[item].value = queryString + '' + restaurants[item].value
      }
      callback(results)
    },
    loadAll () {
      return [
        { 'value': '@qq.com' },
        { 'value': '@126.com' },
        { 'value': '@163.com' },
        { 'value': '@0355.net' },
        { 'value': '@263.net' },
        { 'value': '@3721.net' },
        { 'value': '@yahoo.com' },
        { 'value': '@gmail.com' },
        { 'value': '@msn.com' },
        { 'value': '@hotmail.com' },
        { 'value': '@yeah.net' },
        { 'value': '@aol.com' },
        { 'value': '@ask.com' },
        { 'value': '@live.com' },
        { 'value': '@sohu.com' }
      ]
    },
    // 撤回
    withdraw (row, index) {
      this.getModal = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确定撤回
    confirmDialogVisible () {
      this.getModal = false
      this.$http.get(`${this.$api.deleteSelf}/${this.deleteItem.id}`)
        .then(res => {
          if (res.data.code === 200) {
            this.tableData.splice(this.deleteItem.index, 1)
            this.$message.success('操作成功！')
          }
        })
        .catch(() => {
        })
    },
    // 关闭模态框
    getClose () {
      this.getModal = false
    },
    // 表头
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:linear-gradient(0deg,rgba(243,242,242,1),rgba(255,255,255,1));'
      }
    },
    // tr各行换色
    tableRowClassName ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 1) {
        return 'tr-F8'
      }
    },
    // 筛选
    screen () {
      this.tableData = []
      this.fromData.pageNum = 1
      this.$refs.child.handleCurrentChange(this.fromData.pageNum)
    },
    // 获取发布列表
    getMyarticle () {
      this.$http.post(this.$api.listInsidePublish, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tableData = res.data.data.content
            this.total = res.data.data.totalElements
          } else {
            this.tableData = []
          }
        })
        .catch(() => {
        })
    },
    // 弹框
    getDialog (index, row) {
      this.dialogVisible = false
    },
    // 直接发布
    confirm () {
      var outPublish = {
        id: this.showID,
        oauthIds: this.weixinForm.toString() + this.weiboForm.toString()
      }
      this.dialogVisible = false
      this.$http.post(this.$api.outPublish, outPublish)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    // 后台发布
    // backConfirm () {
    //   this.dialogVisible = false
    // },
    // 弹出模态框
    aritelEdit (index, row) {
      this.weiboForm = []
      this.weixinForm = []
      this.$http.get(this.$api.horizer, { params: { publishChannel: row.publishChannel } })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.weibo = res.data.data.weibo
            this.weixin = res.data.data.weixin
            if (this.weibo && this.weibo.length > 0) {
              this.weibo.forEach(item => {
                this.weiboForm.push(item.id)
              })
            }
            if (this.weixin && this.weixin.length > 0) {
              this.weixin.forEach(item => {
                this.weixinForm.push(item.id)
              })
            }
            if (this.weiboForm.length > 0 || this.weixinForm.length > 0) {
              this.disabled = false
            } else {
              this.disabled = true
            }
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(() => {
        })
      this.dialogVisible = true
      this.showID = row.id
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.tableData = []
      this.fromData.pageNum = 1
      this.$refs.child.handleCurrentChange(this.fromData.pageNum)
    },
    // 获取地区列表
    getScreenlist () {
      this.$http.get(this.$api.listLevelChildIncludeSelf)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    getPagingChange (change) {
      this.fromData.pageNum = change.page
      this.fromData.pageSize = change.size
      this.getMyarticle()
    },
    // 跳转授权
    route () {
      this.$router.push({ name: 'ManageAddAccount' })
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
    // 提交数据
    updataRow (row, index) {
      this.rowData = row
      this.changeVisible = true
    },
    // 确认投稿
    updataClick () {
      this.dateForm.id = this.rowData.id
      console.log(this.dateForm)
      this.$http.post(this.$api.sendEms, this.dateForm)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.dateForm = ''
            this.changeVisible = false
            this.getList()
          }
        })
        .catch(() => {
        })
    },
    // 取消投稿
    overClick (formName) {
      this.$refs[formName].resetFields()
      this.changeVisible = false
    }
  },
  mounted () {
    this.restaurants = this.loadAll()
  },
  created () {
    this.getScreenlist()
    this.getMyarticle()
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    pagination
  }
}
</script>
<style lang="scss">
@import '../message';
</style>
<style scoped>
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
.search-box {
  padding: 9px 15px;
  background: #ffffff;
  margin-bottom: 20px;
}

.user-dialog .modal-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 15px;
}
.table-form {
  width: 100%;
  border: 1px solid #ccc;
  border-bottom: none;
}
.table-box {
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #ccc;
  display: flex;
}
.table-box span {
  padding: 20px 0;
  display: inline-block;
  width: 50%;
}
.table-box span:first-child {
  border-right: 1px solid #ccc;
}
.table-weixin span:last-child {
  text-align: left;
  padding-left: 10px;
  box-sizing: border-box;
}
.table-weibo span:last-child {
  text-align: left;
  padding-left: 10px;
  box-sizing: border-box;
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
.title-u {
  color: #60b4f4;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
}
.region-style .el-cascader {
  width: 200px;
}
.addBox img {
  display: block;
  margin: 0 auto;
}
.addPush {
  color: #60b4f4;
  text-align: center;
  text-decoration: underline;
  cursor: pointer;
  font-size: 20px;
  margin-top: 20px;
}
.detail-dialog .checkStatus {
  cursor: auto;
  text-decoration: none;
}
.dialog-footer {
  display: block;
  text-align: center;
  margin-top: 10px;
}
.publish {
  text-decoration: underline;
  color: #2c8ae5;
  cursor: pointer;
}
</style>
