<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Inspect' }">热点新闻</el-breadcrumb-item>
        <el-breadcrumb-item>检察新媒体</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="hotnews-box">
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
                :xl="20">
          <div class="new-media-header">
            <div class="tabs-card">
              <div class="card-name">
                <router-link :to="{name:'NewMediaWx'}">
                  <img :src="require('@/assets/images/manage/wx.png')">
                  <span>微信</span>
                </router-link>
              </div>
              <div class="card-name">
                <router-link :to="{name:'NewMediaWb'}">
                  <img :src="require('@/assets/images/manage/wb.png')">
                  <span>微博</span>
                </router-link>
              </div>
              <div class="card-name">
                <router-link :to="{name:'NewMediaTout'}">
                  <img :src="require('@/assets/images/manage/tt.png')">
                  <span>今日头条</span>
                </router-link>
              </div>
              <div class="card-name">
                <router-link :to="{name:'NewMediaDouy'}">
                  <img :src="require('@/assets/images/dy.png')">
                  <span>抖音</span>
                </router-link>
              </div>
            </div>
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/repository/components/Menu'
export default {
  name: 'NewMedia',
  data () {
    return {
      activeName: ''
    }
  },
  methods: {
    handleClick (change, event) {
      this.$router.push({ name: change.name })
    }
  },
  created () {
    // var oMeta = document.createElement('meta')
    // oMeta.name = 'referrer'
    // oMeta.content = 'never'
    // document.getElementsByTagName('head')[0].appendChild(oMeta)
  },
  destroyed () {
  },
  components: {
    vMenu
  },
  computed: {
    getTabName: {
      get () {
        return this.$route.name
        // let getRouteName = this.$route.path.split('/')[3]
        // return 'NewMedia' + getRouteName.substring(0, 1).toUpperCase() + getRouteName.slice(1)
      },
      set () {
        this.getRouteName = ''
      }
    }
  },
  watch: {
  }
}
</script>

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
  .new-media {
    padding: 20px;
    min-height: 500px;
  }
  .new-media-header {
    border: 1px solid #e4e7ed;
  }
</style>
