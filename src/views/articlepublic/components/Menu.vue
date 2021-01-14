<!--
 * @Author: MaiChao
 * @Date: 2020-12-07 15:07:01
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-09 15:14:46
-->
<template>
  <div class="sidebar">
    <el-row class="tac">
      <el-col>
        <el-menu :default-active="activeIndex"
                 class="el-menu-vertical-demo"
                 @select="handle"
                 text-color="#000"

                 active-text-color="#309ade">

          <el-menu-item index="LocalArticleWx">
            <span slot="title">微信发布</span>
          </el-menu-item>
          <el-menu-item index="LocalArticleWb">
            <span slot="title">微博发布</span>
          </el-menu-item>
          <el-menu-item index="ManageAddAccount">
            <span slot="title">新媒体矩阵管理</span>
          </el-menu-item>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      activeIndex: 'wxmaterial'
    }
  },
  methods: {
    handle (key, keyPath) {
      this.activeIndex = key
      this.$router.push({ name: key })
    }
  },
  created () {
    this.activeIndex = this.$route.name
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>
<style>
.sidebar {
  width: 204px;
  float: left;
}
.sidebar .el-col {
  box-sizing: border-box;
}
.sidebar .el-menu-item.is-active::before {
  content: "";
  margin-left: -20px;
  float: left;
  width: 5px;
  height: 56px;
  background-color: #3875f0;
}
.sidebar .el-menu {
  background-color: #f5f5f5;
}
.sidebar .el-menu-item {
  background-color: #feffff;
  margin-bottom: 2px;
}
.sidebar .resource-box:last-child {
  margin-top: 15px;
}
.sidebar .el-menu-item i {
  margin-right: 13px;
}
.sidebar .el-menu-item img {
  height: 20px;
  width: 20px;
}
</style>
