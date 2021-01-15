<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item v-if="this.routeName==='ReviewsAssess'"
                            :to="{ name: 'ReviewsAssess' }">任务考核</el-breadcrumb-item>
        <el-breadcrumb-item v-else-if="this.routeName==='ReviewsRecording'"
                            :to="{ name: 'ReviewsRecording' }">工作记录</el-breadcrumb-item>
        <el-breadcrumb-item v-else
                            :to="{ name: 'ReviewsIssued' }">任务下达</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsIssuedAdd' }">任务查看</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
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
          <div>
            <div class="feedback-detail">
              <p class="feedback-title">任务详情</p>
            </div>
            <issued-view :issuedInfo="issuedInfo"></issued-view>
            <!--            <div class="view-issued-box">-->
            <!--              <div class="view-issued-detalis">-->
            <!--                <ul>-->
            <!--                  <li><span>任务名称:</span><span>{{issuedInfo.taskName}}</span></li>-->
            <!--                  <li><span>任务描述:</span><span>{{issuedInfo.taskContent}}</span></li>-->
            <!--                  <li><span>任务地址:</span><span>{{issuedInfo.taskSite}}</span></li>-->
            <!--                  <li><span>人数:</span><span>{{issuedInfo.peopleSum}}</span></li>-->
            <!--                  <li>-->
            <!--                    <span>附件:</span>-->
            <!--                    <span>-->
            <!--                      <img src="http://47.93.1.52/file/jlzfw/2019/09/18/e97a1e78a1b94fa7a530e9a6020abee1.jpg" alt="">-->
            <!--                    </span>-->
            <!--                  </li>-->
            <!--                  <li><span>开始日期</span><span>{{issuedInfo.startDate}}</span></li>-->
            <!--                  <li><span>结束日期</span><span>{{issuedInfo.endDate}}</span></li>-->
            <!--                </ul>-->
            <!--              </div>-->
            <!--            </div>-->
            <div class="feedback">
              <div class="feedback-detail">
                <p class="feedback-title">反馈信息</p>
                <div v-if="comExecuteTaskList.length > 0">
                  <div class="view-issued-detalis"
                       :key="item.id"
                       v-for="(item) of comExecuteTaskList">
                    <ul>
                      <li><span>反馈人:</span><span>{{item.feedBackUserName}}</span></li>
                      <li><span>反馈名称:</span><span>{{item.feedbackTitle}}</span></li>
                      <li><span>反馈描述:</span><span>{{item.feedbackContent}}</span></li>
                      <li><span>反馈时间:</span><span>{{item.feedbackDate}}</span></li>
                      <li>
                        <span>附件:</span>
                        <div v-if="item.accessoryList.length > 0"
                             class="filelist">
                          <p v-for="valueof of item.accessoryList"
                             @click="targetUrl(valueof.accessoryUrl)"
                             :key="valueof.accessoryName"
                             class="color-primary cursor">{{valueof.accessoryName}}</p>
                        </div>
                        <span v-else>暂无附件</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div v-else
                     class="view-issued-detalis">暂无反馈</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/reviews/components/Menu'
import IssuedView from '../components/IssuedView'
export default {
  data () {
    return {
      routeName: '',
      routeId: '',
      issuedInfo: {}, // 任务信息
      comExecuteTaskList: [] // 反馈信息
    }
  },
  methods: {
    targetUrl (url) {
      window.open(url, '_blank')
    },
    getIssuedInfo () {
      this.$http.get(`${this.$api.findOneTask}/${this.routeId}`)
        .then(res => {
          let datas = res.data.data
          this.issuedInfo = datas
          this.comExecuteTaskList = datas.comExecuteTaskList ? datas.comExecuteTaskList : []
        })
        .catch(() => { })
    }
  },
  created () {
    this.routeId = this.$route.query.id
    this.routeName = this.$route.query.routeName
    this.getIssuedInfo()
  },
  components: {
    vMenu,
    IssuedView
  }
}
</script>
<style scoped>
.view-issued-detalis li {
  border-bottom: 1px solid #ccc;
  line-height: 50px;
  display: flex;
  padding: 3px 0;
}
.view-issued-detalis li span:first-child {
  display: inline-block;
  margin-right: 15px;
}
.view-issued-detalis img {
  max-width: 178px;
}
.feedback-title {
  height: 50px;
  background: #ebf3fa;
  line-height: 50px;
  padding: 0 12px;
  font-size: 16px;
}
.filelist {
  display: flex;
  flex-direction: column;
}
.view-issued-detalis {
  padding: 10px 22px;
  background: #fff;
}
</style>
