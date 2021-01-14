<template>
  <div class="lsseuList container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OnlineArticleList' }">在线征稿</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="buttons">
      <el-button @click="myArticle"
                 round
                 type="primary"
                 size="medium">我的征稿</el-button>
      <el-button @click="initArticle"
                 round
                 size="medium"
                 type="warning">发起征稿</el-button>
      <el-button @click="myContribution"
                 round
                 type="success"
                 size="medium">我的投稿</el-button>
      <el-button @click="myDraft"
                 round
                 size="medium">草稿箱</el-button>
    </div>
    <div class="newset">
      <el-table :data="articleList"
                style="width: 100%"
                border>
        <el-table-column label="主题"
                         prop="solicitTitle">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="articleDetails(scope.row.id)">{{scope.row.solicitTitle}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="departmentName"
                         label="征稿单位"
                         width="280">
        </el-table-column>
        <el-table-column width="250"
                         label="起止日期">
          <template slot-scope="scope">{{scope.row.solicitStart}}-{{scope.row.solicitEnd}}</template>
        </el-table-column>
        <el-table-column prop="solicitReadNum"
                         label="阅读数"
                         width="120">
        </el-table-column>
        <el-table-column prop="solicitNum"
                         label="稿件数"
                         width="120">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="toArticleList(scope.row.id)">{{scope.row.solicitNum}}</el-link>
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
      articleList: [],
      rumorVerificate: [],
      params: {
        pageNum: 1,
        pageSize: 20
      },
      dataLess: false
    }
  },
  methods: {
    getData () {
      this.params.pageNum++
      this.getArticleList()
    },
    // 获取征稿列表
    getArticleList () {
      this.$http.post(this.$api.listArticle, this.params)
        .then(res => {
          let datas = res.data.data.content
          this.articleList.push(...datas)
          if (datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { this.dataLess = true })
    },
    myArticle () {
      this.$router.push({ name: 'MyArticle' })
    },
    initArticle () {
      this.$router.push({ name: 'WriteArticle' })
    },
    articleDetails (id) {
      this.$router.push({ name: 'ArticleDetail', query: { id: id, iscover: true } })
    },
    // 跳转稿件列表
    toArticleList (id) {
      this.$router.push({ name: 'ArticleList', query: { id: id } })
    },
    myContribution () {
      this.$router.push({ name: 'MyContribute' })
    },
    myDraft () {
      this.$router.push({ name: 'MyDraft' })
    }
  },
  created () {
    this.getArticleList()
  }
}
</script>
<style scoped>
@import "../contributions.scss";
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.lsseuList .buttons .el-button span {
  display: inline-block;
  font-size: 14px;
  font-family: Adobe Heiti Std R;
  font-weight: bold;
  background-color: transparent;
}
.newset {
  margin-top: 15px;
}
</style>
