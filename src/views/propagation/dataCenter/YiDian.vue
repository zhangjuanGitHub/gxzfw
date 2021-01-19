<template>
  <div id="data-center"
       class="data-content">
    <!-- 搜索栏 -->
    <div class="data-search">
      <div class="data-center-header data-center-box">
        <el-form ref="form"
                 :model="form"
                 inline="inline"
                 label-position="left">
          <el-form-item label="时间"
                        prop="publishTime">
            <el-date-picker v-model="form.publishTime"
                            size="small"
                            type="daterange"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"
                            range-separator="-"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="职能"
                        prop="function">
            <el-select v-model="form.function"
                      size="small"
                      placeholder="全部"
                      class="mode-wid">
              <el-option v-for="(item, index) of functionList"
                        :label="item"
                        :value="item"
                        :key="index"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item  label="地区" prop="districts">
            <el-cascader :options="screenData"
                        size="small"
                        class="mode-wid"
                        v-model="form.districts"
                        placeholder="全部"
                        :show-all-levels="false"
                        :props="{ checkStrictly: true }"
                        clearable></el-cascader>
          </el-form-item> -->
          <el-form-item label="排序"
                        prop="optionSort">
            <el-cascader v-model="form.optionSort"
                         :options="wxOptions"
                         size="small"
                         class="mode-wid"></el-cascader>
          </el-form-item>
          <el-form-item class="keyword" prop="keyword"
                        label="关键字">
            <el-input v-model="form.keyword"
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
    <!-- 内容列表 -->
    <div class="data-out-list">
      <div class="data-center-list">
        <div class="data-page"
             v-for="(item,index) in centerList"
             :key="index">
          <div class="list-left cursor" @click="Websock(item.article,index)">
            <img v-if="item.article.image_url"
                 :src="item.article.image_url">
            <img v-else
                 :src="require('@/assets/images/empty-data.png')">
          </div>
          <!-- 一点 -->
          <div class="list-right">
            <div class="list-user">
              <div class="head-image"
                   @click="getDetail(item.account,index)"
                   :style="{ 'backgroundImage': 'url(' + item.account.channel_image + ')' }">
              </div>
              <span @click="getDetail(item.account,index)"
                    class="user-name">{{item.account.media_name}}</span>
            </div>
            <div class="list-title">
              <h2 v-html="item.article.title" class="lin-clamp-1"
                  @click="Websock(item.article,index)"></h2>
            </div>
            <div class="list-cont lin-clamp-3"
                 v-if="item.article.summary"
                 @click="Websock(item.article,index)"
                 v-html="item.article.summary"></div>
            <!-- <div v-else
                 style="height: 66px; line-height:33px">暂无内容...</div> -->
            <div class="list-see">
              <ul>
                <li>
                  <span>发布时间:</span>
                  <p class="color-blue">{{item.article.publish_time}}</p>
                </li>
                <!-- <li>
                  <span>评论数:</span>
                  <p class="color-blue">{{item.article.comment_count}}</p>
                </li>
                <li>
                  <span>点赞数:</span>
                  <p class="color-blue">{{item.article.like_count}}</p>
                </li>
                <li>
                  <span>转发数:</span>
                  <p class="color-blue">{{item.article.down_count}}</p>
                </li> -->
              </ul>
            </div>
          </div>
          <!-- 推荐 -->
          <div class="user-dialog">
            <el-dialog :visible.sync="item.dialogVisible"
                       :modal="ismodal"
                       @close="getDialog(item, index)"
                       center
                       width="30%">
              <el-form :model="dynamicValidateForm"
                       ref="dynamicValidateForm"
                       :rules="rules">
                <el-form-item class="bordno"
                              prop="type1">
                  <el-checkbox-group v-model="dynamicValidateForm.type1">
                    <el-checkbox label="1"><img :src="require('@/assets/images/dataimg/u5586.png')">微信</el-checkbox>
                    <el-checkbox label="2"><img :src="require('@/assets/images/dataimg/u1770.png')">微博</el-checkbox>
                    <el-checkbox label="3"><img :src="require('@/assets/images/dataimg/u5607.png')">网站</el-checkbox>
                    <el-checkbox label="4"><img :src="require('@/assets/images/dataimg/u1766.png')">今日头条</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item prop="number">
                  <el-input type="textarea"
                            :rows="4"
                            placeholder="请输入推荐理由"
                            v-model="dynamicValidateForm.number">
                  </el-input>
                </el-form-item>
              </el-form>
              <span slot="footer"
                    class="dialog-footer">
                <el-button type="primary"
                           @click="setDialogText(item, index)">确 定</el-button>
                <el-button @click="getDialog(item, index)">取 消</el-button>
              </span>
            </el-dialog>
          </div>
        </div>
        <div v-if="dataNull"
             class="text-center">
          <img :src="require('@/assets/images/empty-data.png')">
          <p style="color:#F56C6C">暂无数据...</p>
        </div>
      </div>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import scrollData from '@/components/ScrollData'
