<template>
  <div class="web-monitor">
    <div class="web-header">
      <el-form ref="from"
               :model="from">
        <el-form-item label="时间:"
                      prop="publishTime">
          <el-date-picker v-model="from.publishTime"
                          size="small"
                          type="daterange"
                          range-separator="至"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     size="small"
                     @click="moreReprint">筛选</el-button>
          <el-button size="small"
                     @click="reset('from')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="web-content">
      <div class="monitor-box">
        <div class="upper-left">
          <p class="monitor-head">
            <span class="title-box">传播力指数分析</span>
          </p>
          <div id="monitor-area"></div>
        </div>
        <div class="upper-right web-name">
          <p class="monitor-head">
            <span class="title-box">信息总览</span>
          </p>
          <p class="databox">网站名称</p>
          <div class="databox-cont">
            <p>
              <i>
                <img src="@/assets/images/allmonit/icon_1.png"
                     alt="">
              </i>
              <span class="datacont"
                    v-text="message.name"></span>
            </p>
          </div>
          <p class="databox">网站类型</p>
          <div class="databox-cont">
            <p>
              <i>
                <img src="@/assets/images/allmonit/icon_3.png"
                     alt=""></i>
              <span class="datacont category"
                    v-text="message.category"></span>
            </p>
          </div>
          <p class="databox">定制频道</p>
          <div class="databox-cont">
            <p>
              <i>
                <img src="@/assets/images/allmonit/icon_2.png"
                     alt="">
              </i>
              <span class="datacont columnNum"
                    v-text="message.columnNum"></span>
            </p>
          </div>
        </div>
      </div>
      <div class="monitor-box">
        <div class="upper-left">
          <p class="monitor-head">
            <span class="title-box">被转载量分析</span>
          </p>
          <div id="monitor-line"></div>
        </div>
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">转载网站Top10</span>
          </p>
          <div id="monitor-sverse"></div>
        </div>
      </div>
      <div class="monitor-box first-box">
        <div class="upper-left first-left">
          <p class="monitor-head">
            <span class="title-box">原创量转载量分析</span>
          </p>
          <div class="monitor-table big-table">
            <el-table :data="pieData"
                      stripe
                      border
                      class="big-table">
              <el-table-column prop="title"
                               label="">
              </el-table-column>
              <el-table-column prop="total"
                               label="发布总量"
                               width="100">
              </el-table-column>
              <el-table-column prop="yuan"
                               label="原创总量"
                               width="100">
              </el-table-column>
              <el-table-column prop="zhuan"
                               label="转载量"
                               width="100">
              </el-table-column>
              <el-table-column prop="beizhuan"
                               label="被转载总量"
                               width="100">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="upper-right first-left">
          <p class="monitor-head">
            <span class="title-box">区检察院网站传播力排行榜</span>
          </p>
          <div class="monitor-table big-table">
            <el-table :data="quData"
                      stripe
                      border
                      max-height="193px">
              <el-table-column prop="branch"
                               label="单位">
              </el-table-column>
              <el-table-column prop="ycSum"
                               label="原创量"
                               width="100">
              </el-table-column>
              <el-table-column prop="bzSum"
                               label="被转载量"
                               width="100">
              </el-table-column>
              <el-table-column prop="percentage"
                               label="传播指数"
                               width="100">
                <template slot-scope="scope">
                  <div>{{scope.row.percentage}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="monitor-box">
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">频道发稿分析</span>
          </p>
          <div id="monitor-colum"></div>
        </div>
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">被各类型网站转载占比</span>
          </p>
          <div id="monitor-cake"></div>
        </div>
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">各频道发稿维度分析</span>
          </p>
          <div class="monitor-table big-table">
            <el-table :data="tableData"
                      stripe
                      max-height="288px"
                      style="width: 100%">
              <el-table-column prop="title"
                               label=""
                               width="60">
              </el-table-column>
              <el-table-column prop="total"
                               label="发稿量"
                               width="80">
                <template slot-scope="scope">
                  <div class="colorbule">
                    <span v-text="scope.row.total"></span>
                    <span v-if="scope.row.title==='环比'">
                      <i class="el-icon-top"
                         style="color:#0ba350"
                         v-if="artucleTotal>0"></i>
                      <i class="el-icon-bottom"
                         style="color:#e94f4f"
                         v-if="artucleTotal<0"></i>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="yuan"
                               label="原创量"
                               width="80">
                <template slot-scope="scope">
                  <div class="colorbule">
                    <span v-text="scope.row.yuan"></span>
                    <span v-if="scope.row.title==='环比'">
                      <i class="el-icon-top"
                         style="color:#0ba350"
                         v-if="artucleYuan>0"></i>
                      <i class="el-icon-bottom"
                         style="color:#e94f4f"
                         v-if="artucleYuan<0"></i>
                    </span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="beizhuan"
                               label="被转载量">
                <template slot-scope="scope">
                  <div class="colorbule">
                    <span v-text="scope.row.beizhuan"></span>
                    <span v-if="scope.row.title==='环比'">
                      <i class="el-icon-top"
                         style="color:#0ba350"
                         v-if="artucleBeizhuan>0"></i>
                      <i class="el-icon-bottom"
                         style="color:#e94f4f"
                         v-if="artucleBeizhuan<0"></i>
                    </span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="el-icon-d-arrow-right leave-more"
           @click="firorsec"></div>
    </div>
  </div>
</template>
<script>
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/chart/bar')
require('echarts/lib/component/dataZoom')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      quData: [], // 区检察院网站传播力排行榜
      pieData: [], // 原创量转载量分析
      options: [], // 频道选择
      tableData: [],
      from: {
        id: 98,
        publishTime: []
      },
      artucleYuan: '',
      artucleBeizhuan: '',
      artucleTotal: '',
      loading: true,
      message: {}
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
    this.from.publishTime[0] = this.formatDate(start)
    this.from.publishTime[1] = this.formatDate(end)
  },
  mounted () {
    this.getSiteChart() // 区检察院网站传播力排行榜
    this.circular() // 原创量转载量分析
    this.monitorArea() // 折线图 指数
    this.monitorColum() // 柱状图 频道发稿分析
    this.monitorCake() // 饼状图 发稿总量分析
    this.monitorLine() // 折线图 被转载量走势
    this.monitorSverse() // 柱状图 转载网站top10
    this.getRowss() // 获取信息总览
    this.getArtucle() // 获取文章信息
  },
  methods: {
    // 区检察院网站传播力排行榜
    getSiteChart () {
      this.$http.get(this.$api.totalData, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.quData.push(...res.data.data)
          }
        })
        .catch(() => {
        })
    },
    // 原创量转载量分析
    circular () {
      this.$http.get(this.$api.totalWeb2)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.pieData.push(...res.data.data)
            this.pieData.forEach(item => {
              if (!item.bzSum || item.bzSum < 0) {
                item.bzSum = 0
              }
              if (!item.ycSum || item.ycSum < 0) {
                item.ycSum = 0
              }
              if (!item.zzSum || item.zzSum < 0) {
                item.zzSum = 0
              }
            })
          }
        })
        .catch(() => {
        })
    },
    formatDate (now) {
      var year = now.getFullYear() + '-'
      var month = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-'
      var d = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
      return year + month + d
    },
    timestampToTime (timestamp) {
      var Y = timestamp.getFullYear() + '-'
      var M = (timestamp.getMonth() + 1 < 10 ? '0' + (timestamp.getMonth() + 1) : timestamp.getMonth() + 1) + '-'
      var D = (timestamp.getDate() < 10 ? '0' + timestamp.getDate() : timestamp.getDate()) + ' '
      var h = (timestamp.getHours() < 10 ? '0' + timestamp.getHours() : timestamp.getHours()) + ':'
      var m = (timestamp.getMinutes() < 10 ? '0' + timestamp.getMinutes() : timestamp.getMinutes()) + ':'
      var s = (timestamp.getSeconds() < 10 ? '0' + timestamp.getSeconds() : timestamp.getSeconds())
      return Y + M + D + h + m + s
    },
    // 折线图 传播力指数 *
    monitorArea () {
      let areaChart = echarts.init(document.getElementById('monitor-area'))
      this.$http.post(this.$api.siteChart1, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            areaChart.setOption({
              tooltip: { trigger: 'axis' },
              legend: {
                data: ['传播力指数']
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                'axisTick': { // 刻度
                  'show': false
                },
                'axisLine': { // 线
                  'show': true
                },
                'splitLine': {
                  'show': true // 网格线
                },
                data: res.data.data.listTime
              },
              yAxis: {
                type: 'value',
                'axisTick': { // 刻度
                  'show': false
                },
                'axisLine': { // 线
                  'show': true
                },
                'splitLine': { // 网格线
                  'show': false
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
                'end': 35
              }],
              series: [{
                name: '传播力指数',
                data: res.data.data.listData,
                type: 'line',
                stack: '总量',
                itemStyle: {
                  normal: {
                    color: '#f688af'
                  }
                },
                areaStyle: { type: 'default' }
              }]
            })
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 柱状图 频道发稿分析 *
    monitorColum () {
      let areaChart = echarts.init(document.getElementById('monitor-colum'))
      this.$http.post(this.$api.siteChart6, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let name = []
            let yuanData = []
            let cntData = []
            res.data.data.forEach(item => {
              name.push(item.cname)
              yuanData.push(item.yuan)
              cntData.push(item.cnt)
            })
            areaChart.setOption({
              legend: {
                data: ['原创量', '发稿量'],
                align: 'left'
              },
              color: ['#4fcb73', '#39a0ff'],
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              xAxis: [
                {
                  type: 'category',
                  data: name,
                  axisTick: {
                    alignWithLabel: true
                  }
                }
              ],
              yAxis: [
                {
                  type: 'value',
                  'axisLine': { // y轴
                    'show': false
                  },
                  'axisTick': { // y轴刻度线
                    'show': false
                  }
                }
              ],
              series: [
                {
                  name: '原创量',
                  type: 'bar',
                  stack: 'two',
                  itemStyle: {
                    emphasis: {
                      barBorderWidth: 1,
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                      shadowColor: 'rgba(0,0,0,0.5)'
                    }
                  },
                  barWidth: '60%',
                  data: yuanData
                },
                {
                  name: '发稿量',
                  type: 'bar',
                  stack: 'two',
                  itemStyle: {
                    emphasis: {
                      barBorderWidth: 1,
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                      shadowColor: 'rgba(0,0,0,0.5)'
                    }
                  },
                  barWidth: '60%',
                  data: cntData
                }
              ]
            })
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 饼状图 发稿总量分析 *
    monitorCake () {
      let pieChart = echarts.init(document.getElementById('monitor-cake'))
      this.$http.post(this.$api.siteChart4, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let pieData = []
            res.data.data.forEach(item => {
              let oneData = {
                name: item.siteType,
                value: item.cnt
              }
              pieData.push(oneData)
            })
            let color = ['#0E7CE2', '#FF8352', '#E271DE', '#F8456B', '#00FFFF', '#4AEAB0']
            pieChart.setOption({
              tooltip: { trigger: 'item' },
              color: color,
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '50%'],
                  data: pieData,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ]
            })
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 折线图 被转载量走势 *
    monitorLine () {
      let lineChart = echarts.init(document.getElementById('monitor-line'))
      this.$http.post(this.$api.siteChart3, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            lineChart.setOption({
              title: {},
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['转载量曲线']
              },
              grid: {
                left: '15',
                right: '35',
                bottom: '0',
                top: '10',
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
                data: res.data.data.listTime,
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
                  name: '转载量曲线',
                  type: 'line',
                  color: '#1f90e5',
                  lineStyle: {
                    normal: {
                      width: 8,
                      color: {
                        type: 'linear',

                        colorStops: [{
                          offset: 0,
                          color: '#A9F387' // 0% 处的颜色
                        }, {
                          offset: 1,
                          color: '#48D8BF' // 100% 处的颜色
                        }],
                        globalCoord: false // 缺省为 false
                      },
                      shadowColor: 'rgba(72,216,191, 0.3)',
                      shadowBlur: 10,
                      shadowOffsetY: 20
                    }
                  },
                  data: res.data.data.listData
                }
              ]
            })
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 柱状图 转载网站top10 *
    monitorSverse () {
      let lineChart = echarts.init(document.getElementById('monitor-sverse'))
      this.$http.post(this.$api.siteChart5, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            lineChart.setOption({
              tooltip: { trigger: 'axis' },
              color: ['#39a0ff'],
              grid: {
                left: '90',
                right: '10',
                bottom: '30'
              },
              xAxis: {
                type: 'value',
                'axisTick': { // 刻度
                  'show': false
                },
                'axisLine': { // 线
                  'show': true
                },
                'splitLine': {
                  'show': true // 网格线
                }
              },
              yAxis: {
                type: 'category',
                data: res.data.data.listTime,
                'axisTick': { // 刻度
                  'show': false
                },
                nameTextStyle: {
                  color: '#06D3CD',
                  fontSize: 14,
                  fontFamily: 'PingFangSC',
                  fontWeight: 300,
                  padding: [0, 0, 8, 0]
                },
                'axisLine': { // 线
                  'show': true
                },
                axisLabel: {
                  color: '#10899A',
                  show: true,
                  rotate: -30
                },
                'splitLine': {
                  'show': false // 网格线
                }
              },
              series: [{
                type: 'bar',
                itemStyle: {
                  barBorderRadius: 10,
                  color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
                    offset: 0,
                    color: 'rgba(0,222,215,0.2)'
                  },
                  {
                    offset: 1,
                    color: '#FFFC00'
                  }
                  ])
                },
                barWidth: 10,
                data: res.data.data.listData

              }]
            })
            this.loading = false
          }
        }).catch(() => {
          this.loading = false
        })
    },
    firorsec () {
      this.$router.push({ name: 'MoreMonitor', query: { tabs: 'website', time: this.from.publishTime } })
    },
    // 获取信息总览 *
    getRowss () {
      this.$http.post(this.$api.allInfo, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.message = res.data.data
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 获取稿件环比
    getArtucle () {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
      let params = {
        id: 98,
        publishTime: [this.timestampToTime(start), this.timestampToTime(end)]
      }
      this.$http.post(this.$api.totalDataByDate, params)
      // this.$http.post(this.$api.totalDataByDate, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tableData = res.data.data
            this.artucleYuan = this.tableData[1].yuan
            this.artucleBeizhuan = this.tableData[1].beizhuan
            this.artucleTotal = this.tableData[1].total
            if (this.tableData[1].yuan !== 0.00) {
              this.tableData[1].yuan = this.tableData[1].yuan * 100 + '%'
            } else {
              this.tableData[1].yuan = '--'
            }
            if (this.tableData[1].beizhuan !== 0.00) {
              this.tableData[1].beizhuan = this.tableData[1].beizhuan * 100 + '%'
            } else {
              this.tableData[1].beizhuan = '--'
            }
            if (this.tableData[1].total !== 0.00) {
              this.tableData[1].total = this.tableData[1].total * 100 + '%'
            } else {
              this.tableData[1].total = '--'
            }
            // console.log(this.artucleTotal)
          }
        }).catch(() => {
          this.loading = false
        })
    },
    // 筛选
    moreReprint () {
      if (!this.from.publishTime) {
        this.from.publishTime = []
      }
      this.monitorArea() // 折线图 指数
      this.monitorColum() // 柱状图 频道发稿分析
      this.monitorCake() // 饼状图 发稿总量分析
      this.monitorLine() // 折线图 被转载量走势
      this.monitorSverse() // 柱状图 转载网站top10
      this.getRowss() // 获取信息总览
      this.getArtucle() // 获取文章信息
    },
    // 重置
    reset (formName) {
      this.$refs[formName].resetFields()
      this.tableData = []
      this.monitorArea() // 折线图 指数
      this.monitorColum() // 柱状图 频道发稿分析
      this.monitorCake() // 饼状图 发稿总量分析
      this.monitorLine() // 折线图 被转载量走势
      this.monitorSverse() // 柱状图 转载网站top10
      this.getRowss() // 获取信息总览
      this.getArtucle() // 获取文章信息
    }
  }
}
</script>
<style scoped>
.web-monitor {
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
}
.web-header .el-form .el-button {
  border-radius: 0px;
  margin: 0 10px;
}
.web-header .el-form .el-form-item:first-of-type {
  margin-right: 10px;
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
.first-box{
  height: 300px;
}
.monitor-box .first-left,
.monitor-box .first-right {
  width: 50%;
  padding: 20px;
  height: 300px;
}
.title-box {
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 8px;
}
.monitor-head {
  margin-bottom: 40px;
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
  padding: 30px;
}
.databox-cont i img {
  width: 35px;
  height: 35px;
  vertical-align: middle;
  margin: 0 10px 0 -5px;
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
  text-align: center;
  margin: 15px 0px;
}
.databox-cont p {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
}
.monitor-table {
  margin-top: 30px;
}
/* .monitor-box .web-name {
  padding: 30px 75px;
} */
.web-content {
  position: relative;
}
.leave-more {
  position: absolute;
  font-size: 60px;
  font-weight: bolder;
  color: #06a4f2;
  cursor: pointer;
  top: 50%;
  right: -36px;
}
.upper-right .databox {
  margin: 10px auto;
}
.datacont {
  min-width: 250px;
  text-align: center;
  overflow: hidden;
  font-size: 20px;
  color: #06a4f2;
  font-weight: bolder;
  box-sizing: border-box;
}
.category {
  padding-right: 35px;
}
.columnNum {
  padding-right: 42px;
}
</style>
