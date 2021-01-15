<template>
  <div class="table-box">
    <h2>素材列表</h2>
    <div class="table-search online-reviews-search">
      <el-form ref="params"
               :model="params"
               inline="inline"
               label-position="left">
        <el-form-item label="关键字:"
                      prop="keyword">
          <el-input size="small"
                    v-model="params.keyword"
                    placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small"
                     type="primary"
                     @click="tableSarch('params')">筛选</el-button>
          <el-button size="small"
                     @click="resetTable('params')">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button size="small"
                   type="primary"
                   @click="downTemp">下载模板</el-button>
        <el-button size="small"
                   type="info"
                   @click="importTable">批量导入</el-button>
        <el-button size="small"
                   type="danger"
                   @click="batchDelete">批量删除</el-button>
      </div>
    </div>
    <div class="tableList">
      <div class="matrix-table">
        <el-table :data="tableList"
                  border
                  ref="clearSelect"
                  @selection-change="handleSelectionChange"
                  style="width: 100%">
          <el-table-column type="selection"
                           width="30">
          </el-table-column>
          <el-table-column prop="createDate"
                           label="创建日期"
                           width="230">
          </el-table-column>
          <el-table-column prop="materialContent"
                           label="素材内容"
                           width="320"
                           show-overflow-tooltip>
          </el-table-column>
          <el-table-column prop="application"
                           label="适用场景"
                           width="320">
          </el-table-column>
          <el-table-column prop="totime"
                           width="150"
                           label="操作">
            <template slot-scope="scope">
              <el-button type="primary"
                         size="small"
                         @click="editItem(scope.row, scope.$index)">修改</el-button>
              <el-button type="danger"
                         size="small"
                         @click="deleteMaterial(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
    <delete-admin
      :deleteAdminDia="deleteAdminDia"
      @deleteAdminsDiaClose="deleteAdminsDiaClose"
      @confirmDeleteDia="confirmDeleteDia"
    >
    </delete-admin>
    <el-dialog
      title="编辑"
      :visible.sync="editDia"
      width="30%"
      :modal-append-to-body="false"
      @close="closeEdit"
    >
      <el-form
        :model="edit"
        label-width="100px"
        ref="ruleForm"
        :rules="rules"
      >
        <el-form-item label="素材内容:" prop="materialContent">
          <el-input v-model="edit.materialContent"></el-input>
        </el-form-item>
        <el-form-item label="适用情景:" prop="application">
          <el-input v-model="edit.application"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEdit">取 消</el-button>
        <el-button type="primary" @click="confirmEdit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
    <down-temp :downTempDia="downTempDia"
               :importApi="'importMaterial'"
               @confirmImport="confirmImport"
               @closeImport="closeImport">
    </down-temp>
  </div>
</template>

<script>
import DeleteAdmin from '../components/DeleteAdmin'
import { forEachMoreDelete } from '@/libs/tools'
import DownTemp from './DownTemp'
export default {
  name: 'MaterialList',
  props: ['ruleForm'],
  data () {
    return {
      rules: {
        materialContent: [
          { required: true, message: '请输入素材内容', trigger: 'blur' }
        ],
        application: [
          { required: true, message: '请输入适用情景', trigger: 'blur' }
        ]
      },
      edit: {}, // 编辑信息
      editDia: false, // 编辑弹框
      deleteList: [], // 批量删
      deleteAdminDia: false, // 删除弹框
      dataLess: false,
      tableList: [],
      params: {
        level: this.ruleForm.level,
        keyword: '',
        pageNum: 1,
        pageSize: 32,
        sortDirection: '',
        sortField: ''
      },
      downTempDia: false,
      token: this.$store.state.user.token
    }
  },
  computed: {
    ranDom: {
      get () {
        return this.ruleForm.ranDom
      }
    }
  },
  methods: {
    // 确认导入
    confirmImport () {
      this.downTempDia = false
      this.tableList = []
      this.getTableList()
    },
    closeImport () {
      this.downTempDia = false
    },
    downTemp () {
      // getMaterial
      window.location.href = `${this.$api.getMaterial}?authCode=${this.token}`
    },
    closeEdit () {
      this.editDia = false
    },
    // 确认编辑
    confirmEdit (ruleForm) {
      this.editDia = false
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$http.post(this.$api.updateMaterial, this.edit)
            .then(res => {
              this.$message.success('操作成功！')
              this.$set(this.tableList, this.edit.index, this.edit)
            })
            .catch(() => {})
        }
      })
    },
    // 编辑
    editItem (item, index) {
      this.editDia = true
      this.$http.post(this.$api.findOneMaterial, item.id)
        .then(res => {
          let datas = res.data.data
          this.edit = datas
          this.edit.index = index
        })
        .catch(() => {})
    },
    handleSelectionChange (change) {
      this.deleteList = change
    },
    // 取消删除
    deleteAdminsDiaClose () {
      this.deleteAdminDia = false
      this.deleteList = []
      this.$refs['clearSelect'].clearSelection()
    },
    // 确认删除
    confirmDeleteDia () {
      let arr = []
      for (let i = 0; i < this.deleteList.length; i++) {
        arr.push(this.deleteList[i].id)
      }
      this.$http.post(this.$api.delectMaterial, arr)
        .then(res => {
          forEachMoreDelete(arr, this.tableList)
          this.deleteList = []
          this.$message.success('操作成功！')
        })
        .catch(() => {})
      this.deleteAdminDia = false
    },
    // 单删
    deleteMaterial (item) {
      this.deleteList.push(item)
      this.deleteAdminDia = true
    },
    // 导入
    importTable () {
      this.downTempDia = true
    },
    // 批量删除
    batchDelete () {
      if (this.deleteList.length > 0) {
        this.deleteAdminDia = true
      } else {
        this.$message.warning('请勾选需要删除的数据！')
      }
    },
    // 重置
    resetTable (params) {
      this.$refs[params].resetFields()
      this.params.pageNum = 1
      this.tableList = []
      this.getTableList()
    },
    // 搜索
    tableSarch () {
      this.params.pageNum = 1
      this.tableList = []
      this.getTableList()
    },
    getData () {
      this.params.pageNum++
      this.getTableList()
    },
    getTableList () {
      this.dataLess = false
      this.$http.post(this.$api.findMaterial, this.params)
        .then(res => {
          let datas = res.data.data
          this.tableList.push(...datas)
          if (datas.length < 31) {
            this.dataLess = true
          }
        })
        .catch(() => {})
    }
  },
  created () {
    this.tableList = []
    this.getTableList()
  },
  components: {
    DeleteAdmin,
    DownTemp
  },
  watch: {
    ranDom (newValue, oldValue) {
      this.tableList = []
      this.getTableList()
      // this.tableList.unshift(this.ruleForm)
    }
  }
}
</script>

<style scoped>
  .Matrix h2 {
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 13px;
    border-left: 3px solid #2f9ff3;
    padding-left: 8px;
    margin-bottom: 17px;
    font-size: 16px;
  }
  .table-box {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #ccc;
  }
  .overflow-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .table-search {
    height: 40px;
    background-color: #eff1f4;
    border-radius: 10px;
    padding: 3px 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .matrix-table {
    margin-top: 18px;
  }
  .table-search .el-input {
    width: 220px;
  }
</style>
