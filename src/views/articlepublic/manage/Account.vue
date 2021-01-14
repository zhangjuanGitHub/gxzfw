<template>
  <div class="container assessment">
        <div class="breadcrumb-box">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ name: 'MessageArticleBox'}">中央信息厨房</el-breadcrumb-item>
            <el-breadcrumb-item :to="{name:'LocalArticleWx'}">发布稿件</el-breadcrumb-item>
            <el-breadcrumb-item>授权账号管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      <div class="articlepublic-data pad20">
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
                :xl="20" class="material">
        <div class="account-box warrant">
          <div class="account-top">
            <!-- <h3>添加授权账号:</h3> -->
            <div class="account-list">
              <div class="list-type">
                <div class="img-box pointer"
                     @click="getUrl('component_qrcode_page')">
                  <el-image :src="require('@/assets/images/manage/weixin.png')"></el-image>
                  <i class="el-icon-circle-plus"></i>
                </div>
                <p class="wexin">微信公众号</p>
              </div>
              <div class="list-type pointer">
                <div class="img-box"
                     @click="getUrl('authorize')">
                  <el-image :src="require('@/assets/images/manage/weibo.png')"></el-image>
                  <i class="el-icon-circle-plus"></i>
                </div>
                <p class="weibo">新浪微博</p>
              </div>
              <div class="list-type pointer">
                <div class="img-box"
                     @click="getEmail()">
                  <el-image :src="require('@/assets/images/manage/email.png')"></el-image>
                  <i class="el-icon-circle-plus"></i>
                </div>
                <p class="get-email">邮箱地址</p>
              </div>
            </div>
          </div>
          <div class="account-content">
            <h3 class="admin-title-span">账号列表:</h3>
            <div class="content-search">
              <el-form ref="form"
                       :model="form"
                       inline="inline"
                       @submit.native.prevent
                       label-position="left"
                       label-width="70px">
                <el-form-item label="账号名称">
                  <el-input size="small"
                            @keyup.enter.native="searchList"
                            placeholder="请输入账户名称"
                            v-model="form.accountName">
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small"
                             type="primary"
                             @click="searchList('form')">查询</el-button>
                  <el-button size="small"
                             @click="resetForm('form')">重置</el-button>
                </el-form-item>
              </el-form>
              <div class="table-export">
                <el-button size="small"
                           type="primary"
                           @click="exportExcel">导出</el-button>
              </div>
            </div>
          </div>
          <div class="account-table">
            <el-table :data="tableData"
                      border
                      id="account"
                      style="width: 100%">
              <el-table-column prop="accountType"
                               label="平台"
                               width="200">
                <template slot-scope='scope'>
                  <div v-if="scope.row.accountType==='wx'">
                    微信
                  </div>
                  <div v-if="scope.row.accountType==='wb'">
                    微博
                  </div>
                  <div v-if="scope.row.accountType==='mail'">
                    邮箱
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="accountName"
                               label="账号名称/地址"
                               width="200">
              </el-table-column>
              <el-table-column prop="authorizationTime"
                               label="授权时间"
                               width="200">
              </el-table-column>
              <el-table-column prop="authorizationStatus"
                               label="授权状态"
                               width="200">
                <template slot-scope='scope'>
                  <div v-if="scope.row.authorizationStatus">
                    正常
                  </div>
                  <div class="error"
                       v-else>
                    过期
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="danger"
                             class="search_danger"
                             @click="deleteRow(scope.row, scope.$index)"
                             size="small">删除</el-button>
                  <el-button @click="relation(scope.row, scope.$index)"
                             class="search_danger"
                             size="small">绑定</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <v-diaing :isDiaingShow="isDiaingShow"
                    :deleteItem="deleteItem"
                    @confirmDelete="getConfirmDelete"
                    @closeModal="getCloseModal">
          </v-diaing>
          <el-dialog title="绑定用户"
                     :visible.sync="relationShow"
                     :modal="ismodal"
                     width="45%"
                     center>
            <el-checkbox :indeterminate="isIndeterminate"
                         v-model="checkAll"
                         @change="handleCheckAllChange">全选</el-checkbox>
            <div style="margin: 15px 0;"></div>
            <el-checkbox-group v-model="checkedCityid"
                               @change="handleCheckedCitiesChange">
              <el-checkbox v-for="item in cities"
                           :label="item.id"
                           :key="item.id"
                           class="checkbox-list">{{item.userName}}</el-checkbox>
            </el-checkbox-group>
            <span slot="footer"
                  class="dialog-footer">
              <el-button @click="restBind">取 消</el-button>
              <el-button type="primary"
                         @click="bindToUser">确 定</el-button>
            </span>
          </el-dialog>
          <el-dialog title="邮箱授权"
                     :visible.sync="email"
                     :modal="ismodal"
                     width="30%"
                     center>
            <div class="content">
              <div class="email-input">
                <span>邮箱地址:</span>
                <el-autocomplete class="inline-input"
                                 v-model="emailList"
                                 :fetch-suggestions="querySearch"
                                 placeholder="请输入邮箱地址"
                                 :trigger-on-focus="false"></el-autocomplete>
              </div>
              <div class="be-careful">
                <ul>
                  <span>融媒体平台将获得以下权限:</span>
                  <li>获得您的昵称、头像、性别;</li>
                  <li>获得您委托发布权限;</li>
                  <li>获得您数据报表权限;</li>
                  <span class="last-be-careful">授权后表示您已同意融媒体服务协议</span>
                </ul>
              </div>
            </div>
            <span slot="footer"
                  class="dialog-footer">
              <el-button type="primary"
                         @click="empower">授 权</el-button>
              <el-button @click="cancel">取 消</el-button>
            </span>
          </el-dialog>
        </div>
        </el-col>
      </el-row>
      </div>
    </div>
