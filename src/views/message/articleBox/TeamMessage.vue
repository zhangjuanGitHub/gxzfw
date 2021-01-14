<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TeamMessage' }">团队推荐</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="select-time">
        <div>
          <span class="demonstration">选择日期</span>
          <el-date-picker v-model="ruleForm.adviseDate"
                          align="right"
                          type="date"
                          format="yyyy 年 MM 月 dd 日"
                          value-format="yyyy-MM-dd"
                          placeholder="选择日期"
                          @change="Selection"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </div>
        <div class="icon-box">
          <ul class="icon-box-ul">
            <li><img :src="require('@/assets/images/message/wx.png')"
                   alt="微信">微信</li>
            <li><img :src="require('@/assets/images/message/wb.png')"
                   alt="微博">微博</li>
            <li><img :src="require('@/assets/images/message/toutiao.png')"
                   alt="今日头条">今日头条</li>
            <li><img :src="require('@/assets/images/message/waiwang.png')"
                   alt="网站">网站</li>
          </ul>
        </div>
      </div>
      <div class="team-box">
        <el-timeline v-if="recom.length!=0">
          <el-timeline-item :timestamp="item.adviseTime"
                            placement="top"
                            v-for="(item,index) in recom"
                            :key="index">
            <div class="team-name-box">
              <p class="message-name">{{item.userName}}:<span>“ {{item.adviseReason}} ”</span></p>
              <div class="apply-box">
                <span>稿件适用于：</span>
                <div class="apply-img-box">
                  <img v-if="item.suitRange.split(',').filter(item => item === '1').length"
                       :src="require('@/assets/images/message/wx.png')"
                       alt="微信">
                  <img v-if="item.suitRange.split(',').filter(item => item === '2').length"
                       :src="require('@/assets/images/message/wb.png')"
                       alt="微博">
                  <img v-if="item.suitRange.split(',').filter(item => item === '3').length"
                       :src="require('@/assets/images/message/toutiao.png')"
                       alt="今日头条">
                  <img v-if="item.suitRange.split(',').filter(item => item === '4').length"
                       :src="require('@/assets/images/message/waiwang.png')"
                       alt="网站">
                </div>
              </div>
            </div>
            <el-card class="team-card-box">
              <p class="team-card-box-p"
                 @click="skipDetails(item)">{{item.articleTitle}} </p>
              <p class="team-card-box-main">{{item.articleSummary}}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
        <div class="cont-none"
             v-else>
          <el-image :src="require('@/assets/images/empty-data.png')"
                    :fit="'fill'"></el-image>
        </div>
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
  </div>
</template>

<script>
import '@/libs/date_format.js'
export default {
  name: 'Team',
  data () {
    return {
      timeTest: '10:43:15',
      timeDefaultShow: '',
      ruleForm: {
        adviseDate: new Date().getTime()
      },
      recom: [],
      suitRange: [],
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      }
    }
  },
  methods: {
    skipDetails (item) {
      // 外部链接  externalStatus true
      if (item.externalStatus) {
        let windowOpen = window.open('_blank')
        windowOpen.location.href = item.externalUrl
      } else {
        console.log(item)
        let newRouter = this.$router.resolve({ name: 'ManuscriptDetail', query: { id: item.articleId } })
        window.open(newRouter.href, '_blank')
      }
    },
    Selection () {
      this.ruleForm.pageNum = 1
      this.ruleForm.pageSize = 10
      let timers = this.ruleForm.adviseDate
      this.ruleForm.adviseDate = timers.date_format().Format('yyyy-MM-dd')
      this.$http.post(this.$api.listAdvise, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.recom = res.data.data.content
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    checkTime (i) {
      if (i < 10) {
        i = '0' + i
      }
      return i
    }
  },
  created () {
    if (this.$route.query.data) {
      this.ruleForm.adviseDate = this.$route.query.data
    }
    this.Selection()
  }
}
</script>

<style scoped>
.select-time {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 12px;
}
.demonstration {
  margin-right: 10px;
}
.select-time .icon-box-ul {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.select-time .icon-box-ul {
  margin-left: -30px;
}
.select-time .icon-box-ul li span:first-child {
  width: 2px;
  height: 12px;
  background: #2899ed;
  display: inline-block;
  margin-right: 10px;
}
.select-time .icon-box-ul li {
  margin-left: 30px;
  display: flex;
  align-items: center;
}
.select-time .icon-box-ul li img {
  height: 16px;
  margin-right: 10px;
}
.team-box {
  margin-top: 30px;
}
.team-name-box {
  margin: 20px 0;
  display: flex;
  justify-content: space-between;
}
.apply-box {
  display: flex;
  align-items: center;
}
.apply-img-box img {
  margin-left: 5px;
}
.message-name span {
  color: #08a0f1;
}
.team-card-box-p {
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  font-size: 20px;
  margin-bottom: 20px;
  cursor: pointer;
}
.team-card-box-main {
  font-size: 16px;
  color: rgba(51, 51, 51, 1);
  line-height: 35px;
  font-weight: 400;
}
.team-box .cont-none {
  width: 333px;
  margin: 50px auto;
}
</style>
