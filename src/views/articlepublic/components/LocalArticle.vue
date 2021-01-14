<!--
 * @Author: MaiChao
 * @Date: 2020-11-11 09:58:00
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-09 14:47:02
-->
<template>
  <div class="local">
    <!-- 搜索框 -->
    <div class="search-box">
      <el-form size="small"
               :model="fromData"
               :inline="true"
               ref="froms"
               class="dis-flex">
        <el-form-item prop="checkStatus"
                      class="label-box text-center item-style"
                      label="流程状态:">
          <el-select class="region"
                     v-model="fromData.checkStatus"
                     placeholder="全部">
            <!-- <el-option label="待发布"
                       :value="5"></el-option> -->
            <el-option label="发布中"
                       :value="5"></el-option>
            <el-option label="发布通过"
                       :value="6"></el-option>
            <!-- <el-option label="发布未通过"
                       :value="-1"></el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item class="item-style"
                      label="报送时间:"
                      prop="times">
          <el-date-picker v-model="fromData.times"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="item-style"
                      label="标题关键字:"
                      prop="articleTitle">
          <el-input placeholder="请输入关键字"
                    v-model="fromData.articleTitle"></el-input>
        </el-form-item>
        <!-- <el-form-item class="item-style"
                      label="所属人:"
                      prop="ownerUserName">
          <el-input placeholder="请输入所属人"
                    v-model="fromData.ownerUserName"></el-input>
        </el-form-item> -->
        <el-form-item class="item-style last-button">
          <el-button size="small"
          type="primary"
                     @click="queryAll">筛选</el-button>
          <el-button size="small"
                     @click="resetForm('froms')">重置</el-button>
          <el-button size="small"
          type="primary"
                     v-if="this.$route.name == 'LocalArticleWx'"
                     @click="combination">组合</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table border
              max-height="615px"
              :data="tableData"
              style="width: 99.9%"
              class="message-list"
              @selection-change="handleSelect">
      <el-table-column type="selection"
                       width="55">
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
          <div @click="checkRow(scope.row, scope.$index)"><u class="text-click pointer"
               v-text="scope.row.articleTitle"></u></div>
        </template>
      </el-table-column>
      <el-table-column prop="ownerUserName"
                       label="所属人"
                       width="110">
      </el-table-column>
      <el-table-column prop="checkStatus"
                       label="流程状态"
                       width="100">
        <template slot-scope="scope">
          <p v-if="scope.row.checkStatus === 5"
             class="color-yellow">发布中</p>
          <p v-if="scope.row.checkStatus === 6"
             class="color-greed">发布通过</p>
          <!-- <p v-if="scope.row.checkStatus === -1"
             class="color-red">发布未通过</p> -->
        </template>
      </el-table-column>
      <el-table-column prop="updateTime"
                       label="报送时间"
                       width="185">
      </el-table-column>
      <el-table-column label="操作"
                       width="140">
        <template slot-scope="scope">
          <div class="dis-flex operation">
            <div class="change-click color-green pointer text-click"
                 v-if="fromData.type === 2">
              <span @click="againRow(scope.row, scope.$index)">发布</span>
            </div>
            <div class="change-click color-green pointer text-click">
              <span @click="outUpload(scope.row, scope.$index)">外部投稿</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="content_page">
      <pagination @pagingChange="getPagingChange"
                  :total="total"
                  ref="child"></pagination>
    </div>
    <!-- 微博选择账号弹框 -->
    <el-dialog title="选择保存账号"
               :visible.sync="saveVisible"
               :modal="false"
               width="35%"
               :before-close="saveClose">
      <div class="user-list">
        <el-radio-group v-model="publishId"
                        label-width="100px">
          <el-radio v-for="item in this.publicData"
                    :label="item.id"
                    :key="item.id">{{item.name}}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="saveUser">确定</el-button>
        <el-button @click="saveClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- 外部投稿 -->
    <el-dialog title="输入投稿地址"
               :modal-append-to-body='false'
               :visible.sync="changeVisible"
               width="30%">
      <div class="user-list email-box">
        <span class="user-title">邮箱地址:</span>
        <el-select v-model="state"
                   placeholder="请选择"
                   size="small">
          <el-option v-for="item in options"
                     :key="item.id"
                     :label="item.mailAddr"
                     :value="item.mailAddr">
          </el-option>
        </el-select>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="updataClick">确定</el-button>
        <el-button @click="overClick">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from '@/components/Pagination.vue'
