<template>
  <div class="exponent">
    <div class="echarts-website">
      <p class="website-head">
        <span class="title-box">网站传播力</span>
        <router-link :to="{name:'WebMonitor'}"><i class="el-icon-s-data"></i><span>全部图表</span></router-link>
      </p>
      <div class="echarts-cont">
        <div class="echarts-left big-table">
          <span class="echarts-title">原创量转载量分析</span>
          <el-table :data="pieData"
                    stripe
                    border >
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
        <div class="echarts-right">
          <div id="website-circular" class="big-table">
            <span class="echarts-title">区检察院网站传播力排行榜</span>
            <el-table :data="tableData"
                      stripe border
                      max-height="198px">
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
    </div>
    <div class="echarts-wechat">
      <p class="wechat-head">
        <span class="title-box">微信传播力</span>
        <router-link :to="{name:'WxMonitor'}"><i class="el-icon-s-data"></i><span>全部图表</span></router-link>
      </p>
      <span class="echarts-title">传播力指数分析</span>
      <div class="echarts-cont">
        <div class="echarts-left">
          <div id="wechat-line"
               @mouseenter="enter()"
               @mouseleave="leave()"></div>
        </div>
        <div class="right-box">
          <div class="echarts-right">
            <p class="databox">发稿总量</p>
            <p><i><img src="@/assets/images/dataimg/dispatch.png"
                     alt=""></i> <span v-text="article.articleSum"></span></p>
            <p class="databox">被转载量</p>
            <p><i><img src="@/assets/images/dataimg/reprint.png"
                     alt=""></i> <span v-text="article.transshipmentSum"></span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
require('echarts/lib/component/legend')
require('echarts/lib/component/dataZoom')
export default {
  data () {
    return {
      tableData: [],
      timmer: '',
      lineChart: '',
      pieData: [],
      option: {},
      faultByHourIndex: '',
      from: {
        wid: 14
      },
      article: {}
    }
  },
  mounted () {
    this.getSiteChart()
    this.circular()
    this.drawLine()
    this.getArticle()
    // new Promise(this.getSiteChart).then(this.circular).then(this.drawLine).then(this.getArticle).catch(err => {
    //   this.$message.error(err)
    // })
  },
  methods: {
    // 区检察院网站传播力排行榜
    getSiteChart () {
      this.$http.get(this.$api.totalData, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tableData.push(...res.data.data)
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
      this.$http.get(this.$api.findSpreadAnalyze)
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
                'start': 80,
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
    // 微信总量和转发量
    getArticle () {
      this.$http.get(this.$api.findWxSum)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.article = res.data.data
          }
        })
        .catch(() => {
        })
    }
  },
  destroyed () {
    this.timer && clearInterval(this.timer)// 清除定时器
  }
}
</script>
<style scoped>
.echarts-website,
.echarts-wechat {
  padding: 15px;
  padding-left: 35px;
  margin-bottom: 15px;
  line-height: 30px;
  background-color: #fff;
}
.website-head a,
.wechat-head a {
  float: right;
  text-decoration: underline;
  font-size: 16px;
  color: #06a4f2;
}
.el-icon-s-data {
  border: 1px solid #06a4f2;
  font-size: 14px;
  margin-right: 10px;
}
.exponent .title-box {
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 8px;
}
.exponent .title-box::before {
  content: "";
  display: inline-block;
  width: 9px;
  height: 20px;
  background-color: #06a4f2;
  position: relative;
  top: 3px;
  margin-right: 12px;
  border-radius: 5px;
}
.echarts-cont {
  display: flex;
  justify-content: space-between;
}
.echarts-cont .echarts-left {
  width: 50%;
}
.echarts-right {
  width: 45%;
  margin: auto;
}
.echarts-wechat .echarts-right {
  width: 390px;
  height: 300px;
  margin-right: 20px;
  background: rgba(251, 255, 254, 1);
  border: 1px solid rgba(238, 238, 238, 1);
  box-sizing: border-box;
  padding: 30px 40px;
  float: right;
}
.echarts-right img {
  width: 38px;
  height: 38px;
  vertical-align: middle;
}
.echarts-right p {
  margin-bottom: 17px;
  margin-left: 25px;
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
.echarts-right p span {
  font-size: 35px;
  vertical-align: middle;
  font-weight: bold;
  color: rgba(48, 137, 253, 1);
  line-height: 38px;
  margin-left: 24px;
}
#website-circular {
  margin: auto;
}
#wechat-line {
  height: 300px;
}
.echarts-cont .table-name {
  width: 100%;
  text-align: right;
}
.echarts-cont .table-name span {
  display: inline-block;
  height: 20px;
  font-size: 19px;
  font-family: PingFang-SC-Medium;
}

.echarts-cont .table-name span i {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-right: 13px;
  background-color: rgb(255, 70, 131);
}
.right-box {
  width: 45%;
  overflow: hidden;
}
.echarts-cont .table-name span:nth-of-type(2) i {
  margin-left: 13px;
  background-color: #1f90e5;
}
.echarts-title {
  display: block;
  /* text-align: center; */
  font-size: 14px;
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
</style>
