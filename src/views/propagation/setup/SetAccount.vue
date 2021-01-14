<template>
  <div class="install">
    <div class="cloum-set">
      <template>
        <div class="account-set">
          <div class="set-title">
            <div class='button'
                 v-if="!batchDelete">
              <el-button size="small"
                         type="primary"
                         @click="addAccount">添加账号</el-button>
              <el-button @click="deleteAccount"
                         type="danger"
                         size="small">删除账号</el-button>
            </div>
            <div v-if="isDelete === true"
                 class="confirmdelete">
              <span class="delete-text">* 请勾选需要批量删除的账号</span>
              <el-button v-if="this.batchDelete"
                         type="danger"
                         size="small" :disabled="this.deleteCheckBoxList.length === 0"
                         @click="showDelete">确认删除</el-button>
              <el-button size="small"
                         @click="cancelDelete">取消删除</el-button>
            </div>
          </div>
          <div class="set-search">
            <div class="data-center-header">
              <el-form :inline="true"
                       ref="ruleForm"
                       :model="ruleForm"
                       class="demo-form-inline">
                <el-form-item label="账号类型:"
                              prop="type">
                  <el-select v-model="ruleForm.type"
                             size="small"
                             @change="searchList()"
                             placeholder="请选择账户类型">
                    <el-option label="微信"
                               value="1"></el-option>
                    <el-option label="微博"
                               value="2"></el-option>
                    <el-option label="网站"
                               value="3"></el-option>
                    <el-option label="头条"
                               value="4"></el-option>
                    <el-option label="抖音"
                               value="5"></el-option>
                    <el-option label="一点"
                               value="6"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字:"
                              prop="keyword">
                  <el-input v-model="ruleForm.keyword"
                            size="small"
                            placeholder="请输入名称关键字"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="searchList"
                             size="small"
                             type="primary">筛选</el-button>
                  <el-button @click="resetForm('ruleForm')"
                             size="small">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="account-list">
            <!-- 微博 -->
            <el-row :gutter="36"
                    v-if="this.ruleForm.type==='2'">
              <el-col :xs="24"
                      :sm="12"
                      :md="6"
                      :lg="6"
                      :xl="6"
                      v-for="(item, index) of accountList"
                      :key="index">
                <div class="account-list-box">
                  <el-image v-if="item.headimg"
                            class="account-img"
                            :src="item.headimg"
                            @click="showDetail(item.wbid)"
                            fit="fill"></el-image>
                  <el-image v-else
                            class="account-img"
                            :src="require('@/assets/images/gh.png')"
                            @click="showDetail(item.wbid)"
                            fit="fill"></el-image>
                  <div class="account-name">
                    <p v-html="item.nick"></p>
                    <span v-html="item.departmentName"></span>
                  </div>
                  <div class="delete-checkbox-box"
                       v-if="isDelete">
                    <el-checkbox-group v-model="deleteCheckBoxList">
                      <el-checkbox class="search-box-checkbox"
                                   :label="item.wbid">删除</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 网站 -->
            <el-row :gutter="36"
                    v-if="this.ruleForm.type==='3'">
              <el-col :xs="24"
                      :sm="12"
                      :md="6"
                      :lg="6"
                      :xl="6"
                      v-for="(item, index) of accountList"
                      :key="index">
                <div class="account-list-box">
                  <div class="account-img"
                       @click="showDetail(item.id)">
                    <el-image class="head-image"
                              :src="require('@/assets/images/gh.png')"
                              fit="fill"></el-image>
                  </div>
                  <div class="account-name">
                    <p v-html="item.name"></p>
                    <span v-html="item.city"></span>
                  </div>
                  <div class="delete-checkbox-box"
                       v-if="isDelete">
                    <el-checkbox-group v-model="deleteCheckBoxList">
                      <el-checkbox class="search-box-checkbox"
                                   :label="item.id">删除</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 头条 -->
            <el-row :gutter="36"
                    v-if="this.ruleForm.type==='4'">
              <el-col :xs="24"
                      :sm="12"
                      :md="6"
                      :lg="6"
                      :xl="6"
                      v-for="(item, index) of accountList"
                      :key="index">
                <div class="account-list-box">
                  <el-image class="head-image"
                            v-if="item.avatar_img"
                            :src="item.avatar_img"
                            @click="showDetail(item.id)"
                            fit="fill"></el-image>
                  <el-image v-else
                            :src="require('@/assets/images/gh.png')"
                            @click="showDetail(item.id)"
                            fit="fill"></el-image>
                  <div class="account-name">
                    <p v-html="item.name"></p>
                    <span v-html="item.briefIntroduction"></span>
                  </div>
                  <div class="delete-checkbox-box"
                       v-if="isDelete">
                    <el-checkbox-group v-model="deleteCheckBoxList">
                      <el-checkbox class="search-box-checkbox"
                                   :label="item.id">删除</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 微信 -->
            <el-row :gutter="36"
                    v-if="this.ruleForm.type==='1'">
              <el-col :xs="24"
                      :sm="12"
                      :md="6"
                      :lg="6"
                      :xl="6"
                      v-for="(item, index) of accountList"
                      :key="index">
                <div class="account-list-box">
                  <div v-if="item.avatar"
                       class="account-img"
                       @click="showDetail(item.wxid)"
                       :style="{ 'backgroundImage': 'url(' + item.avatar + ')' }"></div>
                  <el-image v-else
                            class="account-img"
                            :src="require('@/assets/images/gh.png')"
                            @click="showDetail(item.wxid)"
                            fit="fill"></el-image>
                  <div class="account-name">
                    <p v-html="item.nickname"></p>
                    <span v-html="item.region"></span>
                  </div>
                  <div class="delete-checkbox-box"
                       v-if="isDelete">
                    <el-checkbox-group v-model="deleteCheckBoxList">
                      <el-checkbox class="search-box-checkbox"
                                   :label="item.wxid">删除</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 抖音 -->
            <el-row :gutter="36"
                    v-if="this.ruleForm.type==='5'">
              <el-col :xs="24"
                      :sm="12"
                      :md="6"
                      :lg="6"
                      :xl="6"
                      v-for="(item, index) of accountList"
                      :key="index">
                <div class="account-list-box">
                  <el-image class="head-image"
                            v-if="item.avatar_img"
                            :src="item.avatar_img"
                            @click="showDetail(item.id)"
                            fit="fill"></el-image>
                  <el-image v-else
                            :src="require('@/assets/images/gh.png')"
                            @click="showDetail(item.id)"
                            fit="fill"></el-image>
                  <div class="account-name">
                    <p v-html="item.nickname"></p>
                    <span v-html="item.city"></span>
                  </div>
                  <div class="delete-checkbox-box"
                       v-if="isDelete">
                    <el-checkbox-group v-model="deleteCheckBoxList">
                      <el-checkbox class="search-box-checkbox"
                                   :label="item.id">删除</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
            <!-- 一点 -->
            <el-row :gutter="36"
                    v-if="this.ruleForm.type==='6'">
              <el-col :xs="24"
                      :sm="12"
                      :md="6"
                      :lg="6"
                      :xl="6"
                      v-for="(item, index) of accountList"
                      :key="index">
                <div class="account-list-box">
                  <el-image class="head-image"
                            v-if="item.channel_cover"
                            :src="item.channel_cover"
                            @click="showDetail(item.id)"
                            fit="fill"></el-image>
                  <el-image v-else
                            :src="require('@/assets/images/gh.png')"
                            @click="showDetail(item.id)"
                            fit="fill"></el-image>
                  <div class="account-name">
                    <p v-html="item.media_name"></p>
                    <span v-html="item.province"></span>
                  </div>
                  <div class="delete-checkbox-box"
                       v-if="isDelete">
                    <el-checkbox-group v-model="deleteCheckBoxList">
                      <el-checkbox class="search-box-checkbox"
                                   :label="item.id">删除</el-checkbox>
                    </el-checkbox-group>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="dataNull"
             class="min-height text-center">
          <img :src="require('@/assets/images/empty-data.png')"
               alt="">
        </div>
      </template>
    </div>
    <pagination @pagingChange="getPagingChange"
                :total="total"
                ref="child"></pagination>
    <el-dialog :modal-append-to-body="false"
               :visible.sync="dialogFormVisible">
      <account-details :accountDetails="accountDetails"></account-details>
    </el-dialog>
    <v-diaing :isDiaingShow="dialogVisible"
              @confirmDelete="confirmRawDelete"
              @closeModal="cancelDelete"></v-diaing>
  </div>
