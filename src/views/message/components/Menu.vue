<template>
  <el-menu :default-active="getRouteName"
           @select="handleSelect"
           class="el-menu-vertical-demo hotnews-box">
    <el-menu-item index="intelligenceeditor">
      <span slot="title">智能编辑</span>
    </el-menu-item>
    <el-menu-item index="template">
      <span slot="title">写作模板</span>
    </el-menu-item>
    <el-menu-item index="intelligencenew">
      <span slot="title">智能新闻百科</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
const actions = new Map([
  ['intelligenceeditor', 'IntelligenceEditor'],
  ['template', 'Template'],
  ['intelligencenew', 'Major']
])
export default {
  name: 'Menu',
  data () {
    return {
      activeName: ''
    }
  },
  methods: {
    handleSelect (change) {
      this.$router.push({ name: actions.get(change) })
    }
  },
  created () {
  },
  computed: {
    getRouteName () {
      return this.$route.path.split('/')[3]
    }
  }
}
</script>

<style scoped>
</style>
