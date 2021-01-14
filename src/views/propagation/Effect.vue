<template>
  <div class="container bigData">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.cid}}">新媒体传播力</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'WebMonitor' }">传播力指数</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bigData-box">
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
                :xl="20"
                class="cont-box"
                style="padding-left: 0px; padding-right: 0px;">
          <div class="tabs-card">
            <div class="card-name">
              <router-link :to="{}"
                           :class="{ 'is-active': tabsActive==='wx'}">
                <img :src="require('@/assets/images/manage/wx.png')">
                <span>微信传播力</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{}"
                           :class="{ 'is-active': tabsActive==='wb'}">
                <img :src="require('@/assets/images/manage/wb.png')">
                <span>微博传播力</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{}"
                           :class="{ 'is-active': tabsActive==='website'}">
                <img :src="require('@/assets/images/manage/wz.png')">
                <span>网站传播力</span>
              </router-link>
            </div>
          </div>
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import vMenu from '@/views/propagation/components/Menu'
export default {
  name: 'DataCenter',
  data () {
    return {
      cid: '',
      tabs: '1',
      tabsActive: '',
      activeName: ''
    }
  },
  methods: {
  },
  created () {
    this.tabsActive = this.$route.query.tabs
    this.activeName = this.$route.path
    if (this.userInfo.cid) {
      this.cid = this.userInfo.cid
    }
  },
  watch: {
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo // 是否存在用户信息
    })
  },
  components: {
    vMenu
  }
}
</script>

<style lang="scss" scoped>
@import "./bigData";
.bigData-span {
  display: flex;
  align-items: center;
  img {
    margin-right: 5px;
  }
}
.cont-box {
  padding: 0;
  box-sizing: border-box;
  min-height: 500px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.tabs-card {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}
.card-name a {
  display: inline-block;
  padding: 0 20px;
  height: 40px;
  border-right: 1px solid #e4e7ed;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.card-name .is-active {
  color: #2c8ae5;
  background-color: #fff;
  border-bottom-color: transparent;
}
.card-name img {
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -3px;
}
.card-name span {
  line-height: 33px;
}
.bigData {
  .fl-ri {
    width: 195px;
    line-height: 14px;
    position: absolute;
    top: 15px;
    right: 10px;
    z-index: 999;
    display: flex;
    .right-list {
      display: flex;
    }
    .title {
      font-size: 14px;
      color: #3875f0;
      text-decoration: underline;
      float: right;
      cursor: pointer;
    }
    .images {
      display: inline-flex;
      vertical-align: middle;
      width: 16px;
      height: 14px;
      border: none;
      margin-left: 12px;
      margin-right: 5px;
    }
  }
}
</style>
