<template>
  <div class="data-set">
    <!--    <el-tabs type="border-card"-->
    <!--             v-model="activeName"-->
    <!--             @tabclick="handleClick">-->
    <!--        <addaccount v-bind:dialogCreate="this.addlist"-->
    <!--                    v-on:success="success()"></addaccount>-->
    <!--    </el-tabs>-->
    <div class="account-set">
      <div class="account-num">
        <div>
          <span class="account-num-span">等待审核账号<i @click="getReviewList"
               class="cursor-p">{{unChecked}}</i>个，</span>
          <span class="account-num-span">本次筛选结果账号<i>{{searchTotal}}</i>个</span>
        </div>
        <div v-if="isDelete"
             class="confirmdelete">
          <span class="delete-text">* 请勾选需要批量删除的账号</span>
          <el-button type="danger"
                     size="small"
                     @click="confirmRawDelete">确认删除</el-button>
          <el-button size="small"
                     @click="cancelDelete">取消删除</el-button>
        </div>
        <div v-if="!isDelete">
          <el-button @click="addAccount"
                     size="small"
                     type="primary">添加账号</el-button>
          <el-button @click="deleteAccount"
                     size="small"
                     type="danger">删除账号</el-button>
        </div>
      </div>
      <div class="review-num-search">
        <el-form :inline="true"
                 ref="ruleForm"
                 :model="ruleForm"
                 class="demo-form-inline">
          <el-form-item label="职能:"
                        prop="organizationType">
            <el-select size="small"
                       v-model="ruleForm.organizationType">
              <el-option label="全部"
                         value="0"></el-option>
              <el-option label="政法委"
                         value="1"></el-option>
              <el-option label="公安"
                         value="2"></el-option>
              <el-option label="检察院"
                         value="3"></el-option>
              <el-option label="法院"
                         value="4"></el-option>
              <el-option label="司法"
                         value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="账号类型:"
                        prop="accountType">
            <el-select size="small"
                       v-model="ruleForm.accountType">
              <el-option label="全部"
                         value=""></el-option>
              <el-option label="微信"
                         value="weixin"></el-option>
              <el-option label="微博"
                         value="weibo"></el-option>
              <el-option label="网站"
                         value="website"></el-option>
              <el-option label="头条号"
                         value="toutiao"></el-option>
              <el-option label="一点号"
                         value="yidian"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字:"
                        prop="searchParam">
            <el-input v-model="ruleForm.searchParam"
                      size="small"
                      placeholder="请输入关键字"></el-input>
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
      <div class="account-list">
        <el-row :gutter="36">
          <el-col :xs="24"
                  :sm="12"
                  :md="6"
                  :lg="6"
                  :xl="6"
                  v-for="(item, index) of accountList"
                  :key="index">
            <div class="account-list-box">
              <div class="account-img"
                   @click="handleClickShowDetails(item.id)"
                   :style="{ backgroundImage: 'url(' + item.accountHead + ')' }">
                <!--                <img :src="item.accountHeadPath">-->
              </div>
              <div class="account-name">
                <p>{{item.accountName}}</p>
                <span>{{item.accountNumber}}</span>
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
    <el-dialog title="正在审核中"
               :visible.sync="reviewTable">
      <el-table :data="gridData">
        <el-table-column property="date"
                         label="日期"
                         width="150"></el-table-column>
        <el-table-column property="name"
                         label="姓名"
                         width="200"></el-table-column>
        <el-table-column property="address"
                         label="地址"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="账号详情"
               :visible.sync="dialogVisible"
               :modal-append-to-body='false'
               @close="closeModal"
               width="50%">
      <form-list :dialogVisible="dialogVisible"
                 :formData="formData"
                 @closeModal="getCloseModal"></form-list>
      <span slot="footer"
            class="dialog-footer">
      </span>
    </el-dialog>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import ScrollData from '@/components/ScrollData'
import formList from './AddAccount'
import { forEachMoreDelete } from '@/libs/tools'
export default {
  data () {
    return {
      gridData: [], // 审核列表
      total: 0, // 总数
      searchTotal: 0, // 筛选总数
      unChecked: '', // 未审核数量
      formData: null,
      dataLess: false,
      dataNull: false,
      dialogVisible: false, // 账号详情
      reviewTable: false, // 审核中的账号
      isDelete: false, // 是否删除
      deleteCheckBoxList: [], // 删除的数据
      ruleForm: {
        organizationType: '0',
        accountType: '',
        searchParam: '',
        pageNum: 1,
        pageSize: 32
      },
      accountList: []
    }
  },
  created () {
    this.getAccountList()
    this.getCountNum()
  },
  methods: {
    // 获取审核账号
    getReviewList () {
      this.$router.push({ name: 'ReviewList' })
    },
    closeModal () {
      this.dialogVisible = false
    },
    getCloseModal (item) {
      this.dialogVisible = item
    },
    // 滚动加载
    getData () {
      this.ruleForm.pageNum++
      this.getAccountList()
    },
    // 获取账号数量
    getCountNum () {
      this.$http.get(this.$api.getCountNum)
        .then(res => {
          this.total = res.data.data.total
          this.unChecked = res.data.data.unChecked
        })
        .catch(() => { })
    },
    // 获取账号列表
    getAccountList () {
      this.$http.post(this.$api.assessmentAccountList, this.ruleForm)
        .then(res => {
          let datas = res.data.data.content
          if (datas.length) {
            this.accountList.push(...datas)
            this.searchTotal = res.data.data.totalElements
            if (datas.length < 20) {
              this.dataLess = false
            }
          } else {
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    resetForm (form) {
      this.$refs[form].resetFields()
      this.searchList()
    },
    searchList () {
      this.accountList = []
      this.ruleForm.pageNum = 1
      this.getAccountList()
    },
    // 获取账号详情
    handleClickShowDetails (id) {
      this.$http.get(`${this.$api.getAccount}?id=${id}`)
        .then(res => {
          this.formData = null
          this.formData = res.data.data
          this.dialogVisible = true
        })
        .catch(() => { })
    },
    // 确认删除
    confirmRawDelete () {
      this.$http.post(this.$api.assessAccountDelete, { ids: this.deleteCheckBoxList })
        .then(res => {
          forEachMoreDelete(this.deleteCheckBoxList, this.accountList)
          this.$message.success('操作成功！')
          this.total -= this.deleteCheckBoxList.length
        })
        .catch(() => { })
      this.isDelete = !this.isDelete
    },
    // 取消删除
    cancelDelete () {
      this.isDelete = !this.isDelete
    },
    // 点击删除
    deleteAccount () {
      this.deleteCheckBoxList = []
      this.isDelete = !this.isDelete
    },
    // 添加账号
    addAccount () {
      this.$router.push({ name: 'AssessmentAddAccount' })
    }
  },
  components: {
    formList,
    ScrollData
  }
}
</script>
<style scoped>
.review-num-search {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  padding: 3px 12px;
  box-sizing: border-box;
}
.account-num {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.cursor-p {
  cursor: pointer;
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
.confirmdelete {
  text-align: right;
}
.delete-text {
  color: #1c8ee4;
  margin-right: 50px;
  font-size: 16px;
}
</style>
