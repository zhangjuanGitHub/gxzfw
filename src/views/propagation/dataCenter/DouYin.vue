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
          <!-- <el-form-item label="地区"
                        prop="districts">
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
                         :options="dyOptions"
                         size="small"
                         class="mode-wid"></el-cascader>
          </el-form-item>
          <el-form-item prop="keyword"
                        class="keyword"
                        label="关键字">
            <el-input v-model="form.keyword"
                      size="small"
                      placeholder="请输入关键字"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="searchdouyin">筛选</el-button>
            <el-button size="small"
                       @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <!-- 内容列表 -->
    <div class="data-out-douyin">
      <div class="data-center-douyin" v-if="!dataNull">
        <div class="douyin-page"
             v-for="(item,index) in centerdouyin"
             :key="index">
          <!-- 抖音 -->
          <div class="douyin-right">
            <div class="douyin-cont"
                 v-if="item.video.cover_url">
              <el-image :src="item.video.cover_url"
                        fit="cover"
                        @click="Websock(item.video)"></el-image>
              <div class="douyin-title lin-clamp-1"
                   @click="Websock(item.video)"
                   v-html="item.video.video_desc">
              </div>
              <div class="douyin-see">
                <ul class="see-left">
                  <li class="header-img">
                    <p class="color-blue"
                       @click="getDetail(item.account)">
                      <img :src="item.account.avatar_img">
                    </p>
                  </li>
                  <li>
                    <p class="color-blue">
                      <img :src="require('@/assets/images/allmonit/xin.png')">
                      <span>{{item.video.digg_count}}</span></p>
                  </li>
                  <li>
                    <p class="color-blue">
                      <img :src="require('@/assets/images/allmonit/pinglun.png')">
                      <span>{{item.video.comment_count}}</span>
                    </p>
                  </li>
                  <li>
                    <p class="color-blue">
                      <img :src="require('@/assets/images/allmonit/zhuanfa.png')">
                      <span>{{item.video.share_count}}</span></p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="dataNull"
             class="text-center">
          <img :src="require('@/assets/images/empty-data.png')">
          <p style="color:#F56C6C">暂无数据...</p>
        </div>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import scrollData from '@/components/ScrollData'
import moment from 'moment'
const getSort = new Map()
  .set('timeUp', 'asc')
  .set('timeDo', 'desc')
  .set('dianzanUp', 'asc')
  .set('dianzanDo', 'desc')
  .set('pinglunUp', 'asc')
  .set('pinglunDo', 'desc')
  .set('zhaunfaUp', 'asc')
  .set('zhaunfaDo', 'desc')
export default {
  data () {
    return {
      seen: false,
      x: 0,
      y: 0,
      positionStyle: { top: '20px', left: '20px' },
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
      centerdouyin: [],
      functionList: [],
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
      dyOptions: [
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
          value: 'share_count',
          label: '转发',
          children: [{
            value: 'zhaunfaUp',
            label: '正序'
          }, {
            value: 'zhaunfaDo',
            label: '倒序'
          }]
        },
        {
          value: 'comment_count',
          label: '评论',
          children: [{
            value: 'pinglunUp',
            label: '正序'
          }, {
            value: 'pinglunDo',
            label: '倒序'
          }]
        },
        {
          value: 'digg_count',
          label: '点赞数',
          children: [{
            value: 'dianzanUp',
            label: '正序'
          }, {
            value: 'dianzanDo',
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
      this.form.order = 1
      this.form.sort = 0
      this.centerdouyin = []
      this.getRouterData()
    },
    // 筛选
    searchdouyin () {
      if (!this.form.publishTime) {
        this.form.publishTime = []
      }
      this.form.pageNum = 1
      this.form.sortDirection = getSort.get(this.form.optionSort[1])
      this.form.sortField = this.form.optionSort[0]
      this.centerdouyin = []
      this.getRouterData()
    },
    // 获取文章内容
    getRouterData () {
      this.form.cid = this.$route.query.dis || '1'
      this.dataNull = false
      this.dataLess = false
      this.$http.post(this.$api.dyNewsList, this.form)
        .then(res => {
          if (res.data.code === 200 && res.data.data.list) {
            this.centerdouyin.push(...res.data.data.list)
            if (res.data.data.list.length < 20) {
              this.dataLess = true
            }
            this.centerdouyin.forEach(item => {
              if (item.video.digg_count > 10000) {
                item.video.digg_count = (item.video.digg_count / 10000).toFixed(1) + 'w'
              }
              if (item.video.comment_count > 10000) {
                item.video.comment_count = (item.video.comment_count / 10000).toFixed(1) + 'w'
              }
              if (item.video.share_count > 10000) {
                item.video.share_count = (item.video.share_count / 10000).toFixed(1) + 'w'
              }
            })
            this.centerdouyin.length === 0 ? this.dataNull = true : this.dataNull = false
          } else {
            this.centerdouyin = []
            this.dataNull = true
            this.dataLess = true
          }
        })
        .catch(() => {
        })
    },
    // 获取文章点击
    Websock (item, index) {
      window.open(item.video_url, '_blank')
    },
    // 跳转个人信息详情
    getDetail (item, index) {
      this.$router.push({ name: 'CenterDetail', query: { id: item.id, type: 'douyin', come: this.$route.query.dis } })
    },
    // 获取地区列表
    getScreenlist () {
      let row = {
        cid: this.form.cid,
        type: 5
      }
      this.$http.post(this.$api.findLevelDistricts, row)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
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
      this.centerdouyin = []
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
@import '../bigData';
</style>
<style scoped>
#data-center {
  box-sizing: border-box;
  padding: 20px;
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
.data-out-douyin {
  overflow: hidden;
  width: 1069px;
  min-height: 400px;
}
.data-center-douyin {
  width: 100%;
  margin-top: 10px;
  min-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
}
.data-center-douyin::-webkit-scrollbar {
  display: none;
}
.data-center-douyin {
  -ms-overflow-style: none;
  overflow: -moz-scrollbars-none;
  scrollbar-width: none;
  display: flex;
  flex-wrap: wrap;
}
.douyin-right {
  cursor: pointer;
}
.data-center-douyin .douyin-page {
  width: 23%;
  height: 330px;
  top: 0px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  margin-right: 25px;
  display: flex;
}
.data-center-douyin .douyin-page:nth-of-type(4n + 4){
  margin-right: 0px;
}
.douyin-title {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 84%;
  position: absolute;
  color: #fff;
  bottom: 25px;
  font-size: 14px;
  padding: 5px;
  box-sizing: border-box;
}
.douyin-see {
  width: 44px;
  padding: 5px;
  position: absolute;
  bottom: 3px;
  right: 0px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  display: flex;
}
.douyin-see li {
  height: 60px;
}
.douyin-see .color-blue img {
  display: block;
  width: 30px;
  height: 30px;
}
.douyin-see .header-img {
  height: 50px;
}
.douyin-see .header-img .color-blue img {
  border-radius: 50%;
}
.douyin-see li .color-blue span {
  display: block;
  text-align: center;
  margin-top: 5px;
}
.color-blue {
  width: 32px;
}
.hover-con {
  position: absolute;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 5px;
}
.hover-con p {
  line-height: 20px;
}
.see-right p {
  height: 40px;
  line-height: 40px;
}
</style>
