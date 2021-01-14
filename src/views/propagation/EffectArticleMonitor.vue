<template>
  <div class="effect container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.cid}}">新媒体传播力</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'EffectArticleMonitor' }">文章实时监测</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="echarts-box">
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
          <template >
            <monitor></monitor>
          </template>
          <!-- <div v-else
              class="text-center no-permission">
            <img :src="require('@/assets/images/error-page/noPermission.png')"
                alt="">
            <p>很抱歉，您没有访问此页面的权限</p>
          </div> -->
      </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import vMenu from '@/views/propagation/components/Menu'
import monitor from '@/views/propagation/spread/ArticlesMonitor'
export default {
  data () {
    return {
      cid: '',
      activeName: 'EffectArticleMonitor'
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name })
    }
  },
  components: {
    monitor,
    vMenu
  },
  created () {
    if (this.userInfo.cid) {
      this.cid = this.userInfo.cid
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
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>
<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.effect {
  overflow: hidden;
}
.effect .echarts-box {
  width: 1314px;
  float: right;
}
.effect .el-tabs {
  background-color: #f5f5f5;
}
</style>