import { mapState } from 'vuex'
import moment from 'moment'
const getSort = new Map()
  .set('timeUp', 'asc')
  .set('timeDo', 'desc')
  .set('dianzanUp', 'asc')
  .set('dianzanDo', 'desc')
  .set('zhuanfaUp', 'asc')
  .set('zhuanfaDo', 'desc')
  .set('pinglunUp', 'asc')
  .set('pinglunDo', 'desc')
export default {
  data () {
    return {
      functionList: [],
      type: '',
      dataLess: false,
      dataNull: false,
      dynamicValidateForm: {
        type1: [],
        number: '',
        name: ''
      },
      rules: {
        type1: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ]
      },
      dialogVisible: false, // 回复弹框
      ismodal: false, // 遮罩
      centerList: [],
      form: {
        function: '全部',
        districts: [],
        keyword: '',
        cid: 1,
        publishTime: [],
        sortDirection: 'desc',
        optionSort: ['publish_time', 'timeDo'],
        sortField: '',
        pageNum: 1,
        pageSize: 20
      },
      screenData: [],
      wxOptions: [
        {
          value: 'publish_time',
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
          value: 'comment_count',
          label: '评论数',
          children: [{
            value: 'pinglunUp',
            label: '正序'
          }, {
            value: 'pinglunDo',
            label: '倒序'
          }]
        },
        {
          value: 'like_count',
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
          value: 'down_count',
          label: '转发数',
          children: [{
            value: 'zhuanfaUp',
            label: '正序'
          }, {
            value: 'zhuanfaDo',
            label: '倒序'
          }]
        }
      ]
    }
  },
  methods: {
    // 获取最近一周
    getWeek () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7 + 1)
      this.form.publishTime[0] = moment(start).format('YYYY-MM-DD')
      this.form.publishTime[1] = moment(end).format('YYYY-MM-DD')
    },
    // 重置
    resetForm (form) {
      this.$refs[form].resetFields()
      this.form.pageNum = 1
      this.centerList = []
      this.getRouterData()
    },
    // 筛选
    searchList () {
      if (!this.form.publishTime) {
        this.form.publishTime = []
      }
      this.form.pageNum = 1
      this.form.sortDirection = getSort.get(this.form.optionSort[1])
      this.form.sortField = this.form.optionSort[0]
      this.centerList = []
      this.getRouterData()
    },
    // 获取文章内容
    getRouterData () {
      this.form.cid = this.$route.query.dis || '1'
      this.dataNull = false
      this.dataLess = false
      this.$http.post(this.$api.ydNewsList, this.form)
        .then(res => {
          if (res.data.code === 200 && res.data.data.list) {
            this.centerList.push(...res.data.data.list)
            if (res.data.data.list.length < 20) {
              this.dataLess = true
              this.dataNull = true
            }
            this.centerList.length === 0 ? this.dataNull = true : this.dataNull = false
          } else {
            this.centerList = []
            this.dataNull = true
            this.dataLess = true
          }
        })
        .catch(() => {
        })
    },
    // 获取文章点击
    Websock (item, index) {
      window.open(item.article_url, '_blank')
    },
    // 关闭弹窗
    getDialog (item, index) {
      item.dialogVisible = false
      this.$set(this.centerList, index, item)
    },
    // 推荐外部文章
    setDialogText (item, index) {
      this.$set(this.centerList, index, item)
      let listcread = {
        suitRange: this.dynamicValidateForm.type1.toString(),
        adviseReason: this.dynamicValidateForm.number
      }
      listcread.articleSummary = item.content.substring(0, 100) // 摘要
      listcread.articleTitle = item.title // 标题
      listcread.externalUrl = item.contenturl // 稿件外部链接
      if (listcread.suitRange) {
        this.$http.post(this.$api.adviseExternal, listcread)
          .then(res => {
            if (res.data.code === 200) {
              item.dialogVisible = false
              this.$message.success(res.data.message)
              this.$router.push({ name: 'TeamMessage' })
            }
          })
          .catch(() => {
          })
      } else {
        this.$message.success('请选择账号类型')
      }
    },
    // 推荐弹窗
    showTeamDialog (item, index) {
      item.dialogVisible = true
      this.$set(this.centerList, index, item)
    },
    // 跳转个人信息详情
    getDetail (item, index) {
      this.$router.push({ name: 'CenterDetail', query: { id: item.id, type: 'yidian', come: this.$route.query.dis } })
    },
    // 获取地区列表
    getScreenlist () {
      let row = {
        cid: this.form.cid,
        type: 6
      }
      this.$http.post(this.$api.findLevelDistricts, row)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 下拉加载
    getData () {
      this.form.pageNum++
      this.getRouterData()
    },
    // 获取职能
    getShowFunction () {
      this.$http.get(this.$api.showFunction)
        .then(res => {
          this.functionList = res.data.data
        })
        .catch(() => { })
    }
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    })
  },
  created () {
    this.getWeek()
    this.form.cid = this.$route.query.dis
    this.getRouterData()
    this.getScreenlist()
    this.getShowFunction()
  },
  watch: {
    $route () {
      this.form.cid = this.$route.query.dis
      this.form.pageNum = 1
      this.centerList = []
      this.getRouterData()
      this.getScreenlist()
    }
  },
  components: {
    scrollData
  }
}
</script>
<style lang="scss" scoped>
@import "../bigData";
</style>
<style scoped>
#data-center {
  box-sizing: border-box;
  padding: 20px;
}
.data-out-list {
  overflow: hidden;
  width: 1069px;
  min-height: 400px;
}
.data-center-list {
  width: 1069px;
  margin-top: 10px;
  min-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.data-center-list::-webkit-scrollbar {
  display: none;
}
.data-center-list {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
}
.reroder {
  width: 130px;
  line-height: 40px;
}
.data-center-list .user-dialog .data-page {
  top: 0px;
  overflow: hidden;
}
.user-dialog .el-checkbox-group img {
  vertical-align: middle;
  margin-right: 13px;
}
.reroder .reroder-box {
  display: flex;
  width: 100%;
  justify-content: space-around;
}
.reroder .reroder-box li {
  display: flex;
  justify-content: space-between;
}
.reroder .reroder-box li img {
  margin-right: 7px;
  vertical-align: middle;
  cursor: pointer;
}
.data-page {
  border-bottom: 1px solid #ccc;
  margin-bottom: 16px;
  position: relative;
  margin-right: 12px;
  display: flex;
}
/* .list-left {
  width: 255px;
  height: 168px;
  margin-right: 29px;
}
.list-left img {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
} */
.list-left {
  margin-right: 29px;
}
.list-left img {
    width: 255px;
  height: 168px;
}
.list-right {
  width: 74%;
}
.list-title h2 {
  width: 90%;
  font-size: 18px;
  line-height: 25px;
  font-weight: bold;
color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.list-cont {
  height: 66px;
  text-align: left;
  text-indent: 28px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin: 10px 0;
  padding-right: 20px;
  cursor: pointer;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  text-overflow: -o-ellipsis-lastline;
  overflow: hidden;
  position: relative;
}
.list-user {
  overflow: hidden;
  margin-bottom: 10px;
}
.list-user span,
.list-user .head-image {
  float: left;
}
.list-user .head-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 0px;
  overflow: hidden;
  background-position: center;
  background-size: 30px;
  background-repeat: no-repeat;
}
.list-user .el-image {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  margin-top: 0px;
  float: left;
  vertical-align: middle;
}
.list-user .user-name {
  text-decoration: underline;
  color: rgba(56, 117, 240, 1);
  line-height: 32px;
  cursor: pointer;
}
.list-see .user-name {
  text-decoration: underline;
  color: rgba(56, 117, 240, 1);
  cursor: pointer;
}
.list-see {
  overflow: hidden;
}
.list-user span {
  display: inline-block;
  font-size: 15px;
  font-weight: 400;
  color: rgba(175, 175, 175, 1);
  line-height: 32px;
  margin-left: 10px;
}
#data-center .list-see ul {
  height: 30px;
  margin-right: 10px;
  display: flex;
}
#data-center .list-see ul li {
  display: flex;
  color: #aaaaaa;
}
.list-see p {
  font-size: 14px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  line-height: 25px;
  margin: 0 7px;
}
.list-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}
.list-title i {
  padding-right: 26px;
  cursor: pointer;
}
.data-center-header {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
  margin: 15px 0;
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #333;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.data-center-header .el-form {
  width: 100%;
  padding: 0 8px;
  /* display: flex;
  justify-content: space-around; */
}
.data-center-header .el-form .el-form-item {
  margin-right: 20px;
  margin-bottom: 0;
  float: left;
}
.data-center-header .el-form .el-form-item:last-child {
  float: right;
}
.list-see .color-blue {
  color: #309ade;
}
.read-num {
  margin-right: 15px;
}
.back-img {
  display: inline-block;
  width: 30px;
  height: 30px;
  border-radius: 50%;
}
</style>
