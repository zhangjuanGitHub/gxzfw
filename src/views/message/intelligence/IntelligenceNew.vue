<!--
 * @Author: MaiChao
 * @Date: 2020-03-30 14:08:08
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-09-01 15:16:45
-->
<template>
  <div class="intelligence-new">
    <!-- <el-tabs type="border-card"
             v-model="activeName"
             @tab-click="handleClick(activeName)">
      <el-tab-pane name="Major">
        <span class="assessment-span"
              slot="label">重大节日</span>
      </el-tab-pane>
    </el-tabs> -->
    <div class="tabs-card">
      <div class="card-name">
        <router-link :to="{name:'Major'}">
          <span class="assessment-span">重大节日</span>
        </router-link>
      </div>
      <div class="card-name">
        <router-link :to="{name:'History'}">
          <span class="assessment-span">历史上的今天</span>
        </router-link>
      </div>
      <!-- <div class="card-name">
        <router-link :to="{name:'History'}">
          <span class="assessment-span">重大节日</span>
        </router-link>
      </div> -->
    </div>
    <!-- <router-view></router-view> -->
  </div>
</template>
<script>
export default {
  name: 'IntelligenceNew',
  data () {
    return {
      activeName: 'History'
    }
  },
  created () {
    this.activeName = this.$route.name
  },
  methods: {
    handleClick (activeName) {
      this.$router.push({ name: activeName })
    }
  }
}
</script>
<style lang="scss">
@import '../message';
</style>
<style scoped>
.intelligence-new {
  padding: 0;
  box-sizing: border-box;
  min-height: 500px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.tabs-card {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}
.card-name a {
  display: inline-block;
  padding: 0 20px;
  height: 40px;
  border-right: 1px solid #e4e7ed;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.card-name .is-active {
  color: #2c8ae5;
  background-color: #fff;
  border-bottom-color: transparent;
}
.card-name img {
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -3px;
}
.card-name span {
  line-height: 33px;
}
</style>
