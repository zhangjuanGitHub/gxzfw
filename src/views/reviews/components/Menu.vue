<!--
 * @Author: MaiChao
 * @Date: 2020-09-08 17:01:38
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-15 10:32:58
-->
<template>
  <el-menu :default-active="getRouterPath"
           @select="handleSelect"
           class="el-menu-vertical-demo admin-img-box">
    <el-menu-item index="issued">
      <span slot="title">任务下发</span>
    </el-menu-item>
    <el-menu-item index="receive">
      <span slot="title">执行任务</span>
    </el-menu-item>
    <el-menu-item index="recording">
      <span slot="title">工作记录</span>
    </el-menu-item>
    <el-menu-item index="assessment">
      <span slot="title">任务考核</span>
    </el-menu-item>
    <el-menu-item index="admin">
      <span slot="title">平台账号备忘录(仅自己可见)</span>
    </el-menu-item>
    <el-menu-item index="box">
      <span slot="title">口径库</span>
    </el-menu-item>
    <el-menu-item index="binding">
      <span slot="title">政法网军</span>
    </el-menu-item>
  </el-menu>
</template>

<script>

const actions = new Map([
  ['issued', 'ReviewsIssued'],
  ['receive', 'ReviewsReceive'],
  ['assessment', 'ReviewsAssess'],
  ['recording', 'ReviewsRecording'],
  ['admin', 'ReviewsAdmin'],
  ['box', 'CaliberPublic'],
  ['binding', 'ReviewsBinding']
])
export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  methods: {
    handleSelect (change) {
      this.$router.push({ name: actions.get(change) })
    }
  },
  created () {
    this.routeName = this.$route.query.routeName
  },
  components: {},
  computed: {
    getRouterPath () {
      let routePath = this.$route.path
      if (this.routeName === 'ReviewsAssess') {
        routePath = 'assessment'
      } else if (this.routeName === 'ReviewsRecording') {
        routePath = 'recording'
      } else {
        routePath = this.$route.path.split('/')[3]
      }
      return routePath
    }
  }
}
</script>
<style scoped>
</style>
