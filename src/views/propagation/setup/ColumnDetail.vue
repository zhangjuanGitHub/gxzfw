<template>
  <div class="install">
    <div class="cloum-set">
      <div class='confirmdelete' v-if="this.establish">
        <el-button size="small"
                   v-if="columDetail.status===1"
                   :disabled="columDetail.id === 1"
                   @click="disColum">禁用栏目</el-button>
        <el-button size="small"
                   type="primary"
                   v-else
                   :disabled="columDetail.id === 1"
                   @click="disColum">启用栏目</el-button>
        <el-button type="primary"
                   size="small"
                   class="confirm"
                   :disabled="columDetail.id === 1"
                   @click="confirmTitle">确认修改</el-button>
      </div>
      <div class='confirmdelete' v-else>
        <el-button type="primary"
                   size="small"
                   class="confirm"
                   :disabled="columDetail.id === 1"
                   @click="setUp">确认创建</el-button>
      </div>
      <div class="account-set">
        <div class="colum-top">
          <div class="colum-left">
            <span class="synopsis-title">栏目名称<span class="account-num">该账号类型中存在<i class="set-num">{{total || 0}}</i>个账号</span></span>
            <div class="set-title">
              <el-input v-model="columDetail.column_name"
                        :disabled="columDetail.id === 1"
                        maxlength="25"
                        show-word-limit
                        placeholder="请输入栏目名称"></el-input>
            </div>
            <div class="synopsis">
              <span class="synopsis-title">栏目简介</span>
              <el-input type="text"
                        class="set-first"
                        placeholder="栏目简介"
                        v-model="columDetail.column_introduction"
                        maxlength="50"
                        show-word-limit
                        :disabled="columDetail.id === 1">
              </el-input>
            </div>
          </div>
          <div class="uploud-cover">
            <span class="synopsis-title">栏目封面</span>
            <v-upload @getAttachmentUrl="getAttachmentUrl"
                      :headUrl="imageUrl"
                      :listType="listType"
                      :showList="showList"
                      :isMultiple="isMultiple"
                      :acceptType="acceptType"></v-upload>
            <!-- <el-upload class="avatar-uploader"
                       :action="this.$api.upload"
                       :show-file-list="false"
                       :on-success="handleAvatarSuccess"
                       :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl"
                   :src="imageUrl"
                   class="avatar">
              <i v-else
                 class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
          </div>
        </div>
        <div class="set-search" v-if="this.establish">
          <div class="set-center-header">
            <el-form ref="ruleForm"
                     :model="form">
              <el-form-item label="账号类型:"
                            prop="accountType">
                <el-select v-model="form.accountType"
                           size="small"
                           @change="getSelect()"
                           placeholder="请选择账号类型">
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
                <el-input v-model="form.keyword"
                          size="small"
                          placeholder="请输入名称关键字">
                </el-input>
              </el-form-item>
              <!-- <div class="reroder"></div> -->
            </el-form>
            <div class="last-item">
              <el-button v-if="!this.batchDelete"
                         @click="addAccount"
                         type="primary"
                         size="small">添加账号</el-button>
              <el-button v-if="!this.batchDelete"
                         @click="removeAccount"
                         type="danger"
                         size="small">删除账号</el-button>
              <el-button v-if="this.batchDelete"
                         type="danger"
                         size="small" :disabled="this.deleteCheckBoxList.length === 0"
                         @click="showDelete">确认删除</el-button>
              <el-button v-if="this.batchDelete"
                         size="small"
                         @click="cancleDelete">取消删除</el-button>
              <el-button type="primary"
                         size="small"
                         @click="searchList">筛选</el-button>
              <el-button size="small"
                         @click="resetForm('ruleForm')">重置</el-button>
            </div>
          </div>
        </div>
        <div class="account-list" v-if="this.establish">
          <div class="account-list-box"
               v-for="(item,index) in accountList"
               :key="index">
            <!-- 微信 -->
            <div class="account-details"
                 v-if="form.accountType === '1'">
              <div class="account-img">
                <div v-if="item.avatar"
                     class="head-image"
                     @click="showDetail(item.wxid)"
                     :style="{ 'backgroundImage': 'url(' + item.avatar + ')' }">
                </div>
                <el-image v-else
                          class="head-image"
                          :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.wxid)"
                          fit="fill"></el-image>
                <div class="account-name">
                  <h2 v-html="item.nickname"></h2>
                  <p v-html="item.region"></p>
                </div>
                <div class="delete-checkbox-box"
                     v-if="batchDelete">
                  <el-checkbox-group v-model="deleteCheckBoxList">
                    <el-checkbox class="search-box-checkbox"
                                 :label="item.wxid">删除</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <!-- 微博 -->
            <div class="account-details"
                 v-if="form.accountType === '2'">
              <div class="account-img">
                <el-image v-if="item.headimg"
                          class="head-image"
                          :src="item.headimg"
                          @click="showDetail(item.wbid)"
                          fit="fill"></el-image>
                <el-image v-else
                          class="head-image"
                          :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.wbid)"
                          fit="fill"></el-image>
                <div class="account-name">
                  <h2 v-html="item.nick"></h2>
                  <p v-html="item.region"></p>
                </div>
                <div class="delete-checkbox-box"
                     v-if="batchDelete">
                  <el-checkbox-group v-model="deleteCheckBoxList">
                    <el-checkbox class="search-box-checkbox"
                                 :label="item.wbid">删除</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <!-- 网站 -->
            <div class="account-details"
                 v-if="form.accountType === '3'">
              <div class="account-img">
                <el-image class="head-image"
                          :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.id)"
                          fit="fill"></el-image>
                <div class="account-name">
                  <h2 v-html="item.name"></h2>
                  <p v-html="item.city"></p>
                </div>
                <div class="delete-checkbox-box"
                     v-if="batchDelete">
                  <el-checkbox-group v-model="deleteCheckBoxList">
                    <el-checkbox class="search-box-checkbox"
                                 :label="item.id">删除</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <!-- 头条 -->
            <div class="account-details"
                 v-if="form.accountType === '4'">
              <div class="account-img">
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
                  <h2 v-html="item.name"></h2>
                  <p v-html="item.briefIntroduction"></p>
                </div>
                <div class="delete-checkbox-box"
                     v-if="batchDelete">
                  <el-checkbox-group v-model="deleteCheckBoxList">
                    <el-checkbox class="search-box-checkbox"
                                 :label="item.id">删除</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <!-- 抖音 -->
            <div class="account-details"
                 v-if="form.accountType === '5'">
              <div class="account-img">
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
                   <h2 v-html="item.nickname"></h2>
                  <p v-html="item.city"></p>
                </div>
                <div class="delete-checkbox-box"
                     v-if="batchDelete">
                  <el-checkbox-group v-model="deleteCheckBoxList">
                    <el-checkbox class="search-box-checkbox"
                                 :label="item.id">删除</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
            <!-- 一点 -->
            <div class="account-details"
                 v-if="form.accountType === '6'">
              <div class="account-img">
                <el-image class="head-image"
                          v-if="item.channel_cover"
                          :src="item.channel_cover"
                          @click="showDetail(item.id)"
                          fit="cover"></el-image>
                <el-image v-else
                          :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.id)"
                          fit="cover"></el-image>
                <div class="account-name">
                  <h2 v-html="item.media_name"></h2>
                  <p v-html="item.province"></p>
                </div>
                <div class="delete-checkbox-box"
                     v-if="batchDelete">
                  <el-checkbox-group v-model="deleteCheckBoxList">
                    <el-checkbox class="search-box-checkbox"
                                 :label="item.id">删除</el-checkbox>
                  </el-checkbox-group>
                </div>
              </div>
            </div>
          </div>
          <div v-if="dataNull"
               class="text-center">
            <img :src="require('@/assets/images/empty-data.png')"
                 alt="">
          </div>
        </div>
      </div>
    </div>
    <pagination @pagingChange="getPagingChange"
                :total="total"
                ref="child"></pagination>
    <el-dialog :modal-append-to-body="false"
               :visible.sync="dialogFormVisible">
      <account-details :accountDetails="accountDetails"></account-details>
    </el-dialog>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="confirmRawDelete"
              @closeModal="cancleDelete"></v-diaing>
  </div>
