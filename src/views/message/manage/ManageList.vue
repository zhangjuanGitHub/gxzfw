<!--
 * @Author: MaiChao
 * @Date: 2020-03-30 14:08:08
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-08 09:36:50
-->
<template>
  <div class="container assessment">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ManageMatrix' }">新媒体矩阵</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="assessment-box">
      <v-menu></v-menu>
      <div class="manage-cont">
        <div class="tabs-card">
          <div class="card-name">
            <router-link :to="{name:'ManageMatrix'}">
              <img :src="require('@/assets/images/manage/midsa.png')">
              <span>矩阵管理</span>
            </router-link>
          </div>
          <!-- <div class="card-name">
            <router-link :to="{name:'ManageAddAccount'}">
              <img :src="require('@/assets/images/manage/account.png')">
              <span>授权账号管理</span>
            </router-link>
          </div> -->
        </div>
        <v-matrix></v-matrix>
        <!--          <div v-else class="text-center no-permission">-->
        <!--            <img :src="require('@/assets/images/error-page/noPermission.png')" alt="">-->
        <!--            <p>很抱歉，您没有访问此页面的权限</p>-->
        <!--          </div>-->
      </div>
    </div>
  </div>
</template>
<script>
import vMenu from '@/views/message/components/sidebar'
import vMatrix from '@/views/message/manage/Matrix'
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
    handleClick (activeName) {
      this.$router.push({ name: activeName })
    },
    setActive () {
      this.activeName = this.$route.path.split('/')[3]
      if (this.activeName === 'matrix') {
        this.activeName = 'ManageMatrix'
      } else {
        this.activeName = 'ManageAccountList'
      }
    }
  },
  created () {
    this.setActive()
  },
  components: {
    vMenu,
    vMatrix
  },
  watch: {
    '$route' () {
      this.setActive()
    }
  }
}
</script>
<style lang="scss">
@import "@/views/message/resour";
</style>
<style lang="scss" scoped>
.assessment-box {
  overflow: hidden;
}
.assessment-span {
  display: flex;
  align-items: center;
}
.assessment-span img {
  margin-right: 5px;
}
</style>
