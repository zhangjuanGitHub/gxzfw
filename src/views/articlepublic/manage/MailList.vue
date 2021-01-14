<!--
 * @Author: MaiChao
 * @Date: 2020-08-27 09:56:05
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-04 10:42:12
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
            <el-breadcrumb-item>人员通讯录</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="compose pad20">
        <div class="admin-binding-box dis-flex">
          <div class="admin-tree">
            <div class="admin-tree-title">
              <p><span class="admin-title-span">单位列表</span></p>
            </div>
            <div class="tree-box">
              <el-tree :data="treeData"
                       :props="defaultProps"
                       node-key="value"
                       :default-expanded-keys="[1]"
                       :expand-on-click-node="false"
                       @node-click="handleNodeClick"></el-tree>
            </div>
          </div>
          <div class="admin-table">
            <div class="admin-table-box">
              <el-table ref="multipleTable"
                        :data="tableList"
                        border
                        max-height="650px"
                        style="width:100%">
                <el-table-column label="姓名"
                                 width="180"
                                 show-overflow-tooltip>
                  <template slot-scope="scope">{{ scope.row.userName }}</template>
                </el-table-column>
                <el-table-column prop="loginName"
                                 label="用户名称"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="departmentName"
                                 label="单位"
                                 width="200"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="roleName"
                                 label="角色"
                                 width="140"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column prop="userPhone"
                                 label="电话"
                                 width="180"
                                 show-overflow-tooltip>
                </el-table-column>
                <el-table-column label="创建时间"
                                 width="220">
                  <template slot-scope="scope">{{ scope.row.createTime }}</template>
                </el-table-column>
                <el-table-column prop="name"
                                 label="状态"
                                 width="130">
                  <template slot-scope="scope">
                    <div v-if="scope.row.inUse">启用</div>
                    <div v-else>停用</div>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                 width="130">
                  <template slot-scope="scope">
                    <div>
                      <div class="edit-click pointer text-click">
                        <i class="el-icon-edit-outline"></i>
                        <span @click="editInfo(scope.row)">发起沟通</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <pagination @pagingChange="getPagingChange"
                    :total="total"></pagination>
      </div>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/Pagination.vue'
export default {
  name: 'MailList',
  data () {
    return {
      total: 0,
      Addto: [],
      treeData: [], // 树形
      tableList: [], // 数据列表
      params: {
        pageNum: 1,
        pageSize: 20,
        departmentId: ''
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    handleNodeClick (data) {
      this.params.departmentId = data.value
      this.params.pageNum = 1
      this.tableList = []
      this.userList()
    },
    // 获取列表
    userList () {
      this.dataLess = false
      this.$http.post(this.$api.queryUserList, this.params)
        .then(res => {
          if (res.data.data.content.length) {
            let datas = res.data.data.content
            let newData = datas.filter(item => this.Addto.indexOf(item.id) === -1)
            this.tableList.push(...newData)
            this.total = res.data.data.totalElements
          }
        })
        .catch(() => {
        })
    },
    getPagingChange (change) {
      this.tableList = []
      this.params.pageNum = change.page
      this.params.pageSize = change.size
      this.userList()
    },
    // 获取已添加列表
    getAdd () {
      this.$http.get(this.$api.queryIsbinding)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.Addto = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 获取单位列表
    getDepartmentList () {
      this.$http.get(this.$api.queryDepartment)
        .then(res => {
          this.treeData = res.data.data
        })
        .catch(() => {
        })
    },
    editInfo (row) {
      this.$http.get(this.$api.getUserContact, { params: { id: row.id } })
        .then(res => {
          this.$router.push({ name: 'OnlineMessage', query: { id: row.id, name: row.userName, chatId: res.data.data.chatId } })
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.getDepartmentList()
    this.userList()
  },
  components: {
    pagination
  },
  watch: {
  }
}
</script>
<style scoped>
.admin-binding-box{
  justify-content: center;
}
.admin-tree {
  width: 10%;
  min-width: 230px;
  padding: 0 12px;
}
.admin-tree .el-tree {
  background-color: transparent;
}
.admin-tree-title p {
  color: #2f9ff3;
}
.admin-title-span {
  margin-left: 12px;
  font-size: 16px;
  line-height: 18px;
}
.admin-tree-title p::before {
  width: 4px;
  height: 16px;
  content: "";
  background: #309ade;
  position: absolute;
}
.tree-box {
  margin-top: 15px;
}
.admin-table {
  width: 90%;
  max-width: 1400px;
}
.admin-table-box {
  margin-top: 22px;
}
.admin-keyword {
  width: 150px;
}
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.admin-keyword {
  width: 150px;
}
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.margin-10 {
  margin: 5px 0;
}
.btn-box {
  margin-left: 20px;
}
</style>