</template>
<script>
import vMenu from '@/views/articlepublic/components/Menu'
import vDiaing from '@/components/Diaing'
import '@/libs/date_format.js'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  name: 'Account',
  data () {
    return {
      email: false,
      emailList: '',
      activeName: 'ManageAddAccount',
      checkAll: false,
      checkedCities: [],
      checkedCityid: [],
      cityOptions: [],
      cities: [],
      isIndeterminate: true,
      relationShow: false,
      ismodal: false,
      form: {
        accountName: ''
      },
      formNumber: {
        accountName: '',
        accountPassword: ''
      },
      tableData: [],
      deleteItem: {}, // 删除的对象
      isDiaingShow: false // 弹出框
    }
  },
  created () {
    this.getAccountList()
  },
  methods: {
    getData (name) {
      this.$router.push({ name: name })
    },
    resetForm (form) {
      this.form.accountName = ''
      this.getAccountList()
    },
    searchList () {
      if (!this.form.accountName) {
        this.$message.warning('请输入账号名称！')
      } else {
        this.getAccountList()
      }
    },
    // 定义导出Excel表格事件
    exportExcel () {
      let fileName = this.$route.meta.title
      var wb = XLSX.utils.table_to_book(document.querySelector('#account'))
      exportTable(XLSX, FileSaver, wb, fileName)
    },
    search () {
      if (this.form.accountName) {
        this.getAccountList()
      } else {
        this.$message.warning('请输入账号名称！')
      }
    },
    // 确认删除
    getConfirmDelete (item) {
      console.log(item)
      this.$http.get(`${this.$api.bindDelete}/${item.accountType}/${item.accountId}`)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功！')
            this.tableData.forEach((val) => {
              if (val.accountId === item.accountId) {
                this.tableData.splice(item.index, 1)
              }
            })
          }
        })
        .catch(() => { })
    },
    backGo () {
      this.$router.go(-1)// 返回上一层
    },
    // 取消删除
    getCloseModal () {
      this.isDiaingShow = false
    },
    // 点击删除
    deleteRow (item, index) {
      this.deleteItem = item
      this.deleteItem.index = index
      this.isDiaingShow = true
    },
    relation (item, index) {
      this.deleteItem = item
      this.deleteItem.index = index
      this.$http.get(this.$api.listBindChildUser)
        .then(res => {
          if (res.data.code === 200) {
            this.cities = res.data.data
            this.relationShow = true
          }
        })
        .catch(() => { })
    },
    // 获取账户列表
    getAccountList () {
      this.$http.post(this.$api.authorizer, { search: this.form.accountName })
        .then(res => {
          if (res.data.data) {
            this.tableData = res.data.data
            this.tableData.forEach(item => {
              // item.accountType = item.accountType === 'wx' ? '微信' : '微博'
              // item.authorizationStatus = item.authorizationStatus === true ? '正常' : '过期'
              // let data = item.authorizationTime * 1000
              // item.authorizationTime = data.date_format().Format('yyyy-MM-dd hh:mm:ss')
            })
          }
        })
        .catch(() => { })
    },
    // 获取授权url跳转
    getUrl (url) {
      this.$http.get(this.$api[url])
        .then(res => {
          if (res.data.code === 200) {
            console.log(res.data.message)
            let windowOpen = window.open('_blank')
            windowOpen.location.href = res.data.data.authorizeUrl
            // windowOpen.location.href = res.data.message
          }
        })
        .catch(() => { })
    },
    // // wb获取url跳转
    // getwbUrl (url) {
    //   this.$http.get(this.$api[url])
    //     .then(res => {
    //       if (res.data.code === 200) {
    //         let windowOpen = window.open('_blank')
    //         windowOpen.location.href = res.data.message
    //       }
    //     })
    //     .catch(() => { })
    // },
    // 匹配邮箱
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
    // 获取邮箱地址
    getEmail () {
      this.email = true
    },
    // 获取选中用户信息
    handleCheckAllChange (val) {
      this.checkedCities = []
      this.checkedCityid = []
      this.cityOptions = val ? this.cities : []
      this.cityOptions.forEach(item => {
        this.checkedCities.push(item.userName)
        this.checkedCityid.push(item.id)
      })
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    },
    // 确认授权
    empower () {
      console.log(123)
      let params = {
        mailAddr: this.emailList
      }
      this.$http.post(this.$api.emailAuth, params)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('绑定成功')
            this.email = false
            this.getAccountList()
          }
        })
        .catch(() => { })
    },
    // 取消授权
    cancel () {
      this.emailList = ''
      this.email = false
    },
    // 确定绑定
    bindToUser () {
      let bind = {
        'accountType': this.deleteItem.accountType,
        'accountId': this.deleteItem.accountId,
        'userIds': this.checkedCityid
      }
      this.$http.post(this.$api.bindUser, bind)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('绑定成功')
            this.relationShow = false
            this.checkedCityid = []
          }
        })
        .catch(() => {
          this.relationShow = false
        })
    },
    // 取消绑定
    restBind () {
      this.relationShow = false
      this.checkedCityid = []
    }
  },
  mounted () {
    this.restaurants = this.loadAll()
  },
  components: {
    vDiaing,
    vMenu
  }
}
</script>
<style>
@import '../articlepublic.css';
</style>
<style scoped>
.account-box {
  background: #fff;
  padding: 20px;
}
.account-list {
  display: flex;
  border-radius: 10px;
}
.list-type {
  line-height: 50px;
  margin-right: 30px;
}
.list-type .el-image {
  margin-right: 10px;
  vertical-align: middle;
}
.list-type i {
  font-size: 20px;
  color: #309ade;
  cursor: pointer;
  vertical-align: middle;
}
.list-type .toutiao {
  text-indent: 0px;
}
.account-content h3 {
  line-height: 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  border-left: 3px solid #2f9ff3;
  padding-left: 8px;
  margin: 15px 0px;
}
.content-search {
  display: flex;
  justify-content: space-between;
}

