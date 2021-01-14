<template>
  <div class="web-monitor">
    <div class="web-header">
      <el-form ref="form"
               :model="form">
        <el-form-item  label="地区" prop="districts">
                  <el-cascader :options="screenData"
                  size="small"
                               v-model="form.districts"
                               placeholder="全部"
                               :show-all-levels="false"
                               :props="{ checkStrictly: true }"
                               clearable></el-cascader>
                </el-form-item>
        <el-form-item label="请选择时间:"
                      prop="date">
          <el-date-picker v-model="form.date"
                          size="small"
                          type="daterange"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="moreReprint">筛选</el-button>
          <el-button size="small"
                     @click="reset('form')">重置</el-button>
          <el-button type="primary" size="small"
                     @click="wxExportpost">导出图表</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="monitor-box">
      <div class="upper-left">
        <p class="monitor-head">
          <span class="title-box">传播力指数分析</span>
        </p>
        <div id="wechat-line"
               @mouseenter="enter()"
               @mouseleave="leave()"></div>
      </div>
      <div class="upper-right">
        <p class="monitor-head">
            <span class="title-box">信息总览</span>
          </p>
        <div class="echarts-right">
            <p class="databox">发稿总量</p>
            <p class="databox-sum">
              <i><img src="@/assets/images/dataimg/dispatch.png" alt=""></i>
              <span v-text="article.articleSum"></span>
            </p>
            <p class="databox">被转载量</p>
            <p class="databox-sum">
              <i><img src="@/assets/images/dataimg/reprint.png" alt=""></i>
              <span v-text="article.transshipmentSum"></span>
            </p>
          </div>
      </div>
    </div>
    <div class="monitor-box">
      <div class="upper-left">
        <p class="monitor-head">
          <span class="title-box">发稿量分析</span>
        </p>
        <div id="monitor-area"></div>
      </div>
      <div class="upper-right creadData">
        <p class="monitor-head">
          <span class="title-box">公众号认可度排行榜</span>
        </p>
        <div class="monitor-table big-table">
          <el-table :data="creadData"
                    stripe
                    border
                    max-height="280px"
                    style="width: 100%">
            <el-table-column prop="title"
                             label="排名"
                             width="50"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="公众号"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="colorbule title">
                  <span v-text="scope.row.name"></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="average"
                             label="平均点赞数"
                             width="95">
            </el-table-column>
            <!-- <el-table-column prop="readTotal"
                             label="阅读数"
                             width="80">
            </el-table-column> -->
            <el-table-column prop="sumPointNum"
                             label="总点赞数"
                             width="80">
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="monitor-box wx-table">
      <div class="upper-left">
        <p class="monitor-head">
          <span class="title-box">被转载量分析</span>
        </p>
        <div id="monitor-line"></div>
      </div>
      <div class="upper-right">
        <p class="monitor-head">
          <span class="title-box">被公众号转载Top10</span>
        </p>
        <div id="monitor-sverse"></div>
      </div>
    </div>
    <div class="monitor-box">
      <div class="upper-left big-table monitor-table">
        <p class="monitor-head">
          <span class="title-box">热门文章Top50</span>
        </p>
        <el-table :data="tableData"
                  stripe
                  max-height="295px"
                  style="width: 100%">
          <el-table-column prop="rank"
                           label="排名"
                           width="70">
            <template slot-scope="scope">
              <div>{{scope.$index+1}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="title"
                           label="文章标题"
                           width="200"
                           border
                           show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="article"
                   @click="openWeb(scope.row)">
                <span v-html="scope.row.title"></span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="pubtimeformat"
                           label="发布时间"
                           width="130">
          </el-table-column>
          <el-table-column prop="readnum"
                           label="阅读数"
                           width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.readnum>=0">{{scope.row.readnum}}</span>
              <span v-else
                    style="color:red;">正在统计...</span>
            </template>
          </el-table-column>
          <el-table-column prop="likenum"
                           label="在看数"
                           width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.likenum>=0">{{scope.row.likenum}}</span>
              <span v-else
                    style="color:red;">正在统计..</span>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="simcnt"
                           label="被网站转载"
                           width="100">
            <template slot-scope="scope">
              <span v-if="scope.row.simcnt>0">{{scope.row.simcnt}}</span>
              <span v-else
                    style="color:red;">正在计算...</span>
            </template>
          </el-table-column> -->
          <el-table-column prop="countsum"
                           label="被公众号转载"
                           width="130">
            <template slot-scope="scope">
              <span v-if="scope.row.countsum>=0">{{scope.row.countsum}}</span>
              <span v-else
                    style="color:red;">正在计算...</span>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="upper-right">
        <p class="monitor-head">
          <span class="title-box">公众号发稿量Top10</span>
        </p>
        <div class="monitor-table big-table">
          <el-table :data="asseData"
                    stripe
                    max-height="288px"
                    style="width: 100%">
            <el-table-column prop="title"
                             label="排名"
                             width="70">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             label="公众号"
                             width="200">
              <template slot-scope="scope">
                <div class="colorbule">
                  <span v-text="scope.row.name"></span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="articleCountNum"
                             label="发稿量">
              <template slot-scope="scope">
                <div>
                  <span v-text="scope.row.articleCountNum"></span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/component/dataZoom')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
export default {
  data () {
    return {
      article: {},
      tableData: [],
      creadData: [],
      asseData: [],
      form: {
        districts: [],
        value: '',
        date: []
      },
      loading: true,
      fromData: {
        id: [],
        districts: [],
        searchTime: []
      },
      // options: [],
      screenData: []
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
    this.form.date[0] = this.formatDate(start)
    this.form.date[1] = this.formatDate(end)
  },
  mounted () {
    this.getScreenlist()
    this.fromData.searchTime = this.form.date
    this.drawLine()
    this.getArticle()
    this.monitorArea() // 1
    this.Ranking() // 2
    this.monitorLine() // 3
    this.monitorSverse() // 4
    this.Reprinted() // 5
    this.Assessment() // 6
    this.selectWeixin()
  },
  methods: {
    wxExportpost () {
      let url = process.env.VUE_APP_BASE_URL + this.$api.wxExportpost + '?searchTime=' + this.form.date + '&districts' + this.form.districts
      window.open(url, '_blank')
    },
    formatDate (now) {
      var year = now.getFullYear() + '-'
      var month = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-'
      var d = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
      return year + month + d
    },
    // 微信总量和转发量
    getArticle () {
      this.$http.post(this.$api.findWxSum, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.article = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 鼠标移出
    leave () {
      this.timer && clearInterval(this.timer)// 清除定时器
      this.faultByHourIndex = 0 // 播放所在下标
      this.timer = setInterval(() => { // 使得tootip每隔三秒自动显示
        this.lineChart.dispatchAction({
          type: 'showTip', // 根据 tooltip 的配置项显示提示框。
          seriesIndex: 0,
          dataIndex: this.faultByHourIndex
        })
        this.faultByHourIndex++
        if (this.faultByHourIndex >= this.option.series[0].data.length) {
          this.faultByHourIndex = 0
        }
      }, 1000)
    },
    // 鼠标移入
    enter () {
      this.timer && clearInterval(this.timer)// 清除定时器
    },
    // 面积图
    drawLine () {
      let lineChart = echarts.init(document.getElementById('wechat-line'))
      this.$http.post(this.$api.findSpreadAnalyze, this.fromData)
        .then(res => {
          if (res.data.data) {
            let data = res.data.data.listData
            let lineData = []
            data.forEach(item => {
              lineData.push(item)
            })
            let option = {
              tooltip: {
                trigger: 'axis',
                formatter: '{b0}<br/>{a0}: {c0}<br />'
              },
              legend: {
                data: ['微信传播力指数'],
                x: 'right'
              },
              grid: {
                left: '3%',
                right: '6%',
                bottom: '14%',
                containLabel: true
              },

              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                axisTick: { // 刻度
                  'show': false
                },
                axisLine: { // 线
                  'show': true
                },
                splitLine: {
                  'show': false // 网格线
                },
                data: res.data.data.listCat
              },
              yAxis: {
                type: 'value',
                axisLabel: {
                  show: true,
                  interval: 'auto',
                  formatter: '{value}'
                },
                axisTick: { // 刻度
                  'show': false
                },
                axisLine: { // 线
                  'show': true
                },
                splitLine: {
                  'show': false // 网格线
                }
              },
              dataZoom: [{
                'show': true,
                'height': 12,
                'xAxisIndex': [0],
                bottom: '8%',
                'start': 0,
                'end': 100,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                  color: '#d3dee5'

                },
                textStyle: {
                  color: '#333' },
                borderColor: '#90979c'
              }, {
                'type': 'inside',
                'show': true,
                'height': 15,
                'start': 1,
                'end': res.data.data.listCat.length
              }],
              series: [
                {
                  name: '微信传播力指数',
                  type: 'line',
                  stack: '总量',
                  data: lineData,
                  smooth: true,
                  itemStyle: {
                    color: 'rgb(114, 53, 238)',
                    normal: {
                      color: '#275F82', // 改变折线点的颜色
                      lineStyle: {
                        color: 'rgba(22, 175, 250, 1)' // 改变折线颜色
                      },
                      width: 10,
                      shadowColor: '#275F82',
                      shadowBlur: 10,
                      shadowOffsetY: 10
                    }
                  },
                  areaStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                      offset: 0,
                      color: 'rgb(204,209,255,0.6)'
                    }, {
                      offset: 1,
                      color: 'rgb(39, 126, 224)'
                    }])
                  }
                }
              ]
            }
            this.option = option
            this.lineChart = lineChart
            lineChart.setOption(option)
            this.leave()
          }
        })
        .catch(() => {
        })
    },
    // 堆积柱状图 发稿量
    monitorArea () {
      let areaChart = echarts.init(document.getElementById('monitor-area'))
      this.$http.post(this.$api.findArticleCountAnalyze, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            var option = {
              // backgroundColor: '#323a5e',
              'tooltip': {
                'trigger': 'axis',
                'axisPointer': {
                  'type': 'shadow',
                  textStyle: {
                    color: '#fff'
                  }

                }
              },
              grid: {
                left: '2%',
                right: '4%',
                bottom: '14%',
                top: '16%',
                containLabel: true
              },
              legend: {
                data: ['阅读数', '点赞数', '文章统计数'],
                right: 10,
                top: 12,
                textStyle: {
                  color: '#333'
                },
                itemWidth: 12,
                itemHeight: 10
                // itemGap: 35
              },
              xAxis: {
                type: 'category',
                data: res.data.data.timeList,
                axisLine: {
                  lineStyle: {
                    color: '#333'

                  }
                },
                axisLabel: {
                  // interval: 0,
                  // rotate: 40,
                  textStyle: {
                    fontFamily: 'Microsoft YaHei'
                  }
                }
              },

              yAxis: {
                max: '10000',
                type: 'value',
                axisLine: {
                  show: false,
                  lineStyle: {
                    color: '#333'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: 'rgba(0,0,0,0.3)'
                  }
                },
                axisLabel: {}
              },
              dataZoom: [{
                'show': true,
                'height': 12,
                'xAxisIndex': [0],
                bottom: '8%',
                'start': 0,
                'end': 100,
                handleIcon: 'path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z',
                handleSize: '110%',
                handleStyle: {
                  color: '#d3dee5'

                },
                textStyle: {
                  color: '#333' },
                borderColor: '#90979c'
              }, {
                'type': 'inside',
                'show': true,
                'height': 15,
                'start': 1,
                'end': 35
              }],
              series: [
                {
                  name: '文章统计数',
                  type: 'bar',
                  stack: 'sum',
                  barWidth: '30%',
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#fccb05'
                      }, {
                        offset: 1,
                        color: '#f5804d'
                      }])
                    }
                  },
                  data: res.data.data.articleCountNumList
                },
                {
                  name: '点赞数',
                  type: 'bar',
                  stack: 'sum',
                  barWidth: '30%',
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#8bd46e'
                      }, {
                        offset: 1,
                        color: '#09bcb7'
                      }])
                    }

                  },
                  data: res.data.data.sumPointNumList
                },
                {
                  name: '阅读数',
                  type: 'bar',
                  stack: 'sum',
                  barWidth: '30%',
                  itemStyle: {
                    normal: {
                      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#248ff7'
                      }, {
                        offset: 1,
                        color: '#6851f1'
                      }])
                    }
                  },
                  data: res.data.data.sumReadNumList
                }
              ]
            }
            areaChart.setOption(option)
            // var app = {
            //   currentIndex: -1
            // }
            // setInterval(function () {
            //   var dataLen = option.series[0].data.length

            //   // 取消之前高亮的图形
            //   areaChart.dispatchAction({
            //     type: 'downplay',
            //     seriesIndex: 0,
            //     dataIndex: app.currentIndex
            //   })
            //   app.currentIndex = (app.currentIndex + 1) % dataLen
            //   // console.log(app.currentIndex);
            //   // 高亮当前图形
            //   areaChart.dispatchAction({
            //     type: 'highlight',
            //     seriesIndex: 0,
            //     dataIndex: app.currentIndex
            //   })
            //   // 显示 tooltip
            //   areaChart.dispatchAction({
            //     type: 'showTip',
            //     seriesIndex: 0,
            //     dataIndex: app.currentIndex
            //   })
            // }, 1000)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 折线图 转载量
    monitorLine () {
      let lineChart = echarts.init(document.getElementById('monitor-line'))
      this.$http.post(this.$api.chart4Weixin, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let date = []
            let sum = []
            res.data.data.forEach(item => {
              date.push(item.dte)
              sum.push(item.countsum)
            })
            lineChart.setOption({
              title: {},
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['被公众号转发'],
                right: 10,
                textStyle: {
                  color: '#333'
                },
                itemWidth: 12,
                itemHeight: 10
              },
              grid: {
                left: '15',
                right: '35',
                bottom: '0',
                top: '20',
                containLabel: true
              },
              toolbox: {
                feature: {
                  saveAsImage: {}
                }
              },
              xAxis: {
                type: 'category',
                axisTick: {
                  show: false
                },
                boundaryGap: false,
                data: date,
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#ccc'],
                    width: 1,
                    type: 'solid'
                  }
                }
              },
              yAxis: {
                type: 'value',
                axisTick: {
                  show: false
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['#ccc'],
                    width: 1,
                    type: 'solid'
                  }
                }
              },
              series: [
                {
                  name: '被公众号转发',
                  type: 'line',
                  color: '#1f90e5',
                  data: sum
                }
                // {
                //   name: '被网站转发',
                //   type: 'line',
                //   color: '#ed7d31',
                //   data: res.data.data.listData2
                // }
              ]
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 柱状图 转载网站top10
    monitorSverse () {
      let lineChart = echarts.init(document.getElementById('monitor-sverse'))
      this.$http.post(this.$api.chart5Weixin, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let listData = []
            let listCat = []
            res.data.data.forEach(item => {
              listData.push(item.countsum)
              listCat.push(item.nickname)
            })
            lineChart.setOption({
              tooltip: {
                trigger: 'axis'
              },
              color: ['#39a0ff'],
              grid: {
                left: '15',
                right: '5',
                bottom: '0',
                top: '10',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                data: listCat,
                axisTick: { // 刻度
                  'show': false
                },
                axisLabel: {
                  formatter: function (value) {
                    return value.split('').join('\n')
                  }
                },
                axisLine: { // 线
                  'show': true
                },
                splitLine: {
                  'show': false // 网格线
                }
              },
              yAxis: {
                type: 'value',
                axisTick: { // 刻度
                  'show': false
                },
                axisLine: { // 线
                  'show': true
                },
                splitLine: {
                  'show': true // 网格线
                }
              },
              series: [{
                data: listData,
                type: 'bar'
              }]
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 转载公众号top10
    Assessment () {
      this.$http.post(this.$api.reprintWeixin, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.asseData.push(...res.data.data)
          }
        })
        .catch(() => {

        })
    },
    // 热门文章表格
    Reprinted () {
      this.$http.post(this.$api.hotWeixin, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tableData.push(...res.data.data)
            this.tableData.filter(item => {
              item.pubtimeformat = moment(item.pubtimeformat).format('YYYY.MM.DD')
            })
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 区县公众号top10
    Ranking () {
      this.$http.post(this.$api.tongjiWeixin, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.creadData.push(...res.data.data)
            // this.palay()
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    change () {
      this.creadData.push(this.creadData[0]) // 把第一条数据插入数组最有一条
      this.creadData.shift() // 删除数组中第一条数据
    },
    palay () {
      setInterval(this.change, 2000)
    },
    // 获取地区列表
    getScreenlist () {
      this.$http.get(this.$api.findWxDistricts)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 微信下拉选择框
    selectWeixin () {
      this.$http.get(this.$api.selectWeixin)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.options = res.data.data
          }
        })
        .catch(() => {
        })
    },
    openWeb (row, index) {
      window.open(row.content_url)
    },
    // 筛选
    moreReprint () {
      if (this.form.districts.length) {
        this.fromData.districts = this.form.districts
      } else {
        this.fromData.districts = []
      }
      if (!this.form.date) {
        this.form.date = []
      }
      this.fromData.searchTime = this.form.date
      this.article = {}
      this.creadData = []
      this.tableData = []
      this.asseData = []
      this.monitorArea() // 1
      this.Ranking() // 2
      this.monitorLine() // 3
      this.monitorSverse() // 4
      this.Reprinted() // 5
      this.Assessment() // 6
      this.drawLine()
      this.getArticle()
    },
    // 重置
    reset (formName) {
      // this.form.value = ''
      this.$refs[formName].resetFields()
      this.fromData.searchTime = []
      this.fromData.id = []
      this.fromData.districts = []
      this.creadData = []
      this.tableData = []
      this.asseData = []
      this.monitorArea() // 1
      this.Ranking() // 2
      this.monitorLine() // 3
      this.monitorSverse() // 4
      this.Reprinted() // 5
      this.Assessment() // 6
      this.drawLine()
      this.getArticle()
    }
  }
}
</script>
<style scoped>
.web-monitor{
  padding-top: 20px;
  box-sizing: border-box;
}
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.web-header {
  overflow: hidden;
}
.web-header .el-form {
  overflow: hidden;
  display: flex;
  float: right;
}
.web-header .el-form .el-form-item {
  display: flex;
  margin-bottom: 10px;
  margin-right: 10px;
}
.web-header .el-form .el-button {
  border-radius: 0px;
}
.demonstration {
  margin-right: 10px;
  float: right;
  font-size: 14px;
  line-height: 29px;
}
.monitor-box {
  height: 395px;
  display: flex;
  justify-content: space-between;
}
.upper-left {
  width: 66.5%;
  height: 390px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.upper-right {
  width: 33%;
  height: 390px;
  background-color: #fff;
  padding: 20px;
  box-sizing: border-box;
}

.title-box {
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 8px;
}
.monitor-head {
  display: block;
  margin-bottom: 20px;
}
.title-box::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 20px;
  background-color: #06a4f2;
  position: relative;
  top: 4px;
  margin-right: 12px;
  border-radius: 5px;
}
#monitor-area,
#monitor-colum,
#monitor-cake,
#monitor-line,
#monitor-sverse {
  height: 300px;
}

.upper-right {
  box-sizing: border-box;
  padding: 20px;
}
.databox-cont i img {
  width: 35px;
  height: 35px;
  vertical-align: middle;
}
.upper-right p {
  margin-bottom: 17px;
}
.upper-right .databox {
  width: 135px;
  height: 36px;
  background-color: #16b0fa;
  border-radius: 11px;
  font-size: 21px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 33px;
  margin: 15px 60px;
}
.databox-cont span {
  font-size: 30px;
  vertical-align: middle;
  font-weight: bold;
  color: #308afc;
  line-height: 38px;
  margin-left: 20px;
}
.databox-cont .last {
  display: inline-block;
  width: 135px;
}
.colorbule {
  color: #06a4f2;
  cursor: pointer;
  text-decoration: underline;
}
.monitor-box .creadData {
  padding: 30px 20px;
}
.title span {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.article span {
  cursor: pointer;
  text-decoration: underline;
  color: #06a4f2;
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
#wechat-line,.echarts-right{
  height: 300px;
}
.echarts-right{
  padding-top: 20px;
  box-sizing: border-box;
}
.echarts-right i{
  margin-left: -38px;
}
.echarts-right img {
  width: 38px;
  height: 38px;
  vertical-align: middle;
}
.echarts-right .databox {
  width: 135px;
  height: 33px;
  background: rgba(22, 175, 250, 1);
  border-radius: 11px;
  font-size: 21px;
  font-weight: 500;
  color: rgba(255, 255, 255, 1);
  line-height: 33px;
  text-align: center;
  margin: 17px auto;
}
.echarts-right .databox-sum{
  width: 135px;
  display: flex;
  margin: 0 auto;
}
.echarts-right p span {
  font-size: 35px;
  vertical-align: middle;
  font-weight: bold;
  color: rgba(48, 137, 253, 1);
  line-height: 38px;
  margin-left: 24px;
  display: inline-block;
  width: 135px;
  text-align: center;
  margin: 0 auto;
}
</style>
