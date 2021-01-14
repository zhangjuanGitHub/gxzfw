<template>
  <div class="web-monitor container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'EffectExponent' }">新媒体传播力</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'WebMonitor',query:{tabs:'website'}}">传播力指数</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MoreMonitor' }">网站传播力</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="web-header">
      <el-form ref="from"
               :model="from">
        <el-form-item label="时间:"
                      prop="publishTime">
          <el-date-picker v-model="from.publishTime"
                          size="small"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
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
            <span class="title-box">转载媒体地域分析</span>
          </p>
          <div id="monitor-map"></div>
        </div>
        <div class="upper-right">
          <p class="monitor-head">
            <span class="title-box">转载量地域排名</span>
          </p>
          <div class="monitor-table big-table">
            <el-table :data="tableData"
                      stripe
                      max-height="288px"
                      style="width: 100%">
              <el-table-column prop="index"
                               label="排名"
                               width="120">
                <template slot-scope="scope">
                  <div>{{scope.$index+1}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="name"
                               label="地区"
                               width="120">
              </el-table-column>
              <el-table-column prop="value"
                               label="转载量">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="monitor-box">
        <div class="upper-left">
          <p class="monitor-head">
            <span class="title-box">热词云</span>
          </p>
          <div id="monitor-word"></div>
        </div>
        <div class="upper-right hot-table">
          <p class="monitor-head">
            <span class="title-box">热门文章</span>
          </p>
          <div class="monitor-table big-table">
            <el-table :data="hotTable"
                      stripe
                      max-height="288px"
                      style="width: 100%">
              <el-table-column prop="rank"
                               label="排名"
                               width="60">
                <template slot-scope="scope">
                  <div class="colorbule rank">{{scope.$index+1}}</div>
                </template>
              </el-table-column>
              <el-table-column prop="title"
                               label="标题"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <div class="colorbule title"
                       @click="openBlock(scope.row, scope.$index)">
                    <span v-text="scope.row.title"></span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="simcnt"
                               label="被转载次数"
                               width="90">
                <template slot-scope="scope">
                  <div class="colorbule simcnt">
                    <span v-text="scope.row.simcnt"></span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div class="el-icon-d-arrow-left leave-more"
           @click="firorsec"></div>
    </div>
  </div>
</template>
<script>
import china from 'echarts/map/json/china.json'
import 'echarts/lib/component/visualMap'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/map')
require('echarts-wordcloud')
echarts.registerMap('china', china)
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      tableData: [],
      hotTable: [],
      from: {
        id: '1',
        publishTime: []
      }
    }
  },
  created () {
    if (this.$route.query.time) {
      this.from.publishTime = this.$route.query.time
    } else {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
      this.from.publishTime[0] = this.formatDate(start)
      this.from.publishTime[1] = this.formatDate(end)
    }
  },
  mounted () {
    // new Promise(this.monitorMap)
    //   .then(this.monitorWord)
    //   .then(this.getRowss)
    //   .catch(err => {
    //     this.$message.error(err)
    //   })
    this.monitorMap()
    this.monitorWord()
    this.getRowss()
  },
  methods: {
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
    compare (prop) {
      return function (obj1, obj2) {
        var val1 = obj1[prop]
        var val2 = obj2[prop]; if (val1 < val2) {
          return 1
        } else if (val1 > val2) {
          return -1
        } else {
          return 0
        }
      }
    },
    // 中国地图
    monitorMap () {
      let monitorMap = echarts.init(document.getElementById('monitor-map'))
      this.$http.post(this.$api.sitearea, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.tableData = []
            this.tableData.push(...res.data.data)
            this.tableData.sort(this.compare('value'))
            if (this.tableData.length > 10) {
              this.tableData.length = 10
            }
            monitorMap.setOption({
              tooltip: {},
              legend: {
                orient: 'vertical',
                left: 'left'
              },
              visualMap: {
                type: 'continuous',
                min: 0,
                max: 100000,
                text: ['高', '低'],
                realtime: false,
                calculable: true,
                color: ['#04387b', '#467bc0'] // 蓝绿
              },
              show: true,
              selectedMode: 'single',
              series: [
                {
                  name: '',
                  type: 'map',
                  mapType: 'china',
                  zoom: 1.2,
                  itemStyle: {
                    normal: {
                      show: true,
                      fontSize: '10',
                      color: 'rgba(0,0,0,0.7)',
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
                  showLegendSymbol: true,
                  label: {
                    normal: {
                      show: true
                    },
                    emphasis: {
                      show: true
                    }
                  },
                  data: res.data.data
                }
              ]
            })
          }
        })
        .catch(() => {
        })
    },
    // 热词云
    monitorWord () {
      let monitorWord = echarts.init(document.getElementById('monitor-word'))
      // const end = new Date()
      // const start = new Date()
      // start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
      // let params = {
      //   id: 1,
      //   publishTime: [this.timestampToTime(start), this.timestampToTime(end)]
      // }
      this.$http.post(this.$api.siteChart8, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let listData = res.data.data.listData
            monitorWord.setOption({
              title: {
                // text: '词云', // 标题
                x: 'left',
                textStyle: {
                  fontSize: 23
                }

              },
              backgroundColor: '#F7F7F7',
              tooltip: {
                show: true
              },
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
          }
        })
        .catch(() => {
        })
    },
    firorsec () {
      this.$router.push({ name: 'WebMonitor', query: { tabs: 'website' } })
    },
    openBlock (row, index) {
      window.open(row.url, '_blank')
    },
    // 获取热门文章
    getRowss () {
      this.$http.post(this.$api.siteHot, this.from)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.hotTable = res.data.data
            this.hotTable.forEach(item => {
              if (item.simcnt < 0) {
                item.simcnt = 0
              }
            })
          }
        })
        .catch(() => {
        })
    },
    // 筛选
    moreReprint () {
      if (!this.from.publishTime) {
        this.from.publishTime = []
      }
      this.monitorMap()
      this.monitorWord()
      this.getRowss()
    },
    // 重置
    reset (formName) {
      this.$refs[formName].resetFields()
      this.hotTable = []
      this.monitorMap()
      this.monitorWord()
      this.getRowss()
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
.title-box {
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 8px;
}
.monitor-head {
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
/* #monitor-map {
  background-color: rgba(14, 11, 236, 0.288);
} */
#monitor-map,
#monitor-word {
  height: 300px;
}

.upper-right {
  box-sizing: border-box;
  padding: 30px;
}
.hot-table {
  padding-right: 10px;
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
}
.title span {
  display: block;
  text-decoration: underline;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.monitor-box .web-name {
  padding: 30px 75px;
}
.web-content {
  position: relative;
}
.leave-more {
  position: absolute;
  font-size: 60px;
  font-weight: bolder;
  color: #06a4f2;
  cursor: pointer;
  top: 46%;
  left: -36px;
}
</style>
