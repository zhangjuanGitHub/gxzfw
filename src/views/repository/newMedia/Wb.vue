<template>
  <div class="content-box new-media">
    <!-- 搜索框 -->
    <div class="media-data-search">
      <div class="data-search-header">
        <el-form ref="form"
                 :model="ruleForm"
                 inline="inline"
                 label-position="left">
          <el-form-item label="时间"
                        prop="timeRange">
            <el-date-picker v-model="ruleForm.timeRange"
                            size="small"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="dateChange">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="排序"
                        prop="optionSort">
            <el-cascader v-model="ruleForm.optionSort"
                         :options="wbOptions"
                         size="small"></el-cascader>
          </el-form-item>
          <el-form-item class="keyword"
                        label="搜索">
            <el-select v-model="ruleForm.keywordType"
                             size="small"
                             placeholder="请选择">
              <el-option label="全部"
                          value="0"></el-option>
              <el-option label="内容"
                          value="2"></el-option>
              <el-option label="账号"
                          value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword">
            <el-input v-model="ruleForm.keyword"
                      size="small"
                      placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="searchList">筛选</el-button>
            <el-button size="small"
                       @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <ul class="content-ul">
      <li class="content-li" v-for="(item, index) of wbList" :key="index">
        <div class="right-box">
          <div class="department-detail">
            <div
              class="department-img"
              :style="{ backgroundImage: 'url(' + item.account.headimg + ')' }"
            ></div>
            <div class="dep-name-box">
              <div class="dis-flex-align">
                <p class="department-name media_highlight" v-html="item.account.nick"></p>
                <p class="department-time" v-text="item.article.pubtimeformat || '暂无'"></p>
              </div>
              <el-tooltip  class="item" effect="dark" content="添加至素材库" placement="top">
                <el-button @click.stop="downArticle(item)" type="primary" size="small" circle>
                  <i class="el-icon-download"/>
                </el-button>
              </el-tooltip>
            </div>
          </div>
          <div @click="trageUrl(item.article.articleurl)" class="cursor">
            <p
              class="main-body lin-clamp-3 media_highlight"
              v-html="item.article.content"
            ></p>
          </div>
          <!-- <div class="comsdsaa">
            <p>转发数：<span v-text="item.zhuanfanum || '0'"></span></p>
          </div> -->
          <div class="content-detail">
            <p>转发数：<span v-text="item.article.zhuanfa || '0'"></span></p>
            <p class="hot">评论数：<span v-text="item.article.pinglun || '0'"></span></p>
            <p class="hot">点赞数：<span v-text="item.article.dianzan || '0'"></span></p>
          </div>
        </div>
      </li>
    </ul>
    <div class="text-center" v-if="dataNull">
      <img :src="require('@/assets/images/empty-data.png')" alt="" />
    </div>
    <scroll-data @getData="getData" :dataLess="dataLess"></scroll-data>
    <tag-dialog
      :dialogVisible="dialogVisible"
      @closeModal="getCloseDialog"
      @confirmAddTag="getConfirmAddTag"
    >
    </tag-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import tagDialog from '../components/TagDialog'
const getSort = new Map()
  .set('timeUp', 'asc')
  .set('timeDo', 'desc')
  .set('zhuanfaUp', 'asc')
  .set('zhuanfaDo', 'desc')
  .set('dianzanUp', 'asc')
  .set('dianzanDo', 'desc')
  .set('pinglunUp', 'asc')
  .set('pinglunDo', 'desc')
