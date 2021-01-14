<template>
  <div class="container audio-detail">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: routerName }">{{isPublic === 1 ? '公共' : '个人'}}图像资料库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'AudioDetail' }">视频库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="my-img-list">
      <p class="my-img-title"
         v-text="mrGroup.groupName"></p>
      <p class="my-img-date"><span class="my-img-name"
              v-text="mrGroup.userName"></span>{{mrGroup.createTimeFmt}}</p>
    </div>
    <div class="img-box">
      <el-row :gutter="36">
        <el-col :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                v-for="(item, index) of video"
                :key="index"
                class="el-col-box">
          <el-card shadow="hover"
                   :body-style="{ padding: '0px' }">
            <el-popover trigger="hover"
                        placement="center"
                        width="215">
              <div class="show-data">
                <p>上传人:<span>{{item.userName}}</span></p>
                <p>文件大小:<span>{{item.fileSize}}MB</span></p>
                <p>上传日期:<span>{{item.createTimeFmt}}</span></p>
              </div>
              <div slot="reference"
                   class="name-wrapper">
                <div class="image-box"
                     popover:popover
                     @click="playVideo(item)"
                     :style="{background: 'url('+ item.thumbnailUrl + ') no-repeat center/cover'}">
                  <div class="copy-box">
                    <span class="copy-span"
                          :id="item.uploadPath"
                          v-text="item.uploadPath"></span>
                  </div>
                  <div class="audio-time"
                       v-if="item.fileType === 2">
                    <i class="el-icon-caret-right"></i>
                    <span class="timeArry"
                          v-text="item.hourLon"></span>
                  </div>
                </div>
              </div>
            </el-popover>
            <!-- <div class="image-box"
                 popover:popover
                 @click="playVideo(item)"
                 :style="{background: 'url('+ item.thumbnailUrl + ') no-repeat center', backgroundSize: 'cover'}">
              <div class="copy-box">
                <span class="copy-span"
                      :id="item.uploadPath"
                      v-text="item.uploadPath"></span>
              </div>
              <div class="audio-time"
                   v-if="item.fileType === 2">
                <i class="el-icon-caret-right"></i>
                <span class="timeArry"
                      v-text="item.hourLon"></span>
              </div>
            </div> -->
            <div class="card-details">
              <div class="card-num-box">
                <p class="card-details-title"
                   v-text="item.fileName"></p>
              </div>
              <!-- <div class="details clearfix">
                <span class="details-span">{{item.userName}}</span>
                <time class="time-style"
                      v-text="item.createTimeFmt"></time>
              </div> -->
            </div>
          </el-card>
          <div class="operation">
            <el-button type="primary"
                       v-if="(isPublic === 1 || isPublic === 2) && item.fileType !== 4"
                       @click="downloadFile(item.id)">
              下载
            </el-button>
            <!--            <el-button id="btnCopy" @click="copyUurl(item.uploadPath,index)">-->
            <!--              复制链接-->
            <!--            </el-button>-->
            <el-button id="btnCopy"
                       ref="2010305"
                       v-if="(isPublic === 1) || (isPublic === 2)"
                       @click="deleteVideo(item.id, index)">
              删除
            </el-button>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="dataNull"
         class="text-center">
      <img :src="require('@/assets/images/empty-data.png')"
           alt="">
      <p class="text-click" @click="videoUpload">暂无数据，请前往添加</p>
    </div>
    <el-dialog :visible.sync="dialogVisible"
               :modal-append-to-body='false'
               @close="getCloseModal"
               title="删除操作"
               class="dialog-public"
               width="30%">
      <p class="text-center dialong-about">您确定要删除此视频吗?</p>
      <!--      <div class="dialog-check">-->
      <!--        <el-checkbox v-model="checked">是否删除类别下的视频？</el-checkbox>-->
      <!--      </div>-->
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="getCloseModal">取 消</el-button>
        <el-button type="primary"
                   @click="getConfirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <!-- <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
