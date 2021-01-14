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
                  <div class="history">
                    <div class="history-cont">
                      <el-row :gutter="10">
                        <el-col :xs="14"
                                :sm="14"
                                :md="14"
                                :xl="14"
                                style="padding-left: 0px; padding-right: 0px;"
                                class="history-left">
                          <div class="cont-box"
                              v-for="(item,index) in historyList"
                              :key="index">
                            <div class="coverImage">
                              <img v-if="item.eventThumb"
                                  :src="item.eventThumb">
                              <img v-else
                                  :src="require('@/assets/images/empty-data.png')">
                            </div>
                            <div class="history-box">
                              <p class="history-title">{{item.eventTitle}}</p>
                              <p :class="[!item.isShow ? 'history-center-width': '', 'history-center']">{{item.eventDescription}}</p>
                              <p class="more"
                              v-if="!item.isShow"
                                @click="routeWeb(item)">更多介绍></p>
                              <p class="more"
                                v-if="item.isShow"
                                @click="hideExpand(item)">收起></p>
                            </div>
                          </div>
                        </el-col>
                        <el-col :xs="10"
                                :sm="10"
                                :md="10"
                                :xl="10"
                                class="history-right">
                                <!-- <div class="addhistory" @click="addHistory"><p>添加历史事件</p></div> -->
                          <el-calendar v-model="value">
                            <template slot="dateCell"
                                      slot-scope="{date, data}">
                              <!-- 日期显示 -->
                              <div class="date-box"
                                  :class="data.isSelected ? 'is-selected' : ''"
                                  @click="getClickHistory(data, data.day.split('-').slice(1).join('-'))">
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
                                        <div class="is-selected">{{item.things}}</div>
                                      </el-tooltip>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </template>
                          </el-calendar>
                          <div class="festival-list"></div>
                        </el-col>
                      </el-row>
                    </div>
                    <scroll-data @getData="getData"
                                :dataLess="dataLess"></scroll-data>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <v-dialog
      :historyForm="historyForm"
      :historyVisible="historyVisible"
      @closeModal="getClose"
      @confirmDia="getConfirmDialog"
    >
    </v-dialog>
  </div>
</template>

<script>
import '@/libs/date_format.js'
import vMenu from '@/views/message/components/Menu'
import vDialog from '@/views/message/components/AddHistoryDialog'
export default {
  name: 'History',
  data () {
    return {
      historyForm: { // 添加历史事件
        monthDay: '', // 时间
        eventTitle: '', // 标题
        eventThumb: '', // 封面
        eventDescription: '' // 描述
      },
      historyVisible: false, // 弹框
      value: new Date(),
      dataLess: false,
      historyList: [],
      calendarData: [
        { months: ['09', '11'], days: ['15'], things: '看电影' },
        { months: ['10', '11'], days: ['02'], things: '去公园野炊' },
        { months: ['12'], days: ['02'], things: '看星星' },
        { months: ['12'], days: ['03'], things: '看月亮' }
      ],
      params: {
        monthDay: '',
        pageNum: 1,
        pageSize: 32
      }
    }
  },
  methods: {
    hideExpand (item) {
      item.isShow = false
    },
    // 关闭弹框
    getClose () {
      this.historyVisible = false
    },
    // 确认
    getConfirmDialog () {
      this.historyVisible = false
      this.getListHistory()
    },
    // 点击日历
    getClickHistory (data, date) {
      if (!data.isSelected) {
        this.historyList = []
        this.params.pageNum = 1
        this.getListHistory(date)
      }
    },
    // 添加历史事件
    addHistory () {
      this.historyVisible = true
    },
    getListHistory (date) {
      if (date) {
        this.params.monthDay = date
      } else {
        this.params.monthDay = this.value.Format('MM-dd')
      }
      this.$http.post(this.$api.listHistory, this.params)
        .then(res => {
          let datas = res.data.data.content
          if (datas.length) {
            if (datas.length <= 20) {
              this.dataLess = true
            }
            this.historyList.push(...datas)
          } else {
            this.historyList = []
          }
        })
    },
    getData () {
      this.params.pageNum++
      this.getListHistory()
    },
    routeWeb (item) {
      let getDescNum = item.eventDescription.replace(/[^0-9]/g, '')
      console.log(getDescNum.length)
      if (item.isCollect) {
        window.open(item.eventUrl, '_blank')
      } else if (item.eventDescription.length >= 140 && getDescNum.length < 140) {
        item.isShow = true
      }
    }
  },
  created () {
    this.getListHistory()
  },
  components: {
    vMenu,
    vDialog
  }
}
</script>
<style lang="scss">
@import '../message';
</style>
<style scoped>
.history {
  padding: 20px;
  min-height: 800px;
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
  position: relative;
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
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: #409eff;
  color: #fff;
  padding: 5px 20px;
  border-radius: 5px;
  cursor: pointer;
}
.history-left {
  border: 1px solid #ccc;
  background-color: #f5f5f5;
}
.history-right {
  height: 320px;
}
.history-right .el-calendar {
  border: 1px solid #ccc;
}
.festival-title {
  display: block;
  font-weight: bold;
  font-size: 16px;
  padding: 5px;
  line-height: 30px;
}
.festival-cont {
  text-indent: 30px;
  line-height: 20px;
}
.date-box {
  height: 100%;
}
.cont-box {
  display: flex;
  min-height: 150px;
  border-bottom: 1px solid #ccc;
}
.coverImage {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 197px;
  height: 150px;
  padding: 5px;
  box-sizing: border-box;
  background-color: #fff;
  border-right: 1px solid #ccc;
}
.coverImage img {
  width: auto;
  height: auto;
  max-width: 100%;
  max-height: 100%;
}
.history-box {
  padding: 5px;
  width: 410px;
}
.history-box .history-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 30px;
  width: 410px;
  height: 30px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: block;
}
.history-box .history-center {
  overflow: hidden;
  text-indent: 28px;
  line-height: 22px;
  word-wrap: break-word;
}
.history-center-width {
  height: 90px;
}
.more {
  float: right;
  text-decoration: underline;
  cursor: pointer;
  color: #409eff;
  padding-right: 5px;
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
.addhistory {
  height: 30px;
  display: flex;
  justify-content: flex-end;
  margin-bottom: 5px;
}
.addhistory p {
  background-color: #409eff;
  color: #fff;
  padding: 0px 8px;
  border-radius: 5px;
  cursor: pointer;
  line-height: 30px;
}
</style>
