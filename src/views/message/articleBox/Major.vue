<template>
<div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'IntelligenceEditor' }">智能辅助</el-breadcrumb-item>
        <el-breadcrumb-item >智能新闻百科</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="hotnews-box">
      <el-row :gutter="10">
        <el-col :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu></v-menu>
        </el-col>
        <el-col :xs="21"
                :sm="21"
                :md="21"
                :lg="20"
                :xl="20">
          <div class="intelligence-new">
            <div class="tabs-card">
            <div class="card-name">
              <router-link :to="{name:'Major'}">
                <span class="assessment-span">重大节日</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{name:'History'}">
                <span class="assessment-span">历史上的今天</span>
              </router-link>
            </div>
              <!-- <div class="card-name">
                <router-link :to="{name:'History'}">
                  <span class="assessment-span">重大节日</span>
                </router-link>
              </div> -->
            </div>
            <div class="major">
              <div class="search">
                <div class="search">
                  <div class="festival-box" v-for="(item, index) of festivalsList" :key="index">
                  <span>距</span>
                  <span class="festival" v-text="item.festivalName"></span>
                  <span class="festiva-date" v-text="item.festivalDate"></span>
                  <span class="surplus">还有<i v-text="item.countDown"></i>天</span>
                </div>
                </div>
                 <!-- <div class="add-festival" @click="addFestival">
                  添加节日
                </div> -->
              </div>
              <div class="major-cont">
                <el-row :gutter="10">
                  <el-col :xs="12"
                          :sm="12"
                          :md="12"
                          :xl="12"
                          class="major-left">
                    <span class="festival-title">{{festivalsIntroduceList.festivalName}}简介:</span>
                    <div class="festival-cont" v-html="festivalsIntroduceList.festivalIntroduce"></div>
                  </el-col>
                  <el-col :xs="12"
                          :sm="12"
                          :md="12"
                          :xl="12"
                          class="major-right">
                    <el-calendar v-model="value">
                      <template slot="dateCell"
                                slot-scope="{date, data}">
                        <!-- 日期显示 -->
                        <div class="date-box"
                            :class="data.isSelected ? 'is-selected' : ''"
                            >
                          {{ data.day.split('-').slice(2).join('') }}
                          <!-- 节日显示 -->
                          <div v-for="(item,index) in calendarData"
                            :key="index">
                            <div v-if="(item.months).indexOf(data.day.split('-').slice(1)[0])!=-1">
                              <div v-if="(item.days).indexOf(data.day.split('-').slice(2).join('-'))!=-1">
                                <el-tooltip class="item"
                                            effect="dark"
                                            :content="item.things"
                                            placement="right">
                                  <div @click="getFestivalsIntroduce(item.things)" class="is-selected">{{item.things}}</div>
                                </el-tooltip>
                              </div>
                            </div>
                          </div>
                        </div>
                      </template>
                    </el-calendar>
                    <div class="festival-list">
                      <div class="tradition">
                        <div class="festivals-title">
                          <p class="tradition-left">传统节日:</p>
                        </div>
                        <ul class="tradition-right">
                          <li v-for="(item,index) in festivalsPublic.traditional"
                            :key="index">
                            <span @click="getFestivalsIntroduce(item.festivalName)">{{item.festivalName}}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="tradition modern">
                        <div class="festivals-title">
                          <p class="tradition-left">现代节日:</p>
                        </div>
                        <ul class="tradition-right">
                          <li v-for="(item,index) in festivalsPublic.modern"
                            :key="index">
                            <span @click="getFestivalsIntroduce(item.festivalName)">{{item.festivalName}}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="tradition Anniversary">
                        <div class="festivals-title">
                          <p class="tradition-left">纪念日:</p>
                        </div>
                        <ul class="tradition-right">
                          <li v-for="(item,index) in festivalsPublic.commemorate"
                            :key="index">
                            <span @click="getFestivalsIntroduce(item.festivalName)">{{item.festivalName}}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="tradition terms">
                        <div class="festivals-title">
                          <p class="tradition-left">二十四节气:</p>
                        </div>
                        <ul class="tradition-right">
                          <li v-for="(item,index) in festivalsPublic.solar"
                            :key="index">
                            <span @click="getFestivalsIntroduce(item.festivalName)">{{item.festivalName}}</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <v-dialog
      :festivalForm="festivalForm"
      :festivalVisible="festivalVisible"
      @closeModal="getClose"
      @confirmDia="getConfirmDialog"
    >
    </v-dialog>
  </div>
</template>

