<template>
  <div class="swith-login">
    <el-row :gutter="10">
        <el-col :xs="20"
                :sm="20"
                :md="20"
                :lg="20"
                :xl="21" class="swith-left">
                <div class="left-info">
                  <img :src="require('@/assets/images/yingyong.png')" alt="yingyong">
                </div>
        </el-col>
        <el-col :xs="4"
                :sm="4"
                :md="4"
                :lg="4"
                :xl="3" class="swith-right">
                <div class="right-top">
                  <p class="zh-name">{{getWebsite}}</p>
                  <!-- <span class="en-name">Financial media center of Beijing Procuratorate</span> -->
                </div>
                <div class="user-info-box">
                  <div class="right-infor">
                  <div class="avatar">
                    <el-avatar :src="userInfo.headPicture"></el-avatar>
                  </div>
                  <div class="user-name">
                    <span>{{userInfo.userName}}</span>
                    <span>{{userInfo.roleName}}</span>
                  </div>
                  <!-- <div class="logout">
                    <img :src="require('@/assets/images/logout.png')">
                  </div> -->
                  </div>
                  {{systemList}}
                  <div class="timeline-box">
                    <el-timeline>
                      <el-timeline-item color="#409eff">
                        <p @click="targetUrl()">融媒体应用系统</p>
                      </el-timeline-item>
                    </el-timeline>
                    <el-timeline>
                      <el-timeline-item color="#0bbd87">
                        <p @click="targetUrl()">融媒体监测系统</p>
                      </el-timeline-item>
                    </el-timeline>
                    <el-timeline>
                      <el-timeline-item color="#f56c6c">
                        <p @click="targetUrl()">融媒体系统管理</p>
                      </el-timeline-item>
                    </el-timeline>
                    <el-timeline>
                      <el-timeline-item>
                        <p @click="targetUrl()">融媒体消息中心</p>
                      </el-timeline-item>
                    </el-timeline>
                  </div>
                </div>
                <!-- <el-tabs tab-position="right" class="right-tabs" @tab-click="handleClick" v-model="activeName">
                  <el-tab-pane label="全媒体应用系统" name="yingyong"></el-tab-pane>
                  <el-tab-pane label="全媒体监测系统" name="jiance"></el-tab-pane>
                  <el-tab-pane label="全媒体系统管理" name="xitong"></el-tab-pane>
                  <el-tab-pane label="全媒体消息中心" name="xiaoxi"></el-tab-pane>
                </el-tabs> -->
        </el-col>
      </el-row>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      activities: [
        {
          content: '全媒体应用系统',
          color: '#409eff',
          url: 'http://47.93.1.52/media/home'
        },
        {
          content: '全媒体监测系统',
          color: '#0bbd87',
          url: 'http://47.93.1.52/monitor/bigdata/center/wx?dis=1'
        },
        {
          content: '全媒体系统管理',
          color: '#f56c6c',
          url: 'http://47.93.1.52/media/system/user'
        },
        {
          content: '全媒体消息中心',
          url: 'http://47.93.1.52/media/userset/message'
        }
      ]
    }
  },
  methods: {
    targetUrl (url) {
      window.location.href = url
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo, // 是否存在用户信息
      token: state => state.user.token, // token
      getWebsite: state => state.mutations.websiteName // 网站名称
    }),
    systemList: {
      get () {
        return this.$store.state.mutations.websiteName
      },
      set () {
        this.activities[0].content = '123'
      }
    }
  }
}
</script>
<style lang="scss">
@import "login";
</style>
<style scoped>
.swith-login{
  background: url("../../assets/images/swithBG.jpg") no-repeat fixed 50% 50% /
    cover;
}
.swith-login .el-row,
.swith-login .el-row .el-col{
  display: block;
  height: 100vh;
}
.swith-right{
  background-color: rgba(0,0,0,0.8);
  padding: 10px;
  color: #fff;
  padding: 0 33px 0 13px;
}
.right-top {
  margin-top: 60px;
}
.right-top .zh-name{
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  line-height: 45px;
}
.right-top .en-name{
  display: block;
  font-size: 12px;
  text-align: center
}
.right-infor{
  display: flex;
  margin-top: 40px;
  align-items: center;
}
.user-name span{
  display: block;
  line-height: 19px;
  font-size: 16px;
}
.right-infor .logout{
  width: 50%
}
.right-infor .logout img{
  float: right;
  margin-top: 3px;
  cursor: pointer;
}
.right-infor .avatar{
  margin-right: 10px;
}
.right-tabs{
  margin: 22px;
}
.left-info img{
  display: block;
  padding: 100px 100px 0;
  max-width: 100%;
}
.user-info-box {
  padding: 0 10px;
}
.select-page-box {
  margin-top: 24px;
}
.select-page-box li {
  height: 50px;
  line-height: 50px;
  /* border-top: 1px solid #ccc; */
  /* border-bottom: 1px solid #ccc; */
}
.timeline-box {
  margin-top: 54px
}
</style>
