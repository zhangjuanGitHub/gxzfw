<template>
  <div class="home container">
    <div class="cont-left">
      <div class="cont-userinfo" :style="{backgroundImage: userBack}">
        <div class="cont-text">
          <div>{{this.roleName}} {{this.userName}} 您好！</div>
          <div>现在是 {{showNowTime}}</div>
        </div>
      </div>
      <div class="handle">
        <h2 class="list-head">待处理事项</h2>
        <div class="handle-list">
          <ul>
            <li v-permission="306"><span>需要审核数</span>
              <i v-text="leftValue.needCheckArticleNum" @click="AuditList"></i> 篇
            </li>
            <li><span>未读消息</span>
              <i v-text="leftValue.noReadMessageNum"
                 @click="SystemMessage"/> 条
            </li>
          </ul>
        </div>
        <div class="handle">
          <h2 class="list-head">最新投稿</h2>
          <div class="handle-contribute">
            <swiper ref="mySwiper"
                    @mouseenter="StopSwiper"
                    @mouseleave="UpSwiper"
                    :options="swiperOptions"
                    class="swiper-box"
                    v-if="this.articleData.length > 7">
              <swiper-slide v-for="(item, index) of articleData" :key="index">
                <el-tooltip :content="item.articleTitle"
                            placement="top"
                            v-if="item.articleTitle.length > 20">
                  <p>{{index + 1}}、<a @click="toArticle(item.id)" v-html="item.articleTitle"></a></p>
                </el-tooltip>
                <p v-else>{{index + 1}}、<a @click="toArticle(item.id)" v-html="item.articleTitle"></a></p>
              </swiper-slide>
              <div class="swiper-button-prev" slot="button-prev"></div>
              <div class="swiper-button-next" slot="button-next"></div>
            </swiper>
            <ul v-else class="swip-ul">
              <li v-for="(item, index) of articleData" :key="index">
                <el-tooltip :content="item.articleTitle"
                            placement="top"
                            v-if="item.articleTitle.length > 20">
                  <p>{{index + 1}}、<a @click="toArticle(item.id)" v-html="item.articleTitle"></a></p>
                </el-tooltip>
                <p v-else>{{index + 1}}、<a @click="toArticle(item.id)" v-html="item.articleTitle"></a></p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div class="cont-right">
      <div class="ansy-list tittle-list">
        <ul>
          <li @click="toPush('HotRankingWx')">
            <div class="ranking li_img"><img :src="ansyList.rank"></div>
            <span>热点排行</span>
          </li>
          <li @click="toPush('Contribute')">
            <div class="contribute li_img"><img :src="ansyList.contribute"></div>
            <span>我要投稿</span>
          </li>
          <li @click="toPush('MyMessageList')">
            <div class="myarticle li_img"><img :src="ansyList.my"></div>
            <span>我的稿件</span>
          </li>
          <li @click="toPush('RoughList')" v-permission="306">
            <div class="revision li_img"><img :src="ansyList.revision"></div>
            <span>稿件校对</span>
          </li>
          <li @click="toPush('LocalArticleWx')" v-permission="307">
            <div class="release li_img"><img :src="ansyList.release"></div>
            <span>发布稿件</span>
          </li>
          <li @click="toPush('AssessmentTotal')">
            <div class="assess li_img"><img :src="ansyList.pinggu"></div>
            <span>新媒体建设评估</span>
          </li>
          <li @click="toPush('MyIssueList')">
            <div class="issue li_img"><img :src="ansyList.issue"></div>
            <span>我的议题</span>
          </li>
        </ul>
      </div>
      <div class="chart">
        <h2>本月供稿状态</h2>
        <p v-if="isMy">本月截至目前投稿
          <span @click="getDate" class="month" v-text="rightValue.allArticleNum"></span>篇
          <span v-permission="306">审核通过<span class="month" @click="getStats" style="color:#ED7D31" v-text="rightValue.checkedArticleNum"></span>篇</span>
        </p>
        <p v-else>本月截至目前投稿<span @click="getAllTou"
                class="month"
                v-text="rightValue.allArticleNum"></span>篇
          <span v-permission="306">审核通过<span class="month"
                @click="getAllChecks"
                style="color:#ED7D31"
                v-text="rightValue.checkedArticleNum"></span>篇</span></p>
        <el-button class="myArticle" type="primary" @click="showMyArticle()">我的稿件</el-button>
        <el-button class="allArticle" type="warning" @click="showAllArticle()">单位稿件</el-button>
        <div id="myChart"></div>
        <div class="table-name"><span><i></i>投稿曲线</span><span><i></i>审核通过曲线</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import { swiper, swiperSlide } from 'vue-awesome-swiper'
