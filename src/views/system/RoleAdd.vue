<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemRole' }">角色管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemRoleAdd' }">添加角色</el-breadcrumb-item>
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
          <div class="admin-role-box">
            <div class="admin-role-name">
              <p class="role-p">
                <span>角色名称</span>
              </p>
              <el-input class="role-name-input"
                        size="small"
                        placeholder="请输入角色名称"
                        v-model="roleName"></el-input>
            </div>
            <div class="admin-role-name">
              <p class="role-p">
                <span>APP角色</span>
              </p>
              <el-select v-model="roleType" size="small" class="role-name-input" clearable placeholder="请选择APP角色">
                <el-option label="审核员" value="1">审核员</el-option>
                <el-option label="发布员" value="2">发布员</el-option>
                <el-option label="舆情员" value="3">舆情员</el-option>
                <el-option label="普通用户" value="4">普通用户</el-option>
              </el-select>
            </div>
            <!--    <div class="admin-role-name">-->
            <!--      <p class="role-p">-->
            <!--        <span>是否公开</span>-->
            <!--      </p>-->
            <!--      <el-radio-group v-model="isPublic"-->
            <!--                      class="role-name-input">-->
            <!--        <el-radio :label="true">是</el-radio>-->
            <!--        <el-radio :label="false">否</el-radio>-->
            <!--      </el-radio-group>-->
            <!--    </div>-->
            <div class="role-table-box">
              <p class="role-p">
                <span>权限管理</span>
              </p>
              <div class="tree-box">
                <el-tree :data="treeData"
                         ref="tree"
                         show-checkbox
                         node-key="id"
                         :default-checked-keys="checkedKey"
                         :props="defaultProps">
                </el-tree>
              </div>
              <!--              <el-table class="admin-role-table"-->
              <!--                        ref="multipleTable"-->
              <!--                        :data="tableData"-->
              <!--                        row-key="id"-->
              <!--                        :header-cell-style="getRowClass"-->
              <!--                        :row-class-name="tableRowClassName"-->
              <!--                        border-->
              <!--                        style="width: 100%">-->
              <!--                <el-table-column prop="name"-->
              <!--                                 label="导航名称"-->
              <!--                                 width="228">-->
              <!--                </el-table-column>-->
              <!--                <el-table-column label="权限管理"-->
              <!--                                 width="765">-->
              <!--                  <template slot-scope="scope">-->
              <!--                    &lt;!&ndash;                    {{scope.row}}&ndash;&gt;-->
              <!--                    <el-checkbox-group @change="handleCheckedCitiesChange(scope.row)"-->
              <!--                                       v-model="scope.row.selectList">-->
              <!--                      <el-checkbox v-for="(item) of scope.row.checkboxList"-->
              <!--                                   :key="item.label"-->
              <!--                                   :label="item.label">{{item.name}}</el-checkbox>-->
              <!--                    </el-checkbox-group>-->
              <!--                  </template>-->
              <!--                </el-table-column>-->
              <!--                <el-table-column label="全选"-->
              <!--                                 width="92">-->
              <!--                  <template slot-scope="scope">-->
              <!--                    <el-checkbox v-model="scope.row.checkAll"-->
              <!--                                 @change="handleCheckAllChange(scope.row)"></el-checkbox>-->
              <!--                  </template>-->
              <!--                </el-table-column>-->
              <!--              </el-table>-->
              <div class="admin-role-btn">
                <el-button type="primary"
                           @click="debouncedGetAnswer">保存</el-button>
                <el-button type="info"
                           @click="reset">重置</el-button>
                <el-button class="back-btn"
                           @click="back">返回</el-button>
              </div>
            </div>
          </div>
          <!-- <no-permission v-else></no-permission> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'RoleAdd',
  data () {
    return {
      isPublic: true, // 是否公开
      routeId: '',
      treeData: [], // 权限列表
      checkedKey: [1], // 回显已勾选权限
      defaultProps: {
        children: 'child'
      },
      getSelectList: [],
      roleName: '', // 角色名称
      roleType: '4', // APP角色
      tableData: [
        {
          id: 1,
          name: '中央信息厨房',
          checkboxList: [{ label: 1, name: '显示' }],
          selectList: [],
          checkAll: false,
          children: [{
            id: 11,
            name: '王小虎',
            checkboxList: [
              { label: 11, name: '显示' },
              { label: 12, name: '查看' },
              { label: 13, name: '投稿' },
              { label: 14, name: '编辑' }
            ],
            selectList: [],
            checkAll: false
          }, {
            id: 12,
            name: '王小虎',
            checkboxList: [
              { label: 111, name: '显示' },
              { label: 112, name: '查看' },
              { label: 113, name: '投稿' },
              { label: 114, name: '编辑' }
            ],
            selectList: [],
            checkAll: false
          }]
        }, {
          id: 2,
          name: '大数据中心',
          checkboxList: [{ label: 1, name: '显示' }],
          selectList: [],
          checkAll: false,
          children: [{
            id: 31,
            name: '王小虎',
            checkboxList: [
              { label: 21, name: '显示' },
              { label: 22, name: '测试' },
              { label: 23, name: '测试' },
              { label: 24, name: '测试' }
            ],
            selectList: [],
            checkAll: false
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            checkboxList: [{ label: 13, name: '显示' }],
            selectList: [],
            checkAll: false
          }]
        }, {
          id: 3,
          name: '图片池',
          checkboxList: [
            { label: 1, name: '显示' },
            { label: 2, name: '查看' },
            { label: 3, name: '下载' },
            { label: 4, name: '上传' }
          ],
          selectList: [],
          checkAll: false
        }, {
          id: 4,
          name: '视频池',
          checkboxList: [
            { label: 1, name: '显示' },
            { label: 2, name: '查看' },
            { label: 3, name: '下载' },
            { label: 4, name: '上传' }
          ],
          selectList: [],
          checkAll: false
        }
      ]
    }
  },
  methods: {
    back () {
      this.$router.push({ name: 'SystemRole', query: { page: '1', size: '32' } })
    },
    // 重置
    reset () {
      this.roleName = ''
      this.$refs.tree.setCheckedKeys([])
    },
    // 获取权限列表
    getTreeData (resolve, reject) {
      this.$http.get(this.$api.functionList)
        .then(res => {
          if (res.data.data) {
            this.treeData = res.data.data
            // this.treeData.forEach(item => {
            //   if (item.id === 1 && item.child) {
            //     item.disabled = true
            //   }
            //   item.child.forEach(val => {
            //     if (val.id === 103 || val.id === 104) {
            //       val.disabled = true
            //     }
            //   })
            // })
            resolve()
          }
        })
        .catch(() => {
          reject()
        })
    },
    // 选择
    handleCheckedCitiesChange (row) {
      let checkBoxListLength = row.checkboxList.length
      if (row.selectList.length === checkBoxListLength) {
        row.checkAll = true
      } else {
        row.checkAll = false
      }
    },
    // 全选
    handleCheckAllChange (row) {
      if (row.checkAll) {
        let arr = []
        row.checkboxList.forEach(item => {
          arr.push(item.label)
          row.selectList = [...arr]
        })
      } else {
        row.selectList = []
      }
    },
    // 提交
    getTableRow () {
      // 获取子节点和半选状态下的父节点
      let auth = this.$refs.tree.getCheckedKeys().concat(this.$refs.tree.getHalfCheckedKeys())
      if (!this.roleName) {
        this.$message.warning('请输入角色名称！')
        return false
      }
      if (!this.roleType) {
        this.$message.warning('请选择APP角色！')
        return false
      }
      if (!auth.length) {
        this.$message.warning('请勾选权限！')
        return false
      }
      let row = {
        roleName: this.roleName,
        roleType: this.roleType,
        functionIdArr: auth,
        id: this.routeId,
        isPublic: this.isPublic
      }
      // 有id是编辑，没有则是添加
      let apiName = this.routeId ? 'roleUpdate' : 'saveRole'
      this.$http.post(this.$api[apiName], row)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功！')
            this.$router.push({ name: 'SystemRole' })
          }
        })
        .catch(() => { })
    },
    isEdit () {
      if (this.$route.query.id) {
        this.routeId = this.$route.query.id
        this.$http.get(`${this.$api.getRoleDetails}?id=${this.routeId}`)
          .then(res => {
            let datas = res.data.data
            this.roleName = datas.roleName
            if (datas.roleType === null) {
              this.roleType = '4'
            } else {
              this.roleType = String(datas.roleType)
            }
            this.isPublic = datas.isPublic
            this.checkedKey = datas.functionIds.split(',')
          })
          .catch(() => { })
      }
    }
  },
  created () {
    new Promise(this.getTreeData).then(res => {
      return new Promise(this.isEdit)
    })
    this.debouncedGetAnswer = this.$debounce(this.getTableRow, 500)
  },
  components: {
    vMenu
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>

<style scoped>
.admin-role-box {
  padding: 0 12px;
}
.admin-role-name {
  margin-bottom: 30px;
  display: flex;
  align-items: center;
}
.admin-role-table {
  margin-top: 20px;
}
.admin-role-btn {
  padding-top: 70px;
}
.admin-btn {
  margin-bottom: 10px;
}
.admin-btn:last-child {
  margin-bottom: 0;
}
.role-p {
  font-size: 16px;
  color: #333333;
}
.role-p:before {
  content: "";
  width: 4px;
  height: 16px;
  background: #309ade;
  position: absolute;
}
.role-p span {
  margin-left: 12px;
}
.role-name-input {
  width: 280px;
  margin-left: 20px;
}
.tree-box {
  margin-top: 20px;
}
.tree-box .el-tree {
  background-color: #f5f5f5;
}
</style>
