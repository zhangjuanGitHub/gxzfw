<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>人员通讯录</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="user-book-box">
      <el-row :gutter="10">
        <el-col style="display: none"
                :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu></v-menu>
        </el-col>
        <el-col :xs="24"
                :sm="24"
                :md="24"
                :lg="24"
                :xl="24">
          <router-view></router-view>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/userset/components/BookMenu'
export default {
  name: 'Book',
  data () {
    return {
      tableData: []
    }
  },
  methods: {
  },
  created () {
  },
  components: {
    vMenu
  }
}
</script>

<style scoped>
</style>