.content-search .el-form {
  width: 50%;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 5px 20px;
}
/* .table-export {
  height: 40px;
  padding: 10px 20px;
}
.table-export .el-button {
  padding: 10px 15px;
  border-radius: 0;
}
.table-export .el-button i {
  margin-right: 7px;
  font-size: 16px;
} */
.account-table {
  margin-top: 15px;
}
.card-title {
  display: flex;
  line-height: 25px;
}
.card-title .card-tips {
  margin-left: 10px;
}
.card-form .el-form-item {
  margin: 0px;
}
.card-form .el-form-item .el-button {
  padding: 10px 15px;
  margin-top: 10px;
}
.card-form .el-form {
  width: 80%;
}
.card-list {
  margin-top: 15px;
}
.card-list li {
  width: 100%;
  height: 25px;
  line-height: 25px;
  padding-left: 50px;
  box-sizing: border-box;
}
.add-box {
  padding: 20px;
}
.add-box .img-box {
  cursor: pointer;
}
.account-table .error {
  color: #f56c6c;
}
.checkbox-list {
  width: 20%;
}
.email-input {
  display: flex;
  align-items: center;
}
.el-autocomplete {
  width: 70%;
  margin-left: 10px;
}
.be-careful {
  padding-left: 75px;
  line-height: 30px;
  margin-top: 10px;
}
.be-careful ul span {
  font-weight: 700;
}
.be-careful ul li {
  font-size: 14px;
  margin-left: 5px;
}
</style>
