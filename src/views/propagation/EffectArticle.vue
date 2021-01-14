<template>
  <div class="effect container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.cid}}">新媒体传播力</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'EffectArticle' }">文章传播列表</el-breadcrumb-item>
      </el-breadcrumb>
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
              <template>
                <articles></articles>
              </template>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import vMenu from '@/views/propagation/components/Menu'
import articles from '@/views/propagation/spread/Articles'
export default {
  data () {
    return {
      cid: '',
      activeName: 'EffectArticle'
    }
  },
  methods: {
    handleClick (tab, event) {
      this.$router.push({ name: tab.name })
    }
  },
  components: {
    articles,
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
