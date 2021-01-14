<template>
  <div class="container assessment">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
                <el-breadcrumb-item :to="{ name: 'AssessmentWx' }">管理与考核</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'AssessmentWx' }">新媒体工作量考核</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="assessment-box">
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
          <div class="tabs-card">
            <div class="card-name">
              <router-link :to="{name:'AssessmentWx'}">
                <img :src="require('@/assets/images/manage/wx.png')">
                <span>微信考核</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{name:'AssessmentWb'}">
                <img :src="require('@/assets/images/manage/wb.png')">
                <span>微博考核</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{name:'AssessmentToutiao'}">
                <img :src="require('@/assets/images/manage/tt.png')">
                <span>头条考核</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{name:'AssessmentWebsite'}">
                <img :src="require('@/assets/images/manage/wz.png')">
                <span>门户网站考核</span>
              </router-link>
            </div>
          </div>
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import vMenu from '@/views/assessment/components/Menu'
export default {
  name: 'Assessment',
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
    this.activeName = this.$route.name
  },
  components: {
    vMenu
  },
  watch: {
    '$route' () {
      this.activeName = this.$route.name
    }
  }
}
</script>

<style lang="scss">
@import "./assessment";
</style>
<style lang="scss" scoped>
.assessment-span {
  display: flex;
  align-items: center;
}
.assessment-span img {
  margin-right: 5px;
}
.cont-box {
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
