<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome' }">中央信息厨房</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="message-title">
      <div class="message-title-left">
        <p><span class="message-title-span">稿件池</span></p>
      </div>
      <router-link :to="{name: 'MessageArticleBox',query:{changeSide:false}}">
        <div class="jump-box">
          <p>全部稿件+</p>
        </div>
      </router-link>
    </div>
    <!--    列表-->
    <div>
      <el-table startDate
                border
                empty-text
                :data="tableData"
                class="message-list"
                style="width: 100%">
        <el-table-column prop="areaName"
                         label="地区"
                         width="90">
        </el-table-column>
        <el-table-column prop="updateTime"
                         label="投稿时间"
                         width="100">
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
        <el-table-column prop="departmentName"
                         label="投稿单位"
                         width="100">
        </el-table-column>
        <el-table-column prop="createUserName"
                         label="投稿用户"
                         width="90">
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
                   class="createUserName"
                   slot="reference">{{scope.row.createUserName}}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column prop="originalAuthor"
                         label="原作者"
                         width="70">
        </el-table-column>
        <el-table-column prop="cameristName"
                         label="摄影师"
                         width="70">
        </el-table-column>
        <el-table-column prop="checkUserName"
                         label="审核人"
                         width="120">
          <template slot-scope="scope">
            <p v-if="scope.row.checkUserName">{{scope.row.checkUserName}}</p>
            <p class="errorClass"
               v-else>暂无</p>
          </template>
        </el-table-column>
        <el-table-column prop="checkStatus"
                         label="审核状态"
                         width="100">
          <template slot-scope="scope">
            <p v-if="scope.row.checkStatus ===1"
               class="checkStatus defaultclass">未审核</p>
            <p v-if="scope.row.checkStatus === 3"
               class="checkStatus activeClass">审核通过</p>
            <el-tooltip v-else-if="scope.row.checkStatus === 2"
                        class="item"
                        effect="dark"
                        :content="scope.row.checkReason"
                        placement="top-start">
              <p class="checkStatus errorClass">审核未通过</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="publishNum"
                         label="发布情况"
                         width="80">
          <template slot-scope="scope">
            <div @click="publish(scope.row, scope.$index)"
                 :class="[ scope.row.publishNum === 0 ? '' : 'publish' ]">
              {{scope.row.publishNum}}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="articleGrade"
                         label="评级"
                         width="80">
          <template slot-scope="scope">
            <p v-if="scope.row.articleGrade === 'A'"
               class="rating-p Aclass"
               slot="reference">A</p>
            <p v-else-if="scope.row.articleGrade === 'B'"
               class="rating-p Bclass"
               slot="reference">B</p>
            <p v-else
               class="rating-p defaultclass"
               slot="reference">未评级</p>
            <!-- <el-popover placement="top"
                        width="160"
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
              <p v-if="scope.row.articleGrade === 'A'"
                 class="rating-p Aclass"
                 slot="reference">A</p>
              <p v-else-if="scope.row.articleGrade === 'B'"
                 class="rating-p Bclass"
                 slot="reference">B</p>
              <p v-else
                 class="rating-p defaultclass"
                 slot="reference">未评级</p>
            </el-popover> -->
          </template>
        </el-table-column>
        <el-table-column prop="provinceUse"
                         label="标注"
                         width="125"
                         class="province">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.provinceUse"
                         @change="provinceUse(scope.row, scope.$index)">
              <span class="checkbox-span">被市院公众号采用</span>
            </el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="120">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="delete-click">
                <i class="el-icon-delete"></i>
                <span @click="deleteRow(scope.row, scope.$index)">删除</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <no-permission v-else></no-permission> -->
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
    </div>
    <div class="video">
      <div class="message-title">
        <div class="message-title-left">
          <p><span class="message-title-span">视频池</span></p>
        </div>
        <router-link :to="{name: 'MessageVideo'}">
          <div class="jump-box">
            <p>全部视频+</p>
          </div>
        </router-link>
      </div>
      <!--    视频-->
      <div class="video-box">
        <el-row :gutter="36">
          <el-col :xs="24"
                  :sm="12"
                  :md="6"
                  :lg="6"
                  :xl="6"
                  v-for="(item, index) of video"
                  :key="index">
            <el-card shadow="hover"
                     :body-style="{ padding: '0px' }">
              <div class="image-box"
                   @click="openOut(item)"
                   :style="{background: 'url('+ item.videoThumbnail +') no-repeat center', backgroundSize: 'cover',backgroundPosition:'left top'}">
              </div>
              <div class="card-details">
                <p class="card-details-title lin-clamp-1"
                   v-text="item.videoTitle"></p>
                <div class="details clearfix">
                  <span class="details-span"
                        :id="item.id"
                        v-text="item.createUserName"></span>
                  <time class="time-style"
                        v-text="item.createTime"></time>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="message-title">
      <div class="message-title-left">
        <p><span class="message-title-span">图片池</span></p>
      </div>
      <router-link :to="{name: 'MessageImage'}">
        <div class="jump-box">
          <p>全部图片+</p>
        </div>
      </router-link>
    </div>
    <div class="img-box">
      <el-row :gutter="36">
        <el-col :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                v-for="(item, index) of image"
                :key="index"
                class="el-col-box">
          <el-card shadow="hover"
                   :body-style="{ padding: '0px' }">
            <router-link :to="{name: 'ImageDetails', query: {id:item.id}}">
              <div class="image-box"
                   :style="{background: 'url('+ item.coverImage + ') no-repeat center', backgroundSize: 'cover',backgroundPosition:'left top'}">
              </div>
              <div class="card-details">
                <div class="card-num-box">
                  <p class="card-details-title lin-clamp-1"
                     v-text="item.albumName"></p>
                </div>
                <div class="details clearfix">
                  <span class="details-span"
                        v-text="item.createUserName"></span>
                  <time class="time-style"
                        v-text="item.createTime"></time>
                </div>
              </div>
            </router-link>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 删除弹框 -->
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
  </div>