export default {
  name: 'Wx',
  data () {
    return {
      wbOptions: [
        {
          value: 'pubtime',
          label: '时间',
          children: [{
            value: 'timeUp',
            label: '正序'
          }, {
            value: 'timeDo',
            label: '倒序'
          }]
        },
        {
          value: 'dianzan',
          label: '点赞数',
          children: [{
            value: 'dianzanUp',
            label: '正序'
          }, {
            value: 'dianzanDo',
            label: '倒序'
          }]
        },
        {
          value: 'zhuanfa',
          label: '转发数',
          children: [{
            value: 'zhuanfaUp',
            label: '正序'
          }, {
            value: 'zhuanfaDo',
            label: '倒序'
          }]
        },
        {
          value: 'pinglun',
          label: '评论数',
          children: [{
            value: 'pinglunUp',
            label: '正序'
          }, {
            value: 'pinglunDo',
            label: '倒序'
          }]
        }
      ],
      getSingleItem: {}, // 保存点击单条数据
      addCloud: {
        id: '',
        ncKeyword: '', // 标签
        sourceLevel: '2', // 文章来源
        numberId: '', // 账号id
        numberName: '', // 账号名称
        numberPic: '', // 账号头像
        articleId: '', // 文章id
        articleTitle: '', // 文章标题
        articleContent: '', // 文章内容
        articlePubtime: '', // 文章发布时间
        articlePic: '', // 文章封面图
        articleUrl: '' // 文章url
      }, // 添加云素材
      dialogVisible: false,
      wbList: [],
      dataLess: false,
      dataNull: false,
      ruleForm: {
        cid: '', // 栏目id
        keyword: '', // 搜索关键字
        region: '', // 地区
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        organization: '', // 职能
        pageNum: 1, // 页码
        timeRange: [],
        keywordType: '0',
        sortDirection: 'desc', // 排序顺序 desc
        optionSort: ['zhuanfa', 'zhuanfaDo'],
        sortField: 'zhuanfa' // 0时间，1阅读，2转发
      }
    }
  },
  methods: {
    // 重置
    resetForm (form) {
      this.dataNull = false
      this.$refs[form].resetFields()
      this.ruleForm.pageNum = 1
      this.ruleForm.keyword = ''
      this.wbList = []
      this.getWbList()
    },
    dateChange (val) {
      if (val === null) {
        this.ruleForm.timeRange = []
      }
    },
    // 筛选
    searchList () {
      this.dataNull = false
      this.ruleForm.pageNum = 1
      this.ruleForm.sortDirection = getSort.get(this.ruleForm.optionSort[1])
      this.ruleForm.sortField = this.ruleForm.optionSort[0]
      this.wbList = []
      this.getWbList()
    },
    // 确认添加标签
    getConfirmAddTag (item) {
      //   id: '',
      //   nvKeyword: '', // 标签
      //   sourceLevel: '', // 文章来源
      //   numberId: '', // 账号id
      //   numberName: '', // 账号名称
      //   numberPic: '', // 账号头像
      //   articleId: '', // 文章id
      //   articleTitle: '', // 文章标题
      //   articlePubtime: '', // 文章发布时间
      //   articlePic: '', // 文章封面图
      //   articleUrl: '' // 文章url
      this.addCloud.isSync = item.isSync
      this.addCloud.ncKeyword = item.filterArr.join(',')
      this.addCloud.numberId = this.getSingleItem.account.wbid
      this.addCloud.numberName = this.getSingleItem.account.nick
      this.addCloud.numberPic = this.getSingleItem.account.headimg
      this.addCloud.articleId = this.getSingleItem.article.waid
      this.addCloud.articlePubtime = this.getSingleItem.article.pubtimeformat
      this.addCloud.articleUrl = this.getSingleItem.article.articleurl
      this.$http.post(this.$api.addNewscloud, this.addCloud)
        .then(res => {
          this.$message.success('操作成功！')
        })
        .catch(() => {})
      this.dialogVisible = false
    },
    // 关闭弹出框
    getCloseDialog () {
      this.dialogVisible = false
    },
    // 显示弹出框
    downArticle (item) {
      this.getSingleItem = item
      this.dialogVisible = true
    },
    trageUrl (url) {
      window.open(url, '_blank')
    },
    getData () {
      this.ruleForm.pageNum++
      this.getWbList()
    },
    getWbList () {
      this.$http
        .post(this.$api.WbfindCityArticles, this.ruleForm)
        .then(res => {
          if (res.data.data.list.length) {
            let datas = res.data.data.list
            if (datas.length < 20) {
              this.dataLess = true
            }
            this.wbList.push(...datas)
          } else {
            this.dataNull = true
            this.wbList = []
          }
        })
        .catch(() => {})
    },
    // 获取最近一周
    getWeek () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.ruleForm.timeRange[0] = moment(start).format('YYYY-MM-DD')
      this.ruleForm.timeRange[1] = moment(end).format('YYYY-MM-DD')
    }
  },
  created () {
    this.getWeek()
    this.getWbList()
  },
  components: {
    tagDialog
  }
}
</script>
<style lang="scss">
@import "../repository";
</style>
<style scoped>
.new-media {
  background: #ffffff;
}
.new-media-title span {
  margin-left: 12px;
}
.content-detail p {
  color: #aaaaaa;
}
.content-detail span {
  color: #08a0f1;
}
.content-li:first-child.content-li {
  padding-top: 0;
}
.content-li {
  display: flex;
  padding: 22px 0;
  border-bottom: 1px solid rgba(204, 204, 204, 1);
}
.content-title {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  margin-bottom: 18px;
}
.main-body {
  font-size: 14px;
  color: #333333;
  margin-bottom: 28px;
  font-weight: 400;
  line-height: 1.5;
}
.content-detail {
  display: flex;
  justify-content: flex-end;
}
.content-detail .hot {
  margin-left: 15px;
}
.cover-box img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}
.department-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 0px;
  overflow: hidden;
  background-position: center;
  background-size: 100% 100%;
  /* background-size: 145px; */
}
.department-detail {
  display: flex;
  margin-bottom: 8px;
  align-items: center;
  height: 35px;
}
.cover-img {
  width: 255px;
  height: 168px;
  display: table-cell;
  vertical-align: middle;
}
.department-name {
  margin: 0 20px;
  font-size: 15px;
}
.department-time {
  font-size: 15px;
  color: #afafaf;
}
.right-box {
  width: 100%;
  flex: 1;
}
</style>
