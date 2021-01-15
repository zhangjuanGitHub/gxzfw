<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">任务下发</el-breadcrumb-item>
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
                :xl="20"
        >
          <div class="reviews-search-box">
            <!-- 搜索栏 -->
            <div class="summary-seach online-reviews-search">
              <el-form :inline="true"
                       ref="ruleForm"
                       :model="ruleForm"
                       class="demo-form-inline">
                <el-form-item label="任务状态"
                              class="form-source"
                              prop="taskStatus">
                  <el-select v-model="ruleForm.taskStatus"
                             size="small"
                             @change="getSource"
                             placeholder="请选择状态">
                    <el-option :label="item.label"
                               :value="item.id"
                               v-for="(item, index) of listType"
                               :key="index"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="关键字"
                              class="form-keyword"
                              prop="keyword">
                  <el-input size="small"
                            v-model="ruleForm.keyword"
                            placeholder="请输入关键字"></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button size="small"
                             @click="searchList"
                             type="primary">筛选</el-button>
                  <el-button size="small"
                             @click="resetForm('ruleForm')">重置</el-button>
                </el-form-item>
                <el-form-item>
                  <el-button size="small"
                             type="primary"
                             @click="addIssued">添加</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div class="reviews-right-box">
              <div class="reviews-table">
                <div class="admin-table-box">
                  <el-table ref="multipleTable"
                            :data="tableList"
                            border
                            style="width: 100%">
                    <el-table-column label="任务名称"
                                     show-overflow-tooltip
                                     width="222">
                      <template slot-scope="scope">
                        <el-link class="color-text" @click="viewIssued(scope.row.id)">{{ scope.row.taskName }}</el-link>
                      </template>
                    </el-table-column>
                    <el-table-column label="任务状态"
                                     width="80"
                    >
                      <template slot-scope="scope">
                        <p :class="taskStatus.get(scope.row.taskStatus).color">{{taskStatus.get(scope.row.taskStatus).text}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column prop="userName"
                                     label="发布人"
                                     show-overflow-tooltip
                                     width="150">
                    </el-table-column>
                    <el-table-column prop="startDate"
                                     label="开始时间"
                                     width="150"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="endDate"
                                     label="结束时间"
                                     width="150"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="taskType"
                                     label="任务类型"
                                     width="90"
                                     show-overflow-tooltip>
                      <template slot-scope="scope">
                        <p class="color-primary" v-if="scope.row.taskType === 1">常规</p>
                        <p class="color-primary" v-else>紧急</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="人数"
                                     width="70"
                                     prop="peopleSum"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="150"
                    >
                      <template slot-scope="scope">
                        <div class="disflex">
                          <el-button size="small" @click="issuedTask(scope.row, scope.$index)" v-if="scope.row.taskStatus === 1">下发</el-button>
                          <el-button size="small" type="primary" @click="closeTask(scope.row, scope.$index)" v-if="scope.row.taskStatus === 2">审结</el-button>
                          <el-button size="small" type="danger" @click="deleteTask(scope.row.id)">删除</el-button>
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
        </el-col>
      </el-row>
    </div>
    <delete-task
      :deleteTaskDia="deleteTaskDia"
      @deleteTaskDiaClose="deleteTaskDiaClose"
      @confirmDeleteDia="confirmDeleteDia"
    >
    </delete-task>
    <issued-task
      :IssuedTaskDia="IssuedTaskDia"
      @issuedTaskDiaClose="issuedTaskDiaClose"
      @confirmIssuedDia="confirmIssuedDia"
    >
    </issued-task>
    <close-task
      :closeTaskDia="closeTaskDia"
      @taskDiaClose="taskDiaClose"
      @confirmCloseDia="confirmCloseDia"
    >
    </close-task>
  </div>
</template>

<script>
import vMenu from '@/views/reviews/components/Menu'
import DeleteTask from '../components/DeleteTask'
import IssuedTask from '../components/IssuedTask'
import CloseTask from '../components/CloseTask'
import { forEachSingleDelete } from '@/libs/tools'
const actions = new Map([
  [1, { text: '未下发', color: 'color-warning' }],
  [2, { text: '已下发', color: 'color-primary' }],
  [3, { text: '已审结', color: 'color-success' }],
  [4, { text: '已过期', color: 'color-danger' }]
])
export default {
  name: 'SystemLog',
  data () {
    return {
      deleteTaskId: '', // 需要删除的任务id
      issuedTaskInfo: {}, // 需要下发的任务
      closeTaskInfo: '', // 需要审结的任务id
      taskStatus: actions,
      deleteTaskDia: false, // 删除弹框
      IssuedTaskDia: false, // 下发弹框
      closeTaskDia: false, // 审结弹框
      dataLess: false,
      tableList: [],
      routeName: '',
      ruleForm: {
        pageNum: 1,
        pageSize: 32,
        keyword: '', // 关键词
        taskStatus: '', // 状态
        sortDirection: '',
        sortField: ''
      },
      listType: [
        {
          id: '',
          label: '全部'
        },
        {
          id: 1,
          label: '未下发'
        },
        {
          id: 2,
          label: '已下发'
        },
        {
          id: 3,
          label: '已审结'
        },
        {
          id: 4,
          label: '已过期'
        }
      ]
    }
  },
  methods: {
    // 取消下发
    issuedTaskDiaClose () {
      this.IssuedTaskDia = false
    },
    // 删除弹框取消
    deleteTaskDiaClose () {
      this.deleteTaskDia = false
    },
    // 取消审结
    taskDiaClose () {
      this.closeTaskDia = false
    },
    // 确认下发
    confirmIssuedDia () {
      this.IssuedTaskDia = false
      this.$http.get(`${this.$api.issuedTask}/${this.issuedTaskInfo.id}`)
        .then(res => {
          this.issuedTaskInfo.taskStatus = 2
          this.$message.success('操作成功！')
          this.$set(this.tableList, this.issuedTaskInfo.index, this.issuedTaskInfo)
        })
        .catch(() => {})
    },
    // 确认删除
    confirmDeleteDia () {
      this.deleteTaskDia = false
      this.$http.get(`${this.$api.delectTask}/${this.deleteTaskId}`)
        .then(res => {
          forEachSingleDelete(this.tableList, this.deleteTaskId)
          this.$message.success('操作成功！')
        })
        .catch(() => {})
    },
    // 确认审结
    confirmCloseDia () {
      this.closeTaskDia = false
      this.$http.get(`${this.$api.updateTask}/${this.closeTaskInfo.id}`)
        .then(res => {
          this.$message.success('操作成功！')
          this.closeTaskInfo.taskStatus = 3
          this.$set(this.tableList, this.closeTaskInfo.index, this.closeTaskInfo)
        })
        .catch(() => {})
    },
    // 下发任务
    issuedTask (item, index) {
      this.issuedTaskInfo = item
      this.issuedTaskInfo.index = index
      this.IssuedTaskDia = true
    },
    // 删除任务
    deleteTask (id) {
      this.deleteTaskId = id
      this.deleteTaskDia = true
    },
    // 审结任务
    closeTask (item, index) {
      this.closeTaskInfo = item
      this.closeTaskInfo.index = index
      this.closeTaskDia = true
    },
    // 查看任务
    viewIssued (id) {
      this.$router.push({ name: 'ReviewsIssuedView', query: { id: id } })
    },
    addIssued () {
      this.$router.push({ name: 'ReviewsIssuedAdd' })
    },
    getSource () {},
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.tableList = []
      this.ruleForm.pageNum = 1
      this.getFindTask()
    },
    getData () {
      this.ruleForm.pageNum++
      this.getFindTask()
    },
    // 获取时间
    getDateInfo () {
    },
    // 筛选
    searchList () {
      this.ruleForm.pageNum = 1
      this.tableList = []
      this.getFindTask()
    },
    // 获取列表
    getFindTask () {
      this.dataLess = false
      this.$http.post(this.$api.findTask, this.ruleForm)
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
    this.routeName = this.$route.name
    this.getFindTask()
  },
  components: {
    vMenu,
    DeleteTask,
    IssuedTask,
    CloseTask
  }
}
</script>
<style scoped>
.admin-table-box {
  margin-top: 22px;
}
.reviews-search-box {
  background: #fff;
  padding: 12px 15px 30px;
}
.summary-seach {
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 15px;
}
.color-text {
  color: #409eff;
}
</style>
