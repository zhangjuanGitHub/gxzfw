<template>
  <div class="header-wrap"
       v-if="userInfo && routeName !== 'Login' && routeDowload !== 'dowload'">
    <div class="header-title-wrap">
      <div class="header-title-div">
        <div id="logo-box">
          <img id="logo"
               :src="require('@/assets/images/logo-a.png')"
               @click="toHome">
          <p class="title-list">
            <span class="website-name"
                  @click="toHome">{{getWebSiteName}}</span>
          </p>
        </div>
        <div class="header-menu">
          <el-menu :default-active="getRouter"
                   mode="horizontal"
                   @select="handleSelect"
                   text-color="#fff"
                   class="el-menu-style">
            <el-menu-item index="home">
              首页
            </el-menu-item>
            <el-menu-item index="repository">
              媒体资源库
            </el-menu-item>
            <el-menu-item index="message" v-permission="3">
              中央信息厨房
            </el-menu-item>
            <el-menu-item index="propagation"
                          v-permission="4"
                          v-if="this.userInfo.cid">
              大数据中心
            </el-menu-item>
            <el-menu-item index="setup"
                          v-permission="4"
                          v-else>
              大数据中心
            </el-menu-item>
            <el-menu-item index="opinion"
                          @click="blankUrl"
                          v-permission="9">
              舆情监测
            </el-menu-item>
            <el-menu-item index="assessment"
                          v-permission="5">
              管理与考核
            </el-menu-item>
            <el-menu-item index="contributions"
                          v-permission="6">
              媒体联盟
            </el-menu-item>
            <el-menu-item index="reviews">
              网评管理
            </el-menu-item>
          </el-menu>
        </div>
      </div>
      <div class="header-right">
        <div class="icon-box">
          <router-link :to="{name: 'SystemUser'}"
                       v-permission="7">
            <el-tooltip class="item"
                        effect="dark"
                        content="系统管理"
                        placement="bottom">
              <img class="team-img time"
                   :src="require('@/assets/images/sys.png')">
            </el-tooltip>
          </router-link>
          <router-link :to="{name: 'SystemMessage'}">
            <el-badge :value="noReadMessageNum"
                      v-if="noReadMessageNum"
                      class="badge-box">
              <el-tooltip class="item"
                        effect="dark"
                        content="全部消息"
                        placement="bottom">
              <img :src="require('@/assets/images/header/h-message.png')">
            </el-tooltip>
            </el-badge>
            <el-tooltip class="item"
                        effect="dark"
                        content="全部消息"
                        placement="bottom" v-else>
              <img :src="require('@/assets/images/header/h-message.png')">
            </el-tooltip>
          </router-link>
        </div>
        <el-dropdown @command="handleCommand"
                     :hide-on-click="false">
          <div class="nav-right-box">
            <img style="margin-right: 5px"
                 v-if="headPicture"
                 :src="headPicture"
                 alt="">
            <img style="margin-right: 5px"
                 v-else
                 :src="require('@/assets/images/userimg.png')"
                 alt="">
            <p class="el-dropdown-link"
               v-text="userName"><i class="el-icon-arrow-down el-icon--right"></i></p>
            <el-dropdown-menu class="nav-right-drop"
                              slot="dropdown">
              <el-dropdown-item command="AuthUser"
                                :class="{'is-active': this.$route.path.split('/')[1] === 'user'}">个人中心</el-dropdown-item>
              <el-dropdown-item command="logout">安全退出</el-dropdown-item>
            </el-dropdown-menu>
          </div>
        </el-dropdown>
      </div>
    </div>
    <!--    回到顶部-->
    <template>
      <el-backtop></el-backtop>
    </template>
    <el-dialog title="确定退出系统？"
               :visible.sync="dialogVisible"
               :modal-append-to-body='false'
               width="30%">
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary"
                   @click="logout">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import ws from '@/libs/socket'
