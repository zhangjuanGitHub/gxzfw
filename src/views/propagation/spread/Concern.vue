<template>
  <div>
    <div class="web-header">
      <el-form ref="form"
               :model="form">
        <el-form-item label="时间:"
                      prop="searchTime">
          <el-date-picker v-model="form.searchTime"
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
                     @click="reset('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="concern">
      <div class="topleft">
        <p class="website-head">
          <span class="title-box">被各类型网站转载</span>
        </p>
        <div id="topleft-bar"></div>
      </div>
      <div class="topright">
        <p class="website-head">
          <span class="title-box">综合Top10转载网站</span>
        </p>
        <div id="topright-bar"></div>
      </div>
      <div class="bottomleft">
        <p class="website-head">
          <span class="title-box">{{value}}转载Top</span>
        </p>
        <div class="botleft-table monitor-table big-table">
          <el-table :data="botleftTable"
                    stripe
                    max-height="435px"
                    style="width: 100%">
            <el-table-column prop="rank"
                             label="排名"
                             width="60">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="domainList"
                             label="根域名"
                             width="150"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="sitenameList"
                             label="网站名称"
                             width="150"
                             show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="articleCountNumList"
                             label="转载量"
                             width="146"
                             show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottomright">
        <p class="website-head">
          <span class="title-box">媒体关注文章Top10</span>
        </p>
        <div class="botright-table monitor-table big-table">
          <el-table :data="botrightTable"
                    stripe
                    max-height="435px"
                    style="width: 100%">
            <el-table-column prop="rank"
                             label="排名"
                             width="60">
              <template slot-scope="scope">
                <div>{{scope.$index+1}}</div>
              </template>
            </el-table-column>
            <el-table-column prop="title"
                             label="标题"
                             show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="bottomright-title"
                     @click="openWeb(scope.row)">{{scope.row.title}}</div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
