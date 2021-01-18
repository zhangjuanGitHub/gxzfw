<template>
  <div class="content-box new-media">
    <!-- 搜索框 -->
    <div class="media-data-search">
      <div class="data-search-header">
        <el-form ref="ruleForm"
                 :model="ruleForm"
                 inline="inline"
                 label-position="left">
          <el-form-item label="时间"
                        prop="publishTime">
            <el-date-picker v-model="ruleForm.publishTime"
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
            <el-select v-model="ruleForm.function"
                      size="small"
                      placeholder="全部"
                      class="mode-wid">
              <el-option v-for="(item, index) of functionList"
                        :label="item"
                        :value="item"
                        :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序"
                        prop="optionSort">
            <el-cascader v-model="ruleForm.optionSort"
                         :options="dyOptions"
                         size="small"></el-cascader>
          </el-form-item>
          <el-form-item prop="keyword"
                        label="关键字">
            <el-input v-model="ruleForm.keyword"
                      size="small"
                      placeholder="请输入关键字"
                      class="mode-wid"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="searchList">筛选</el-button>
            <el-button size="small"
                       @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="text-center" v-if="dataNull">
      <img :src="require('@/assets/images/empty-data.png')" alt="" />
    </div>
    <div class="content-douyin" v-else>
      <div class="douyin-page" v-for="(item,index) in dyList" :key="index">
        <div class="cursor">
          <div v-if="item.video.cover_url">
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
                  <p class="color-blue">
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
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
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
  name: 'Wx',
  data () {
    return {
      functionList: [],
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
          label: '转发数',
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
      ],
      dyList: [],
      dataLess: false,
      dataNull: false,
      ruleForm: {
        cid: '3', // 栏目id
        districts: [],
        publishTime: [],
        pageNum: 1, // 页码
        pageSize: 20,
        keyword: '',
        function: '',
        sortDirection: 'desc', // 排序顺序 desc
        sortField: 'digg_count', // 0时间，1阅读，2转发
        optionSort: ['digg_count', 'dianzanDo']
      }
    }
  },
  methods: {
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.dataNull = false
      this.ruleForm.pageNum = 1
      this.ruleForm.keyword = ''
      this.dyList = []
      this.getDyList()
    },
    // 筛选
    searchList () {
      if (!this.ruleForm.publishTime) {
        this.ruleForm.publishTime = []
      }
      this.dataNull = false
      this.ruleForm.pageNum = 1
      this.ruleForm.sortDirection = getSort.get(this.ruleForm.optionSort[1])
      this.ruleForm.sortField = this.ruleForm.optionSort[0]
      this.dyList = []
      this.getDyList()
    },
    getData () {
      this.ruleForm.pageNum++
      this.getDyList()
    },
    // 获取文章点击
    Websock (item, index) {
      window.open(item.video_url, '_blank')
    },
    getDyList () {
      this.dataLess = false
      this.$http.post(this.$api.dyNewsList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data.list) {
            this.dyList.push(...res.data.data.list)
            if (res.data.data.list.length < 20) {
              this.dataLess = true
            }
            this.dyList.forEach(item => {
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
            this.dyList.length === 0 ? this.dataNull = true : this.dataNull = false
          } else {
            this.dyList = []
            this.dataNull = true
            this.dataLess = true
          }
        })
        .catch(() => {
        })
    },
    // 获取最近一周
    getWeek () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      this.ruleForm.publishTime[0] = moment(start).format('YYYY-MM-DD')
      this.ruleForm.publishTime[1] = moment(end).format('YYYY-MM-DD')
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
  created () {
    this.getDyList()
    this.getWeek()
    this.getShowFunction()
  },
  components: {}
}
</script>
<style lang="scss">
@import "../repository";
</style>
<style scoped>
.new-media {
  background: #ffffff;
}
.content-douyin {
  width: 100%;
  margin-top: 10px;
  min-height: 400px;
  overflow-x: hidden;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
}
.douyin-page {
  width: 23%;
  height: 330px;
  top: 0px;
  overflow: hidden;
  margin-bottom: 16px;
  position: relative;
  margin-right: 25px;
  display: flex;
}
.content-douyin .douyin-page:nth-of-type(4n + 4){
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
  bottom: 8px;
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
