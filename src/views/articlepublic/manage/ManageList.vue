<!--
 * @Author: MaiChao
 * @Date: 2020-08-27 09:56:05
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-11-12 09:48:30
-->
<template>
  <div class="right-conten">
    <div class="sperad-conten article-conten">
      <div class="tab-head dis-flex pad020">
        <div class="page-title">
          稿件发布
        </div>
        <div class="tab-right dis-flex">
          <span>当前所在位置:</span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name:'LocalArticleWx'}">稿件发布</el-breadcrumb-item>
            <el-breadcrumb-item>新媒体矩阵管理</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="sperad-data pad20">
        <!-- <div class="tabs-card">
          <div class="card-name"
               :class="{ 'is-active': activeName==='ManageMatrix'}"
               @click="getData('ManageMatrix')">
            <img :src="require('@/assets/image/manage/midsa.png')">
            <span>矩阵管理</span>
          </div>
          <div class="card-name"
               :class="{ 'is-active': activeName==='ManageAddAccount'}"
               @click="getData('ManageAddAccount')">
            <img :src="require('@/assets/image/manage/account.png')">
              <span>授权账号管理</span>
          </div>
        </div> -->
        <v-matrix></v-matrix>
      </div>
    </div>
  </div>
</template>
<script>
import vMatrix from '@/views/articlepublic/manage/Matrix'
export default {
  name: 'Assessment',
  data () {
    return {
      activeName: 'ManageMatrix',
      headerCard: [
      ]
    }
  },
  methods: {
    getData (activeName) {
      this.$router.push({ name: activeName })
    }
  },
  created () {
  },
  components: {
    vMatrix
  },
  watch: {
  }
}
</script>
<style scoped>
.tabs-card .is-active {
    color: #fff;
    background-color: #00afff;
    border-bottom-color: transparent;
}
</style>
