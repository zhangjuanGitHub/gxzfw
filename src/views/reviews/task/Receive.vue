<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsReceive' }">执行任务</el-breadcrumb-item>
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
          <div class="reviews-search-box">
            <!-- 搜索栏 -->
            <div class="summary-seach online-reviews-search">
              <el-form :inline="true"
                       ref="ruleForm"
                       :model="ruleForm"
                       class="demo-form-inline">
                <el-form-item label="办理状态"
                              class="form-source"
                              prop="executeStatus">
                  <el-select v-model="ruleForm.executeStatus"
                             size="small"
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
                                     width="320">
                      <template slot-scope="scope">
                        <el-link class="color-text" @click="viewIssued(scope.row.id)">{{ scope.row.task_name }}</el-link>
                      </template>
                    </el-table-column>
                    <el-table-column prop="user_name"
                                     label="发布人"
                                     show-overflow-tooltip
                                     width="92">
                    </el-table-column>
                    <el-table-column prop="start_time"
                                     label="开始时间"
                                     width="160"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="end_time"
                                     label="结束时间"
                                     width="160"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column label="任务类型"
                                     width="90"
                                     show-overflow-tooltip>
                      <template slot-scope="scope">
                        <p class="color-primary" v-if="scope.row.task_type === 1">常规</p>
                        <p class="color-primary" v-else>紧急</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="任务状态"
                                     width="90"
                                     show-overflow-tooltip>
                      <template slot-scope="scope">
                        <p :class="taskStatus.get(scope.row.execute_status).color">{{taskStatus.get(scope.row.execute_status).text}}</p>
                      </template>
                    </el-table-column>
                    <el-table-column label="操作"
                                     width="150"
                    >
                      <template slot-scope="scope">
                        <div class="disflex">
                          <el-button size="small" @click="feedback(scope.row.id)" v-if="scope.row.execute_status !== 2">反馈</el-button>
                          <el-button size="small" type="primary" @click="viewIssued(scope.row.id)">查看</el-button>
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
  </div>
</template>

<script>
import vMenu from '@/views/reviews/components/Menu'
import { mapState } from 'vuex'
const actions = new Map([
  [1, { text: '处理中', color: 'color-primary' }],
  [2, { text: '已上报', color: 'color-success' }]
])
export default {
  data () {
    return {
      taskStatus: actions, // 办理状态
      dataLess: false,
      tableList: [],
      routeName: '',
      ruleForm: {
        keyword: '',
        executeStatus: '',
        pageNum: 1,
        pageSize: 32,
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
          label: '处理中'
        },
        {
          id: 2,
          label: '已上报'
        }
      ]
    }
  },
  methods: {
    // 反馈
    feedback (id) {
      this.$router.push({ name: 'ReviewsFeedback', query: { id: id } })
    },
    // 查看任务
    viewIssued (id) {
      this.$router.push({ name: 'ReviewsFeedback', query: { id: id } })
    },
    // 搜索
    searchList () {
      this.ruleForm.pageNum = 1
      this.tableList = []
      this.getReceiveList()
    },
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.ruleForm.pageNum = 1
      this.tableList = []
      this.getReceiveList()
    },
    getData () {
      this.ruleForm.pageNum++
      this.getReceiveList()
    },
    // 获取列表
    getReceiveList () {
      this.dataLess = false
      this.$http.post(this.$api.findExecuteTask, this.ruleForm)
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
    this.getReceiveList()
  },
  components: {
    vMenu
  },
  computed: {
    ...mapState({
      loginUserId: state => state.user.userInfo.id // 登陆用户id
    })
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
