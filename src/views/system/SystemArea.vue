<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemLog' }">地区管理</el-breadcrumb-item>
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
          <div>
            <div class="admin-right-box">
              <div class="admin-area-add">
                <el-button type="primary" @click="addArea">在顶级添加</el-button>
              </div>
              <div class="area-tree">
                <el-tree
                  :data="data"
                  show-checkbox
                  node-key="id"
                  default-expand-all
                  :expand-on-click-node="false">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>{{ node.label }}</span>
                    <span class="tree-span-box">
                      <el-button
                        type="text"
                        size="mini"
                        @click="() => append(data)">
                        添加
                      </el-button>
                      <el-button
                        type="text"
                        size="mini"
                        @click="() => remove(node, data)">
                          删除
                      </el-button>
                    </span>
                  </span>
                </el-tree>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="添加地区" :visible.sync="dialogFormVisible" :modal-append-to-body="false">
      <el-form
        :model="ruleForm"
        label-width="100px"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="活动名称" prop="areaName">
          <el-input v-model="ruleForm.areaName" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDia('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="confirmDia('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="删除操作" :visible.sync="deleteDia" :modal-append-to-body="false"></el-dialog>
  </div>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
let id = 1000
export default {
  data () {
    const data = [{
      id: 1,
      label: '一级 1',
      visible: false,
      children: [{
        id: 4,
        visible: false,
        label: '二级 1-1',
        children: [{
          id: 9,
          visible: false,
          label: '三级 1-1-1'
        }, {
          id: 10,
          visible: false,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      visible: false,
      label: '一级 2',
      children: [{
        id: 5,
        visible: false,
        label: '二级 2-1'
      }]
    }, {
      id: 3,
      visible: false,
      label: '一级 3'
    }]
    return {
      data: JSON.parse(JSON.stringify(data)),
      tableList: [],
      routeName: '',
      ruleForm: {
        areaName: ''
      },
      deleteDia: false,
      dialogFormVisible: false,
      rules: {
        areaName: [
          { required: true, message: '请输入地区', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    addArea () {
      this.dialogFormVisible = true
    },
    closeDia (ruleForm) {
      this.dialogFormVisible = false
      this.$refs[ruleForm].resetFields()
    },
    confirmDia () {
      let json = {
        id: id++,
        label: '首部添加',
        children: []
      }
      this.data.unshift(json)
      this.dialogFormVisible = false
    },
    append (data) {
      const newChild = { id: id++, label: 'testtest', children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove (node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    }
  },
  created () {
    this.routeName = this.$route.name
  },
  components: {
    vMenu
  }
}
</script>
<style scoped>
  .admin-right-box {
    padding: 0 12px;
    min-height: 400px;
  }
  .admin-area-add {
    margin-bottom: 20px;
  }
  .area-tree .el-tree{
    padding: 10px 0;
  }
  .tree-span-box {
    margin-left: 10px;
  }
</style>