</template>
<script>
import pagination from '@/components/Pagination.vue'
import vDiaing from '@/views/system/components/Diaing'
import vUpload from '@/components/UploadAll.vue'
// import scrollData from '@/components/ScrollData'
import AccountDetails from '@/views/propagation/setup/AccountDetails'
export default {
  data () {
    return {
      listType: 'text',
      showList: false,
      isMultiple: false,
      acceptType: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      deteleRow: {},
      dialogVisible: false,
      deleteItem: {},
      establish: false, // 创建
      imageUrl: '', // 上传图片
      accountDetails: '', // 账号详情
      total: 0, // 列表总数
      dataNull: false, // 数据为空
      deleteCheckBoxList: [],
      batchDelete: false, // 控制删除样式
      columDetail: {
        column_name: '',
        column_introduction: ''
      },
      activeName: 'first',
      isActive: false,
      dialogFormVisible: false,
      visible: false,
      accountList: [],
      form: {
        accountType: '1',
        keyword: ''
      },
      page: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  methods: {
    getAttachmentUrl (url) {
      this.imageUrl = url.response.message
    },
    // handleAvatarSuccess (res, file) {
    //   this.imageUrl = res.message
    // },
    // beforeAvatarUpload (file) {
    //   const isLt2M = file.size / 1024 / 1024 < 10
    //   if (!isLt2M) {
    //     this.$message.error('上传头像图片大小不能超过 10MB!')
    //   }
    //   return isLt2M
    // },
    resetForm (form) {
      this.$refs[form].resetFields()
      this.page.pageNum = 1
      this.accountList = []
      this.$refs.child.handleCurrentChange(this.page.pageNum)
      this.getList()
    },
    // 栏目标题简介
    confirmTitle () {
      if (this.columDetail.column_name && this.columDetail.column_introduction) {
        let row = {
          id: this.columDetail.id,
          columnCover: this.imageUrl,
          columnName: this.columDetail.column_name,
          columnIntroduction: this.columDetail.column_introduction
        }
        this.$http.post(this.$api.updateColumn, row)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('修改成功!')
              this.$http.get(this.$api.queryColumn)
                .then(res => {
                  if (res.data.data) {
                    this.$store.commit('mutations/columnMenu', res.data.data)
                    this.$router.push({ name: 'SetColumn' })
                  }
                }).catch(() => { })
            }
          })
          .catch(() => { })
      } else {
        this.$message.warning('请输入栏目标题及简介！')
      }
    },
    // 筛选
    searchList () {
      if (this.form.keyword) {
        this.accountList = []
        this.page.pageNum = 1
        this.$refs.child.handleCurrentChange(this.page.pageNum)
        this.getList()
      } else {
        this.$message.warning('请输入筛选条件！')
      }
    },
    // 分页
    getPagingChange (change) {
      this.page.pageNum = change.page
      this.page.pageSize = change.size
      this.getList()
    },
    // 下拉加载更多
    // getData () {
    //   this.page.pageNum++
    //   this.getList()
    // },
    // 展示删除弹框
    showDelete () {
      this.deteleRow.ids = this.deleteCheckBoxList.join(',')
      this.dialogVisible = true
    },
    // 取消删除
    cancleDelete () {
      this.batchDelete = !this.batchDelete
      this.deleteCheckBoxList = []
      this.dialogVisible = false
    },
    // 确认删除
    confirmRawDelete () {
      this.deteleRow.type = this.form.accountType
      this.deteleRow.cid = this.columDetail.id
      if (this.deteleRow.ids) {
        this.deteleRow.type = this.form.accountType
        this.deteleRow.cid = this.columDetail.id
        this.$http.get(this.$api.deleteAccForCol, { params: this.deteleRow })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功！')
              this.dialogVisible = false
              this.accountList = []
              this.getList()
            }
            this.deleteCheckBoxList = []
          })
          .catch(() => { })
        this.batchDelete = false
      } else {
        this.$message.warning('请选择需要删除的数据！')
        return false
      }
    },
    // 删除账户
    removeAccount () {
      this.batchDelete = true
    },
    // 账户类型
    getSelect () {
      this.page.pageNum = 1
      this.form.keyword = ''
      this.accountList = []
      this.$refs.child.handleCurrentChange(this.page.pageNum)
      this.getList()
    },
    // 获取账户信息
    getList () {
      // this.batchDelete = false
      this.dataNull = false
      let row = {
        type: parseInt(this.form.accountType) || 1,
        cid: parseInt(this.columDetail.id),
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        keyword: this.form.keyword
      }
      this.$http.post(this.$api.queryAccByColId, row)
        .then(res => {
          if (res.data.data && res.data.data.list.length) {
            this.total = res.data.data.accountNum
            this.accountList = res.data.data.list
          } else {
            this.dataNull = true
          }
        })
        .catch(() => {
          this.dataNull = true
        })
    },
    // 跳转添加账户
    addAccount () {
      this.$router.push({ name: 'AppendColum', query: { cid: this.columDetail.id } })
    },
    // 账号详情显示
    showDetail (id) {
      let type = this.form.accountType
      this.$http.get(this.$api.queryInfoById, { params: { type: type, id: id } })
        .then(res => {
          if (res.data.data) {
            this.accountDetails = res.data.data.list[0]
            this.accountDetails.type = type
          }
        })
        .catch(() => { })
      this.dialogFormVisible = true
    },
    // 栏目重置
    restColum () {
      this.columDetail.column_name = '未命名栏目' + this.columDetail.id
      this.columDetail.column_introduction = ''
      this.imageUrl = ''
      this.accountList = []
      this.visible = false
    },
    // 禁用/启用栏目
    disColum () {
      if (this.columDetail.column_introduction && this.columDetail.column_name) {
        if (this.columDetail.status) {
          this.columDetail.status = 0
        } else {
          this.columDetail.status = 1
        }
        this.columSet()
      } else {
        this.$message.warning('请输入栏目标题及简介！')
      }
    },
    // 获取栏目信息
    queryColumn () {
      this.$http.get(this.$api.queryMeColumn)
        .then(res => {
          if (res.data.code === 200) {
            let columBox = res.data.data.overList.filter(res => res.id === this.columDetail.id)
            columBox.forEach(item => {
              this.columDetail = item
              this.imageUrl = this.columDetail.column_cover.replace('blob:', '')
            })
          }
        })
        .catch(() => { })
    },
    // 栏目操作
    columSet () {
      this.$http.get(this.$api.updateStatus, { params: { cid: this.columDetail.id, status: this.columDetail.status } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.$http.get(this.$api.queryColumn)
              .then(res => {
                if (res.data.data) {
                  this.$store.commit('mutations/columnMenu', res.data.data)
                  // this.$router.push({ name: 'SetColumn' })
                }
              }).catch(() => { })
          }
        }).catch(() => { })
    },
    // 创建栏目
    setUp () {
      if (this.columDetail.column_name && this.columDetail.column_introduction) {
        let row = {
          columnCover: this.imageUrl,
          columnName: this.columDetail.column_name,
          columnIntroduction: this.columDetail.column_introduction
        }
        this.$http.post(this.$api.addColumn, row)
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('创建成功!')
              this.$router.push({ name: 'AppendColum', query: { cid: res.data.data } })
            }
          })
          .catch(() => {
            this.$router.push({ name: 'SetColumn' })
          })
      } else {
        this.$message.warning('请输入栏目标题及简介！')
      }
    }
  },
  components: {
    AccountDetails,
    pagination,
    vUpload,
    vDiaing
  },
  created () {
    if (this.$route.query.columDetail) {
      this.columDetail.id = JSON.parse(this.$route.query.columDetail)
      this.establish = true
      this.getList()
      this.queryColumn()
    } else {
      this.establish = false
      this.columDetail.id = ''
    }
  }
}
</script>
<style lang="scss">
@import '../bigData';
</style>>
<style scoped>
.install {
  position: relative;
  overflow: hidden;
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
.colum-top{
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
}
.colum-left{
  width: 50%;
}
.account-set {
  min-height: 500px;
  box-sizing: border-box;
  overflow: hidden;
}
.account-set .set-title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 40px;
  align-items: center;
}
.account-set .column-name {
  width: 280px;
}
.set-title span {
  font-size: 14px;
}
.account-list {
  display: flex;
  flex-wrap: wrap;
  text-align: center;
}
.cloum-set .account-list-box {
  width: 25%;
  display: flex;
  margin: 40px 0 20px 0;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.cloum-set .set-img img {
  vertical-align: middle;
  margin-right: 5px;
}
.cloum-set .account-list .account-list-box .active {
  display: block;
}
.cloum-set .account-list .account-name h2 {
  font-size: 16px;
  font-weight: bold;
  color: black;
  line-height: 40px;
  margin-top: 5px;
}
.cloum-set .account-name p {
  font-size: 12px;
  color: #ccc;
  line-height: 14px;
  cursor: pointer;
}
.cloum-set .account-img {
  position: relative;
}
/* .cloum-set .news {
  position: absolute;
  left: 60px;
  top: -5px;
} */
.cloum-set .button .el-button {
  font-weight: bold;
  cursor: pointer;
  margin-left: 10px;
}
.cloum-set .button i {
  margin-right: 5px;
}
.set-center-header {
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
.set-center-header {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
}
.set-center-header .el-form {
  display: flex;
}
.set-center-header .el-form .el-form-item {
  display: flex;
  margin: 0;
  margin-right: 20px;
}
.set-center-header .el-button {
  border-radius: 0px;
}
.set-center-header .el-checkbox:last-child {
  margin-left: -70px;
}
.cloum-set .set-img {
  display: inline-block;
  height: 100%;
  width: 100%;
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

.set-title .el-input {
  width: 100%;
}
.account-img .head-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0px auto;
  overflow: hidden;
  background-position: center;
  cursor: pointer;
}
.text-center {
  width: 280px;
  margin: 0 auto;
}
.set-num {
  font-style: normal;
  color: #1c8ee4;
  margin: 0 5px;
  text-decoration: underline;
  cursor: pointer;
}
.synopsis-title {
  font-size: 15px;
  color: #666;
  display: block;
  line-height: 22px;
  margin-bottom: 10px;
}
.synopsis .el-input {
  width: 100%;
  margin-bottom: 20px;
}
.last-item {
  float: right;
  line-height: 40px;
}
.account-num {
  font-size: 13px;
  text-align: right;
  color: #666;
  margin-left: 12%;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 152px;
  line-height: 152px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 152px;
  display: block;
}
.uploud-cover{
  width: 33%;
}
.confirmdelete{
  text-align: right;
}
</style>
