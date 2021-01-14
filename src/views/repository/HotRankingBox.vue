<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Inspect' }">热点新闻</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Ranking' }">热点排行</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col
        :xs="3"
        :sm="3"
        :md="3"
        :lg="4"
        :xl="4">
        <v-menu></v-menu>
      </el-col>
      <el-col
        :xs="21"
        :sm="21"
        :md="21"
        :lg="20"
        :xl="20">
        <div class="new-media-header">
            <div class="tabs-card">
              <div class="card-name">
                <router-link :to="{name:'HotRankingWx'}">
                  <img :src="require('@/assets/images/manage/wx.png')">
                  <span>微信</span>
                </router-link>
              </div>
              <div class="card-name">
                <router-link :to="{name:'HotRankingWb'}">
                  <img :src="require('@/assets/images/manage/wb.png')">
                  <span>微博</span>
                </router-link>
              </div>
              <div class="card-name">
                <router-link :to="{name:'HotRankingTout'}">
                  <img :src="require('@/assets/images/manage/tt.png')">
                  <span>今日头条</span>
                </router-link>
              </div>
            </div>
            <router-view></router-view>
          </div>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import vMenu from '@/views/repository/components/Menu'
export default {
  data () {
    return {
    }
  },
  methods: {},
  created () {
  },
  components: {
    vMenu
  }
}
</script>
<style lang="scss">
  @import "repository";
</style>
<style scoped>
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
.new-media-header {
    border: 1px solid #e4e7ed;
  }
</style>
