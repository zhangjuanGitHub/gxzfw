<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Inspect' }">热点新闻</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TopicList' }">专题列表</el-breadcrumb-item>
        <el-breadcrumb-item>{{routeTitle}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="trace-box">
      <div class="trace-top">
        <div class="news-box">
          <p class="reace-num-title"><span class="news-title">专题追踪</span> <span class="news-total">相关新闻数：{{datasCount}}篇</span></p>
          <div class="line-time">
<!--            <div class="ribbon"><span>专题追踪</span></div>-->
            <el-timeline>
              <el-timeline-item :timestamp="item.pubtime" placement="top" v-for="(item, index) of timeLine" :key="index">
                <el-card>
                  <div @click="targetUrl(item.url)" class="cursor">
                    <h4 v-text="item.title" class="timeline-title"></h4>
                    <p class="timeline-source">来源：<span v-text="item.source"></span></p>
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>
        <div class="reace-num-box">
          <p class="reace-num-title"><span class="news-title">专题关键词</span></p>
          <div id="monitor-word"></div>
        </div>
      </div>
      <div class="trend-box">
        <p class="trend-line-title"><span class="news-title">传播趋势</span></p>
        <div id="myChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
import 'echarts/lib/component/visualMap'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/line')
require('echarts-wordcloud')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  name: 'Trace',
  data () {
    return {
      datasCount: '', // 总数
      timeLine: [], // 追踪
      routeTitle: '', // 标题
      routeKeyWorld: '', // 热词
      routeId: '',
      ruleForm: {
        times: []
      },
      listData: [],
      rightValue: []
    }
  },
  methods: {
    // 热词云
    monitorWord () {
      let monitorWord = echarts.init(document.getElementById('monitor-word'))
      // let cread = {
      //   startSearchDate: this.ruleForm.times[0] || '',
      //   endSearchDate: this.ruleForm.times[1] || '',
      //   wid: '14'
      // }
      // this.from.startSearchDate = this.from.times[0] || ''
      // this.from.endSearchDate = this.from.times[1] || ''
      // this.from.wid = '14'
      // this.$http.post(this.$api.siteChart8, cread)
      //   .then(res => {
      //     if (res.data.code === 200 && res.data.data) {
      //       // let listData = res.data.data.listData
      //     }
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
      this.$http.get(`${this.$api.findKeywords}/${this.routeId}`)
        .then(res => {
          let listData = res.data.data
          monitorWord.setOption({
            title: {
              // text: '词云', // 标题
              x: 'left',
              textStyle: {
                fontSize: 23
              }
            },
            backgroundColor: '#F7F7F7',
            series: [{
              name: 'Google Trends',
              type: 'wordCloud',
              size: ['90%', '90%'],
              autoSize: {
                enable: false,
                minSize: 14
              },
              textStyle: {// 文字样式设置
                normal: {
                  color: function () { // 颜色
                    return 'rgb(' + [// 返回随机生成的颜色
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160),
                      Math.round(Math.random() * 160)
                    ].join(',') + ')'
                  }
                },
                emphasis: {// 鼠标划入样式
                  shadowBlur: 10, // 文字阴影模糊度
                  shadowColor: '#333'// 文字阴影颜色
                }
              },
              data: listData
            }]
          })
        })
    },
    drawLine () {
      this.$http.get(`${this.$api.findChart}/${this.routeId}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.rightValue = res.data.data
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('myChart'))
            // 绘制图表
            myChart.setOption({
              title: {},
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '40',
                right: '40',
                bottom: '0',
                top: '40',
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
                data: this.rightValue.listCat,
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
                  name: '日传播量',
                  type: 'line',
                  color: '#1f90e5',
                  data: this.rightValue.listData
                }
              ]
            })
          }
        })
        .catch(() => {
        })
    },
    // 获取时间线
    getTimeLine () {
      this.$http.get(`${this.$api.findShaft}/${this.routeId}`)
        .then(res => {
          this.timeLine = res.data.data.listData
          this.datasCount = res.data.data.count
        })
    },
    targetUrl (url) {
      window.open(url, '_blank')
    },
    getHotCloud () {
    }
  },
  mounted () {
    // 线图
    this.drawLine()
    // 词云
    this.monitorWord()
  },
  created () {
    this.routeId = this.$route.query.id
    this.routeKeyWorld = this.$route.query.Keyword
    this.routeTitle = this.$route.query.title
    this.getTimeLine()
    this.getHotCloud()
  },
  components: {}
}
</script>
<style scope>
  .news-box, .reace-num-box {
    padding: 18px 18px 30px;
  }
  .news-box {
    background: #fff;
    width: 700px;
    max-height: 500px;
    overflow: auto;
    /** 单独为横向和竖向设置滚动条 **/
    overflow-x: auto;
    overflow-y: auto;
  }
  .trace-top {
    display: flex;
  }
  .reace-num-box {
    background: #fff;
    margin-left: 25px;
    width: 495px;
  }
  .reace-num-title:before {
    width: 5px;
    height: 22px;
    content: '';
    position: absolute;
    background: #08A0F1;
  }
  .reace-num-title .news-title {
    font-size: 16px;
    margin-left: 12px;
  }
  #monitor-word {
    height: 300px;
    margin-top: 20px;
  }
  #myChart {
    width: 100%;
    height: 320px;
  }
  .trend-box {
    background: #fff;
    margin-top: 20px;
    padding: 18px 18px 30px;
  }
  .trend-line-title:before {
    width: 5px;
    height: 22px;
    content: '';
    position: absolute;
    background: #08A0F1;
  }
  .trend-line-title span {
    font-size: 16px;
    margin-left: 12px;
  }
  .reace-num-title {
    height: 22px;
    line-height: 22px;
  }
  .ribbon {
    width: 28px;
    border-top: 14px solid #FF5A00;
    border-right: 50px solid #FF5A00;
    border-left: 15px solid transparent;
    border-bottom: 14px solid #FF5A00;
    position: relative;
  }
  .line-time {
    margin-top: 25px;
    padding: 0 44px;
  }
  .ribbon span {
    position: absolute;
    width: 95px;
    top: -13px;
    right: 0;
    bottom: 0;
    left: 5px;
    height: 28px;
    line-height: 28px;
    color: #fff;
    font-size: 14px;
  }
  .news-total {
    color:#08A0F1;
    font-size: 18px;
    margin-left: 20px;
  }
  .timeline-source {
    margin-top: 20px;
  }
  .timeline-title {
    font-size: 16px;
    line-height: 1.5;
  }
  .line-time {
    overflow: auto;
    overflow-x: auto;
    overflow-y: auto;
    max-height: 390px;
  }
</style>
