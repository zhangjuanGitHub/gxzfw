<template>
  <el-menu :default-active="getRouterPath"
           @select="handleSelect"
           class="el-menu-vertical-demo admin-img-box">
<!--    <el-menu-item index="area"-->
<!--                  v-if="$isPermission(701)">-->
<!--      <i class="el-icon-share"></i>-->
<!--      <span slot="title">地区管理-->
<!--      </span>-->
<!--    </el-menu-item>-->
    <el-menu-item index="department">
      <i class="el-icon-share"></i>
      <span slot="title">单位管理
      </span>
    </el-menu-item>
    <el-menu-item index="branch">
      <i class="el-icon-menu"></i>
      <span slot="title">部门管理
      </span>
    </el-menu-item>
    <el-menu-item index="role">
      <i class="el-icon-s-custom"></i>
      <span slot="title">角色管理</span>
    </el-menu-item>
    <el-menu-item index="user">
      <i class="el-icon-user-solid"></i>
      <span slot="title">用户管理</span>
    </el-menu-item>
    <el-menu-item index="set"
                  v-if="$isPermission(704)">
      <i class="el-icon-s-tools"></i>
      <span slot="title">系统设置</span>
    </el-menu-item>
    <el-menu-item index="rule"
                  v-if="$isPermission(703)">
      <i class="el-icon-connection"></i>
      <span slot="title">系统规则</span>
    </el-menu-item>
    <el-menu-item index="log">
      <i class="el-icon-document"></i>
      <span slot="title">操作日志</span>
    </el-menu-item>
    <el-menu-item index="check"
                  v-if="$isPermission(704)">
      <i class="el-icon-edit-outline"></i>
      <span slot="title">审核人设置</span>
    </el-menu-item>
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
      switch (change) {
        case 'department':
          this.$router.push({ name: 'SystemDepartment' })
          break
        case 'branch':
          this.$router.push({ name: 'SystemBranch' })
          break
        case 'role':
          this.$router.push({ name: 'SystemRole' })
          break
        case 'user':
          this.$router.push({ name: 'SystemUser' })
          break
        case 'log':
          this.$router.push({ name: 'SystemLog' })
          break
        case 'set':
          this.$router.push({ name: 'SystemSet' })
          break
        case 'rule':
          this.$router.push({ name: 'SystemRule' })
          break
        case 'check':
          this.$router.push({ name: 'CheckSet' })
          break
        case 'area':
          this.$router.push({ name: 'SystemArea' })
          break
      }
    }
  },
  created () { },
  components: {},
  computed: {
    getRouterPath () {
      let routePath = this.$route.path
      return routePath.split('/')[2]
    }
  }
}
</script>

<style scoped>
</style>
