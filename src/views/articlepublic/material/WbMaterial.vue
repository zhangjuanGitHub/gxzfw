<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox'}">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{name:'LocalArticleWb'}">发布稿件</el-breadcrumb-item>
        <el-breadcrumb-item>微博发布</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <div class="page-title">
          稿件发布
        </div>
        <div class="tab-right dis-flex">
          <span>当前所在位置:</span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name:'LocalArticleWb'}">稿件发布</el-breadcrumb-item>
            <el-breadcrumb-item>微信发布</el-breadcrumb-item>
          </el-breadcrumb>
        </div> -->
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
                :xl="20" class="material">
          <div class="tabs-card">
            <div class="card-name"
                 :class="{ 'is-active': activeName==='LocalArticleWb'}"
                 @click="getData('LocalArticleWb')">
              <span>本地稿件</span>
            </div>
            <!-- <div class="card-name"
                 :class="{ 'is-active': activeName==='MaterialWblocal'}"
                 @click="getData('MaterialWb',0)">
              <span>本地素材库</span>
            </div>
            <div class="card-name"
                 :class="{ 'is-active': activeName==='MaterialWb'}"
                 @click="getData('MaterialWb',1)">
              <span>微博素材库</span>
            </div> -->
            <div class="card-name"
                 :class="{ 'is-active': activeName==='PublicRecordWb'}"
                 @click="getData('PublicRecordWb')">
              <span>发布记录</span>
            </div>
          </div>
          <div class="account-box warrant">
            <router-view></router-view>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import vMenu from '@/views/articlepublic/components/Menu'
export default {
  name: 'Account',
  data () {
    return {
      activeName: 'LocalArticleWb'
    }
  },
  components: {
    vMenu
  },
  methods: {
    getData (url, index) {
      if (index === 0) {
        this.$router.push({ name: url, query: { showLocal: true } })
        this.activeName = 'LocalArticleWb'
      } else if (index === 1) {
        this.$router.push({ name: url, query: { showLocal: false } })
        this.activeName = 'MaterialWb'
      } else {
        this.$router.push({ name: url })
        this.activeName = url
      }
    }
  },
  created () {
    if (this.$route.query.showLocal) {
      JSON.parse(this.$route.query.showLocal) ? this.activeName = 'MaterialWblocal' : this.activeName = 'MaterialWb'
    } else {
      this.activeName = this.$route.name
    }
  },
  watch: {
    $route (to, from) {
      if (this.$route.query.showLocal) {
        JSON.parse(this.$route.query.showLocal) ? this.activeName = 'MaterialWblocal' : this.activeName = 'MaterialWb'
      } else {
        this.activeName = this.$route.name
      }
    }
  }
}
</script>
<style scoped>
.account-box {
  background: #fff;
}
.account-list {
  display: flex;
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 20px 0 0 30px;
}
/*选项卡按钮*/
.card-name {
  outline: none;
  padding: 4px 20px;
  font-size: 14px;
  text-align: center;
  background: rgba(237, 248, 253, 1);
  border-radius: 2px;
  color: #333333;
  margin-right: 7px;
  cursor: pointer;
}
.tabs-card {
  display: flex;
  margin-bottom: 20px;
}
.tabs-card .is-active {
  color: #fff;
  background-color: #00afff;
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
.material{
  background-color: #fff;
  padding: 20px !important;
}

</style>
