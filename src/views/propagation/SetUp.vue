<template>
  <div class="container bigData">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.cid}}">新媒体传播力</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/propagation/setup/column' }">设置</el-breadcrumb-item>
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
                :xl="20">
          <el-tabs type="border-card"
                   v-model="activeName"
                   @tab-click="handleClick(activeName)">
            <el-tab-pane name="/propagation/setup/column">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/dataimg/column.png')">栏目设置</span>
            </el-tab-pane>
            <el-tab-pane name="/propagation/setup/account">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/dataimg/account.png')">账户设置</span>
            </el-tab-pane>
            <router-view></router-view>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import vMenu from '@/views/propagation/components/Menu'
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Assessment',
  data () {
    return {
      cid: '',
      activeName: '',
      headerCard: []
    }
  },
  methods: {
    handleClick (activeName) {
      this.$router.push({ path: activeName })
    }
  },
  created () {
    switch (this.$route.path) {
      case '/propagation/setup/appendcolum':
        this.activeName = '/propagation/setup/column'
        break
      case '/propagation/setup/columndetail' || '/propagation/setup/appendcolum':
        this.activeName = '/propagation/setup/column'
        break
      case '/propagation/setup/addaccount':
        this.activeName = '/propagation/setup/account'
        break
      default:
        this.activeName = this.$route.path
        break
    }
    if (this.userInfo.cid) {
      this.cid = this.userInfo.cid
    }
  },
  watch: {
    $route () {
      switch (this.$route.path) {
        case '/propagation/setup/appendcolum':
          this.activeName = '/propagation/setup/column'
          break
        case '/propagation/setup/columndetail' || '/propagation/setup/appendcolum':
          this.activeName = '/propagation/setup/column'
          break
        case '/propagation/setup/addaccount':
          this.activeName = '/propagation/setup/account'
          break
        default:
          this.activeName = this.$route.path
          break
      }
    }
  },
  components: {
    vMenu
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
    ...mapGetters('mutations',
      {
        columnMenu: 'columnMenu'
      }
    )
  }
}
</script>

<style lang="scss" scoped>
@import "./bigData";
.bigData-span {
  display: flex;
  align-items: center;
}
.bigData-span img {
  margin-right: 5px;
}
</style>
