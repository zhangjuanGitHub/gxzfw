<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'publicImage' }">媒体素材库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'publicVideo' }">公共图像资料库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'UploadVideo' }">{{routeItem ? '上传视频' : '新建视频类别'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="upload-video-box">
      <div class="my-img-list upload-video-detail">
         <span>文件标题：</span>
        <el-input v-model="params['mrGroup.groupName']"
                  ref="setFocus"
                  placeholder="请输入类别名称"
                  :disabled="routeItem.isDefault === 1"
                  autofocus>
          <i @click="getFocus"
             slot="suffix"
             class="el-input__icon el-icon-edit"></i></el-input>
        <!--        <p class="my-img-date"><span class="my-img-name">{{userName}}</span>{{currentTime}}</p>-->
      </div>
      <!-- <div class="upload-video-detail">
        <span>视频标题：</span>
        <el-input placeholder="请输入视频标题"
                  v-model="videoInfo.fileName"></el-input>
      </div>
      <div class="upload-video-detail">
        <span>视频链接：</span>
        <el-input placeholder="请输入视频链接"
                  v-model="videoInfo.uploadPath"></el-input>
      </div> -->
      <!-- <el-upload :action="this.$api.upload"
                 accept=".mp4"
                 drag
                 :http-request="uploadSectionFile"
                 :on-remove="handleRemove">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip"
             slot="tip">只能上传mp4文件</div>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%"
             :src="dialogImageUrl"
             alt="">
      </el-dialog> -->
      <div class="relevet">
        <el-button type="primary" id="filePicker" size="small">选择文件</el-button>
      </div>
      <div class="file-panel">
        <div class="file-list">
          <ul class="file-item"
              :class="`file-${file.id}`"
              v-for="file in fileList"
              :key="file.uid">
            <li class="file-name">{{file.name}}</li>
            <li v-if="videosize">上传中...</li>
            <li class="progress"></li>
          </ul>
          <div class="file-operate" v-if="fileList.length">
              <a title="移除"
                 @click="remove(fileList)"><i class="iconfont icon-close-big"></i>移除文件</a>
            </div >
          <div class="no-file"
               v-if="!fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
        </div>
      </div>
      <vue-upload ref="uploader"
                  uploadButton="#filePicker"
                  multiple
                  @fileChange="fileChange"
                  @success="onSuccess"></vue-upload>
      <!-- 确认 -->
      <div class="upload-btn">
        <el-button type="primary"
                   @click="debouncedGetAnswer">确定</el-button>
        <el-button type="info"
                   @click="goBack">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import '@/libs/date_format.js'
import { mapState, mapGetters } from 'vuex'
import vueUpload from '@/components/upload'
export default {
  name: 'UploadVideo',
  data () {
    return {
      fileList: [],
      uploadPath: [],
      videosize: false,
      routeItem: '',
      videoInfo: {
        fileType: 4,
        uploadPath: '',
        fileName: ''
      },
      mrFiles: [], // 上传file对象
      params: { // 基本信息
        'mrGroup.id': '',
        'mrGroup.groupType': 2,
        'mrGroup.isPublic': 1,
        'mrGroup.groupName': ''
      },
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  components: {
    vueUpload
  },
  methods: {
    // 提交
    sumbitVideo () {
      if (!this.params['mrGroup.groupName']) {
        this.$message.warning('请输入类别名称!')
        return false
      }
      let fd = new FormData()
      for (let key in this.params) {
        fd.append(key, this.params[key])
      }
      this.fileList.forEach((item, index) => {
        fd.append(`mrFiles[${index}].fileName`, '')
        fd.append(`mrFiles[${index}].uploadPath`, '')
        fd.append(`mrFiles[${index}].fileType`, this.videoInfo.fileType)
        fd.append(`mrFiles[${index + 1}].fileName`, item.name)
        fd.append(`mrFiles[${index + 1}].uploadPath`, this.uploadPath[index])
        fd.append(`mrFiles[${index + 1}].fileType`, this.videoInfo.fileType)
      })
      this.$http.post(this.$api.editGroupOrFile, fd)
        .then(res => {
          this.$message.success('操作成功！')
          this.$router.push({ name: 'publicVideo' })
        })
        .catch(() => {
        })
    },
    // 获取焦点
    getFocus () {
      this.$refs['setFocus'].focus()
    },
    fileChange (file) {
      if (!file.size) return
      this.fileList.push(file)
      this.videosize = true
    },
    onSuccess (file, response, guId) {
      let box = {
        guid: guId,
        filename: file.name
      }
      if (response.data.isOver) {
        this.videosize = false
        this.uploadPath.push(response.data.uploadPath)
      } else {
        this.$http.post(this.$api.mergeChunkUpload, box).then(res => {
          this.uploadPath.push(res.data.data.uploadPath)
          this.$message.success('上传成功')
          this.videosize = false
        }).catch(() => {})
      }
    },
    remove (file) {
      // 取消并中断文件上传
      this.uploader.cancelFile(file)
      // 在队列中移除文件
      this.uploader.removeFile(file, true)
      // 在ui上移除
      let index = this.fileList.findIndex(ele => ele.id === file.id)
      this.fileList.splice(index, 1)
    },
    fileCategory (ext) {
      let type = ''
      const typeMap = {
        video: ['mp4', 'm3u8', 'rmvb', 'avi', 'swf', '3gp', 'mkv', 'flv']
      }
      Object.keys(typeMap).forEach((_type) => {
        const extensions = typeMap[_type]
        if (extensions.indexOf(ext) > -1) {
          type = _type
        }
      })
      return type
    },
    goBack () {
      this.$router.push({ name: 'publicVideo' })
    }
  },
  computed: {
    ...mapState({
      userName: state => state.user.userInfo.userName
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    }),
    uploader () {
      return this.$refs.uploader
    }
  },
  created () {
    this.token = this.$store.state.user.token
    this.debouncedGetAnswer = this.$debounce(this.sumbitVideo, 500)
    if (this.$route.query.item) {
      let item = JSON.parse(this.$route.query.item)
      this.routeItem = item
      this.params['mrGroup.id'] = item.id
      this.params['mrGroup.groupName'] = item.groupName
      this.currentTime = item.createTimeFmt
    } else {
      let str = new Date().getTime()
      this.currentTime = str.date_format().Format('yyyy-MM-dd hh:mm')
    }
  }
}
</script>
<style lang="scss">
@import "../resour";
</style>
<style scoped>
.my-img-list {
  display: flex;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  margin-bottom: 32px;
  align-items: center;
}
.my-img-date {
  font-size: 16px;
  color: #39a3f2;
}
.my-img-name {
  margin-right: 30px;
}
.my-img-list .el-input {
  width: 450px;
}
.upload-video-box {
  width: 1000px;
  padding: 70px 50px;
  margin: 0 auto;
  background: #ffffff;
}
.upload-video-detail {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}
.upload-video-detail span {
  display: inline-block;
  width: 90px;
}
.upload-btn {
  text-align: right;
  margin-top: 80px;
}
/*.upload-video-box div:nth-of-type(3) {*/
/*  margin-left: 80px;*/
/*}*/
.test-img img {
  width: 20px;
}
.right-box {
  right: 0;
}
.left-box,
.right-box {
  height: 40px;
  position: absolute;
  top: 0;
  background-color: rgba(25, 30, 64, 0.8);
}
.file-operate{
  cursor: pointer;
  font-size: 14px;
}
.no-file{
  font-size: 14px;
}
.relevet{
  position: relative;
}
</style>
