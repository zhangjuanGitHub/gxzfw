<!--
 * @Author: MaiChao
 * @Date: 2020-11-11 09:58:28
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-15 11:54:53
-->
<template>
  <div class="material-box">
    <!-- 搜索框 -->
    <div class="search-box">
      <el-form size="small"
               :model="fromData"
               :inline="true"
               ref="froms"
               class="dis-flex">
        <el-form-item class="item-style"
                      label="发布日期:"
                      prop="times">
          <el-date-picker v-model="fromData.times"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="item-style"
                      label="标题关键字:"
                      prop="keyword">
          <el-input placeholder="请输入关键字"
                    v-model="fromData.keyword"></el-input>
        </el-form-item>
        <el-form-item class="item-style last-button">
          <el-button size="small"
                     type="primary"
                     @click="queryAll">筛选</el-button>
          <el-button size="small"
                     @click="resetForm('froms')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="newmedia_main over_hidden">
      <div class="local-material">
        <div>
          <span class="title"
                v-if="showLocal">本地素材</span>
          <span class="title"
                v-else>微信素材</span>
        </div>
        <div class="show-local"
             v-if="showLocal">
          <w-f-column itemW="318"
                      class="list-content">
            <template slot-scope="{columnNum,columnIndex}">
              <water-follow :list="localList"
                            :columnNum="columnNum"
                            :columnIndex="columnIndex">
                <template slot-scope="{item}">
                  <div class="my-box"
                       :style="{height:item+'px'}">
                    <div v-for="(ciklist, cikid) of item.cikArticleList"
                         :key="cikid">
                      <div class="wx_detail"
                           v-if="item.cikArticleList.length===1">
                        <div class="wx_cover cursor"
                             v-if="cikid===0">
                          <img :src="ciklist.coverImage"
                               alt=""
                               class="top-img">
                          <span v-html="ciklist.articleTitle || '暂无'" @click="trageUrl(ciklist)"
                                class="wx_title cursor font_16 all_hightlight text-click"></span>
                        </div>
                        <div >
                          <p class='wx_main cursor lin-clamp-3 font_14 all_hightlight'
                             v-html="ciklist.articleSummary || '暂无'"></p>
                        </div>
                      </div>
                      <div v-else>
                        <div class="wx_cover cursor"
                             v-if="cikid===0">
                          <img :src="ciklist.coverImage"
                               alt=""
                               class="top-img">
                          <span v-html="ciklist.articleTitle || '暂无'"
                                class="wx_title cursor font_16 all_hightlight text-click"></span>
                        </div>
                        <div class="cursor bottom-box"
                             v-else>
                          <p v-html="ciklist.articleTitle || '暂无'" @click="trageUrl(ciklist)"
                             class="bottom-title cursor font_16 text-click"></p>
                          <img :src="ciklist.coverImage"
                               alt=""
                               class="bottom-img">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="delete-item">
                    <el-tooltip class="item"
                                effect="dark"
                                content="编辑上传"
                                placement="top">
                      <el-button @click="itemUpload(item)"
                                 size="mini"
                                 class="search_add el-icon-edit">
                      </el-button>
                    </el-tooltip>
                    <el-tooltip class="item"
                                effect="dark"
                                content="删除素材"
                                placement="top">
                      <el-button @click="itemDelete(item)"
                                 size="mini"
                                 class="search_delete el-icon-delete">
                      </el-button>
                    </el-tooltip>
                  </div>
                </template>
              </water-follow>
            </template>
          </w-f-column>
        </div>
        <div class="show-wx"
             v-else>
          <w-f-column itemW="318"
                      class="list-content">
            <template slot-scope="{columnNum,columnIndex}">
              <water-follow :list="materialList"
                            :columnNum="columnNum"
                            :columnIndex="columnIndex">
                <template slot-scope="{item}">
                  <div class="my-box"
                       :style="{height:item+'px'}">
                    <div v-for="(ciklist, cikid) of item.items"
                         :key="cikid">
                      <div class="wx_detail"
                           v-if="item.items.length===1">
                        <div class="wx_cover cursor"
                             v-if="cikid===0">
                          <img :src="ciklist.thumbUrl"
                               alt=""
                               class="top-img">
                          <span v-html="ciklist.title || '暂无'" @click="trageUrl(ciklist)"
                                class="wx_title cursor font_16 all_hightlight text-click"></span>
                        </div>
                        <div @click="trageUrl(ciklist)">
                          <p class='wx_main cursor lin-clamp-3 font_14 all_hightlight'
                             v-html="ciklist.digest || '暂无'"></p>
                        </div>
                      </div>
                      <div v-else>
                        <div class="wx_cover cursor"
                             v-if="cikid===0">
                          <img :src="ciklist.thumbUrl"
                               alt=""
                               class="top-img">
                          <span v-html="ciklist.title || '暂无'" @click="trageUrl(ciklist)"
                                class="wx_title cursor font_16 all_hightlight text-click"></span>
                        </div>
                        <div class="cursor bottom-box"
                             v-else>
                          <p v-html="ciklist.title || '暂无'" @click="trageUrl(ciklist)"
                             class="bottom-title cursor font_16 text-click"></p>
                          <img :src="ciklist.thumbUrl"
                               alt=""
                               class="bottom-img">
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="delete-item">
                    <el-tooltip class="item"
                                effect="dark"
                                content="发布"
                                placement="top">
                      <el-button @click="pubArticle(item)"
                                 size="mini"
                                 class="search_add el-icon-edit">
                      </el-button>
                    </el-tooltip>
                    <!-- <el-tooltip class="item"
                                effect="dark"
                                content="预览"
                                placement="top">
                      <el-button @click="outView(item)"
                                 size="mini"
                                 class="search_add el-icon-view">
                      </el-button>
                    </el-tooltip> -->
                  </div>
                </template>
              </water-follow>
            </template>
          </w-f-column>
        </div>
      </div>
      <div class="text-center"
           v-if="dataNull">
        <img :src="require('@/assets/images/empty-data.png')"
             alt="">
      </div>
    </div>
    <div class="content_page">
      <pagination @pagingChange="getPagingChange"
                  :total="total"
                  ref="child"></pagination>
    </div>
    <!-- 删除弹框 -->
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
      <!-- 确认发布弹框 -->
    <el-dialog title="确认发布文章?"
               :visible.sync="publicShow"
              :modal-append-to-body='false'
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
import pagination from '@/components/Pagination.vue'
import WFColumn from '@/components/WFColumn'
import WaterFollow from '@/components/WaterFollow'
export default {
  data () {
    return {
      pubData: {},
      publicShow: false,
      state: '', // 外部投稿地址
      rowData: {}, // 外部投稿数据
      changeVisible: false, // 外部投稿弹框
      columnNum: 5,
      columnIndex: 5,
      layout: [],
      showLocal: true,
      dataNull: false,
      dialogVisible: false, // 删除弹框
      deleteItem: {}, // 删除素材
      localList: [], // 本地组合列表
      materialList: [], // 微信拉取列表
      total: 0,
      fromData: {
        times: [], // 日期数组
        keyword: '', // 关键字
        pageNum: 1,
        pageSize: 20
      },
      colNumbers: '' // 列表数
    }
  },
  methods: {
    // 分页
    getPagingChange (change) {
      this.fromData.pageNum = change.page
      this.fromData.pageSize = change.size
      this.showLocal ? this.getLocalarticle() : this.getWxarticle()
    },
    // 筛选
    queryAll () {
      this.$refs.child.handleCurrentChange(1)
    },
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.fromData.pageNum = 1
      this.fromData.pageSize = 20
      this.$refs.child.handleCurrentChange(1)
    },
    // 从微信拉取的素材
    getWxarticle () {
      this.$http.post(this.$api.materialList, this.fromData)
        .then(res => {
          if (res.data.data.content.length) {
            this.dataNull = false
            this.materialList = res.data.data.content
            this.total = res.data.data.totalElements
          } else {
            this.materialList = []
            this.total = 0
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    // 从本地组合的素材
    getLocalarticle () {
      this.$http.post(this.$api.mergeList, this.fromData)
        .then(res => {
          if (res.data.data.content.length) {
            this.dataNull = false
            this.localList = res.data.data.content
            this.total = res.data.data.totalElements
          } else {
            this.localList = []
            this.total = 0
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    // 切换渠道
    tabShow () {
      this.total = 0
      this.fromData.pageNum = 1
      this.$refs.child.handleCurrentChange(1)
      this.showLocal = !this.showLocal
      this.showLocal ? this.getLocalarticle() : this.getWxarticle()
    },
    // 跳转详情
    trageUrl (item) {
      item.url ? window.open(item.url, 'black') : this.$router.push({ name: 'ManuscriptDetail', query: { id: item.id } })
    },
    // 获取删除详情
    itemDelete (item) {
      this.dialogVisible = true
      this.showLocal ? this.deleteItem.id = item.id : this.deleteItem.id = item.id
    },
    // 确认删除
    getConfirmDelete () {
      this.$http.get(this.$api.deleteMergeArticle, { params: { mergeId: parseInt(this.deleteItem.id) } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功!')
            this.dialogVisible = false
            this.showLocal ? this.getLocalarticle() : this.getWxarticle()
          }
        })
        .catch(() => {
        })
    },
    // 跳转上传详情
    itemUpload (item) {
      this.$router.push({ name: 'Compose', query: { id: item.articleIds, mergeId: item.id, showLocal: this.showLocal } })
    },
    // 发布弹框
    pubArticle (item) {
      this.pubData = item
      this.publicShow = true
    },
    // 取消发布
    pubClose () {
      this.publicShow = false
    },
    // 确认发布
    publishWeixin () {
      this.$http.get(this.$api.publishWeixin, { params: { materialId: this.pubData.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.publicShow = false
          }
        })
        .catch(() => {
          this.publicShow = false
        })
    },
    // 关闭删除弹出框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 外部投稿地址
    querySearch (queryString, callback) {
      let restaurants = this.restaurants
      let results = JSON.parse(JSON.stringify(restaurants)) // 把数组的浅复制换成深复制
      for (let item in results) {
        results[item].value = queryString + '' + restaurants[item].value
      }
      callback(results)
    },
    loadAll () {
      return [
        { 'value': '@qq.com' },
        { 'value': '@126.com' },
        { 'value': '@163.com' },
        { 'value': '@0355.net' },
        { 'value': '@263.net' },
        { 'value': '@3721.net' },
        { 'value': '@yahoo.com' },
        { 'value': '@gmail.com' },
        { 'value': '@msn.com' },
        { 'value': '@hotmail.com' },
        { 'value': '@yeah.net' },
        { 'value': '@aol.com' },
        { 'value': '@ask.com' },
        { 'value': '@live.com' },
        { 'value': '@sohu.com' }
      ]
    },
    // 预览
    outView (item) {
      console.log(item)
    }
  },
  components: {
    pagination,
    vDiaing,
    WaterFollow,
    WFColumn
  },
  mounted () {
    this.restaurants = this.loadAll()
  },
  created () {
    this.showLocal = JSON.parse(this.$route.query.showLocal)
    this.showLocal ? this.getLocalarticle() : this.getWxarticle()
  },
  watch: {
    $route (to, from) {
      this.showLocal = JSON.parse(this.$route.query.showLocal)
      this.showLocal ? this.getLocalarticle() : this.getWxarticle()
    }
  }
}
</script>
<style scoped>
@import '../articlepublic.css';
.newmedia_main .list-content {
  overflow: hidden;
  position: relative;
}
.list-content {
  width: 100%;
}
.list-content .my-box {
  box-shadow: 2px 3px 5px 4px rgba(229, 232, 235, 0.75);
  padding: 5px;
  margin-bottom: 20px;
  width: 318px;
  margin-right: 10px;
  box-sizing: border-box;
}
.newmedia_main .title {
  font-weight: bold;
  font-size: 18px;
}
.wx_detail {
  width: 90%;
  height: 200px;
  margin: auto;
}
.wx_title {
  color: #fff;
  margin-top: 10px;
  padding: 10px;
}
/* .wx_des p {
  margin-left: 5px;
} */
.wx_avatar {
  background-size: 140px;
}
.wx_main {
  height: 63px;
  line-height: 1.5;
  color: #9a9a9a;
  margin-top: 10px;
  margin-bottom: 10px;
}
.wx_share {
  justify-content: space-between;
}
.wx_share span {
  color: #0780b6;
}
/* .content_page {
  width: 100%;
  background-color: #fff;
  position: absolute;
  bottom: 0px;
} */
.tab-show {
  margin-left: 20px;
  text-decoration: underline;
  cursor: pointer;
  color: #0780b6;
}
.wx_cover {
  width: 100%;
  height: 135px;
  background: #a5a5a5;
  position: relative;
}
.top-img {
  width: 100%;
  margin: 0;
}
.bottom-box {
  display: flex;
  min-height: 100px;
  align-items: center;
}
.bottom-img {
  width: 80px;
  height: 80px;
  margin: 0;
  position: unset;
}
.bottom-title {
  min-height: 100px;
  line-height: 30px;
  margin: 20px 10px;
  border-bottom: 1px solid #a5a5a5;
  box-sizing: border-box;
}
.wx_box:last-of-type .bottom-title {
  border: none;
}
.wx_box {
  box-shadow: none;
}
.wx_title {
  position: absolute;
  bottom: 5px;
}

.delete-item {
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  display: none;
}
.delete-item .el-button {
  outline: none;
  border: none;
  font-size: 20px;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  padding: 0px;
}
.wx_detail {
  width: 100%;
}
.list-content .delete-item:hover {
  display: block;
}
.list-content .my-box:hover + .delete-item {
  display: block;
}
.search-box {
  padding: 9px 8px;
  background: #e8ebf2;
  overflow: hidden;
  margin-bottom: 15px;
}
.search-box .el-form{
  flex-wrap: wrap;
}
.search-box .item-style{
  display: flex;
}
</style>