export default {
  data () {
    return {
      state: '', // 外部投稿地址
      options: [], // 外部投稿数据
      changeVisible: false, // 外部投稿弹框
      publicData: [],
      publishId: '',
      cikArticleId: '',
      saveVisible: false,
      total: 0,

      ids: [],
      fromData: {
        type: 1,
        ownerUserName: '', // 所属人
        times: [], // 日期数组
        checkStatus: '', // 流程状态
        articleTitle: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      tableData: [
      ]
    }
  },
  methods: {
    // 分页
    getPagingChange (change) {
      this.fromData.pageNum = change.page
      this.fromData.pageSize = change.size
      this.getMyarticle()
    },
    // 筛选
    queryAll () {
      this.$refs.child.handleCurrentChange(1)
    },
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.fromData.pageNum = 1
      this.$refs.child.handleCurrentChange(1)
    },
    // 获取列表信息
    getMyarticle () {
      this.$http.post(this.$api.localPublicList, this.fromData)
        .then(res => {
          if (res.data.data) {
            this.tableData = res.data.data.content
            this.total = res.data.data.totalElements
          }
        })
        .catch(() => { })
    },
    // 选择要组合的稿件
    handleSelect (val) {
      if (val.length > 0) {
        let arr = []
        val.forEach(item => {
          arr.push(item.id)
        })
        this.ids = arr
      }
    },
    // 跳转组合页面
    combination () {
      if (this.ids.length > 0) {
        this.$router.push({ name: 'Compose', query: { id: this.ids.join(','), showLocal: true } })
      } else {
        this.$message.warning('请选择组合稿件')
      }
    },
    // 跳转稿件详情
    checkRow (row, index) {
      this.$router.push({ name: 'ManuscriptDetail', query: { id: row.id } })
    },
    // 获取发布账号信息
    againRow (row, index) {
      this.cikArticleId = row.id
      this.$http.get(this.$api.wbPublishInfo)
        .then(res => {
          if (res.data.data) {
            this.saveVisible = true
            this.publicData = res.data.data
          } else {
            this.$message.warning('暂无发布账号')
          }
        })
        .catch(() => { })
    },
    // 确定发布
    saveUser () {
      this.$http.get(this.$api.weiboPub, { params: { cikArticleId: this.cikArticleId, publishId: this.publishId } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.saveClose()
            this.getMyarticle()
          }
        })
        .catch(() => { })
    },
    // 取消发布
    saveClose () {
      this.publishId = ''
      this.saveVisible = false
    },
    // 外部投稿地址
    // 打开弹框获取绑定邮箱
    outUpload (item) {
      this.rowData = item
      this.$http.get(this.$api.emailMyList)
        .then(res => {
          if (res.data.code === 200) {
            this.options = res.data.data
            this.changeVisible = true
          }
        })
        .catch(() => {
        })
    },
    // 确认投稿
    updataClick () {
      if (this.state) {
        let params = {
          id: this.rowData.id,
          email: this.state
        }
        this.$http.post(this.$api.sendEms, params)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('操作成功')
              this.state = ''
              this.changeVisible = false
              this.getMyarticle()
            }
          })
          .catch(() => {
          })
      } else {
        this.$message.warning('请输入邮箱地址')
      }
    },
    // 取消投稿
    overClick () {
      this.state = ''
      this.rowData = {}
      this.changeVisible = false
    }
  },
  components: {
    pagination
  },
  created () {
    this.$route.name === 'LocalArticleWx' ? this.fromData.type = 1 : this.$route.name === 'LocalArticleWb' ? this.fromData.type = 2 : this.fromData.type = 3
    this.getMyarticle()
  }
}
</script>
<style>
/* @import '../articlepublic.css'; */
</style>
<style scoped>
/* .content_page {
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 0px;
  padding-bottom: 10px;
  z-index: 999;
} */
.change-click{
  margin-right: 10px;
}
.search-box {
  padding: 9px 8px;
  background: #e8ebf2;
  overflow: hidden;
  margin-bottom: 15px;
}
.search-box .el-form{
  flex-wrap: wrap;
}
.item-style {
  display: flex;
  margin-bottom: 0px;
}
.item-style .el-select {
  width: 160px;
}
.item-style .el-input {
  width: 160px;
}
.item-style .el-date-editor {
  width: 270px;
}
</style>
