<template>
  <div class="container bigData">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.cid}}">新媒体传播力</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.dis}}">我的栏目</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.dis}}">{{columName}}</el-breadcrumb-item>
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
              <router-link :to="{path:'/propagation/center/wx', query: { dis: this.dis }}"
                           :class="{ 'is-active': tabsActive==='wx'}">
                <img :src="require('@/assets/images/manage/wx.png')">
                <span>微信</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{path:'/propagation/center/wb', query: { dis: this.dis }}"
                           :class="{ 'is-active': tabsActive==='wb'}">
                <img :src="require('@/assets/images/manage/wb.png')">
                <span>微博</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{path:'/propagation/center/website', query: { dis: this.dis }}"
                           :class="{ 'is-active': tabsActive==='website'}">
                <img :src="require('@/assets/images/manage/wz.png')">
                <span>门户网站</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{path:'/propagation/center/toutiao', query: { dis: this.dis }}"
                           :class="{ 'is-active': tabsActive==='toutiao'}">
                <img :src="require('@/assets/images/manage/tt.png')">
                <span>今日头条</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{path:'/propagation/center/douyin', query: { dis: this.dis }}"
                           :class="{ 'is-active': tabsActive==='douyin'}">
                <img :src="require('@/assets/images/dy.png')">
                <span>抖音</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{path:'/propagation/center/yidian', query: { dis: this.dis }}"
                           :class="{ 'is-active': tabsActive==='yidian'}">
                <img :src="require('@/assets/images/yd.png')">
                <span>一点资讯</span>
              </router-link>
            </div>
          </div>
          <router-view></router-view>
          <div class="fl-ri"
               ref="alllist">
            <p @click="newsList"
               class="right-list">
              <i><img :src="newsURL"
                     class="images"></i><span class="title">新闻列表</span>
            </p>
            <p @click="userList"
               class="right-list">
              <i><img :src="userURL"
                     class="images"></i><span class="title">用户列表</span>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import vMenu from '@/views/propagation/components/Menu'
export default {
  name: 'DataCenter',
  data () {
    return {
      cid: '',
      tabs: '1',
      tabsActive: '',
      activeName: '/propagation/center/wx',
      dis: '1',
      columName: '',
      newsURL: require('@/assets/images/dataimg/newList.png'),
      userURL: require('@/assets/images/dataimg/account02.png')
    }
  },
  methods: {
    // 新闻列表
    newsList () {
      this.$router.push({ path: this.activeName, query: { dis: this.dis } })
    },
    // 用户列表
    userList () {
      let tabs = this.activeName.split('/')[3]
      if (this.$route.query.come) {
        this.dis = parseInt(this.$route.query.come)
      }
      this.$router.push({ name: 'UserList', query: { dis: this.dis, tabs: tabs } })
    },
    activeCread () {
      let name = '/propagation/center/' + this.$route.query.tabs
      return name
    }
  },
  mounted () {
    this.$http.get(this.$api.queryColumn)
      .then(res => {
        if (res.data.code === 200) {
          this.$store.commit('mutations/columnMenu', res.data.data)
        }
      })
      .catch(() => { })
  },
  created () {
    if (this.$route.query.come) {
      this.dis = parseInt(this.$route.query.come)
      this.$route.query.tabs = this.$route.query.type
    } else {
      this.columName = this.columnMenu && this.columnMenu.filter(res => res.id === parseInt(this.$route.query.dis))[0].column_name
      this.dis = parseInt(this.$route.query.dis)
    }
    this.tabsActive = this.$route.query.tabs
    this.activeName = this.$route.path
    if (this.$route.query.tabs) {
      this.activeName = '/propagation/center/' + this.$route.query.tabs
    }
    if (this.userInfo.cid) {
      this.cid = this.userInfo.cid
    } else {
      this.cid = this.dis
    }
  },
  watch: {
    $route () {
      if (this.$route.query.come) {
        this.dis = parseInt(this.$route.query.come)
        this.$route.query.tabs = this.$route.query.type
      } else {
        this.columName = this.columnMenu && this.columnMenu.filter(res => res.id === parseInt(this.$route.query.dis))[0].column_name
        this.dis = parseInt(this.$route.query.dis)
      }

      if (this.$route.query.type) {
        this.$route.query.tabs = this.$route.query.type
      }
      // this.dis = parseInt(this.$route.query.dis)
      this.tabsActive = this.$route.query.tabs
      this.activeName = this.$route.path
      if (this.$route.query.tabs) {
        this.activeName = '/propagation/center/' + this.$route.query.tabs
      }
    }

  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo // 是否存在用户信息
    }),
    ...mapGetters('mutations',
      {
        columnMenu: 'columnMenu'
      }
    )
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
