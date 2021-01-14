<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'publicImage' }">媒体素材库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'personImage' }">个人图像资料库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'CreateImage' }">{{routeItem ? '上传图片' : '新建图片类别'}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="my-img-list">
      <el-input v-model="params['mrGroup.groupName']"
                ref="setFocus"
                placeholder="请输入相册名称"
                :disabled="routeItem.isDefault === 1"
                autofocus>
        <i @click="getFocus"
           slot="suffix"
           class="el-input__icon el-icon-edit"></i></el-input>
    </div>
    <div class="upload-min-height upload-img">
      <v-upload @getAttachmentUrl="getAttachmentUrl"
                @removeAttachmentFiles="removeAttachmentFiles"
                :listType="listType"
                :showList="showList"
                :isMultiple="isMultiple"
                :acceptType="acceptType"></v-upload>
      <!-- <el-upload :action="this.$api.upload"
                 ref="upload"
                 list-type="picture-card"
                 :file-list="fileList"
                 multiple
                 drag
                 accept=".jpg,.jpeg,.png,.gif,.JPG,.JPEG,.GIF"
                 :http-request="uploadSectionFile"
                 :on-preview="handlePictureCardPreview"
                 :on-remove="handleRemove">
        <span class="el-icon-plus avatar-uploader-icon"></span>
        <div class="el-upload__tip"
             slot="tip">只能上传jpg/png/gif文件</div>
      </el-upload> -->
    </div>
    <div class="upload-btn-box">
      <el-button type="primary"
                 @click="debouncedGetAnswer">确定</el-button>
      <el-button type="info"
                 @click="goBack">取消</el-button>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import '@/libs/date_format.js'
import vUpload from '@/components/UploadAll.vue'
export default {
  name: 'CreateImage',
  data () {
    return {
      listType: 'picture-card',
      showList: true,
      isMultiple: true,
      acceptType: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      routeItem: '',
      isPublic: 2, // 1公共资源，2个人资源
      fileList: [], // 默认列表
      mrFiles: [],
      groupId: '', // 通过路由获取的id,非新创建的相册
      currentTime: '',
      params: {
        'mrGroup.id': '',
        'mrGroup.groupType': 1,
        'mrGroup.isPublic': 2,
        'mrGroup.groupName': ''
      }
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
    // 创建类别
    sumbitImage () {
      if (!this.params['mrGroup.groupName']) {
        this.$message.error('请输入相册名称！')
        return false
      }
      let fd = new FormData()
      for (let key in this.params) {
        fd.append(key, this.params[key])
      }
      this.mrFiles.forEach((item, index) => {
        fd.append(`mrFiles[${index}].file`, item)
      })
      this.$http.post(this.$api.editGroupOrFile, fd)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功！')
            this.$router.push({ name: 'personImage' })
          }
        })
        .catch(() => { })
    },
    goBack () {
      this.$router.go(-1)
    },
    getFocus () {
      this.$refs['setFocus'].focus()
    }
  },
  created () {
    this.debouncedGetAnswer = this.$debounce(this.sumbitImage, 500)
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
  },
  components: {
    vUpload
  },
  computed: {
    ...mapState({
      userName: state => state.user.userInfo.userName,
      token: state => state.user.token
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  directives: {
    focus: {
      inserted: function (el) {
        el.focus()
      }
    }
  }
}
</script>
<style lang="scss">
@import "../resour";
</style>
<style scoped>
.my-img-list {
  padding: 48px 5px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  margin-bottom: 32px;
  align-items: center;
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
.my-img-list .el-input {
  width: 450px;
}
.upload-btn-box {
  text-align: right;
}
.upload-min-height {
  min-height: 300px;
}
.el-icon-plus {
  font-size: 24px;
}
</style>
