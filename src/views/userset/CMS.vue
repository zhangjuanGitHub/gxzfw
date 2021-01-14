<!--
 * @Author: MaiChao
 * @Date: 2020-03-30 14:08:08
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-09-22 19:55:32
-->
<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/user/cms' }">CMS绑定</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-box">
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
                :xl="20">
          <div class="user-form-box">
            <span class="user-id">用户ID</span>
            <el-input v-model="cmsBind"></el-input>
            <div class="admin-btn-box">
              <el-button type="primary"
                         @click="getUserId">快速获取</el-button>
              <el-button class="back-btn"
                         @click="confirmBind">确认绑定</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/userset/components/UserMenu'
export default {
  name: 'CMS',
  data () {
    return {
      cmsBind: ''
    }
  },
  methods: {
    // 快速获取
    getUserId () {
      this.$http.get(this.$api.getCmsUserIdUrl)
        .then(res => {
          if (res.data.data) {
            let windowOpen = window.open('_blank')
            windowOpen.location.href = 'http://124.193.149.90:2525/website-webapp/getUserId.jsp'
          }
        })
        .catch(() => {})
    },
    // 确认绑定
    confirmBind () {
      if (this.cmsBind) {
        this.$http.get(`${this.$api.saveCmsUserId}?cmsUserId=${this.cmsBind}`)
          .then(res => {
            this.$message.success('绑定成功！')
          })
          .catch(() => {})
      } else {
        this.$message.warning('请输入用户ID')
      }
    }
  },
  created () {
    this.$http.get(this.$api.getCmsUserId)
      .then(res => {
        this.cmsBind = res.data.data
      })
      .catch(() => {})
  },
  components: {
    vMenu
  }
}
</script>

<style scoped>
  @import "userset.scss";
  .user-form-box {
    background: #fff;
    padding: 20px;
  }
  .user-id {
    margin-right: 25px;
    color: #333333;
  }
</style>
