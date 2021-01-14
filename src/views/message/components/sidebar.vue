<template>
  <div class="sidebar">
    <el-row class="tac">
      <el-col>
        <el-menu :default-active="activeIndex"
                 class="el-menu-vertical-demo"
                 @select="handle"
                 text-color="#000"
                 :default-openeds="openeds"
                 active-text-color="#309ade">
          <el-menu-item index="manage">
            <i><img src="@/assets/images/resimg/archiv.png"
                   alt=""></i>
            <span slot="title">新媒体矩阵</span>
          </el-menu-item>
          <!-- <el-menu-item index="editor">
            <i><img src="@/assets/images/resimg/public.png"
                   alt=""></i>
            <span slot="title">跨平台编辑器</span>
          </el-menu-item> -->
          <!-- <el-menu-item index="newscloud"> 5月28日安豪说干掉
            <i><img src="@/assets/images/resimg/user.png"
                   alt=""></i>
            <span slot="title">检察新闻云</span>
          </el-menu-item> -->
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
      activeIndex: 'Assessment',
      openeds: ['1']
    }
  },
  methods: {
    handle (key, keyPath) {
      switch (key) {
        case 'manage':
          this.$router.push({ name: 'ManageMatrix' })
          break
        case 'editor':
          this.$router.push({ name: 'CrossEditor' })
          this.activeIndex = 'editor'
          break
        case 'newscloud':
          this.$router.push({ name: 'NewsCloudWx' })
          break
      }
    }
  },
  created () {
    let routePteh = this.$route.path.split('/')[2]
    this.activeIndex = routePteh
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
