<!--
 * @Author: MaiChao
 * @Date: 2020-11-12 09:46:53
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-08 14:46:34
-->
<template>
  <div class="container">
    <div class="sperad-conten article-conten">
        <div class="breadcrumb-box">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name:'LocalArticleWx'}">稿件发布</el-breadcrumb-item>
            <el-breadcrumb-item>稿件组合</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      <div class="articlepublic-data pad20">
        <div class="account-box"
             v-if="showLocal">
          <div class="compose-list">
            <div class="list-box"
                 v-for="(item,index) in articleList"
                 :key="index"
                 @click="operation(item,index)">
              <el-popover placement="right"
                          trigger="click"
                          :ref="item.id">
                <div class="list-sort">
                  <el-button size="small"
                             type="primary"
                             v-if="index!==0"
                             @click="upList(item,index)"
                             class="el-icon-upload2">上移</el-button>
                  <el-button size="small"
                             type="warning"
                             v-if="index<articleList.length-1"
                             @click="downList(item,index)"
                             class="el-icon-download">下移</el-button>
                  <el-button size="small"
                             type="danger"
                             @click="deleteList(item,index)"
                             class="el-icon-delete">删除</el-button>
                </div>
                <div slot="reference"
                     class="first-box"
                     v-if="index===0">
                  <div class="max-article"
                       v-html="item.articleTitle">
                  </div>
                  <div class="max-img">
                    <img :src="item.coverImage">
                  </div>
                </div>
                <div slot="reference"
                     class="dis-flex"
                     v-else>
                  <div class="article"
                       v-html="item.articleTitle">
                  </div>
                  <div class="cover-img">
                    <img :src="item.coverImage">
                  </div>
                </div>
              </el-popover>
            </div>
            <div class="append"
                 @click="appendArticle">
              <i class="el-icon-plus"></i>
              追加文章
            </div>
          </div>
          <div class="compose-article">
            <div class="article-title"
                 v-html="articleDetail.articleTitle">
            </div>
            <div class="article-author">
              <span v-html="articleDetail.originalAuthor"
                    class="author"></span>|
              <span v-html="articleDetail.updateTime"></span>
            </div>
            <div class="article-content"
                 v-html="articleDetail.articleContent">
            </div>
            <div class="footer">
              <el-button type="primary"
                         @click="saveArticle">保存</el-button>
              <el-button @click="saveCompose">保存并上传</el-button>
            </div>
          </div>
        </div>
        <div class="account-box"
             v-else>
          <div class="compose-list">
            <div class="list-box"
                 v-for="(item,index) in articleList"
                 :key="index">
              <div class="first-box"
                   @click="openOut(item)"
                   v-if="index===0">
                <div class="max-article text-click"
                     v-html="item.title">
                </div>
                <div class="max-img">
                  <img :src="item.thumbUrl">
                </div>
              </div>
              <div class="dis-flex"
                   @click="openOut(item)"
                   v-else>
                <div class="article text-click"
                     v-html="item.title">
                </div>
                <div class="cover-img">
                  <img :src="item.thumbUrl">
                </div>
              </div>
            </div>
          </div>
          <div class="compose-article">
            <!-- <iframe id="iframe" :src="articleDetail.url"></iframe> -->
            <div class="article-title"
                 v-html="articleDetail.title">
            </div>
            <div class="article-author">
              <span v-html="articleDetail.author"
                    class="author"></span>|
              <span v-html="articleDetail.createTime"></span>
            </div>
            <div class="article-content"
                 v-html="articleDetail.content">
            </div>
            <div class="footer">
              <el-button type="primary"
                         @click="pubArticle">发布</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 选择文章弹框 -->
    <el-dialog title="选择图文文章"
               :visible.sync="appendVisible"
               :modal="ismodal"
               width="35%"
               :before-close="handleClose">
      <div class="list-table">
        <el-table border
                  :data="tableData"
                  style="width: 99.9%"
                  class="message-list"
                  @selection-change="handleSelect">
          <el-table-column type="selection"
                           width="55">
          </el-table-column>
          <el-table-column prop="createUserName"
                           label="封面"
                           width="110">
            <template slot-scope='scope'>
              <div class="img-box">
                <!-- {{scope.row.coverImage}} -->
                <img :src="scope.row.coverImage">
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="articleTitle"
                           label="标题"
                           show-overflow-tooltip>
            <template slot-scope='scope'>
              <span @click="routerWeb(scope.row, scope.$index)"
                    class="text-click pointer ellipsis">
                {{scope.row.articleTitle}}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="updateTime"
                           label="最近修改时间"
                           width="160">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-input v-model="fromData.articleTitle"
                  placeholder="搜索图文文章"
                  suffix-icon="el-icon-search"></el-input>
        <el-button class="search-query"
                   @click="searchList">查询</el-button>
        <el-button type="primary"
                   @click="bindToUser">确定</el-button>
        <el-button @click="restBind">取消</el-button>
        <p class="negative"
           @click="routerArticle">没有找到要发布的文章？去我要投稿撰写>></p>
      </div>
    </el-dialog>
    <!-- 删除弹框 -->
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
    <!-- 选择账号弹框 -->
    <el-dialog title="选择保存账号"
               :visible.sync="saveVisible"
               :modal="ismodal"
               width="35%"
               :before-close="saveClose">
      <div class="user-list">
        <el-radio-group v-model="Num"
                           label-width="100px">
          <el-radio v-for="item in this.publicData"
                       :label="item.id"
                       :key="item.id">{{item.nickName}}</el-radio>
        </el-radio-group>
      </div>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="saveUser">确定</el-button>
        <el-button @click="saveClose">取消</el-button>
      </div>
    </el-dialog>
    <!-- 确认发布弹框 -->
    <el-dialog title="确认发布文章?"
               :visible.sync="publicShow"
               :modal="ismodal"
               width="35%"
               :before-close="pubClose">
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="publishWeixin">确定</el-button>
        <el-button @click="pubClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import vDiaing from '@/components/Diaing'
