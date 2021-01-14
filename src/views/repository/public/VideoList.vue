<template>
  <div class="assessment container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'publicImage' }">媒体素材库</el-breadcrumb-item>
          <el-breadcrumb-item>公共图像资料库</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :xs="3"
              :sm="3"
              :md="3"
              :lg="4"
              :xl="4">
        <v-menu></v-menu>
      </el-col>
      <el-col :xs="21"
              :sm="21"
              :md="21"
              :lg="20"
              :xl="20"
              class="cont-box"
              style="padding-left: 0px; padding-right: 0px;">
        <div class="AssessHead">
          <div class="tabs-card">
            <div class="card-name">
              <router-link :to="{name:'publicImage'}">
                <img :src="require('@/assets/images/resimg/photo.png')"
                    alt="">
                <span>图片库</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{name:'publicVideo'}">
                <img :src="require('@/assets/images/resimg/video.png')"
                    alt="">
                <span>视频库</span>
              </router-link>
            </div>
          </div>
          <template>
            <videobox v-loading="loading"></videobox>
          </template>
          <!-- <div v-else
              class="text-center no-permission">
            <img :src="require('@/assets/images/error-page/noPermission.png')"
                alt="">
            <p>很抱歉，您没有访问此页面的权限</p>
          </div> -->
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import vMenu from '@/views/repository/components/Menu'
import Videobox from '@/views/repository/components/PublicVideobox'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Issue',
  data () {
    return {
      activeName: 'publicVideo'
    }
  },
  methods: {
    handleClick (item) {
      this.$router.push({ name: item })
    }
  },
  created () { },
  components: {
    vMenu,
    Videobox
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>
<style lang="scss">
@import "../resour";
</style>
<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.assessment .el-col {
  box-sizing: border-box;
}
.assessment .el-menu-item.is-active::before {
  content: "";
  margin-left: -20px;
  float: left;
  width: 5px;
  height: 56px;
  background-color: #3875f0;
}
.assessment {
  margin: 0 auto;
  position: relative;
  min-height: calc(120vh - 60px);
  overflow: hidden;
}
.assessment .el-menu-item {
  background-color: #feffff;
  margin-bottom: 2px;
}
.assessment .el-menu-item:last-child {
  margin-top: 15px;
}
.assessment .el-menu-item i {
  margin-right: 13px;
}
.AssessHead {
  width: 1104px;
  float: right;
  min-height: 500px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.AssessHead .el-tabs--border-card .is-top {
  border: none;
  background-color: #f5f5f5;
}
.AssessHead .is-top span i {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 10px;
}
.AssessHead .is-top span img {
  width: 18px;
  height: 15px;
}
.AssessHead .el-tabs--border-card .el-tabs__header .is-active {
  background-color: #f5f5f5;
  border-bottom: 2px solid #3875f0;
}
.AssessHead .el-tabs--border-card .el-tabs__header .el-tabs__item {
  border-top: none;
  border-left: none;
  border-right: none;
}
.AssessHead .el-tabs__item {
  padding: 0 13px;
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
