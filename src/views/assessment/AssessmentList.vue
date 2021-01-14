<template>
  <div class="container assessment">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
<!--        <el-breadcrumb-item :to="{ name: 'AssessmentTotal' }">人员信息管理</el-breadcrumb-item>-->
        <el-breadcrumb-item :to="{ name: 'AssessmentAccountList' }">新媒体账号管理</el-breadcrumb-item>
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
                :xl="20">
          <el-tabs type="border-card"
                   v-model="activeName"
                   @tab-click="handleClick(activeName)">
            <!-- <el-tab-pane name="AccountMatrix">
              <span class="assessment-span"
                    slot="label"><img :src="require('@/assets/images/manage/midsa.png')">矩阵管理</span>
            </el-tab-pane> -->
            <el-tab-pane name="AssessmentAccountList">
              <span class="assessment-span"
                    slot="label"><img :src="require('@/assets/images/manage/account.png')">账号管理</span>
            </el-tab-pane>
            <router-view></router-view>
          </el-tabs>
          <!--          <div v-else class="text-center no-permission">-->
          <!--            <img :src="require('@/assets/images/error-page/noPermission.png')" alt="">-->
          <!--            <p>很抱歉，您没有访问此页面的权限</p>-->
          <!--          </div>-->
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
      activeName: 'AccountMatrix',
      headerCard: [
      ]
    }
  },
  methods: {
    handleClick (activeName) {
      this.$router.push({ name: activeName })
    },
    setActive () {
      this.activeName = 'AssessmentAccountList'
      // this.activeName = this.$route.path.split('/')[3]
      // if (this.activeName === 'matrix') {
      //   this.activeName = 'AccountMatrix'
      // } else {
      //   this.activeName = 'AssessmentAccountList'
      // }
    }
  },
  created () {
    this.setActive()
  },
  components: {
    vMenu
  },
  watch: {
    '$route' () {
      this.setActive()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./assessment";
</style>
<style lang="scss">
.assessment-span {
  display: flex;
  align-items: center;
}
.assessment-span img {
  margin-right: 5px;
}
</style>