// import ScrollData from '@/components/ScrollData'
import { realFormatSecond } from '@/libs/tools'
export default {
  name: 'MyImaageList',
  data () {
    return {
      newItem: {},
      dataNull: false,
      dataLess: false,
      isPublic: '',
      dialogVisible: false,
      mrGroup: {},
      params: {
        groupId: '',
        pageNum: 1,
        pageSize: 20,
        keyword: ''
      },
      video: [],
      deleteItem: {}
    }
  },
  methods: {
    getData () {
      this.params.pageNum++
      this.getVideoList()
    },
    deleteVideo (id, index) {
      this.deleteItem.id = id
      this.deleteItem.index = index
      this.dialogVisible = true
    },
    // 关闭弹出框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 确认删除
    getConfirmDelete () {
      this.dialogVisible = false
      this.$http.get(`${this.$api.fileDelete}/?fileId=${this.deleteItem.id}`)
        .then(res => {
          if (res.data.code === 200) {
            this.video.forEach((item, index) => {
              if (this.deleteItem.id === item.id) {
                this.video.splice(index, 1)
              }
            })
            if (!this.video.length) {
              this.dataNull = true
            }
            this.$message.success('操作成功！')
          }
        })
        .catch(() => { })
    },
    // 下载
    downloadFile (id) {
      window.location.href = `${this.$api.downloadFile}?fileId=${id}&authCode=${this.token}`
    },
    // 视频播放
    playVideo (item) {
      let isHttp = item.uploadPath.substr(0, 4)
      if (isHttp !== 'http') {
        this.$message.warning('视频链接地址错误！')
        return false
      }
      // fileType2 正常上传视频 4外部链接
      if (item.fileType !== 2) {
        let openWindow = window.open('_blank')
        openWindow.location.href = item.uploadPath
      } else {
        let routeData = this.$router.resolve({
          name: 'PlayVideo',
          query: { id: item.id }
        })
        window.open(routeData.href, '_blank')
      }
    },
    // 获取视频列表
    getVideoList () {
      this.$http.post(this.$api.fileList, this.params)
        .then(res => {
          if (res.data.code === 200 && res.data.data.page.content.length) {
            let content = res.data.data.page.content
            let group = res.data.data.mrGroup
            this.video.push(...content)
            this.mrGroup = group
            this.video.forEach((item, index) => {
              item.vidioDetail = false
              item.hourLon = realFormatSecond(item.hourLon)
            })
            if (content.length < 19) {
              this.dataLess = true
            }
          } else {
            this.video = []
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    copyUurl (item, index) {
      const range = document.createRange()
      range.selectNode(document.getElementById(item))
      const selection = window.getSelection()
      if (selection.rangeCount > 0) selection.removeAllRanges()
      selection.addRange(range)
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功!')
      } else {
        this.$message.error('您的浏览器暂不支持自动复制，请手动复制!')
      }
    },
    showDetail (item, index) {
      item.aidioDetail = true
    },
    hiddenDetail (item, index) {
      item.aidioDetail = false
    },
    videoUpload () {
      if (this.isPublic === 1) {
        this.$router.push({ name: 'PublicUploadVideo', query: { item: JSON.stringify(this.newItem) } })
      } else {
        this.$router.push({ name: 'PersonUploadVideo', query: { item: JSON.stringify(this.newItem) } })
      }
    }
  },
  created () {
    this.newItem = JSON.parse(this.$route.params.item)
    this.params.groupId = this.$route.params.id
    this.isPublic = parseInt(this.$route.params.isPublic)
    this.getVideoList()
  },
  components: {
    // ScrollData
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading,
      token: state => state.user.token
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    }),
    routerName () {
      let router = this.isPublic === 1 ? 'publicVideo' : 'personVideo'
      return router
    }
  }
}
</script>

<style scoped>
.my-img-list {
  padding: 48px 5px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  margin-bottom: 32px;
}
.my-img-title {
  font-size: 22px;
  color: #333333;
}
.my-img-date {
  font-size: 16px;
  color: #39a3f2;
}
.my-img-name {
  margin-right: 30px;
}
.audio-detail .image-box {
  height: 170px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.audio-detail .img-box .el-col {
  width: 25%;
  height: 100%;
  overflow: hidden;
  position: relative;
}
.audio-detail .details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.audio-detail .card-details {
  padding: 16px 16px 10px;
}
.audio-detail .card-num-box {
  display: flex;
  justify-content: space-between;
}
.audio-detail .card-details-title,
.audio-detail .details-span,
.audio-detail .time-style {
  font-size: 16px;
}
.audio-detail .card-details-title {
  color: #333333;
  line-height: 2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.audio-detail .details-span {
  color: #1783ff;
  display: inline-block;
  width: 96px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.audio-detail .time-style {
  color: #b2b2b2;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.audio-detail .operation .el-button {
  width: 85px;
  height: 32px;
  font-size: 13px;
  border-radius: 30px;
  color: #fff;
  padding: 0px;
}
.audio-detail .operation {
  margin: 19px 50px;
  text-align: center;
}
.audio-detail .operation .el-button:last-child {
  background-color: #c86cdf;
}
.audio-detail .address {
  height: 25px;
  margin-top: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  border: 1px solid #f5f5f5;
  line-height: 25px;
  font-size: 12px;
}
.audio-detail .audio-time {
  width: 100px;
  height: 32px;
  border-radius: 30px;
  font-size: 20px;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  right: 0px;
  bottom: 0px;
  cursor: pointer;
  margin-right: 16px;
  display: flex;
  align-items: center;
}
.timeArry {
  font-size: 16px;
}
.audio-detail .audio-time i {
  margin-left: 3px;
}
.audio-detail .audioDetail {
  width: 100%;
  height: 170px;
  background: #0000004b;
}
.audio-detail .audioDetail p {
  color: #fff;
  font-size: 14px;
  font-weight: bold;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.show-enter-active,
.show-leave-active {
  transition: opacity 0.5s ease-out;
}
.show-enter,
.show-leave-to {
  opacity: 0;
}
.copy-span {
  opacity: 0;
  display: inline-block;
  width: 100%;
}
.audio-detail .show-data span {
  color: #39a3f2;
  margin-left: 5px;
}
.audio-detail .show-data p {
  display: flex;
}
.audio-detail .el-popover {
  border: none;
  top: 90px;
  right: 0px;
  cursor: pointer;
}
.show-data p {
  margin-bottom: 5px;
}
</style>
