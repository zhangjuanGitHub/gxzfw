<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemUser' }">用户管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemUserAddData' }">添加用户-可访问数据</el-breadcrumb-item>
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
          <div class="admin-form-box">
            <el-tabs v-model="tabActiveName"
                     @tab-click="handleClick">
              <el-tab-pane label="基本信息"
                           name="SystemUserAdd"></el-tab-pane>
              <!-- <el-tab-pane label="可访问数据"
                           name="SystemUserAddData"></el-tab-pane> -->
              <el-tab-pane label="修改密码"
                           name="SystemUserAddPass"></el-tab-pane>
            </el-tabs>
            <div class="tree-box">
              <el-tree :data="treeData"
                       ref="tree"
                       show-checkbox
                       node-key="id"
                       :default-checked-keys="checkedKey"
                       :props="defaultProps">
              </el-tree>
            </div>
            <div class="btn-box">
              <el-button type="primary"
                         @click="saveData">保存</el-button>
              <el-button @click="resetData">重置</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'UserAddData',
  data () {
    return {
      routerId: '',
      tabActiveName: 'SystemUserAddData',
      treeData: [],
      checkedKey: [], // 默认勾选
      defaultProps: {
        label: 'departmentName',
        children: 'childList'
      }
    }
  },
  methods: {
    saveData () {
      let treeKeys = this.$refs.tree.getCheckedKeys()
      if (treeKeys.length) {
        treeKeys = treeKeys.join(',')
      } else {
        this.$message.warning('请勾选可访问数据！')
        return false
      }
      let row = {
        id: this.routerId,
        dataDepartmentIds: treeKeys
      }
      this.$http.post(this.$api.saveDataDepartmentIds, row)
        .then(res => {
          this.$message.success('操作成功！')
          this.$router.replace({ name: 'SystemUser' })
        })
        .catch(() => { })
    },
    resetData () {
      this.$refs.tree.setCheckedKeys([])
    },
    handleClick (tab) {
      this.$router.push({ name: tab.name, query: { id: this.routerId } })
    },
    getListLevelOfUser () {
      this.$http.get(this.$api.listLevelOfUser)
        .then(res => {
          this.treeData = res.data.data
        })
        .catch(() => { })
    },
    getTreeCheockList () {
      this.$http.get(`${this.$api.getDataDepartmentIds}?id=${this.routerId}`)
        .then(res => {
          this.checkedKey = res.data.data.split(',')
        })
        .catch(() => { })
    }
  },
  created () {
    this.routerId = this.$route.query.id
    this.getListLevelOfUser()
    this.getTreeCheockList()
  },
  components: {
    vMenu
  }
}
</script>
<style lang="scss">
@import "system";
</style>
<style scoped>
.btn-box {
  margin-top: 30px;
  margin-left: 25px;
}
.admin-form-box {
  padding: 10px 20px;
}
</style>