import 'swiper/swiper-bundle.css'
import { mapState, mapGetters } from 'vuex'
// 引入基本模板
let echarts = require('echarts/lib/echarts')
// 引入折线图组件
require('echarts/lib/chart/line')
// 引入提示框和title组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  data () {
    return {
      userName: '', // 用户名
      roleName: '', // 职位
      isMy: true,
      showNowTime: '',
      animateRank: false, // 是否设置class
      contributionData: [],
      articleData: [],
      leftValue: '',
      rightValue: '',
      value: null,
      realData: '',
      realTime: '',
      userBack: 'url(' + require('@/assets/images/home/user.png') + ')',
      ansyList: {
        my: require('@/assets/images/home/my.png'),
        pinggu: require('@/assets/images/home/pinggu.png'),
        release: require('@/assets/images/home/release.png'),
        issue: require('@/assets/images/home/issue.png'),
        rank: require('@/assets/images/home/ranking.png'),
        revision: require('@/assets/images/home/revision.png'),
        contribute: require('@/assets/images/home/contribute.png')
      },
      ruleform: {
        pageNum: 1,
        pageSize: 5
      },
      form: {
        publishChannel: '', // 渠道
        date: [], // 日期数组
        departmentId: [], // 单位名称
        checkStatus: '', // 审核状态
        keyword: '', // 关键字
        pageNum: 1,
        pageSize: 30
      },
      swiperOptions: {
        notNextTick: true,
        loop: true,
        slidesPerGroup: 1,
        autoplay: {
          delay: 3000,
          stopOnLastSlide: false,
          disableOnInteraction: false
        },
        direction: 'vertical',
        slidesPerView: 6,
        // 设置点击箭头
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev'
        }
      },
      monthDay: []
    }
  },
  components: {
    swiper,
    swiperSlide
  },
  created () {
    this.roleName = this.userInfo.roleName
    this.userName = this.userInfo.userName
    var nowDate = new Date()
    var showNowTime = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate()
    var monthone = nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + 1
    this.showNowTime = showNowTime
    this.monthDay[0] = monthone
    this.monthDay[1] = showNowTime
  },
  mounted () {
    this.drawLine()
    this.honeTodo()
    this.getContibuteList()
  },
  methods: {
    showMyArticle () {
      this.isMy = true
      this.drawLine()
    },
    showAllArticle () {
      this.isMy = false
      this.drawAllLine()
    },
    toWriteContribute (id) {
      this.$router.push({ name: 'WriteContribute', query: { id: id } })
    },
    drawLine () {
      this.$http.post(this.$api.myArticle)
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
                left: '15',
                right: '15',
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
                data: this.rightValue.chartData.days,
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
                  name: '投稿曲线',
                  type: 'line',
                  color: '#1f90e5',
                  data: this.rightValue.chartData.allArticles
                },
                {
                  name: '审核通过曲线',
                  type: 'line',
                  color: '#ed7d31',
                  data: this.rightValue.chartData.checkedArticles
                }
              ]
            })
          }
        })
        .catch(() => {
        })
    },
    drawAllLine () {
      this.$http.post(this.$api.allArticle)
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
                left: '15',
                right: '15',
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
                data: this.rightValue.chartData.days,
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
                  name: '投稿曲线',
                  type: 'line',
                  color: '#1f90e5',
                  data: this.rightValue.chartData.allArticles
                },
                {
                  name: '审核通过曲线',
                  type: 'line',
                  color: '#ed7d31',
                  data: this.rightValue.chartData.checkedArticles
                }
              ]
            })
          }
        })
        .catch(() => {
        })
    },
    dealWithTime (data) {
      let formatDateTime
      let H = data.getHours()
      let Min = data.getMinutes()
      let S = data.getSeconds()
      H = H < 10 ? ('0' + H) : H
      Min = Min < 10 ? ('0' + Min) : Min
      S = S < 10 ? ('0' + S) : S
      formatDateTime = H + ':' + Min + ':' + S
      return formatDateTime
    },
    dealWith (timeStamp) {
      let formatDate
      let year = new Date(timeStamp).getFullYear()
      let month = new Date(timeStamp).getMonth() + 1 < 10 ? '0' + (new Date(timeStamp).getMonth() + 1) : new Date(timeStamp).getMonth() + 1
      let date = new Date(timeStamp).getDate() < 10 ? '0' + new Date(timeStamp).getDate() : new Date(timeStamp).getDate()
      formatDate = year + '.' + month + '.' + date
      return formatDate
    },
    // 获取征稿列表
    getArticleList () {
      this.$http.post(this.$api.listArticle, this.ruleform)
        .then(res => {
          this.contributionData = res.data.data.content
        })
        .catch(() => { })
    },
    // 获取投稿列表
    getContibuteList () {
      this.$http.post(this.$api.articleList, this.form)
        .then(res => {
          let datas = res.data.data.content
          this.articleData.push(...datas)
        })
        .catch(() => { })
    },
    StopSwiper () {
      this.swiper.autoplay.stop()
    },
    UpSwiper () {
      this.swiper.autoplay.start()
    },
    // 首页数据
    honeTodo () {
      this.$http.get(this.$api['home_todo'])
        .then(res => {
          if (res.data.code === 200) {
            this.leftValue = res.data.data
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    toArticle (id) {
      this.$router.push({ name: 'ManuscriptDetail', query: { id: id } })
    },
    toPush (nextRoute) {
      this.$router.push({ name: nextRoute })
    },
    // 我的稿件 个人
    getDate () {
      if (this.rightValue.allArticleNum !== 0) {
        this.$router.push({ name: 'MyMessageList', query: { date: '1' } })
      }
    },
    getAllTou () {
      if (this.rightValue.allArticleNum !== 0) {
        this.$router.push({ name: 'MessageArticleBox', query: { changeSide: false, date: this.monthDay } })
      }
    },
    getAllChecks () {
      if (this.rightValue.checkedArticleNum !== 0) {
        this.$router.push({ name: 'MessageArticleBox', query: { checkResult: '3', changeSide: false, date: this.monthDay } })
      }
    },
    // 审核通过 个人
    getStats () {
      if (this.rightValue.checkedArticleNum !== 0) {
        this.$router.push({ name: 'MyMessageList', query: { checkResult: '3' } })
      }
    },
    // 未读
    MessageArticleBox () {
      if (this.leftValue.noReadArticleNum !== 0) {
        this.$router.push({ name: 'MessageArticleBox', query: { read: '0', changeSide: false } })
      }
    },
    // 需要审核数
    AuditList () {
      if (this.leftValue.needCheckArticleNum !== 0) {
        this.$router.push({ name: 'AuditList', query: { checkResult: '1' } })
      }
    },
    // 未读消息
    SystemMessage () {
      if (this.leftValue.noReadMessageNum !== 0) {
        this.$router.push({ name: 'SystemMessage' })
      }
    }

  },
  destroyed () {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  computed: {
    swiper () {
      return this.$refs.mySwiper.swiper
    },
    ...mapState({
      userInfo: state => state.user.userInfo
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>
<style>
.swiper-container {
  width: 320px;
  height: 100%;
  position: static;
  --swiper-navigation-size: 24px;
}
.swiper-box .swiper-slide p, .swip-ul li p {
  height: 40px;
  cursor: pointer;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.swiper-box .swiper-slide a, .swip-ul li a {
  color: #1f90e5;
}
.swiper-box .swiper-slide a:hover, .swip-ul li a:hover {
  text-decoration: underline;
}
.swiper-box .swiper-button-prev, .swiper-button-next {
  top: 47%;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.2);
}
.swiper-box .swiper-button-prev {
  left: 0px;
}
.swiper-button-prev:hover, .swiper-button-next:hover{
  background-color: rgba(0, 0, 0, 0.4);
}
.swiper-box .swiper-button-next {
  right: 0px;
}
.swiper-button-prev:after, .swiper-button-next:after{
  font-size: 10px;
  font-weight: bold;
  color: #fff;
}
</style>
<style lang="scss" scoped>
.contribution-right{
  width: 1000px;
  height: 260px;
  overflow: hidden;
  border-bottom: 1px solid #DDDDDD;
  margin-bottom: 20px;
  h2 span{
    font-size: 16px;
    font-family: DengXian-Regular;
    font-weight: 400;
    color: rgba(51, 51, 51, 1);
    line-height: 49px;
    padding-left: 9px;
  }
  h2 span:first-of-type::before{
    content: "";
    width: 4px;
    background-color: #32a1f5;
    height: 17px;
    float: left;
    margin-top: 15px;
  }
  .contribution-ul{
    padding: 0 20px 20px 20px;
    border: 1px solid #DDDDDD;
  }
  .contribution-li{
    display: flex;
    padding: 22px 0;
    border-bottom: 1px solid rgba(204, 204, 204, 1);
    overflow: scroll;
  }
  .cover-box{
    width: 255px;
    height: 168px;
    margin-right: 32px;
  }
  .text-box{
    width: 100%;
    flex: 1;
  }
  .cover-box img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: auto;
  }
  .detail-title{
    font-size: 16px;
    font-weight: bold;
    color: #000000;
  }
  .detail-content{
    height: 60px;
    font-size: 14px;
    color: #333333;
    margin: 15px 0;
    font-weight: 400;
    line-height: 1.5;
  }
  .detail-msg{
    width: 100%;
    height: 40px;
    line-height: 40px;
    position: relative;
    .detail-time{
      left: 0;
    }
    .detail-readNum{
      left: 150px;
    }
    .detail-name{
      left: 300px;
    }
    .detail-email{
      right: 100px;
    }
    .detail-tougao{
      width: 80px;
      height: 40px;
      text-align: center;
      background-color: #409EFF;
      color: white;
      border-radius: 8px;
      right: 0;
    }
  }
  .detail-msg p{
    position: absolute;
    color: #aaaaaa;
  }
}
.home {
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  padding: 47px 30px 100px 35px;
  .chart {
    width: 826px;
    height: 478px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 30px 25px 45px 55px;
    float: right;
    position: relative;
    h2 {
      font-size: 24px;

      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      border-left: 8px solid #329edd;
      text-indent: 17px;
      margin-bottom: 35px;
      margin-left: -20px;
    }
    .myArticle{
      position: absolute;
      right: 180px;
      top: 60px;
    }
    .allArticle{
      position: absolute;
      right: 50px;
      top: 60px;
    }
    p {
      position: absolute;
      left: 70px;
      top: 70px;
      font-size: 18px;

      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      a {
        text-decoration: underline;
        margin: 0 5px;
        cursor: pointer;
      }
    }
  }
  .cont-left{
    .cont-userinfo{
      width: 290px;
      height: 120px;
      margin: 20px 0 65px 20px;
      background-repeat: no-repeat;
      background-size: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .cont-img{
      position: absolute;
    }
    .cont-img img{
      width: 280px;
      height: 115px;
    }
    .cont-text{
      font-size: 14px;
      font-weight: 500;
      color: white;
      text-align: center;
      line-height: 30px;
    }
  }
  .cont-right {
    .time {
      width: 206px;
      font-size: 14px;
      font-weight: bold;
      color: rgba(51, 51, 51, 1);
      line-height: 36px;
      text-align: center;
      margin-bottom: 30px;
    }
    .clock-box {
      width: 140px;
      height: 140px;
      background: rgba(255, 255, 255, 1);
      border: 9px solid rgba(108, 188, 247, 1);
      border-radius: 30px;
      margin-left: 60px;
      float: left;
    }
    .clock {
      width: 206px;
      height: 206px;
      background: rgba(255, 255, 255, 1);
      border: 9px solid rgba(108, 188, 247, 1);
      border-radius: 30px;
      width: 136px;
      height: 136px;
      border: 2px solid rgba(0, 0, 0, 1);
      border-radius: 21px;
    }
  }
  .handle {
    h2 {
      line-height: 18px;
      font-size: 15px;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      border-left: 5px solid #1f90e5;
      text-indent: 17px;
      margin-top: 26px;
    }
  }
  .table-name {
    width: 100%;
    text-align: center;
    margin-top: 23px;
    span {
      display: inline-block;
      height: 20px;
      font-size: 19px;

      i {
        display: inline-block;
        vertical-align: middle;
        width: 20px;
        height: 20px;
        margin-top: -5px;
        margin-right: 13px;
        background-color: #1f90e5;
      }
      &:nth-of-type(2) {
        i {
          margin-left: 13px;
          background-color: #ed7d31;
        }
      }
    }
  }
  .handle-contribute,.handle-list {
    width: 390px;
    background: rgba(255, 255, 255, 1);
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    margin-top: 15px;
    color: rgba(51, 51, 51, 1);
    line-height: 36px;
    box-sizing: border-box;
  }
  .handle-contribute {
    height: 270px;
    padding: 10px 10px;
    position: relative;
    overflow: hidden;
    .list-content li {
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .list-content li a {
      color: #1f90e5;
    }
    .list-content li a:hover {
      text-decoration: underline;
    }
  }
  .handle-list {
    padding: 28px 50px;
    span {
      display: inline-block;
      width: 170px;
    }
    i {
      color: #1f90e5;
      cursor: pointer;
      font-style: normal;
      display: inline-block;
      width: 30px;
      text-align: center;
    }
    a {
      display: inline-block;
      width: 17px;
      color: #22a4ff;
      margin-right: 10px;
    }
  }
  .ansy-list {
    overflow: hidden;
    margin-bottom: 60px;
  }
  li {
    img {
      display: block;
      margin: auto;
    }
  }
  .li_img {
    padding-top: 23px;
  }
  .myarticle {
    background: linear-gradient(
      0deg,
      rgb(185, 215, 238),
      rgb(46, 152, 233),
      rgba(0, 124, 220, 1)
    );
  }
  .assess {
    background: linear-gradient(
      0deg,
      rgb(245, 224, 187),
      rgb(224, 176, 72),
      rgb(192, 149, 9)
    );
  }
  .release {
    background: linear-gradient(
      0deg,
      rgb(193, 236, 238),
      rgb(72, 206, 224),
      rgb(17, 137, 167)
    );
  }
  .contribute {
    background: linear-gradient(
      0deg,
      rgb(243, 220, 204),
      rgb(247, 170, 107),
      rgb(207, 113, 25)
    );
  }
  .ranking {
    background: linear-gradient(
      0deg,
      rgb(232, 204, 243),
      rgb(192, 121, 233),
      rgb(169, 63, 230)
    );
  }
  .revision {
    background: linear-gradient(
      0deg,
      rgb(243, 204, 233),
      rgb(233, 121, 209),
      rgb(226, 80, 182)
    );
  }
  .issue {
    background: linear-gradient(
      0deg,
      rgb(245, 202, 226),
      rgb(248, 107, 166),
      rgb(218, 52, 115)
    );
  }
}
#myChart {
  width: 747px;
  height: 320px;
}
.ansy-list {
  ul {
    display: flex;
    width: 100%;
    justify-content: space-around;
    float: right;
    margin-top: 5px;
    li div {
      width: 110px;
      height: 110px;
      border-radius: 10px;
      vertical-align: middle;
      box-sizing: border-box;
      cursor: pointer;
    }
  }
}
.tittle-list {
  display: flex;
  width: 100%;
  justify-content: space-around;
  float: right;
  margin-top: 5px;
  span {
    display: inline-block;
    width: 110px;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: rgba(51, 51, 51, 1);
    line-height: 36px;
    cursor: pointer;
  }
}
.month {
  color: #22a4ff;
  cursor: pointer;
  text-decoration: underline;
  margin: 0 5px;
}
</style>