</template>
<script>
import vDiaing from '@/views/system/components/Diaing'
import pagination from '@/components/Pagination.vue'
import AccountDetails from '@/views/propagation/setup/AccountDetails'
export default {
  data () {
    return {
      total: 0, // 总数
      deteleRow: {},
      dataLess: false,
      accountDetails: '', // 账号详情
      deleteCheckBoxList: [], // 删除的数据
      dataNull: false, // 如果数据为空,控制某些样式隐藏
      isDelete: false, // 是否删除
      dialogFormVisible: false, // 弹出框账号详情
      dialogVisible: false, // 账号详情
      accountList: [],
      ruleForm: {
        type: '1',
        keyword: '',
        pageNum: 1
      }
    }
  },
  methods: {
    // 分页
    getPagingChange (change) {
      this.ruleForm.pageNum = change.page
      this.ruleForm.pageSize = change.size
      this.getSelect('getAccInfo')
    },
    // 滚动加载
    // getData () {
    //   this.ruleForm.pageNum++
    //   this.getSelect('getAccInfo')
    // },
    resetForm (form) {
      this.$refs[form].resetFields()
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
      this.searchList()
    },
    closeModal () {
      this.dialogVisible = false
    },
    getCloseModal (item) {
      this.dialogVisible = item
    },
    // 确认删除
    confirmRawDelete () {
      this.deteleRow.type = this.ruleForm.type
      this.$http.post(this.$api.deleteByIds, this.deteleRow)
        .then(res => {
          this.$message.success('操作成功！')
          this.searchList()
        })
        .catch(() => { })
      this.isDelete = !this.isDelete
      this.batchDelete = false
    },
    // 获取列表
    getSelect (apiName) {
      this.batchDelete = false
      this.$http.post(this.$api[apiName], this.ruleForm)
        .then(res => {
          if (res.data.data.list && res.data.data.list.length > 0) {
            this.dataNull = false
            this.accountList = res.data.data.list
            this.total = res.data.data.count
          } else {
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    // 展示删除弹框
    showDelete () {
      this.deteleRow.ids = this.deleteCheckBoxList
      this.dialogVisible = true
    },
    // 取消删除
    cancelDelete () {
      this.batchDelete = false
      this.isDelete = false
      this.deleteCheckBoxList = []
      this.dialogVisible = false
    },
    // 点击删除
    deleteAccount () {
      this.deleteCheckBoxList = []
      this.batchDelete = true
      this.isDelete = true
    },
    // 添加账号
    addAccount () {
      this.$router.push({ name: 'AddAccount' })
    },
    // 账号详情显示
    showDetail (id) {
      this.$http.get(this.$api.queryInfoById, { params: { type: this.ruleForm.type, id: id } })
        .then(res => {
          this.accountDetails = null
          this.accountDetails = res.data.data.list[0]
          this.accountDetails.type = this.ruleForm.type
        })
        .catch(() => { })
      this.dialogFormVisible = true
    },
    // 筛选
    searchList () {
      this.accountList = []
      this.ruleForm.pageNum = 1
      this.$refs.child.handleCurrentChange(this.ruleForm.pageNum)
      this.getSelect('getAccInfo')
    }
  },
  created () {
    // 默认请求微信
    this.getSelect('getAccInfo')
  },
  components: {
    AccountDetails,
    pagination,
    vDiaing
  }
}
</script>
<style scoped>
.install {
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  /* min-height: calc(120vh - 60px); */
}
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.colum-set {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  width: 100%;
}
.remove span {
  display: inline-block;
  width: 98px;
  height: 30px;
  background: rgba(103, 168, 231, 1);
  border-radius: 10px;
  border: none;
  outline: none;
}
.remove span > img {
  width: 14px;
  height: 14px;
  border: none;
}
.remove i {
  display: inline-block;
  width: 30px;
  height: 30px;
  background: #000;
}
.remove i img {
  display: block;
  width: 14px;
  height: 14px;
  border: none;
}
.colum-set div {
  width: 343px;
  height: 355px;
  background: rgba(238, 239, 240, 0.5);
  box-sizing: border-box;
}
.colum-set div h3 {
  padding: 15px;
}
.colum-set div h3 span {
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 18px;
}
.colum-set div h3 .fl-right {
  float: right;
}
.colum-set div h3 .blue {
  color: #009bff;
  cursor: pointer;
}
.colum-set div p {
  padding: 15px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
}
.account-set {
  box-sizing: border-box;
  overflow: hidden;
}
.account-set .set-title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  margin-left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row-reverse;
}
.account-set .set-title .title-first {
  font-weight: bolder;
  letter-spacing: 3px;
  font-size: 18px;
}
.account-set .set-title i {
  font-style: normal;
  text-decoration: underline;
  margin: 0 5px;
  color: #2899ed;
  cursor: pointer;
}
.account-list {
  padding: 20px 0;
}
.account-list-box,
.account-name,
.delete-checkbox-box {
  text-align: center;
}
.account-list-box {
  margin-bottom: 30px;
  height: 175px;
}
.account-list-box img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.account-name p {
  font-size: 18px;
  margin-bottom: 10px;
}
.account-name span {
  color: #ccc;
}
.delete-checkbox-box {
  margin-top: 10px;
}
.delete-text {
  color: #1c8ee4;
  margin-right: 50px;
  font-size: 16px;
}
.cloum-set .news {
  position: absolute;
  left: 60px;
  top: -5px;
}
.cloum-set .button .el-button {
  margin-left: 10px;
}
.cloum-set .button i {
  margin-right: 5px;
}
.data-center-header {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  margin: 15px 0;
  padding: 0 15px;
  font-size: 14px;
  color: #333;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.data-center-header {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
}
.data-center-header .el-form {
  display: flex;
  justify-content: space-between;
}
.data-center-header .el-form .el-form-item {
  margin: 0;
  margin-right: 20px;
}
.data-center-header .el-button {
  border-radius: 0px;
}
.data-center-header .el-checkbox:last-child {
  margin-left: -70px;
}
.cloum-set .set-img {
  display: inline-block;
  height: 100%;
  width: 100%;
}
.account-details {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.delete-checkbox-box {
  text-align: center;
  margin-top: 10px;
}
.delete-text {
  color: #1c8ee4;
  margin-right: 50px;
  font-size: 16px;
}
.account-img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-position: center;
  overflow: hidden;
  margin: 0 auto 15px auto;
  cursor: pointer;
}
.head-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-top: 0px;
  overflow: hidden;
  background-position: center;
}
.opera {
  display: flex;
}
</style>
