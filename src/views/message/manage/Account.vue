<template>
  <div class="container assessment">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ManageMatrix' }">新媒体矩阵</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="assessment-box">
      <v-menu></v-menu>
      <div class="manage-cont">
        <div class="tabs-card">
          <div class="card-name">
            <router-link :to="{name:'ManageMatrix'}">
              <img :src="require('@/assets/images/manage/midsa.png')">
              <span>矩阵管理</span>
            </router-link>
          </div>
          <!-- <div class="card-name">
            <router-link :to="{name:'ManageAddAccount'}">
              <img :src="require('@/assets/images/manage/account.png')">
              <span>授权账号管理</span>
            </router-link>
          </div> -->
        </div>
        <div class="add-box">
          <div class="account-box warrant">
            <div class="account-top">
              <!-- <h3>添加授权账号:</h3> -->
              <div class="account-list">
                <div class="list-type">
                  <div class="img-box"
                       @click="getwxUrl('component_qrcode_page')">
                    <el-image :src="require('@/assets/images/resimg/u15656.png')"></el-image>
                    <i class="el-icon-circle-plus"></i>
                  </div>
                  <p class="wexin">微信公众号</p>
                </div>
                <div class="list-type">
                  <div class="img-box"
                       @click="getwbUrl('authorize')">
                    <el-image :src="require('@/assets/images/resimg/u15663.png')"></el-image>
                    <i class="el-icon-circle-plus"></i>
                  </div>
                  <p class="weibo">新浪微博</p>
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
                               @click="searchList('form')">筛选</el-button>
                    <el-button size="small"
                               @click="resetForm('form')">重置</el-button>
                  </el-form-item>
                </el-form>
                <div class="table-export">
                  <el-button size="small"
                             type="primary"
                             @click="debouncedGetAnswer">导出</el-button>
                  <!-- <el-button size="small"
                             @click="backGo">返回</el-button> -->
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
                  </template>
                </el-table-column>
                <el-table-column prop="accountName"
                                 label="账号名称"
                                 width="200">
                </el-table-column>
                <el-table-column prop="authorizationTime"
                                 label="授权时间"
                                 width="220">
                </el-table-column>
                <el-table-column prop="authorizationStatus"
                                 label="授权状态"
                                 width="220">
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
                    <el-button type="primary"
                               @click="deleteRow(scope.row, scope.$index)"
                               size="small">删除</el-button>
                    <el-button @click="relation(scope.row, scope.$index)"
                               size="small">绑定</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- <v-diaing :isDiaingShow="isDiaingShow"
                      :deleteItem="deleteItem"
                      @confirmDelete="getConfirmDelete"
                      @closeModal="getCloseModal">
            </v-diaing> -->
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
                             :key="item.id">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
              <span slot="footer"
                    class="dialog-footer">
                <el-button @click="restBind">取 消</el-button>
                <el-button type="primary"
                           @click="bindToUser">确 定</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
        <v-diaing :isDiaingShow="isDiaingShow"
                  :deleteItem="deleteItem"
                  @confirmDelete="getConfirmDelete"
                  @closeModal="getCloseModal">
        </v-diaing>
      </div>
    </div>
  </div>
</template>
<script>
import vDiaing from '@/components/Diaing'
import vMenu from '@/views/message/components/sidebar'
import '@/libs/date_format.js'
import { mapState } from 'vuex'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  name: 'Account',
  data () {
    return {
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
    this.debouncedGetAnswer = this.$debounce(this.exportExcel, 500)
    this.getAccountList()
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    })
  },
  methods: {
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
      console.log(item.accountType)
      // let accountType = item.accountType === 'wx' ? 'wx' : 'wb'
      this.$http.get(`${this.$api.delete_self_authorizer}/${item.accountType}/${item.accountId}`)
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
      this.relationShow = true
      this.$http.get(this.$api.listBindChildUser)
        .then(res => {
          if (res.data.code === 200) {
            this.cities = res.data.data
            // console.log(res.data.data)
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
              let data = item.authorizationTime * 1000
              item.authorizationTime = data.date_format().Format('yyyy-MM-dd hh:mm:ss')
            })
          }
        })
        .catch(() => { })
    },
    // wx获取url跳转
    getwxUrl (url) {
      let windowOpen = window.open('_blank')
      windowOpen.location.href = window.g.baseUrl + this.$api[url] + '?authCode=' + this.$store.state.user.token
      // windowOpen.location.href = 'http://platform.free.vipnps.vip/oauth/weixin/authorize?token=efd2e155-c163-48cf-bde5-02e11e911f50&state=1'
    },
    // wb获取url跳转
    getwbUrl (url) {
      this.$http.get(this.$api[url])
        .then(res => {
          if (res.data.code === 200) {
            let windowOpen = window.open('_blank')
            windowOpen.location.href = res.data.message
          }
        })
        .catch(() => { })
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
    // 确定绑定
    bindToUser () {
      let bind = {
        'accountType': this.deleteItem.accountType,
        'accountId': this.deleteItem.accountId,
        'userIds': this.checkedCityid
      }
      this.$http.post(this.$api.bindAuthorizerToUser, bind)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('绑定成功')
            this.relationShow = false
            this.checkedCityid = []
          }
        })
        .catch(() => { })
    },
    // 取消绑定
    restBind () {
      this.relationShow = false
      this.checkedCityid = []
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (from.name === 'ManageMatrix') {
        vm.$router.replace({
          name: 'EmptyView',
          path: 'empty'
        })
      }
      // 因为当钩子执行前，组件实例还没被创建
      // vm 就是当前组件的实例相当于上面的 this，所以在 next 方法里你就可以把 vm 当 this 来用了。
      // 当前组件的实例
      // if (to.name === 'ManageAddAccount') {
      //   console.log(vm.$router)
      //   vm.$router.replace(to.path)
      //   // window.reload()
      // }
    })
  },
  components: {
    vDiaing,
    vMenu
  }
}
</script>
<style lang="scss">
@import '../resour';
</style>
<style scoped>
.account-box {
  background: #fff;
}
.account-list {
  display: flex;
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 20px 0 0 30px;
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
.table-export {
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
}
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
</style>
