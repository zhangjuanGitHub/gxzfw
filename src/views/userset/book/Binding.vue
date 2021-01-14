<template>
  <div>
    <div class="admin-binding-box">
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
                    style="width: 100%">
            <el-table-column label="姓名"
                             width="100"
                             show-overflow-tooltip>
              <template slot-scope="scope">{{ scope.row.userName }}</template>
            </el-table-column>
            <el-table-column prop="loginName"
                             label="用户名称"
                             width="140"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="departmentName"
                             label="单位"
                             width="200"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="roleName"
                             label="角色"
                             width="100"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="userPhone"
                             label="电话"
                             width="140"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="创建时间"
                             width="180">
              <template slot-scope="scope">{{ scope.row.createTime }}</template>
            </el-table-column>
            <el-table-column prop="name"
                             label="状态"
                             width="82">
              <template slot-scope="scope">
                <div v-if="scope.row.inUse">启用</div>
                <div v-else>停用</div>
              </template>
            </el-table-column>
            <el-table-column label="操作"
                             width="127">
              <template slot-scope="scope">
                <div>
                  <div class="edit-click">
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
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>

<script>
import { mapGetters } from 'vuex'
import ScrollData from '@/components/ScrollData'
export default {
  name: 'SystemUser',
  data () {
    return {
      dataLess: false, // 数据小于32
      dialogVisible: false,
      deleteItem: {}, // 需要删除的数据
      deleteSelection: [], // 选择删除的数据
      total: '',
      Addto: [],
      treeData: [], // 树形
      tableList: [], // 数据列表
      routeName: '',
      keyword: '',
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
    // 滚动加载
    getData () {
      this.params.pageNum++
      this.userList()
    },
    // 获取列表
    userList () {
      this.dataLess = false
      this.$http.post(this.$api.queryUserList, this.params)
        .then(res => {
          let datas = res.data.data.content
          if (datas.length) {
            let newData = datas.filter(item => this.Addto.indexOf(item.id) === -1)
            this.tableList.push(...newData)
            this.total = res.data.data.totalElements
            if (datas.length < 20) {
              this.dataLess = true // 小于32
            }
          }
        })
        .catch(() => {
        })
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
          if (res.data.data && res.data.code === 200) {
            this.treeData = res.data.data
          }
        })
        .catch(() => {
        })
    },
    editInfo (row) {
      this.$http.get(this.$api.getUserContact, { params: { id: row.id } })
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.$router.push({ name: 'Station', query: { id: row.id, name: row.userName, chatId: res.data.data.chatId } })
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.routeName = this.$route.name
    this.getDepartmentList()
    this.userList()
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    ScrollData
  }
}
</script>
<style lang="scss">
@import "../userset.scss";
</style>
<style scoped>
.admin-binding-box {
  display: flex;
  min-height: 400px;
}
.admin-tree {
  width: 220px;
  border-left: 1px solid #dbdbdb;
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
  flex: 1;
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