import { mapState } from 'vuex'
export default {
  name: 'Header',
  data () {
    return {
      dialogVisible: false,
      activeIndex: '',
      dowload: false
    }
  },
  methods: {
    blankUrl () {
      this.$http.get(this.$api.yqController)
        .then(res => {
          let blankTo = res.data.message
          var a = document.createElement('a')
          a.setAttribute('href', blankTo)
          a.setAttribute('target', '_blank')
          a.setAttribute('id', 'startTelMedicine')
          // 防止反复添加
          if (document.getElementById('startTelMedicine')) {
            document.body.removeChild(document.getElementById('startTelMedicine'))
          }
          document.body.appendChild(a)
          a.click()
          // window.open(res.data.data, '_blank')
        })
        .catch(() => { })
    },
    // 右侧下拉菜单
    handleCommand (key) {
      switch (key) {
        case 'AuthUser':
          this.$router.push({ name: 'AuthUser' })
          break
        case 'Book':
          this.$router.push({ name: 'UserSetBook' })
          break
        case 'logout':
          this.isLogout()
          break
        case 'System':
          this.$router.push({ name: 'SystemMessage' })
          break
      }
    },
    toHome () {
      this.$router.push({ name: 'Home' })
    },
    isLogout () {
      this.dialogVisible = true
    },
    // 退出
    logout () {
      this.dialogVisible = false
      this.$http.get(this.$api.logout)
        .then(res => {
          ws.getWsClose()
          this.$store.commit('mutations/emptyState')
          this.$store.commit('user/userSignout')
          sessionStorage.clear()
          localStorage.clear()
          this.isRouterAlive = false
          this.$nextTick(function () {
            this.isRouterAlive = true
          })
          this.$router.replace({ name: 'Login' })
        })
        .catch(() => {
        })
    },
    // nav
    handleSelect (key, keyPath) {
      switch (key) {
        case 'message':
          this.$router.push({ name: 'MessageArticleBox', query: { changeSide: false } })
          break
        case 'home':
          this.$router.push({ name: 'Home' })
          break
        case 'repository':
          this.$router.push({ name: 'Inspect' })
          break
        case 'propagation':
          this.$router.push({ name: 'DataCenterWx', query: { dis: parseInt(this.userInfo.cid) } })
          break
        case 'setup':
          this.$router.push({ name: 'StarAccountWx' })
          break
        case 'assessment':
          this.$router.push({ name: 'AssessmentWx' })
          break
        case 'contributions':
          this.$router.push({ name: 'Contributions' })
          break
        case 'reviews':
          this.$router.push({ name: 'ReviewsAssess' })
          break
      }
    }
  },
  created () {
    if (this.userInfo && this.userInfo.userId) {
      ws.initWebSocket()
    }
  },
  watch: {
    userInfo (newValue, oldValue) {
      if (this.userInfo && this.userInfo.userId) {
        ws.initWebSocket()
      }
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo, // 是否存在用户信息
      token: state => state.user.token, // token
      userName: state => state.user.userInfo.userName, // 用户名
      headPicture: state => state.user.userInfo.headPicture, // 用户头像
      noReadMessageNum: state => state.user.noReadMessageNum, // 未读消息
      getWebSiteName: state => state.mutations.setWebSiteName // 网站名称
    }),
    // ...mapGetters('mutations', {
    //   getPermission: 'getPermission'
    // }),
    routeName () {
      return this.$route.name
    },
    routeDowload () {
      return this.$route.path.split('/')[3]
    },
    getRouter () {
      let getRouterPath = this.$route.path.split('/')[1]
      let routerActive = 'no-active'
      if (getRouterPath !== 'user' && getRouterPath !== 'userset' && getRouterPath !== 'book') {
        routerActive = getRouterPath
      }
      if (getRouterPath === 'articlepublic') {
        routerActive = 'message'
      }
      return routerActive
    }
  }
}
</script>

<style lang="scss">
@import './header';
.header-wrap {
  //width: 100%;
  color: #fff;
  background: linear-gradient(
    0deg,
    rgb(161, 152, 240),
    rgb(102, 72, 212),
    rgb(62, 29, 209)
  );
}
.header-title-wrap {
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
}
.header-title-div {
  height: 60px;
  display: flex;
  align-items: center;
  flex: 1;
}
.el-menu.el-menu--horizontal {
  border: none;
}
.nav-right-box {
  /*width: 170px;*/
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 60px;
  line-height: 60px;
}
.nav-right-box img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
.el-dropdown-link {
  color: #ffffff;
  font-size: 16px;
  text-align: right;
  white-space: nowrap;
}
.el-menu-style {
  display: flex;
  align-items: center;
  background: transparent;
}
.header-wrap .icon-box {
  background: #9f9ee9;
  display: flex;
  align-items: center;
  padding: 0 18px;
  height: 34px;
  border-radius: 15px;
  margin-right: 10px;
}
.icon-box .time {
  width: 25px;
}
.badge-box {
  height: 100%;
  display: flex;
  align-items: center;
}
.header-menu {
  flex: 1;
}
.margin-l-12 {
  margin-left: 12px;
}
.header-right {
  display: flex;
  align-items: center;
  min-width: 15%;
}
.team-img {
  margin: 0 15px 0 0;
}
.icon-box a {
  display: inline-block;
  height: 21px;
}
#logo {
  height: 50px;
  vertical-align: middle;
  cursor: pointer;
}
#logo-box {
  display: flex;
  width: 190px;
  position: relative;
}
.header-wrap .title-list {
  font-size: 18px;
  margin-left: 10px;
  line-height: 22px;
  text-align: center;
  display: flex;
}
.website-name {
  align-self: center;
  cursor: pointer;
}
.el-menu-style {
  display: flex;
  justify-content: center;
}

</style>
