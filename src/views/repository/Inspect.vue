<template>
  <div class='inspect'>
    <div class='inspect-header'>
      <el-form ref="ruleForm"
                :model="ruleForm"
                inline="inline"
                label-position="left">
        <el-form-item label="选择时间"
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
        <el-form-item prop="keyword" label="关键字">
          <el-input v-model="ruleForm.keyword"
                    size="small"
                    placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button size="small"
                      type="primary"
                      @click="checkKeyword">筛选</el-button>
          <el-button size="small"
                      @click="resetBtnForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <!--      <router-link :to="{name: 'Null'}">更多</router-link>-->
    </div>
    <div class='content-box'>
      <ul class='content-ul'>
        <li class='content-li'
            v-for="(item, index) of inspectList"
            :key="index">
          <div>
            <div class="title-align">
              <p @click="targetUrl(item.url)" class='content-title cursor lin-clamp-1' v-html="item.title"></p>
              <el-tooltip  class="item" effect="dark" content="添加至素材库" placement="top">
                <el-button @click="downArticle(item)" type="primary" size="small" circle>
                  <i class="el-icon-download"/>
                </el-button>
              </el-tooltip>
            </div>
            <p @click="targetUrl(item.url)" class='main-body cursor lin-clamp-3 media_highlight' v-html="item.summary"></p>
          </div>
          <div class='content-detail'>
            <p>发布时间：<span v-text="item.insert_time"></span></p>
            <!-- <p class='track' @click="track(item,index)"><i>热</i><span>添加追踪</span></p>
            <p v-if="item.status === 1">状态：<span class="danger">未分析</span></p>
            <p v-else-if="item.status === 2">状态：<span class="primary">分析中</span></p>
            <p v-else-if="item.status === 3">状态：<span class="success">已完成</span></p> -->
            <!-- <p>相似报道数：<span v-text="item.hot_score"></span></p> -->
            <p class="media_highlight">来源：<span v-html="item.source"></span></p>
          </div>
        </li>
      </ul>
      <v-dialog
        :trackForm="trackForm"
        :trackVisible="trackVisible"
        @closeModal="getClose"
        @confirmDia="getConfirmDia"
      >
      </v-dialog>
    </div>
    <div class="text-center"
         v-if="dataNull">
      <img :src="require('@/assets/images/empty-data.png')"
           alt="">
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
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
import vDialog from './components/Dialog'
import tagDialog from './components/TagDialog'
export default {
  name: 'Inspect',
  data () {
    return {
      inspectList: [],
      dataLess: false,
      dataNull: false,
      trackVisible: false,
      trackForm: {
        id: '',
        specialName: '',
        specialKeyword: '',
        time: [],
        sourceId: '' // 文章id
      },
      dialogVisible: false,
      addCloud: {
        id: '',
        ncKeyword: '', // 标签
        isSync: '',
        sourceLevel: '3', // 文章来源
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
      ruleForm: {
        cid: '', // 栏目id
        keyword: '', // 搜索关键字
        region: '', // 地区
        startDate: '', // 开始时间
        endDate: '', // 结束时间
        organization: '', // 职能
        pageNum: 1, // 页码
        pageSize: 20, // 页容量
        sortDirection: '', // 排序顺序 desc
        sortField: '', // 0时间，1阅读，2转发
        timeRange: []

      }
    }
  },
  methods: {
    // 关闭弹出框
    getCloseDialog () {
      this.dialogVisible = false
    },
    // 显示弹出框
    downArticle (item) {
      console.log(item)
      this.getSingleItem = item
      this.dialogVisible = true
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
      this.addCloud.numberId = this.getSingleItem.id
      this.addCloud.numberName = this.getSingleItem.source
      this.addCloud.articleId = this.getSingleItem.id
      this.addCloud.articleTitle = this.getSingleItem.title
      this.addCloud.articlePubtime = this.getSingleItem.insert_time
      this.addCloud.articleUrl = this.getSingleItem.url
      this.$http.post(this.$api.addNewscloud, this.addCloud)
        .then(res => {
          this.$message.success('操作成功！')
        })
        .catch(() => {})
      this.dialogVisible = false
    },
    resetBtnForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.dataNull = false
      this.inspectList = []
      this.ruleForm.keyword = ''
      this.getList()
    },
    dateChange (val) {
      if (val === null) {
        this.ruleForm.timeRange = []
      }
    },
    getData () {
      this.ruleForm.pageNum++
      this.getList()
    },
    // 跳转
    targetUrl (url) {
      window.open(url, '_blank')
    },
    // 筛选
    checkKeyword () {
      this.dataNull = false
      this.inspectList = []
      this.getList()
    },
    // 获取信息列表
    getList () {
      this.$http.post(this.$api.hotFindArticles, this.ruleForm)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            if (datas.length < 20) {
              this.dataLess = true
            }
            this.inspectList.push(...datas)
          } else {
            this.dataNull = true
            this.inspectList = []
          }
        })
        .catch(() => { })
    },
    // 热点追踪弹框
    track (item, index) {
      if (item.status === 1) {
        this.trackForm.sourceId = item.id
        this.trackVisible = true
      } else if (item.status === 2) {
        this.$message.warning('文章分析中！')
      } else if (item.status === 3) {
        this.$message.warning('文章分析已完成！')
      }
    },
    // 取消弹框
    getClose () {
      this.trackVisible = false
    },
    getConfirmDia () {
      this.trackVisible = false
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
    this.getList()
  },
  components: {
    // eslint-disable-next-line vue/no-unused-components
    vDialog,
    tagDialog
  }
}
</script>
<style lang="scss">
  @import "repository";
  .inspect-header .el-form-item {
    margin-bottom: 0px;
  }
  .inspect-header .el-form {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
  }
</style>
<style scoped>
.search-input {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
  margin-left: 30px;
}
.time-range {
  margin-left: 30px;
  font-size: 14px;
}
.admin-keyword {
  width: 200px;
}
.btn-box {
  margin-right: 20px;
}
.inspect {
  background: #ffffff;
  min-height: 500px;
  overflow: hidden;
}
.inspect-header {
  height: 40px;
  margin: 16px 26px;
  background-color: #eff1f4;
  border-radius: 10px;
}
.inspect-header span {
  color: #606266;
}
.inspect-title:before {
  content: "";
  width: 5px;
  height: 24px;
  background: #2c8ae5;
  position: absolute;
  top: 20px;
}
.inspect-title {
  line-height: 32px;
}
.inspect-title span {
  font-size: 16px;
}
.content-box {
  padding: 0 32px;
}
.inspect-title span {
  margin-left: 12px;
}
.content-detail p {
  color: #aaaaaa;
  margin-right: 15px;
}
.content-detail span {
  color: #08a0f1;
}
.content-li {
  padding: 16px 0;
  border-top: 1px solid rgba(204, 204, 204, 1);
}
.content-li .title-align {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.content-title {
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  /* margin-bottom: 18px; */
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
  /* justify-content: space-between; */
}
.track{
  cursor: pointer;
}
.track i{
  display: inline-block;
  width: 16px;
  padding: 2px;
  border-radius: 2px;
  background-color: #08a0f1;
  color: #fff;
  font-style: normal;
  margin-right: 5px;
}
</style>