export default {
  name: 'Account',
  data () {
    return {
      publicShow: false,
      showLocal: false,
      Num: '',
      addVal: [],
      publicData: [],
      saveVisible: false,
      fromData: {
        exportIds: [], // 排除id
        type: 1,
        ownerUserName: '', // 所属人
        times: [], // 日期数组
        checkStatus: '', // 流程状态
        articleTitle: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      mergeId: '', // 素材id
      params: {
        ids: [], // 组合文章ids
        articleIds: [], // 保存文章ids
        materialIds: [] // 素材文章ids
      },
      articleList: [], // 排序列表
      articleDetail: {}, // 展示图文
      seachInput: '', // 图文文章搜索
      dialogVisible: false, // 删除弹框
      operaId: '',
      deleteItem: {},
      appendVisible: false, // 追加弹框
      ismodal: false,
      tableData: [] // 追加列表
    }
  },
  components: {
    vDiaing
  },
  methods: {
    // 组合生成本地素材
    getMergeArticle () {
      this.$http.post(this.$api.getArticleList, this.params)
        .then(res => {
          if (res.data.data) {
            this.articleList = res.data.data
            this.articleDetail = this.articleList[0]
          }
        })
        .catch(() => { })
    },
    // 组合生成微信素材
    geWeixinArticle () {
      this.$http.get(this.$api.getMaterialNews, { params: { id: this.mergeId } })
        .then(res => {
          if (res.data.data) {
            console.log(res.data.data)
            this.articleList = res.data.data.items
            this.articleDetail = this.articleList[0]
            console.log(this.articleDetail.content)
            // this.articleDetail.content.replace('data-src', 'src');
          }
        })
        .catch(() => { })
    },
    // 添加文章弹框
    appendArticle () {
      this.appendVisible = true
      this.fromData.exportIds = this.params.ids
      this.$http.post(this.$api.localPublicList, this.fromData)
        .then(res => {
          if (res.data.data) {
            this.tableData = res.data.data.content
          }
        })
        .catch(() => { })
    },
    // searchList 添加文章筛选
    searchList () {
      this.tableData = []
      this.appendArticle()
    },
    // 关闭弹框
    handleClose () {
      this.appendVisible = false
    },
    // 确定添加文章弹框
    bindToUser () {
      if (this.addVal.length > 0) {
        this.params.ids = this.params.ids.concat(this.addVal)
        this.fromData.exportIds = this.params.ids
        this.$http.post(this.$api.localPublicList, this.fromData)
          .then(res => {
            if (res.data.data) {
              this.tableData = res.data.data.content
            }
          })
          .catch(() => { })
        this.getMergeArticle()
        this.addVal = []
        this.appendVisible = false
      } else {
        this.$message.warning('请选择添加文章!')
      }
    },
    // 取消
    restBind () {
      this.tableData = []
      this.fromData.exportIds = []
      this.fromData.articleTitle = ''
      this.appendVisible = false
    },
    // 选择要上传的稿件
    handleSelect (val) {
      if (val.length > 0) {
        this.addVal = []
        val.forEach(item => {
          this.addVal.push(item.id.toString())
        })
      }
    },
    // 选中列表中文件&&打开排序弹框
    operation (item, index) {
      this.operaId = index
      this.articleDetail = item
    },
    // 上移
    upList (item, index) {
      this.$refs[item.id][0].doClose()
      if (index !== 0) {
        this.articleList[index] = this.articleList.splice(index - 1, 1, this.articleList[index])[0]
      } else {
        this.articleList.push(this.articleList.shift())
      }
    },
    // 下移
    downList (item, index) {
      this.$refs[item.id][0].doClose()
      if (index !== this.articleList.length - 1) {
        this.articleList[index] = this.articleList.splice(index + 1, 1, this.articleList[index])[0]
      } else {
        this.articleList.unshift(this.articleList.splice(index, 1)[0])
      }
    },
    // 删除
    deleteList (item, index) {
      this.dialogVisible = true
      this.$refs[item.id][0].doClose()
    },
    // 组合生成本地素材
    saveArticle () {
      let paramsData = {
        articleIds: this.params.ids,
        mergeId: ''
      }
      if (this.$route.query.mergeId) {
        paramsData.mergeId = this.$route.query.mergeId
      }
      this.$http.post(this.$api.mergeArticle, paramsData)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
          }
        })
        .catch(() => { })
    },
    // 保存并上传
    saveCompose () {
      let paramsData = {
        articleIds: this.params.ids,
        mergeId: ''
      }
      if (this.$route.query.mergeId) {
        paramsData.mergeId = this.$route.query.mergeId
      }
      this.$http.post(this.$api.mergeArticle, paramsData)
        .then(res => {
          if (res.data.code === 200) {
            this.mergeId = res.data.data
            this.getPublicNum()
          }
        })
        .catch(() => { })
    },
    // 获取推送账号
    getPublicNum () {
      this.$http.get(this.$api.wxPublishInfo)
        .then(res => {
          if (res.data.data.length > 0) {
            this.saveVisible = true
            this.publicData = res.data.data
          } else {
            this.$message.warning('暂未绑定发布账号')
          }
        })
        .catch(() => { })
    },
    // 确认删除
    getConfirmDelete () {
      this.params.ids.splice(this.operaId, 1)
      this.getMergeArticle()
    },
    // 关闭删除弹出框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 跳转稿件池
    routerArticle () {
      this.$router.push({ name: 'Contribute' })
    },
    // 跳转外部
    openOut (item) {
      window.open(item.url, '_black')
    },
    // 确定选择保存账号
    saveUser () {
      let paramsData = {
        authorizerId: this.Num,
        mergeId: ''
      }
      if (this.$route.query.mergeId) {
        paramsData.mergeId = this.$route.query.mergeId
      } else {
        paramsData.mergeId = this.mergeId
      }

      this.$http.post(this.$api.mergeUpload, paramsData)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功')
            this.saveClose()
          }
        })
        .catch(() => { })
    },
    // 关闭选择弹框
    saveClose () {
      this.Num = ''
      this.saveVisible = false
    },
    // 发布弹框
    pubArticle () {
      this.publicShow = true
    },
    // 确认发布
    publishWeixin () {
      this.$http.get(this.$api.publishWeixin, { params: { materialId: this.mergeId } })
        .then(res => {
          if (res.data.code === 200) {
            this.publicShow = false
            console.log(res.data.data)
          }
        })
        .catch(() => {
          this.publicShow = false
        })
    },
    // 取消发布
    pubClose () {
      this.publicShow = false
    }
  },
  created () {
    this.showLocal = JSON.parse(this.$route.query.showLocal)
    if (!JSON.parse(this.$route.query.showLocal)) {
      this.mergeId = this.$route.query.mergeId
      this.geWeixinArticle()
    } else {
      this.params.ids = this.$route.query.id.split(',')
      this.getMergeArticle()
    }
  }
}
</script>
<style >
.article-content img {
  display: block;
  max-width: 100%;
  max-height: 100%;
}
</style>
<style scoped>
.account-box {
  display: flex;
  padding: 20px 10px;
}
/*文章列表展示*/
.compose-list {
  width: 20%;
  border: 1px solid #f0f0f0;
}
.list-box {
  display: flex;
  align-items: center;
  padding: 5px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
}
.article {
  width: 160px;
  padding: 10px;
  font-size: 14px;
  line-height: 24px;
  box-sizing: border-box;
}
.cover-img img {
  display: block;
  width: 88px;
  height: 66px;
}
.append {
  cursor: pointer;
  color: #1478d6;
  padding: 20px 10px;
  text-align: center;
}
/*文章内容展示*/
.compose-article {
  width: 80%;
  margin-left: 20px;
  overflow: hidden;
  position: relative;
}
.article-title {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
  line-height: 30px;
}
.article-author {
  text-align: center;
  font-size: 16px;
  line-height: 30px;
  color: #666;
}
.author {
  margin-right: 5px;
}
.article-content {
  min-height: 650px;
  font-size: 15px;
  color: #333;
  line-height: 30px;
  margin-bottom: 70px;
   box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}

.list-sort {
  text-align: center;
}
.list-sort .el-button {
  display: block;
  margin: 10px 0px;
}
.footer {
  width: 100%;
  position: absolute;
  bottom: 0px;
  text-align: center;
  padding: 5px 0;
}
.dialog-footer .el-input {
  width: 248px;
  float: left;
}
.negative {
  color: #ff0000;
  line-height: 30px;
  font-size: 14px;
  margin-top: 20px;
  cursor: pointer;
  text-decoration: underline;
}
.img-box {
  width: 88px;
  height: 66px;
}
.img-box img {
  display: block;
  width: 100%;
  height: 100%;
}
.text-click {
  display: block;
  margin: 0 auto;
}
.search-query {
  color: #fff;
  background-color: #f27a3e;
}
.first-box {
  height: 120px;
  position: relative;
}
.first-box .max-img img {
  width: 100%;
  height: 120px;
}
.first-box .max-article {
  position: absolute;
  bottom: 0px;
  color: #fff;
  font-size: 16px;
  padding: 10px;
}
</style>
