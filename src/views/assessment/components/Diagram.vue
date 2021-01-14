<template>
  <div class="diagram">
    <div class="chart">
     <div class="echarts-box">
       <p>
         <span v-text="dayArcNum.title"></span>
         <el-link @click="targetUrl(dayArcNum.url)" v-text="dayArcNum.url"></el-link>
       </p>
     </div>
      <div id="mothChart"></div>
      <div class="table-name"><span><b>{{parseInt(echartsData.month) >=10 ? echartsData.month + '月' : echartsData.month.substring(1, 2) + '月'}}</b> 门户网站更新情况</span></div>
    </div>
  </div>
</template>
<script>
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入柱状图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  props: ['echartsData'],
  data () {
    return {
      dayArcNum: {} // 标题、url
    }
  },
  mounted () {
    this.getEchattsList()
    // 页面加载完后显示当前时间
    // this.realTime = this.dealWithTime(new Date())
    // // 定时刷新时间
    // let _this = this
    // // 定时器
    // this.timer = setInterval(function () {
    //   _this.realTime = _this.dealWithTime(new Date()) // 修改数据date
    // }, 1000)
  },
  methods: {
    getEchattsList () {
      this.$http.post(this.$api.monthWzList, this.echartsData)
        .then(res => {
          if (res.data.data) {
            let datas = res.data.data
            this.dayArcNum = datas
            // 基于准备好的dom，初始化echarts实例
            let myChart = echarts.init(document.getElementById('mothChart'))
            // 绘制图表
            myChart.setOption({
              title: {},
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['更新情况'],
                x: 'right'
              },
              grid: {
                left: '15',
                right: '15',
                bottom: '0',
                top: '15',
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
                data: datas.dayArcNum.monthDays,
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
                  name: '更新情况',
                  type: 'line',
                  color: '#1f90e5',
                  data: datas.dayArcNum.returnArray
                }
              ]
            })
          }
        })
        .catch(() => {})
    },
    targetUrl (url) {
      window.open(url, '_blank')
    }
  },
  watch: {
    echartsData (newVal, oldVal) {
      this.getEchattsList()
    }
  }
}
</script>
<style scoped>
.diagram .chart h2 {
  height: 23px;
  font-size: 24px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  border-left: 8px solid #329edd;
  text-indent: 17px;
  margin-bottom: 17px;
  margin-left: -20px;
}
.diagram .chart p {
  font-size: 18px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}
.diagram .chart p a {
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  text-decoration: underline;
  color: rgba(73, 169, 225, 1);
  margin-left: 30px;
  font-size: 18px;
}
.diagram .chart p span {
  display: inline-block;
  height: 27px;
  background: rgba(195, 226, 250, 1);
  font-family: Adobe Heiti Std R;
  font-weight: normal;
  color: #333;
  line-height: 27px;
  text-align: center;
  padding: 0 10px;
}
.diagram .chart #mothChart {
  width: auto;
  height: 230px;
}
.diagram .table-name {
  width: 100%;
  text-align: center;
  margin-top: 23px;
}
.diagram .table-name span {
  display: inline-block;
  height: 20px;
  font-size: 19px;
  font-family: PingFang-SC-Medium;
}

.diagram .table-name span i {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
  margin-top: -5px;
  margin-right: 13px;
  background-color: #1f90e5;
}
.diagram .table-name span b {
  color: #eb6d07;
  font-size: 21px;
  font-weight: normal;
}
.echarts-box {
  margin-bottom: 30px;
  padding: 0 20px;
}
</style>
