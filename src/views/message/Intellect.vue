<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'IntelligenceEditor' }">智能编辑</el-breadcrumb-item>
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
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/message/components/Menu'
export default {
  name: 'Intellect',
  data () {
    return {
    }
  },
  methods: {
  },
  created () {
  },
  watch: {},
  components: {
    vMenu
  }
}
</script>

<style scoped>
</style>