</template>

<script>
import '@/libs/date_format.js'
import vDiaing from '@/views/system/components/Diaing'
export default {
  name: 'List',
  data () {
    return {
      text: '',
      initiateContent: '',
      infoDialog: false,
      ismodal: false, // 遮罩
      createUserId: '',
      phone: '',
      wechat: '',
      dialogVisible: false,
      deleteItem: {}, // 需要删除的数据
      ruleForm: {
        organizationType: '', // 职能
        areaId: '', // 地区id
        departmentId: '', // 单位名称
        articleStatus: '', // 稿件状态
        articleGrade: '', // 稿件级别
        startDate: '',
        endDate: ''
      },
      tableData: [], // 稿件池
      video: [], // 视频池
      image: [] // 图片池
    }
  },
  methods: {
    // 评级失去焦点时隐藏确认
    getHide (scope) {
      scope.row.showRatingPopover = false
    },
    openOut (item) {
      window.open(item.videoLink, '_blank')
    },
    routerWeb (row, index) {
      row.readStatus = 1
      if (this.ruleForm.isWebsite === '1') {
        // 设置已读
        this.$http.get(`${this.$api.readArticle}/${row.id}`)
          .then(res => {
            if (res.data.code === 200) {
              window.open(row.websiteUrl, '_blank')
            }
          })
          .catch(() => {
          })
      } else {
        let local = this.$router.resolve({ name: 'ManuscriptDetail', params: { id: row.id } })
        window.open(local.href, '_blank')
      }
    },
    // 删除当前行数据
    deleteRow (index, row) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确认删除
    getConfirmDelete (item) {
      if (!Array.isArray(item)) {
        this.$http.get(this.$api.articleDelete, { params: { id: item.id } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功')
              this.tableData.splice(item.index, 1)
            }
          })
          .catch(() => {
          })
      }
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 获取稿件列表
    getList () {
      let articlePar = {}
      articlePar.organizationType = ''
      articlePar.areaId = ''
      articlePar.departmentId = ''
      articlePar.articleStatus = ''
      articlePar.articleGrade = ''
      articlePar.startDate = ''
      articlePar.endDate = ''
      articlePar.pageNum = 1
      articlePar.pageSize = 10
      this.$http.post(this.$api.articleList, articlePar)
        .then(res => {
          this.tableData = res.data.data.content
          this.tableData.forEach(item => {
            // 转换数字为布尔值
            // item.editorPraise = !!item.editorPraise
            // item.provinceUse = !!item.provinceUse
          })
        })
        .catch(() => {
        })
    },
    // 获取查询视频列表
    videoList () {
      this.ruleForm.pageNum = 1
      this.ruleForm.pageSize = 4
      this.$http.post(this.$api.videoList, this.ruleForm)
        .then(res => {
          this.video = res.data.data.content
        })
        .catch(() => {
        })
    },
    // 获取查询图片列表
    PhotoList () {
      this.ruleForm.pageNum = 1
      this.ruleForm.pageSize = 4
      this.$http.post(this.$api.PhotoList, this.ruleForm)
        .then(res => {
          this.image = res.data.data.content
        })
        .catch(() => {
        })
    },
    // 设置采用
    provinceUse (row, index) {
      // provinceUse
      this.$http.get(`${this.$api.provinceUse}/${row.id}`)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('采用成功')
          }
        })
        .catch(() => {
          this.$message.worning('设置失败')
        })
    },
    // 跳转发布情况
    publish (row, index) {
      if (row.publishNum) {
        this.$router.push({ name: 'PublishDetail', query: { id: row.id, type: 1 } })
      } else {
        this.$message.warning('发布情况为0！')
      }
    },
    // 发送站内信息
    showTeamDialog (row, index) {
      this._self.$refs[`popover-${index}`].doClose()
      this.infoDialog = true
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
            this.createUserId = res.data.data.userId
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.getList()
    this.videoList()
    this.PhotoList()
  },
  components: {
    vDiaing
  }
}
</script>
<style lang="scss" scoped>
@import "./message";
</style>
<style lang="scss" scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.message-title {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  justify-content: space-between;
}
.publish {
  text-decoration: underline;
  color: #2c8ae5;
  cursor: pointer;
}
.message-title-left {
  p {
    font-size: 16px;
    color: #333333;
    &::before {
      content: "";
      width: 4px;
      height: 16px;
      background: #2c8ae5;
      position: absolute;
      z-index: -1;
    }
  }
}
.message-title-span {
  font-size: 16px;
  margin-left: 12px;
}
.jump-box {
  p {
    color: #4395e1;
    font-size: 16px;
  }
}
.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f56c6c;
}
.title-u {
  color: #60b4f4;
  cursor: pointer;
}
/*视频池*/
.video {
  margin-top: 30px;
}
.video-box {
  margin-bottom: 22px;
}
.image-box {
  height: 170px;
  overflow: hidden;
}
.details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.card-details {
  padding: 16px 16px 26px;
}
.card-details-title,
.details-span,
.time-style {
  font-size: 16px;
}
.card-details-title {
  color: #333333;
  line-height: 2;
}
.details-span {
  color: #1783ff;
  display: inline-block;
  width: 96px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.time-style {
  color: #b2b2b2;
}
.delete-click {
  color: #f56c6c;
  cursor: pointer;
}
.delete-click span {
  text-decoration: underline;
  margin-left: 5px;
}
.message-list {
  background-color: #f5f5f5;
  border: none;
}
.province .el-checkbox {
  white-space: normal;
}
.checkbox-span {
  display: inline-block;
  width: 80px;
  vertical-align: middle;
  white-space: normal;
}
.createUserName {
  cursor: pointer;
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
</style>
