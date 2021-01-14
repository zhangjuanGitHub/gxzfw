<template>
  <div >
    <div class="btn-box">
      <el-button size="medium"
                 type="primary"
                 @click="addbindings">添加绑定</el-button>
      <el-button class="delete"
                 size="medium"
                 type="danger"
                 @click="deleteRowList">批量删除</el-button>
    </div>
    <el-table ref="multipleTable"
              :data="tableData"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="30">
      </el-table-column>
      <el-table-column label="姓名"
                       width="162">
        <template slot-scope="scope">{{ scope.row.user_name }}</template>
      </el-table-column>
      <el-table-column prop="user_phone"
                       label="手机号"
                       width="190">
      </el-table-column>
      <el-table-column prop="department_name"
                       label="单位"
                       width="450"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="user_mail"
                       label="邮箱"
                       show-overflow-tooltip>
      </el-table-column>
    </el-table>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>

<script>
import vDiaing from '@/views/system/components/Diaing'
import ScrollData from '@/components/ScrollData'
export default {
  name: 'Directly',
  data () {
    return {
      dataLess: false, // 数据小于32
      params: {
        pageNum: 1,
        pageSize: 32,
        type: 5
      },
      tableData: [],
      dialogVisible: false,
      deleteItem: {}, // 需要删除的数据
      deleteSelection: [] // 选择删除的数据
    }
  },
  methods: {
    // 获取列表
    userList () {
      this.dataLess = false
      this.$http.post(this.$api.partmentList, this.params)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            this.tableData.push(...datas)
            if (datas.length < 20) {
              this.dataLess = true // 小于32
            }
          }
        })
        .catch(() => {
        })
    },
    // 勾选删除数据
    handleSelectionChange (change) {
      this.deleteSelection = change
    },
    // 弹出模态框
    deleteRow (index, row) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 批量删除
    deleteRowList () {
      if (this.deleteSelection.length >= 1) {
        this.dialogVisible = true
        this.deleteItem = this.deleteSelection
      } else {
        this.$message.warning('请至少选择一条需要删除的数据！')
      }
    },
    // 确认删除
    getConfirmDelete (item) {
      let id = []
      for (let i = 0; i < item.length; i++) {
        id.push(item[i].id)
      }
      let ids = id.join(',')
      this.$http.get(this.$api.partmenDelete, { params: { ids: ids } })
        .then(res => {
          if (res.data.code === 200) {
            item.forEach(item => {
              this.tableData.forEach((val, index) => {
                if (item.id === val.id) {
                  this.tableData.splice(index, 1)
                }
              })
            })
            this.$message.success('删除成功！')
          }
        })
        .catch(() => {
          this.$refs['multipleTable'].clearSelection()
        })
    },
    // 滚动加载
    getData () {
      this.params.pageNum++
      this.userList()
    },
    // 跳转添加绑定
    addbindings () {
      this.$router.push({ name: 'Binding5', query: { type: this.params.type } })
    }
  },
  created () {
    this.userList()
  },
  components: {
    vDiaing,
    ScrollData
  }
}
</script>

<style scoped>
.btn-box {
  margin-bottom: 20px;
}
</style>
