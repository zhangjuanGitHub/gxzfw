<template>
  <el-menu :default-active="activeName"
           @select="handleSelect"
           class="el-menu-vertical-demo admin-img-box">
    <el-menu-item index="Directly">
      <span slot="title">直属团队</span>
    </el-menu-item>
    <el-menu-item index="Newsletter">
      <span slot="title">通讯员团队</span>
    </el-menu-item>
    <el-menu-item index="Review">
      <span slot="title">网评员团队</span>
    </el-menu-item>
    <el-menu-item index="Expert">
      <span slot="title">专家学者团队</span>
    </el-menu-item>
    <el-menu-item index="Bookbigv">
      <span slot="title">网红大V团队</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
      activeName: ''
    }
  },
  methods: {
    handleSelect (change) {
      this.$router.push({ name: change })
    }
  },
  created () {
    let pathName = this.$route.path.split('/')[2]
    this.activeName = pathName.substring(0, 1).toUpperCase() + pathName.slice(1)
  },
  computed: {
  }

}
</script>

<style scoped>
</style>
