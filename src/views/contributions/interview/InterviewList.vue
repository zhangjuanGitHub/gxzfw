<template>
  <div class="visitList container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'InterviewList' }">约访列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="buttons">
      <el-button @click="myInterview"
                 round
                 type="warning"
                 size="medium">我的约访</el-button>
      <el-button @click="writeInterview"
                 round
                 size="medium"
                 type="primary">发起约访</el-button>
    </div>
    <div class="visit">
      <el-table :data="interviewList"
                style="width: 100%"
                border>
        <el-table-column prop="interviewTheme"
                         label="约访主题"
                         width="515px">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="interviewDetails(scope.row.id)">{{scope.row.interviewTheme}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime"
                         label="申请时间"
                         width="170">
        </el-table-column>
        <el-table-column prop="applyUserName"
                         label="申请人"
                         width="120">
        </el-table-column>
        <el-table-column prop="applyDepartmentName"
                         label="申请人单位"
                         width="130">
        </el-table-column>
        <el-table-column prop="targetDepartmentName"
                         label="约访对象"
                         width="210">
        </el-table-column>
        <el-table-column prop="replyStatus"
                         width="140"
                         label="状态">
          <template slot-scope="scope">
            <p v-if='scope.row.replyStatus === 1'
               class='activeClass'>已接受</p>
            <p v-else-if='scope.row.replyStatus === 2'
               class='errorClass'>已拒绝</p>
            <p v-else>未回复</p>
          </template>
        </el-table-column>
      </el-table>
      <!-- <no-permission v-else></no-permission> -->
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
export default {
  data () {
    return {
      interviewList: [],
      page: {
        pageNum: 1,
        pageSize: 32
      },
      dataLess: false
    }
  },
  methods: {
    getData () {
      this.page.pageNum++
      this.getInterviewList()
    },
    // 获取列表
    getInterviewList () {
      this.$http.post(this.$api.listInterview, this.page)
        .then(res => {
          let datas = res.data.data.content
          this.interviewList.push(...datas)
          if (datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 跳转约访详情
    interviewDetails (id) {
      this.$router.push({ name: 'InterviewDetails', query: { id: id } })
    },
    myInterview () {
      this.$router.push({ name: 'MyInterview' })
    },
    writeInterview () {
      this.$router.push({ name: 'WriteInterview' })
    }
  },
  created () {
    this.getInterviewList()
  }
}
</script>
<style scoped>
.visitList .visit {
  margin-top: 12px;
}
.visitList .activeClass {
  color: #2baf0c;
}
.visitList .errorClass {
  color: #f10909;
}
.visitList {
  box-sizing: border-box;
}
.visit {
  margin-top: 15px;
}
</style>
