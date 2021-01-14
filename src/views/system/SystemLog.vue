<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemLog' }">操作日志</el-breadcrumb-item>
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
              <div class="admin-table">
                <div class="admin-search">
                  <div class="admin-log">
                    <p class="admin-log-p"><span class="admin-log-span">操作日志</span></p>
                  </div>
                  <div class="search-input border-radius search-box">
                    <span class="public-span-style">单位名称：</span>
                    <el-cascader :options="department"
                               v-model="params.departmentId"
                               placeholder="全部" class="admin-department"
                               :show-all-levels="false" size="small"
                               :props="{ checkStrictly: true, emitPath: false }"
                               clearable></el-cascader>
                    <span>选择日期：</span>
                    <el-date-picker v-model="date"
                                    @change="getDateInfo"
                                    class="admin-date"
                                    type="daterange"
                                    size="small"
                                    value-format="yyyy-MM-dd"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                    </el-date-picker>
                    <span>关键字：</span>
                    <el-input v-model="params.searchParam"
                              size="small"
                              placeholder="请输入关键字"
                              class="admin-keyword">
                    </el-input>
                    <div class="btn-box">
                      <el-button size="small"
                                 type="primary"
                                 @click="getKeyword">筛选</el-button>
                      <el-button size="small"
                                 @click="resetForm">重置</el-button>
                    </div>
                  </div>
                </div>
                <div class="admin-table-box">
                  <el-table ref="multipleTable"
                            :data="tableList"
                            border
                            style="width: 100%">
                    <el-table-column label="用户名"
                                     width="165">
                      <template slot-scope="scope">{{ scope.row.userName }}</template>
                    </el-table-column>
                    <el-table-column prop="departmentName"
                                     label="单位名称"
                                     width="320"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="operateDescribe"
                                     label="操作说明"
                                     show-overflow-tooltip
                                     width="140">
                    </el-table-column>
                    <el-table-column prop="operateIp"
                                     label="ip地址"
                                     width="235"
                                     show-overflow-tooltip>
                    </el-table-column>
                    <el-table-column prop="operateTime"
                                     label="操作时间"
                                     width="210"
                                     show-overflow-tooltip>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
            <scroll-data @getData="getData"
                         :dataLess="dataLess"></scroll-data>
          </div>
          <!-- <no-permission v-else></no-permission> -->
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
export default {
  name: 'SystemLog',
  data () {
    return {
      dataLess: false,
      date: [],
      total: '',
      tableList: [],
      department: [],
      routeName: '',
      keyword: '',
      params: {
        pageNum: 1,
        pageSize: 32,
        departmentId: '',
        searchParam: '',
        startDate: null,
        endDate: null
      }
    }
  },
  methods: {
    // 获取单位列表
    getDepartment () {
      this.$http.get(this.$api.listSelect)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.department = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 重置
    resetForm () {
      this.date = []
      this.params.searchParam = ''
      this.params.departmentId = ''
      this.tableList = []
      this.getLogList()
    },
    getData () {
      this.params.pageNum++
      this.getLogList()
    },
    // 获取时间
    getDateInfo () {
    },
    // 搜索
    getKeyword () {
      if (this.date.length || this.params.searchParam.trim() || this.params.departmentId) {
        this.params.pageNum = 1
        this.tableList = []
        this.getLogList()
      } else {
        this.$message.warning('请输入关键字！')
      }
    },
    handleNodeClick (data) {
    },
    // 获取分页参数
    getPagingChange (change) {
      this.$router.push({ name: 'AdminLog', query: { page: change.page, size: change.size } })
    },
    // 获取列表
    getLogList () {
      this.dataLess = false
      this.params.startDate = this.date[0] || ''
      this.params.endDate = this.date[1] || ''
      this.$http.post(this.$api.logList, this.params)
        .then(res => {
          let content = res.data.data.content
          this.tableList.push(...content)
          this.total = res.data.data.totalElements
          if (content.length < 31) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.routeName = this.$route.name
    this.getLogList()
    this.getDepartment()
  },
  components: {
    vMenu
  }
}
</script>
<style scoped>
.admin-right-box {
  display: flex;
  padding: 0 12px;
  min-height: 400px;
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
.admin-date {
  width: 220px;
  margin-right: 10px;
}
.admin-department {
  width: 190px;
  margin-right: 10px;
}
.search-box {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
}
.btn-box {
  margin-left: 10px;
}
.admin-log-span {
  line-height: 18px;
}
</style>
