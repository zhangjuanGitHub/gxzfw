<template>
  <el-menu :default-active="getRouterName"
           @select="handleSelect"
           class="el-menu-vertical-demo admin-img-box">
    <el-menu-item index="AuthUser">
      <i class="el-icon-user-solid"></i>
      <span slot="title">个人信息</span>
    </el-menu-item>
    <el-menu-item index="AuthSettings">
      <i class="el-icon-s-tools"></i>
      <span slot="title">安全设置</span>
    </el-menu-item>
<!--    <el-menu-item index="UserCms">-->
<!--      <i class="el-icon-connection"></i>-->
<!--      <span slot="title">CMS绑定</span>-->
<!--    </el-menu-item>-->
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  methods: {
    handleSelect (change) {
      this.$router.push({ name: change })
    }
  },
  created () { },
  components: {
  },
  computed: {
    getRouterName () {
      return this.$route.name
    }
  }
}
</script>

<style scoped>
</style>
