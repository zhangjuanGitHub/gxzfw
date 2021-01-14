
<template>
<div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'publicImage' }">媒体素材库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ClapAtWill' }">随手拍</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col
        :xs="3"
        :sm="3"
        :md="3"
        :lg="4"
        :xl="4">
        <v-menu></v-menu>
      </el-col>
      <el-col
        :xs="21"
        :sm="21"
        :md="21"
        :lg="20"
        :xl="20" style="padding-left: 0px; padding-right: 0px;">
        <div class='inspect'>
          <div class='inspect-header'>
            <div class="time-range">
              <span>选择时间：</span>
              <el-date-picker
                v-model="ruleForm.searchTime"
                type="daterange"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                size="small"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </div>
            <div class="search-input">
              <span>关键字：</span>
              <el-input v-model="ruleForm.content"
                        size="small"
                        placeholder="请输入关键字"
                        class="admin-keyword">
              </el-input>
            </div>
            <div class="btn-box">
              <el-button size="small"
                          type="primary"
                          @click="searchList">筛选</el-button>
              <el-button size="small"
                          @click="resetBtnForm">重置</el-button>
            </div>
          </div>
          <div class='content-box'>
            <el-table :data="clapList"
                      style="width: 100%"
                      border>
              <el-table-column prop="departmentName"
                              label="部门"
                              width="150">
              </el-table-column>
              <el-table-column prop="createTime"
                              label="发布时间"
                              width="150">
              </el-table-column>
              <el-table-column label="发布内容"
                              show-overflow-tooltip
                              width="620" prop="content">
              </el-table-column>
              <el-table-column label="附件" width="120">
                <template slot-scope="scope">
                  <!-- <div class="disflex"> -->
                    <div class="delete-click" v-if="scope.row.type === 0" style="color: #409eff">
                      <i class="el-icon-camera"></i>
                      <span @click="showImgList(scope.row.arrayUrls)">图片</span>
                    </div>
                    <div class="delete-click" v-else style="color: #67c23a">
                      <i class="el-icon-video-camera"></i>
                      <span @click="showVideo(scope.row.arrayUrls)">视频</span>
                    </div>
                  <!-- </div> -->
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog
            title="图片列表"
            :visible.sync="showImgDialog"
            width="800px"
            :modal-append-to-body="false"
            center>
              <el-row :gutter="10">
                <el-col :span="8" v-for="(item, index) of imgArr" :key="index">
                  <el-card :body-style="{ padding: '0px' }" class="clap-box">
                    <div class="clap-img-box">
                      <img :src="item" class="image" @click="showBigger(item)">
                    </div>
                    <div style="padding: 14px;">
                      <div class="bottom clearfix">
                        <el-button type="text" class="button" @click="showBigger(item)">查看大图</el-button>
                      </div>
                    </div>
                  </el-card>
                </el-col>
              </el-row>
          </el-dialog>
          <el-dialog
            title="视频"
            :visible.sync="showVideoDialog"
            width="45%"
            :modal-append-to-body="false"
            center class="video-dialog">
              <el-row>
                <el-col :span="24">
                  <video :src="this.videoUrl" preload controls style="max-height: 450px"></video>
                </el-col>
              </el-row>
          </el-dialog>
          <div class="text-center"
              v-if="dataNull">
            <img :src="require('@/assets/images/empty-data.png')"
                alt="">
          </div>
          <scroll-data @getData="getData"
                      :dataLess="dataLess"></scroll-data>
        </div>
      </el-col>
    </el-row>
</div>
</template>

<script>
import vMenu from '@/views/repository/components/Menu'
export default {
  name: 'Inspect',
  data () {
    return {
      dataLess: false,
      dataNull: false,
      clapList: [],
      ruleForm: {
        content: '', // 搜索关键字
        searchTime: [],
        pageNum: 1,
        pageSize: 20
      },
      showImgDialog: false,
      showVideoDialog: false,
      imgArr: [],
      videoUrl: ''
    }
  },
  methods: {
    // 查看图片列表
    showImgList (urls) {
      if (this.imgArr.length > 0) {
        this.imgArr = []
      }
      this.showImgDialog = true
      this.imgArr = urls
    },
    // 查看视频
    showVideo (url) {
      if (this.videoUrl.length > 0) {
        this.videoUrl = []
      }
      this.showVideoDialog = true
      this.videoUrl = url[0]
    },
    // 查看大图
    showBigger (url) {
      window.open(url, '_blank')
    },
    searchList () {
      this.ruleForm.pageNum = 1
      this.dataLess = false
      this.clapList = []
      this.getList()
    },
    // 重置
    resetBtnForm () {
      this.clapList = []
      this.ruleForm.searchTime = []
      this.ruleForm.content = ''
      this.ruleForm.pageNum = 1
      this.getList()
    },
    getData () {
      this.ruleForm.pageNum++
      this.getList()
    },
    // 获取随手拍列表
    getList () {
      this.$http.post(this.$api.getClapList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data.content.length) {
            let datas = res.data.data.content
            this.clapList.push(...datas)
            if (datas.length < 20) {
              this.dataLess = true
            }
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getList()
  },
  components: {
    vMenu
  }
}
</script>
<style>
.video-dialog .el-col-24{
  display: flex;
  justify-content: center;
}
</style>
<style scoped>
.search-input {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #333333;
  margin-left: 30px;
}
.time-range {
  margin-left: 30px;
  font-size: 14px;
}
.admin-keyword {
  width: 200px;
}
.btn-box {
  margin-right: 20px;
}
.inspect {
  background: #ffffff;
  min-height: 500px;
  overflow: hidden;
}
.inspect-header {
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 26px;
  background-color: #eff1f4;
  border-radius: 10px;
}
.inspect-header span {
  color: #606266;
}
.content-box {
  padding: 0 32px;
}
.clap-box {
  height: 300px;
  margin-bottom: 10px;
}
.clap-img-box {
  width: 100%;
  height: 230px;
  position: relative;
  background-color: #f5f5f5;
}
.clap-img-box img{
  width: 100%;
  max-height: 230px;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  cursor: pointer;
}
.clap-box:after {
  content: "";
  flex: auto;
 }
.clap-box .clearfix{
  text-align: center;
}
</style>