<script>
import '@/libs/date_format.js'
import vMenu from '@/views/message/components/Menu'
import vDialog from '@/views/message/components/AddFestivalDialog'
export default {
  name: 'Major',
  data () {
    return {
      festivalForm: {
        festivalName: '', // 节日名称
        festivalDate: '', // 节日日期
        festivalIntroduce: '' // 节日简介
      }, // 添加节日信息
      festivalVisible: false, // 添加节日弹框
      festivalsList: [], // 倒计时节日列表
      festivalsPublic: { // 传统节日列表
        traditional: [], // 传统节日
        modern: [], // 现代节日
        commemorate: [], // 纪念日
        solar: [] // 节气
      },
      festivalsIntroduceList: {}, // 节日介绍
      value: new Date(),
      calendarData: [ // 格式
        { months: ['09', '11'], days: ['15'], things: '看电影' },
        { months: ['10', '11'], days: ['02'], things: '去公园野炊' },
        { months: ['12'], days: ['02'], things: '看星星' },
        { years: ['2020'], months: ['01'], days: ['17'], things: '看月亮' }
      ]
    }
  },
  methods: {
    // 添加节日
    addFestival () {
      this.festivalVisible = true
    },
    // 关闭弹框
    getClose () {
      this.festivalVisible = false
    },
    // 确认
    getConfirmDialog () {
      this.festivalVisible = false
      this.getFestivalsTaggingCalendar()
    },
    getChange (change) {
      console.log(change)
    },
    // 点击日历
    getClickHistory (data, date) {
      console.log(data)
      console.log(date)
      if (!data.isSelected) {
        this.getFestivalsIntroduce(date)
      }
    },
    getDate () {
      console.log(this.value.Format('yyyy-MM-dd'))
    },
    // 获取倒计时节日
    getFestivals () {
      this.$http.get(this.$api.list_festivals_countdown)
        .then(res => {
          this.festivalsList = res.data.data
        })
        .catch(() => {})
    },
    // 获取公共节日
    getFestivalsPublic () {
      this.$http.get(this.$api.list_festivals_public)
        .then(res => {
          this.festivalsPublic = res.data.data
        })
        .catch(() => {})
    },
    // 获取节日介绍
    getFestivalsIntroduce (name) {
      this.$http.get(this.$api.list_festivals_introduce, { params: { name: name } })
        .then(res => {
          this.festivalsIntroduceList = res.data.data
          document.body.scrollTop = document.documentElement.scrollTop = 0
        })
        .catch(() => {})
    },
    // 获取日历节日
    getFestivalsTaggingCalendar (date) {
      this.$http.get(this.$api.list_festivals_tagging_calendar, { params: { yearMonth: this.value.Format('yyyy-MM-dd') } })
        .then(res => {
          this.calendarData = res.data.data.festivals
        })
        .catch(() => {})
    }
  },
  created () {
    this.getFestivals()
    this.getFestivalsPublic()
    this.getFestivalsIntroduce()
    this.getFestivalsTaggingCalendar()
  },
  watch: {
    value (newValue, oldValue) {
      this.getFestivalsTaggingCalendar()
    }
  },
  components: {
    vMenu,
    vDialog
  }
}
</script>
<style scoped>
.major {
  min-height: 500px;
  padding: 15px;
  background: #fff;
}
.intelligence-new {
  padding: 0;
  box-sizing: border-box;
  min-height: 500px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.search {
  display: flex;
  justify-content: space-between
}
.festival-box {
  border-radius: 5px;
  background-color: #f5f5f5;
  line-height: 40px;
  max-width: 450px;
  padding-left: 5px;
  margin-right: 20px;
  display: flex;
  justify-content: space-around;
}
.surplus {
  background-color: #409eff;
  color: #fff;
  border-radius: 0 5px 5px 0;
  padding: 0 5px;
  font-size: 14px;
}
.festival {
  display: block;
  min-width: 60px;
  max-width: 250px;
  margin-left: 5px;
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.festiva-date {
  display: block;
  width: 100px;
  text-align: center;
}
.festival,
.festiva-date {
  color: #409eff;
}
.surplus i {
  font-style: normal;
  margin: 0 5px;
}
.add-festival {
  background-color: #409eff;
  color: #fff;
  padding: 0px 8px;
  border-radius: 5px;
  cursor: pointer;
  line-height: 40px;
  font-size: 14px;
}
.major-cont {
  margin-top: 15px;
}
.major-left {
  min-height: 500px;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
}
.major-right .el-calendar {
  border: 1px solid #ccc;
}
.festival-title {
  display: block;
  font-weight: bold;
  font-size: 16px;
  padding: 5px;
  line-height: 30px;
}
.date-box {
  height: 100%;
}
.tradition{
  display: flex;
}
.tradition-left{
  width: 165px;
  line-height: 40px;
  text-align: left;
  font-weight: bold;
}
.tradition-right{
  line-height: 40px;
  display: flex;
  align-items: center;
  flex-wrap:wrap
}
.tradition-right li {
  margin-right: 5px;
  cursor: pointer;
}
.modern .tradition-right:after {
    content: "";
    flex: auto;
 }
.tradition-right li span{
  font-size: 14px;
  padding: 7px 12px;
  background-color: #409eff;
  color: #fff;
  border-radius: 6px;
}
.modern .tradition-left{
  width: 135px;
}
.modern .tradition-right li span{
  background-color: #67C23A;
}
.Anniversary .tradition-right li span{
  background-color: #909399;
}
.terms .tradition-right li span{
  background-color: #F56C6C;
}
.festivals-title {
  width: 100px;
}
.festival-cont {
  overflow: auto;
  overflow-x: auto;
  overflow-y: auto;
  max-height: 1200px;
}
.tabs-card {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}
.card-name a {
  display: inline-block;
  padding: 0 20px;
  height: 40px;
  border-right: 1px solid #e4e7ed;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.card-name .is-active {
  color: #2c8ae5;
  background-color: #fff;
  border-bottom-color: transparent;
}
</style>
