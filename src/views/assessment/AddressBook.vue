<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'AssessmentTotal' }">管理与考核</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'AssessmentWx' }">人员通讯录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="assessment-book">
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
import vMenu from '@/views/assessment/components/Menu'
export default {
  name: 'AddressBook',
  data () {
    return {}
  },
  methods: {},
  created () { },
  components: {
    vMenu
  }
}
</script>
<style scope>
</style>
