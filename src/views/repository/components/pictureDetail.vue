<template>
  <div class="container picture-detail">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: routerName }">{{isPublic === 1 ? '公共' : '个人'}}图像资料库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'pictureDetail' }">图片库</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="my-img-list">
      <p class="my-img-title"
         v-text="group.groupName"></p>
      <p class="my-img-date"><span class="my-img-name"
              v-text="group.userName"></span>{{group.createTimeFmt}}</p>
    </div>
    <div class="img-box">
      <el-row :gutter="36">
        <el-col :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                v-for="(item, index) of image"
                :key="index"
                class="el-col-box">
          <el-card shadow="hover"
                   :body-style="{ padding: '0px' }">
            <el-popover ref="popover"
                        placement="center"
                        width="215"
                        trigger="hover">
              <div class="show-data">
                <p>上传人:<span>{{item.userName}}</span></p>
                <p>文件大小:<span>{{item.fileSize || '0'}}KB</span></p>
                <p>上传日期:<span>{{item.createTimeFmt}}</span></p>
              </div>
              <div slot="reference"
                   class="name-wrapper">
                <div class="image-box"
                     v-popover:popover
                     @click="showBiggerImg(item)"
                     :style="{background: 'url('+ item.uploadPath + ') no-repeat center/cover'}">
                </div>
              </div>
            </el-popover>
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
                       v-if="(isPublic === 1) || (isPublic === 2)"
                       @click="downloadFile(item.id)">
              <i class="el-icon-plus"></i>
              下载
            </el-button>
            <el-button @click="deleteVideo(item.id, index)"
                       v-if="(isPublic === 1) || (isPublic === 2)">
              <i class="el-icon-delete"></i>
              删除
            </el-button>
          </div>
        </el-col>
        <div class="upload-min-height upload-img upload-detail">
          <v-upload @getAttachmentUrl="getAttachmentUrl"
                    @removeAttachmentFiles="removeAttachmentFiles"
                    :listType="listType"
                    :showList="showList"
                    :acceptType="acceptType"
                    :isMultiple="isMultiple"></v-upload>
          <!-- <el-upload :action="this.$api.upload"
                     ref="upload"
                     list-type="picture-card"
                     :file-list="fileList"
                     multiple
                     drag
                     accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
                     :http-request="uploadSectionFile"
                     :on-remove="handleRemove">
            <i class="el-icon-upload"></i>
            <span class="image-tip">只能上传jpg/png/gif文件</span>
          </el-upload> -->
        </div>
      </el-row>
    </div>
    <div class="show-big-box" :style="{height: currentHeight + 'px'}" v-if="showBigger" @click="closeBiggerImg">
      <img :src="fileRoute" alt="">
    </div>
    <div class="upload-btn-box">
      <el-button type="primary"
                 @click="sumbitImage">确定</el-button>
      <el-button type="info"
                 @click="goBack">取消</el-button>
    </div>
    <el-dialog :visible.sync="dialogVisible"
               :modal-append-to-body='false'
               @close="getCloseModal"
               title="删除操作"
               class="dialog-public"
               width="30%">
      <p class="text-center dialong-about">您确定要删除此图片吗?</p>
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
// import ScrollData from '@/components/ScrollData'
import vUpload from '@/components/UploadAll.vue'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'MyImaageList',
  data () {
    return {
      listType: 'picture-card',
      showList: true,
      isMultiple: true,
      acceptType: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      mrFiles: [],
      dataNull: false,
      dataLess: false,
      dialogVisible: false,
      isPublic: '',
      params: {
        groupId: '',
        pageNum: 1,
        pageSize: 32,
        keyword: ''
      },
      detail: {
        'mrGroup.id': '',
        'mrGroup.groupType': 1,
        'mrGroup.isPublic': 1,
        'mrGroup.groupName': ''
      },
      image: [],
      deleteItem: {},
      group: {},
      showBigger: false,
      fileRoute: '',
      currentHeight: ''
    }
  },
  methods: {
    getAttachmentUrl (file) {
      this.mrFiles.push(file.raw)
    },
    removeAttachmentFiles (file) {
      this.mrFiles.forEach((item, index) => {
        if (item.uid === file.uid) {
          this.mrFiles.splice(index, 1)
        }
      })
    },
    getData () {
      this.params.pageNum++
      this.getImageList()
    },
    // 删除
    deleteVideo (id, index) {
      this.deleteItem.id = id
      this.deleteItem.index = index
      this.dialogVisible = true
    },
    // 确认删除
    getConfirmDelete () {
      this.dialogVisible = false
      this.$http.get(`${this.$api.fileDelete}/?fileId=${this.deleteItem.id}`)
        .then(res => {
          if (res.data.code === 200) {
            this.image.forEach((item, index) => {
              if (this.deleteItem.id === item.id) {
                this.image.splice(index, 1)
              }
            })
            this.$message.success('操作成功！')
          }
        })
        .catch(() => { })
    },
    // 模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 下载
    downloadFile (id) {
      window.location.href = `${this.$api.downloadFile}?fileId=${id}&authCode=${this.token}`
    },
    showDetail (item, index) {
      item.vidioDetail = true
    },
    hiddenDetail (item, index) {
      item.vidioDetail = false
    },
    getImageList () {
      this.$http.post(this.$api.fileList, this.params)
        .then(res => {
          if (res.data.code === 200 && res.data.data.page.content.length) {
            let content = res.data.data.page.content
            let group = res.data.data.mrGroup
            this.image.push(...content)
            this.group = group
            this.image.forEach(item => {
              item.vidioDetail = false
            })
            if (content.length < 20) {
              this.dataLess = true
            }
          } else {
            let group = res.data.data.mrGroup
            this.group = group
            this.image = []
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    goBack () {
      this.$router.go(-1)
    },
    // 添加图片
    sumbitImage () {
      this.detail['mrGroup.id'] = this.params.groupId
      this.detail['mrGroup.groupName'] = this.group.groupName
      this.detail['mrGroup.isPublic'] = this.isPublic
      let fd = new FormData()
      for (let key in this.detail) {
        fd.append(key, this.detail[key])
      }
      this.mrFiles.forEach((item, index) => {
        fd.append(`mrFiles[${index}].file`, item)
      })
      this.$http.post(this.$api.editGroupOrFile, fd)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功！')
            this.$router.push({ name: this.routerName })
          }
        })
        .catch(() => { })
    },
    // 放大图片
    showBiggerImg (item) {
      this.currentHeight = document.documentElement.clientHeight || document.body.clientHeight
      this.fileRoute = item.uploadPath
      this.showBigger = true
    },
    // 关闭放大图片
    closeBiggerImg () {
      this.showBigger = false
      this.fileRoute = ''
    }
  },
  mounted () {
    let bod = document.querySelector('body')
    bod.style.overflow = 'auto'
  },
  created () {
    this.params.groupId = this.$route.params.id
    this.isPublic = parseInt(this.$route.params.isPublic)
    this.getImageList()
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
      let router = this.isPublic === 1 ? 'publicImage' : 'personImage'
      return router
    }
  },
  components: {
    vUpload
    // ScrollData
  }
}
</script>
<style lang="scss">
@import "../resour";
.upload-detail .avatar-uploader-icon {
  font-size: 32px;
  margin-top: 100px;
}
</style>
<style scoped>
.show-big-box {
  width: 100%;
  /* height: 100%; */
  background-color: rgba(0, 0, 0, 0.7);
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: scroll;
}
.show-big-box img {
  max-width: 800px;
}
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
.picture-detail .image-box {
  height: 170px;
  overflow: hidden;
  cursor: pointer;
}
.picture-detail .img-box .el-col {
  width: 24%;
  height: 100%;
  position: relative;
}
.picture-detail .details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.picture-detail .card-details {
  padding: 16px;
}
.picture-detail .card-num-box {
  display: flex;
  justify-content: space-between;
}
.picture-detail .card-details-title,
.picture-detail .details-span,
.picture-detail .time-style {
  font-size: 16px;
}
.picture-detail .card-details-title {
  color: #333333;
  line-height: 2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.picture-detail .details-span {
  color: #1783ff;
  display: inline-block;
  width: 96px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.picture-detail .time-style {
  color: #b2b2b2;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.picture-detail .operation .el-button {
  width: 85px;
  height: 32px;
  font-size: 13px;
  border-radius: 0px;
  color: #fff;
  padding: 0px;
}
.picture-detail .operation {
  margin: 19px 50px;
}
.picture-detail .operation .el-button:last-child {
  background-color: #c86cdf;
}
.picture-detail .audioDetail {
  width: 100%;
  height: 170px;
  background: #0000004b;
}
.picture-detail .audioDetail p {
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
.dialong-about {
  font-size: 18px;
}
.show-data p {
  margin-bottom: 5px;
}
.show-data span {
  color: #39a3f2;
  margin-left: 5px;
}
.upload-btn-box {
  text-align: right;
}
.picture-detail .el-row {
  display: flex;
  flex-wrap: wrap;
}
.picture-detail .upload-img {
  display: block;
  padding: 0 18px;
}
.picture-detail .image-tip {
  font-size: 14px;
}
</style>
