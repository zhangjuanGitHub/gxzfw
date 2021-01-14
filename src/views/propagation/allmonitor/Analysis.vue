<template>
  <div class="container web-monitor">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'EffectExponent' }">新媒体传播力</el-breadcrumb-item>
          <el-breadcrumb-item v-if="formData.articleId" :to="{ name: 'EffectArticle' }">文章传播列表</el-breadcrumb-item>
          <el-breadcrumb-item v-if="formData.utId" :to="{ name: 'EffectArticleMonitor' }">文章实时监测</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'Analysis' }">传播力分析</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="web-content">
      <div class="monitor-box">
        <div class="upper-left">
          <p class="monitor-head">
            <span class="title-box"
                  v-html="article.title"></span>
          </p>
          <div class="news-title">
            <div class="news-cont">
              <p class="content"
                 v-html="article.content"></p>
              <span class="show-all" v-if="article.url"
                    @click="showall">
                展示全文
              </span>
            </div>
          </div>
        </div>
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">被各类型网站转载占比</span>
          </p>
          <div id="monitor-cake"></div>
        </div>
      </div>
      <div class="monitor-box">
        <div class="upper-left">
          <p class="monitor-head">
            <span class="title-box">被转载量走势</span>
          </p>
          <div id="monitor-line"></div>
        </div>
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">转载媒体地域排名Top10</span>
          </p>
          <div id="monitor-sverse"></div>
        </div>
      </div>
      <div class="monitor-box">
        <div class="upper-left">
          <p class="monitor-head">
            <span class="title-box">影响媒体地域分析</span>
          </p>
          <div id="monitor-map"></div>
        </div>
        <div class="upper-right web-table">
          <p class="monitor-head">
            <span class="title-box">被互联网转载</span>
          </p>
          <div class="monitor-table big-table">
            <el-table :data="tableData"
                      stripe
                      max-height="288px"
                      :header-cell-style="getRowClass"
                      style="width: 100%">
              <el-table-column prop="name"
                               label="排名"
                               width="50"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{scope.$index+1}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="title"
                               label="标题"
                               width="90"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="colorbule source">
                    <span @click="openweb(scope.row)"
                          v-text="scope.row.title"></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="sim"
                               label="相似度"
                               width="80"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{scope.row.sim}}%</div>
                </template>
              </el-table-column>
              <el-table-column prop="sitename"
                               label="来源"
                               width="95"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="title">
                    <span v-text="scope.row.sitename"></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="pubtimeformat"
                               label="发布时间"
                               width="85"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="title">
                    <span v-text="scope.row.pubtimeformat"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import china from 'echarts/map/json/china.json'
