<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: getRouteName }">{{getRouteTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
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
          <div class="test-box">
          </div>
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
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  components: {
    vMenu
  },
  created () {
  },
  computed: {
    getRouteTitle () {
      return this.$route.meta.title
    },
    getRouteName () {
      return this.$route.name
    }
  }
}
</script>
<style lang="scss">
  @import "system";
</style>
<style lang="scss" scoped>
  .admin-img-box img {
    width: 18px;
    height: 18px;
    margin-right: 10px;
  }
</style>
