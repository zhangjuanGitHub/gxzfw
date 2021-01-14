<template>
  <div class="monitor">
    <div class="monitor-search article-search">
      <el-form ref="form"
               :model="form"
               label-width="80px">
        <el-form-item label="时间:"
                      prop="date">
          <el-date-picker v-model="form.date"
                          size="small"
                          type="daterange"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div class="search-btn">
        <el-button class="first-btn"
                   type="primary"
                   @click="getArticle">筛选</el-button>
        <el-button class="first-btn"
                   @click="reset('form')">重置</el-button>
        <el-button class="first-btn"
                   type="primary"
                   v-if="!deleteShow"
                   @click="showTeamDialog">新建任务</el-button>
        <el-button class="first-btn"
                   type="danger"
                   v-else
                   :disabled="this.params.utid.length===0"
                   @click="showDelete">确认删除</el-button>
        <el-button type="danger"
                   v-if="!deleteShow"
                   @click="deleteTeamDialog">删除任务</el-button>
        <el-button v-else
                   @click="overDelete">取消删除</el-button>
      </div>
    </div>
    <div class="monitor-cont"
         v-for="(item,index) in monitorList"
         :key="index">
      <div class="content-box">
        <el-checkbox-group v-model="params.utid"
                           v-if="deleteShow">
          <el-checkbox :label="item.utid">删除</el-checkbox>
        </el-checkbox-group>
        <div class="content -right">
          <div class="content-title" v-html="item.title"></div>
          <p class="monitor-abs" v-html="item.content"></p>
        </div>
      </div>
      <div class="statis">
        <span>提交时间: <i>{{item.inserttime}}</i></span>
        <span class="last-span"
              v-if="item.simcnt===0">该文本在互联网传播数据较少</span>
        <span class="last-span"
              style="color:red;"
              v-else-if="item.simcnt===-1">正在计算,请稍后...</span>
        <span class="last-span"
              v-else-if="item.simcnt===-2">文章过短</span>
        <span class="last-span"
              v-else-if="item.simcnt===-3">更新失败</span>
        <span class="last-span"
              v-else>有<i class="red"
             @click="MonitorAnaly(item,index)">{{item.simcnt}}</i>条转载数据</span>
      </div>
    </div>
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal="ismodal"
                 center
                 title="新建实时监测任务"
                 width="40%">
        <el-form :model="fromData"
                 :label-position="'right'"
                 :rules="rules"
                 ref="fromData">
          <el-form-item prop="title"
                        label="文章题目:">
            <el-input v-model="fromData.title"></el-input>
          </el-form-item>
          <el-form-item class="bordno"
                        prop="crawlertype"
                        label="范围:">
            <el-radio-group v-model="fromData.crawlertype">
              <el-radio label="1">全网数据</el-radio>
              <el-radio label="2">新闻网站</el-radio>
              <!-- <el-radio label="3">微信</el-radio> -->
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="content"
                        label="正文内容:">
            <el-input type="textarea"
                      :rows="4"
                      placeholder="请输入文章内容"
                      v-model="fromData.content">
            </el-input>
          </el-form-item>
        </el-form>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="setDialogText('fromData')">确 定</el-button>
          <el-button @click="getDialog">取 消</el-button>
          <el-button @click="getRest('fromData')">重置</el-button>
        </span>
      </el-dialog>
    </div>
    <el-dialog title="任务删除"
               :visible.sync="deleteTeam"
               :modal-append-to-body="false"
               width="30%"
               center>
      <span class="dialog-span">您确定要执行此操作吗?</span>
      <span slot="footer"
            class="dialog-footer">
        <el-button type="primary"
                   @click="deleteTeams">确 定</el-button>
        <el-button @click="overDelete">取 消</el-button>
      </span>
    </el-dialog>
    <div v-if="dataNull"
         class="text-center">
      <img :src="require('@/assets/images/empty-data.png')">
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import ScrollData from '@/components/ScrollData'
export default {
  data () {
    return {
      params: {
        utid: []
      },
      deleteShow: false,
      deleteTeam: false,
      deleteList: [],
      form: {
        date: []
      },
      dataLess: false,
      dataNull: false,
      monitorList: [],
      dialogVisible: false,
      ismodal: false, // 遮罩
      compute: [],
      timer: null,
      articleId: '',
      fromData: {
        crawlertype: '',
        content: ''
      },
      rules: {
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          { min: 10, message: '不得少于10个字符', trigger: 'blur' }
        ],
        crawlertype: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    formatDate (now) {
      var year = now.getFullYear() + '-'
      var month = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-'
      var d = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
      return year + month + d
    },
    // 新建任务打开
    showTeamDialog () {
      this.dialogVisible = true
      clearInterval(this.timer)
      this.timer = null
    },
    // 新建任务关闭
    getDialog (formName) {
      this.dialogVisible = false
      this.setTimer()
    },
    // 新建任务重置
    getRest (formName) {
      this.$refs[formName].resetFields()
    },
    // 新建任务
    setDialogText (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.insert, this.fromData)
            .then(res => {
              if (res.data.code === 200 && res.data.data) {
                this.articleId = res.data.data.toString()
                this.$refs[formName].resetFields()
                this.getArticle()
              }
            }).catch(() => {
            })
          this.dialogVisible = false
        } else { return false }
      })
    },
    // 获取文章列表 无数据弹出新建弹框
    getArticle (resolve, reject) {
      let article = {}
      if (this.form.date) {
        article.startDate = this.form.date[0]
        article.endDate = this.form.date[1]
      } else {
        article.startDate = ''
        article.endDate = ''
      }
      this.dataNull = false
      this.$http.post(this.$api.userTextList, article)
        .then(res => {
          this.monitorList = res.data.data.list
          // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
          let open = []
          this.monitorList.forEach(item => {
            if (item.simcnt === -1) {
              open.push(item.simcnt)
            }
          })
          if (open.length > 0) {
            this.setTimer()
          } else {
            clearTimeout(this.timer)
          }
          if (this.monitorList.length === 0) {
            this.dataNull = true
            this.timer && clearTimeout(this.timer)
          }
          resolve()
        }).catch(() => {})
    },
    setTimer () {
      this.timer && clearTimeout(this.timer)
      this.timer = setInterval(() => {
        this.getArticle()
      }, 10000)
    },
    // 传播分析
    MonitorAnaly (item, index) {
      this.$router.push({ name: 'Analysis', query: { utid: item.utid } })
    },
    // retrieval () {
    //   this.getArticle()
    // },
    // 重置
    reset (formName) {
      this.$refs[formName].resetFields()
      this.deleteTeam = false
      this.deleteShow = false
      this.params.utid = []
      this.monitorList = []
      this.getArticle()
      this.timer && clearTimeout(this.timer)
    },
    // 删除弹框
    showDelete () {
      this.deleteTeam = true
      this.dialogVisible = false
      this.getArticle()
    },
    deleteTeamDialog () {
      this.deleteShow = true
      this.timer && clearTimeout(this.timer)
    },
    // 确认删除
    deleteTeams () {
      if (this.params.utid.length < 1) {
        this.deleteTeam = false
        this.deleteShow = false
        this.$message.warning('请选择删除的文章')
      } else {
        this.$http.post(this.$api.deleteByUtids, this.params)
          .then(res => {
            if (res.data.code === 200) {
              this.getArticle()
              this.params.utid = []
              this.deleteTeam = false
              this.deleteShow = false
              this.timer && clearTimeout(this.timer)
              this.$message.success('操作成功!')
            }
          }).catch(() => {
            this.deleteTeam = false
            this.deleteShow = false
          })
      }
    },
    // 取消删除
    overDelete () {
      this.deleteTeam = false
      this.deleteShow = false
      this.params.utid = []
      this.setTimer()
    },
    reprintTable () {
      if (this.monitorList.length === 0) {
        this.dataNull = true
        this.showTeamDialog()
        this.timer && clearTimeout(this.timer)
      }
    }
  },
  mounted () {
    new Promise(this.getArticle)
      .then(this.reprintTable)
      .catch({})
  },
  created () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.form.date[0] = this.formatDate(start)
    this.form.date[1] = this.formatDate(end)
    this.timer && clearTimeout(this.timer)
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    })
  },
  destroyed () {
    // 每次离开当前界面时，清除定时器
    this.timer && clearTimeout(this.timer)
  }
}
</script>
<style scoped>
.monitor {
  min-height: 500px;
  padding: 15px;
  background-color: #fff;
}
.monitor-search {
  background-color: #eff1f4;
  border-radius: 10px;
}
.monitor-search .el-form {
  display: flex;
}
.monitor-search .el-form .el-form-item {
  margin: 0;
  height: 40px;
}
.monitor-search .el-form-item .el-input {
  width: 140px;
}
.monitor-search .search-btn {
  float: right;
  margin-top: -34px;
}
.monitor-search .el-button {
  border-radius: 0px;
  line-height: 0px;
  padding: 13px 9px;
  margin-right: 13px;
}
.monitor-search .first-btn {
  position: relative;
}
.monitor-search .first-btn::after {
  content: '';
  display: inline-block;
  width: 1px;
  height: 28px;
  background-color: #cccccc;
  position: absolute;
  right: -13px;
  top: 0px;
}
.monitor-cont {
  padding: 15px 19px 23px 14px;
  border-bottom: 1px solid #cccccc;
}
.monitor-cont .monitor-title {
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 48px;
  display: inline-block;
}
.monitor-cont .monitor-abs {
  max-height: 130px;
  overflow: hidden;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin-bottom: 10px;
  /* 适用于webkit多行文本省略号*/
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  overflow: hidden;
}
.monitor .statis {
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  float: right;
}
.monitor .statis span i {
  font-style: normal;
}
.monitor .statis .red {
  color: red;
  margin: 0 5px;
  text-decoration: underline;
  cursor: pointer;
}
.monitor .statis span:first-of-type {
  margin-right: 20px;
}
.monitor-search .el-form-item .el-checkbox:last-child {
  margin-left: -20px;
}
.last-span {
  display: inline-block;
  width: 120px;
}
.content-box {
  display: flex;
  align-items: center;
}
.content-box .el-checkbox-group {
  margin-right: 10px;
}
.content-title{
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 48px;
}
</style>
