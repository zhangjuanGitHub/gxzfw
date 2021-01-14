<template>
  <el-menu :default-active="getRouterName"
           @select="handleSelect"
           class="el-menu-vertical-demo admin-img-box">
    <el-menu-item index="SystemMessage">
      <span slot="title">全部消息</span>
    </el-menu-item>
    <el-menu-item index="Interview">
      <span slot="title">约访消息</span>
    </el-menu-item>
    <el-menu-item index="SystemIssue">
      <span slot="title">议题消息</span>
    </el-menu-item>
    <el-menu-item index="Station">
      <span slot="title">在线沟通</span>
    </el-menu-item>
    <el-menu-item index="Forward">
      <span slot="title">响应消息</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  methods: {
    handleSelect (change) {
      console.log(change)
      // if (change === 'Station') {
      //   if (this.userInfo && this.userInfo.id) {
      //     ws.initWebSocket()
      //   }
      // }
      this.$router.push({ name: change })
    }
  },
  created () { },
  components: {
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo // 是否存在用户信息
    }),
    getRouterName () {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
</style>
