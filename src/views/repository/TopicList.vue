<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Inspect' }">热点新闻</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'TopicList' }">专题列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="topic-box">
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
          <div class="topic-detail-box">
            <el-row :gutter="15">
              <el-col :span="8"
                      v-for="(item, index) in topicList"
                      :key="index"
                      class="topic-col">
                <el-card :body-style="{ padding: '0px' }"
                         shadow="hover">
                  <div class="topic-img">
                    <p class="topic-detail-title lin-clamp-1" v-text="item.specialName"></p>
                    <p class="createdTime">创建时间: <span v-text="item.createTime"></span></p>
                  </div>
                  <div class="topic-detail">
                    <div class="topic-detail-body cursor">
                      <p class="lin-clamp-3" v-text="item.specialKeyword"></p>
                    </div>
                    <div class="topic-bottom clearfix">
                      <div class="display-div just-bet margin-b-10">
                        <p v-if="item.status === 1">状态：<span class="danger">未分析</span></p>
                        <p v-else-if="item.status === 2">状态：<span class="primary">分析中</span></p>
                        <p v-else-if="item.status === 3">状态：<span class="success">已完成</span></p>
                        <p>相关报道：<span class="primary" v-text="item.relatedReportNum"></span></p>
                      </div>
                      <div class="display-div just-bet">
                        <p>追踪日期：<span class="primary" v-text="item.specialStart + ' - ' +item.specialEnd"></span></p>
                      </div>
                      <div class="topic-btn-box">
                        <i @click="setting(item,index)" class="iconfont icon-icon_shezhi"></i>
                        <i @click="trace(item)" class="iconfont icon-shujukanban primary"></i>
                        <i @click="delectSpecial(item.id)" class="iconfont icon-shanchu1 danger"></i>
                      </div>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <div class="text-center"
                 v-if="dataNull">
              <img :src="require('@/assets/images/empty-data.png')"
                   alt="">
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
    <v-dialog
      :trackForm="trackForm"
      :trackVisible="trackVisible"
      @closeModal="getClose"
      @confirmDia="getConfirmDia"
    >
    </v-dialog>
    <delete-dialog
      :isDiaingShow="isDiaingShow"
      @closeModal="getCloseDelete"
      @confirmDelete="getConfirmDelete"
    ></delete-dialog>
  </div>
</template>

<script>
import vMenu from '@/views/repository/components/Menu'
import vDialog from './components/Dialog'
import deleteDialog from '../../components/Diaing'
export default {
  name: 'TopicList',
  data () {
    return {
      dataLess: false,
      dataNull: false,
      topicList: [],
      trackVisible: false, // 修改弹框
      isDiaingShow: false, // 删除弹框
      trackForm: {
        id: '',
        specialName: '',
        specialKeyword: '',
        time: [],
        sourceId: '' // 文章id
      },
      page: {
        'pageNum': 1,
        'pageSize': 10,
        'sortDirection': '',
        'sortField': ''
      }
    }
  },
  methods: {
    trace (item) {
      if (item.status === 3) {
        this.$router.push({ name: 'Trace', query: { id: item.id, title: item.specialName, Keyword: item.specialKeyword } })
      } else {
        this.$message.warning('文章分析中！请分析完成后重试！')
      }
    },
    // 确认删除
    getConfirmDelete () {
      let json = {
        ids: []
      }
      json.ids.push(this.deleteId)
      this.$http.post(this.$api.delectSpecial, json)
        .then(res => {
          this.$message.success('操作成功！')
          // this.topicList = []
          this.topicList.forEach((item, index) => {
            if (item.id === this.deleteId) {
              this.topicList.splice(index, 1)
            }
          })
          if (!this.topicList.length >= 1) {
            this.dataNull = true
          }
        })
        .catch(() => {})
    },
    // 关闭删除弹框
    getCloseDelete () {
      this.isDiaingShow = false
    },
    // 删除弹框
    delectSpecial (id) {
      this.isDiaingShow = true
      this.deleteId = id
      // let json = {
      //   ids: []
      // }
      // json.ids.push(id)
      // this.$http.post(this.$api.delectSpecial, json)
      //   .then(res => {
      //     this.$message.success('操作成功！')
      //     this.topicList = []
      //     this.getList()
      //   })
      //   .catch(() => {})
    },
    getData () {
      this.page.pageNum++
      this.getList()
    },
    // 热点追踪弹框
    setting (item, index) {
      this.$http.get(`${this.$api.findOne}/${item.id}`)
        .then(res => {
          this.trackForm = res.data.data
          this.trackForm.id = item.id
          this.trackForm.time = [this.trackForm.specialStart, this.trackForm.specialEnd]
        })
      this.trackVisible = true
    },
    // 确认修改
    getConfirmDia () {
      this.trackVisible = false
      this.topicList = []
      this.getList()
    },
    // 取消弹框
    getClose () {
      this.trackVisible = false
    },
    getList () {
      this.$http.post(this.$api.findSpecial, this.page)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            if (datas.length < 20) {
              this.dataLess = true
            }
            this.topicList.push(...datas)
          } else {
            this.dataNull = true
            this.topicList = []
          }
        })
        .catch(() => {})
    }
  },
  created () {
    this.getList()
  },
  components: {
    vMenu,
    vDialog,
    deleteDialog
  }
}
</script>
<style scope>
.topic-title:before {
  content: "";
  width: 5px;
  height: 22px;
  position: absolute;
  background: #5397e2;
}
.topic-title span {
  margin-left: 12px;
  font-size: 16px;
}
.topic-detail-box {
  background: #fff;
  padding: 0px 15px 30px;
}
.topic-detail {
  padding: 0 10px 10px;
}
.topic-detail-title {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
}
.topic-detail-body {
  font-size: 16px;
  padding: 10px 0;
  color: #333;
  border-bottom: 1px solid rgba(229, 228, 228, 1);
  min-height: 50px;
}
.topic-detail-body p {
  line-height: 1.2;
  letter-spacing: 1.2px;
}
.topic-img {
  position: relative;
  padding: 15px;
  background: #fafafa;
  border-bottom: 1px solid rgba(229, 228, 228, 1);
}
.topic-img img {
  width: 100%;
  height: 155px;
}
.topic-bottom {
  padding: 10px 0 10px;
}
.display-div {
  display: flex;
}
.margin-b-10 {
  margin-bottom: 10px;
}
.topic-source {
  margin-left: 40px;
}
.just-bet {
  justify-content: space-between;
}
.oper-icon {
  opacity: 0;
  transition: opacity 2s;
  position: absolute;
  color: red;
  background: red;
  position: absolute;
  top: 10px;
  right: 10px;
}
.topic-img:hover .oper-icon {
  opacity: 1;
}
.topic-btn-box .iconfont {
  font-size: 24px;
  cursor: pointer;
}
.topic-btn-box {
  margin: 20px auto 0;
  display: flex;
  justify-content: space-around;
  padding-top: 10px;
  border-top: 1px solid rgba(229, 228, 228, 1);
}
.topic-col {
  margin-top: 10px
}
</style>