import 'echarts/lib/component/visualMap'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/map')
require('echarts/lib/chart/bar')
require('echarts/lib/chart/pie')
require('echarts/lib/chart/line')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
echarts.registerMap('china', china)
export default {
  data () {
    return {
      tableData: [],
      article: {},
      formData: {
      },
      loading: true,
      mapData: []
    }
  },
  created () {
    this.formData.articleId = this.$route.query.id
    this.formData.utId = this.$route.query.utid
  },
  mounted () {
    if (this.formData.articleId) {
      this.getPaperSpread()
    }
    if (this.formData.utId) {
      this.getMonitor()
    }
    this.monitorCake()
    this.getFindSim()
    this.monitorLine()
    this.monitorMap()
    this.monitorSverse()
  },
  methods: {
    // 表头
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background-color:#16AFFA; color:#fff'
      }
    },
    // 中国地图
    monitorMap () {
      let monitorMap = echarts.init(document.getElementById('monitor-map'))
      this.$http.post(this.$api.paperArea, this.formData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.mapData = res.data.data
            monitorMap.setOption({
              title: {
                text: '全国地图大数据',
                subtext: '',
                x: 'center',
                textStyle: { color: '#ffffff' }
              },
              tooltip: { trigger: 'item', formatter: '' },
              legend: {
                orient: 'vertical',
                left: 'left'
              },
              visualMap: {
                type: 'continuous',
                min: 0,
                max: 1000,
                text: ['High', 'Low'],
                realtime: false,
                calculable: true,
                color: ['#003fbf', '#7857f3', '#72c1fd']
              },
              selectedMode: 'single',
              series: [
                {
                  type: 'map',
                  mapType: 'china',
                  zoom: 1.2,
                  itemStyle: {
                    normal: {
                      borderColor: 'rgba(0, 0, 0, 0.2)'
                    },
                    emphasis: {
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                      shadowBlur: 5,
                      borderWidth: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  },
                  showLegendSymbol: false,
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: this.mapData
                }
              ]
            })
          }
        }).catch(() => {
        })
    },
    // 折线图
    monitorLine () {
      let lineChart = echarts.init(document.getElementById('monitor-line'))
      this.$http.post(this.$api.paperChart1, this.formData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let lineData = res.data.data.dateList
            let lineNum = res.data.data.cntList
            lineChart.setOption({
              title: {},
              tooltip: {
                trigger: 'axis'
              },
              legend: {
                data: ['被转载量曲线']
              },
              grid: {
                left: '15',
                right: '35',
                bottom: '0',
                top: '70',
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
                data: lineData,
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
                  name: '被转载量曲线',
                  type: 'line',
                  color: '#1f90e5',
                  data: lineNum
                }
                // {
                //   name: '采用曲线',
                //   type: 'line',
                //   color: '#ed7d31',
                //   data: [220, 182, 191, 234, 290, 330, 310]
                // }
              ]
            })
          }
        }).catch(() => {
        })
    },
    // 柱状图
    monitorSverse () {
      let lineChart = echarts.init(document.getElementById('monitor-sverse'))
      this.$http.post(this.$api.paperArea, this.formData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let name = []
            let value = []
            res.data.data.forEach(item => {
              name.push(item.name)
              value.push(item.value)
            })
            lineChart.setOption({
              color: ['#39a0ff'],
              tooltip: {
                trigger: 'axis'
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
                data: name,
                'axisTick': { // 刻度
                  'show': false
                },
                'axisLine': { // 线
                  'show': true
                },
                'splitLine': {
                  'show': false // 网格线
                }
              },
              series: [{
                data: value,
                type: 'bar'
              }]
            })
            this.loading = false
          }
        }).catch(() => {
        })
    },
    // 饼图
    monitorCake () {
      let pieChart = echarts.init(document.getElementById('monitor-cake'))
      this.$http.post(this.$api.paperChart2, this.formData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            pieChart.setOption({
              tooltip: {
                trigger: 'item',
                formatter: '{a} <br/>{b} : {c} ({d}%)'
              },
              series: [
                {
                  name: '访问来源',
                  type: 'pie',
                  radius: '55%',
                  center: ['50%', '50%'],
                  data: res.data.data,
                  itemStyle: {
                    emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                  }
                }
              ],
              color: ['#f7318e', '#d463e9', '#C9C9C9', '#FFD700', '#94d68e', '#C0FF3E']
            })
          }
        })
        .catch(() => {
          return false
        })
    },
    firorsec () {
      this.$router.push({ name: 'WebMonitor' })
    },
    // 获取传播文章详情
    getPaperSpread () {
      this.$http.get(this.$api.paperSpread, { params: { waId: this.formData.articleId } })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.article = res.data.data.article
          }
        })
        .catch(() => {
        })
    },
    // 获取监测文章详情
    getMonitor () {
      this.$http.get(this.$api.findArticleByUtId, { params: { utId: this.formData.utId } })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.article = res.data.data
          }
        })
        .catch(() => {
        })
    },
    openweb (row) {
      window.open(row.url)
    },
    // 获取表格内容
    getFindSim () {
      this.$http.post(this.$api.findSim, this.formData)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tableData = res.data.data
          }
        })
        .catch(() => {
          this.tableData = []
        })
    },
    // 展示全文
    showall () {
      window.open(this.article.url)
    }
  }
}
</script>
<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
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
  position: relative;
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
  display: block;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.monitor-head {
  margin-bottom: 20px;
}
.title-box::before {
  content: "";
  display: inline-block;
  width: 8px;
  height: 20px;
  background-color: #06a4f2;
  position: relative;
  top: 4px;
  margin-right: 12px;
  border-radius: 5px;
}
/* #monitor-map {
  background-color: rgba(14, 11, 236, 0.288);
} */
#monitor-map,
#monitor-line,
#monitor-sverse,
#monitor-cake {
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
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.title span {
  display: block;
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #06a4f2;
}
.source span {
  display: block;
  width: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.pubtime span {
  display: block;
  width: 75px;
  overflow: hidden;
  text-overflow: ellipsis;
  cursor: pointer;
}
.news-title {
  background-color: #f5f5f5;
}
.news-cont {
  line-height: 35px;
  font-size: 14px;
}
.news-cont .content {
  max-height: 288px;
  line-height: 22px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 13;
  overflow: hidden;
  padding: 0px 15px;
}
.news-cont .show-all {
  color: #06a4f2;
  text-decoration: underline;
  position: absolute;
  right: 20px;
  bottom: 0px;
  cursor: pointer;
}
.news-detail {
  text-indent: 25px;
}
.monitor-box .web-table {
  padding: 30px 10px;
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
.web-header .el-form .el-form-item:first-of-type {
  margin-right: 10px;
}
.web-header .el-form .el-button {
  border-radius: 0px;
  margin: 0 10px;
}
</style>
