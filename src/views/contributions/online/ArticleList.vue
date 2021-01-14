<template>
  <div class="issuedetail container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MyArticle' }">我的征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'ArticleList' }">稿件列表</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="artcile">
        <div class="assessment-seach">
          <el-form :inline="true"
                    ref="ruleForm"
                    :model="ruleForm"
                    class="demo-form-inline">
            <el-form-item label="审理状态"
                        prop="status">
              <el-select v-model="ruleForm.status" size="small">
                <el-option label="待审理"
                                :value="0"></el-option>
                <el-option label="通过"
                                :value="1"></el-option>
                <el-option label="退回"
                                :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="投稿时间"
                            prop="createTime">
              <el-date-picker v-model="ruleForm.createTime"
                              size="small"
                              type="date"
                              format="yyyy 年 MM 月 dd 日"
                              value-format="yyyy-MM-dd"
                              placeholder="请选择时间">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="关键字"
                      prop="articleTitle">
              <el-input size="small"
                            v-model="ruleForm.articleTitle"
                            placeholder="请输入关键字"></el-input>
            </el-form-item>
            <div class="right-btn">
              <el-form-item>
                <el-button size="small" @click="searchList" type="primary">筛选</el-button>
                <el-button size="small" @click="resetForm('ruleForm')">重置</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="artcile-table">
            <el-table :data="articleData"
                        style="width: 100%"
                        id="wx-data"
                        border>
                <el-table-column label="投稿时间" prop="createTime"
                                width="160">
                </el-table-column>
                <el-table-column prop="articleTitle"
                                label="稿件标题">
                  <template slot-scope="scope">
                    <el-link type="primary"
                            @click="articleDetails(scope.row)">{{scope.row.articleTitle}}</el-link>
                  </template>
                </el-table-column>
                <el-table-column prop="articleWordCount"
                                label="字数"
                                width="80">
                </el-table-column>
                <el-table-column prop="userName"
                                label="投稿人"
                                width="120">
                </el-table-column>
                <!-- <el-table-column label="联系方式" prop="userEmail"
                                width="160">
                </el-table-column> -->
                <el-table-column prop="urls"
                                label="附件"
                                width="120">
                </el-table-column>
                <el-table-column prop="status"
                                label="审理状态"
                                width="100">
                  <template slot-scope="scope">
                    <span v-if="scope.row.status == 0">待审理</span>
                    <span v-if="scope.row.status == 1">通过</span>
                    <span v-if="scope.row.status == 2">退回</span>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                width="100">
                  <template slot-scope="scope">
                      <img  v-if="scope.row.status == 0" class="shenli-style" @click="articleDetails(scope.row)" src="@/assets/images/contributions/shenli.png" alt="审理" title="审理">
                  </template>
                </el-table-column>
            </el-table>
        </div>
    <!-- <scroll-data @getData="getData" :dataLess="dataLess"></scroll-data> -->
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
  </div>
</template>
<script>
export default {
  data () {
    return {
      ruleForm: {
        createTime: '',
        articleTitle: '',
        pageNum: 1,
        pageSize: 30,
        status: '',
        solicitId: ''
      },
      articleData: []
    }
  },
  methods: {
    resetForm () {
      this.ruleForm.status = ''
      this.ruleForm.articleTitle = ''
      this.ruleForm.createTime = ''
      this.ruleForm.pageNum = 1
      this.ruleForm.solicitId = ''
      this.articleData = []
      this.getArticleList()
    },
    searchList () {
      this.articleData = []
      this.getArticleList()
    },
    articleDetails (row) {
      this.$router.push({ name: 'ArticleDetail', query: { id: row.id, isEdit: true, status: row.status } })
    },
    // 获取列表
    getArticleList () {
      this.$http.post(this.$api.contributeList, this.ruleForm)
        .then(res => {
          let datas = res.data.data.content
          this.articleData.push(...datas)
          if (datas < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getArticleList()
    this.ruleForm.solicitId = this.$route.query.id
  },
  mounted () {}
}
</script>
<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.assessment-seach {
  height: 46px;
  /* background: rgba(239, 241, 244, 1); */
  background: #ffffff;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 3px 12px;
  margin-bottom: 5px;
  position: relative;
}
.assessment-seach .el-form-item {
  margin-bottom: 0px;
  margin-left: 10px;
  margin-right: 50px;
}
.right-btn{
  position: absolute;
  right: 0;
  top: 2px;
}
.shenli-style{
    width: 25px;
    height: 25px;
}
</style>