// import { mapState } from 'vuex'
let echarts = require('echarts/lib/echarts')
require('echarts/lib/chart/bar')
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      value: '',
      lineClick: {},
      fromData: {
        wid: '14',
        cid: '1',
        orginal: null,
        startSearchDate: '',
        endSearchDate: ''
      },
      form: {
        searchTime: []
      },
      siteName: {
        siteType: ''
      },
      botleftTable: [],
      botrightTable: []
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30 * 6)
    this.form.searchTime[0] = this.formatDate(start)
    this.form.searchTime[1] = this.formatDate(end)
  },
  mounted () {
    new Promise(this.Reprint)
      .then(this.reprintTable)
      .catch(err => {
        this.$message.error(err)
      })
    this.allReprint()
    this.followTable()
  },
  methods: {
    formatDate (now) {
      var year = now.getFullYear() + '-'
      var month = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-'
      var d = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
      return year + month + d
    },
    // 被各类型网站转载
    Reprint (resolve, reject) {
      let that = this
      this.lineClick = echarts.init(document.getElementById('topleft-bar'))
      this.$http.post(this.$api.channelChart1, this.form)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            var max = Math.max(...res.data.data.articleCountNumList).toString()
            var indexOfMax = res.data.data.articleCountNumList.indexOf(max)
            this.value = res.data.data.sitynameList[indexOfMax]
            this.siteName.siteType = res.data.data.sitytypeList[indexOfMax]
            let option = {
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              xAxis: {
                type: 'category',
                data: res.data.data.sitynameList,
                axisTick: {
                  show: false
                },
                axisLine: {
                  show: false
                },
                axisLabel: {
                  show: true
                }
              },
              yAxis: {
                show: false,
                type: 'value'
              },
              series: [
                {
                  name: '转载量', // 序列名称
                  type: 'bar', // 类型
                  label: { // 图形上的文本标签
                    show: true,
                    position: 'top', // 相对位置
                    rotate: 0, // 旋转角度
                    color: '#000'
                  },
                  itemStyle: { //
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#6AD1DF' },
                          { offset: 1, color: '#9170ED' }
                        ]
                      )
                    }
                  },
                  barWidth: 60, // 柱形的宽度
                  barCategoryGap: '20%', // 柱形的间距
                  data: res.data.data.articleCountNumList
                }
              ]
            }
            this.lineClick.setOption(option)
            this.lineClick.off('click')
            // this.lineClick.getZr().on('click', params => {
            //   let pointInPixel = [params.offsetX, params.offsetY]
            //   if (this.lineClick.containPixel('grid', pointInPixel)) {
            //     // let xIndex = this.lineClick.convertFromPixel({ seriesIndex: 0 }, [params.offsetX, params.offsetY])[0]
            //     that.siteName.siteType = res.data.data.sitytypeList[params.dataIndex]
            //     that.value = params.name
            //     console.log(pointInPixel)
            //   }
            // })
            this.lineClick.on('click', function (params) {
              that.siteName.siteType = res.data.data.sitytypeList[params.dataIndex]
              that.value = params.name
              that.botleftTable = []
              that.reprintTable()
            }, false)
            resolve()
          }
        })
        .catch(() => {
          return false
        })
    },
    // 综合Top10转载网站
    allReprint () {
      let lineChart = echarts.init(document.getElementById('topright-bar'))
      this.$http.post(this.$api.channelChart2, this.form)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            lineChart.setOption({
              tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                  type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
                }
              },
              grid: {
                top: '20',
                left: '90',
                right: '20',
                bottom: '40'
              },
              xAxis: [
                {
                  type: 'value',
                  show: false
                }
              ],
              yAxis: [
                {
                  type: 'category',
                  axisTick: {
                    show: false
                  },
                  axisLine: {
                    show: false
                  },
                  axisLabel: {
                    show: true,
                    rotate: 40
                  },
                  data: res.data.data.sitenameList
                }
              ],
              series: [
                {
                  name: '转载量',
                  type: 'bar',
                  label: {
                    normal: {
                      show: true,
                      position: 'insideRight',
                      color: '#000'
                    }
                  },
                  itemStyle: { //
                    normal: {
                      color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [
                          { offset: 0, color: '#6AD1DF' },
                          { offset: 1, color: '#9170ED' }
                        ]
                      )
                    }
                  },
                  barWidth: 20, // 柱形的宽度
                  data: res.data.data.articleCountNumList
                }
              ]
            })
          }
        }).catch(() => {
          return false
        })
    },
    // 转载 top10
    reprintTable (resolve, reject) {
      this.botleftTable = []
      let params = {
        id: this.siteName.siteType,
        searchTime: this.form.searchTime
      }
      this.$http.post(this.$api.chartTop, params)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            res.data.data.sitenameList.forEach((item, index) => {
              let dataList = {}
              dataList.sitenameList = res.data.data.sitenameList[index]
              dataList.domainList = res.data.data.domainList[index]
              dataList.articleCountNumList = res.data.data.articleCountNumList[index]
              this.botleftTable.push(dataList)
            })
            resolve()
          }
        })
        .catch(() => {
          return false
        })
    },
    // 关注 top10
    followTable () {
      this.$http.post(this.$api.siteHotArticles, this.form)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.botrightTable.push(...res.data.data.list)
          }
        })
        .catch(() => {
          return false
        })
    },
    openWeb (row) {
      window.open(row.url)
    },
    // 筛选
    moreReprint () {
      if (!this.form.searchTime) {
        this.form.searchTime = []
      }
      this.botrightTable = []
      this.botleftTable = []
      new Promise(this.Reprint)
        .then(this.reprintTable)
        .catch(err => {
          this.$message.error(err)
        })
      this.allReprint()
      this.followTable()
    },
    // 重置
    reset (formName) {
      this.$refs[formName].resetFields()
      this.botrightTable = []
      this.botleftTable = []
      new Promise(this.Reprint)
        .then(this.reprintTable)
        .catch(err => {
          this.$message.error(err)
        })
      this.allReprint()
      this.followTable()
    }
  }
}
</script>
<style scoped>
.concern {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.topleft,
.topright,
.bottomleft,
.bottomright {
  width: 49.8%;
  background-color: #fff;
  margin-top: 6px;
  box-sizing: border-box;
  padding: 15px;
}
.concern .website-head {
  width: 100%;
  line-height: 46px;
}
.concern .title-box {
  font-size: 18px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
}

.concern .title-box::before {
  content: '';
  display: inline-block;
  width: 9px;
  height: 20px;
  background-color: #06a4f2;
  position: relative;
  top: 3px;
  margin-right: 12px;
  border-radius: 5px;
}
.concern .select {
  display: block;
  width: 135px;
  float: right;
}
#topleft-bar {
  width: 100%;
  height: 420px;
}
#topright-bar {
  width: 100%;
  height: 420px;
}
.web-header {
  overflow: hidden;
  margin-top: 10px;
}
.web-header .el-form {
  overflow: hidden;
  display: flex;
  margin-left: 10px;
  justify-content: flex-end;
}
.web-header .el-form .el-form-item {
  display: flex;
  margin-bottom: 0px;
}
.web-header .el-form .el-button {
  border-radius: 0px;
  margin: 0 10px;
}
.web-header .el-form .el-form-item:first-of-type {
  margin-right: 10px;
}
.botright-table .bottomright-title {
  cursor: pointer;
  text-decoration: underline;
  color: #06a4f2;
  text-align: left;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
