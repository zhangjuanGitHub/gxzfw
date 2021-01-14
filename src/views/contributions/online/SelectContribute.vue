<template>
  <div class="issuedetail container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OnlineArticleList' }">在线征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'SelectContribute' }">选择投稿</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="artcile">
        <div class="btn-box">
          <el-button type="primary" size="medium" @click="selectMore">批量投稿</el-button>
        </div>
        <div class="artcile-table">
            <el-table :data="articleData"
                        style="width: 100%"
                        id="wx-data"
                        border @selection-change="handleSelectChange">
                <el-table-column type="selection"
                                     width="32">
                    </el-table-column>
                <el-table-column label="报送时间" prop="createTime"
                                width="160">
                </el-table-column>
                <el-table-column prop="articleTitle"
                                label="稿件标题">
                  <template slot-scope="scope">
                    <el-link type="primary"
                            @click="articleDetails(scope.row)">{{scope.row.articleTitle}}</el-link>
                  </template>
                </el-table-column>
                <el-table-column label="操作"
                                width="100">
                  <template slot-scope="scope">
                    <div class="edit-click" v-if="!scope.row.isAddSolicit">
                      <i class="el-icon-finished"></i>
                      <span @click="selectToContribute(scope.row)">投稿</span>
                    </div>
                    <div v-else>
                      <i class="el-icon-finished"></i>
                      <span>已投稿</span>
                    </div>
                  </template>
                </el-table-column>
            </el-table>
        </div>
        <scroll-data @getData="getData" :dataLess="dataLess"></scroll-data>
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
        pageNum: 1,
        pageSize: 20,
        solicitId: ''
      },
      articleData: [],
      selectMoreList: [],
      dataLess: false,
      articleIds: []
    }
  },
  methods: {
    // 批量投稿
    selectMore () {
      if (this.selectMoreList.length >= 1) {
        let selectItem = []
        for (let i = 0; i < this.selectMoreList.length; i++) {
          selectItem.push(this.selectMoreList[i].id)
        }
        let form = {
          solicitId: this.ruleForm.solicitId,
          articleIds: selectItem
        }
        this.contribute(form)
      } else {
        this.$message.warning('请至少选择一条需要投稿的数据！')
      }
    },
    // 滚动加载
    getData () {
      this.ruleForm.pageNum++
      this.getArticleList()
    },
    // 选择
    handleSelectChange (selection) {
      this.selectMoreList = selection
    },
    // 单个投稿
    selectToContribute (row) {
      this.articleIds.push(row.id)
      let form = {
        solicitId: this.ruleForm.solicitId,
        articleIds: this.articleIds
      }
      this.contribute(form)
    },
    contribute (form) {
      this.$http.post(this.$api.selectContribute, form).then(res => {
        if (res.data.code === 200) {
          this.$message.success('操作成功')
          this.articleData = []
          this.getArticleList()
        }
      }).catch(() => { })
    },
    // 去稿件详情页
    articleDetails (row) {
      this.$router.push({ name: 'ArticleDetail', query: { id: row.id, isArticle: true } })
    },
    // 获取列表
    getArticleList () {
      this.$http.post(this.$api.getContribute, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data.content) {
            let datas = res.data.data.content
            this.articleData.push(...datas)
            if (datas < 20) {
              this.dataLess = true
            }
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
.btn-box {
  margin-bottom: 5px;
}
</style>
