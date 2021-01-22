<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'OnlineArticleList' }">在线征稿</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'WriteContribute' }">发起投稿</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="dis-flex">
        <div class="contribute">
          <div class="title-box">
            <el-input v-model="contDetail.articleTitle"
                      ref="contribute"
                      maxlength="64"
                      show-word-limit></el-input>
          </div>
          <vue-ueditor-wrap ref="editor" :init="myInit"  v-model="msg"  :config="myConfig" class="ueditor"></vue-ueditor-wrap>
          <div class="upload-box">
            <el-upload class="upload-demo"
                       :action="this.$api.upload"
                       :on-success="successFileLists"
                       :on-remove="removeUploadAnnex"
                       :on-progress="uploadFileProcess"
                       :before-upload="beforeAvatarUpload"
                       :on-error="errorFile"
                       multiple
                       :limit="3"
                       :file-list="annexFileList">
              <el-button
                         size="small"
                         type="primary">上传附件</el-button>
            </el-upload>
          </div>
          <div class="upload-box">
            <!-- <span class="up-cover">上传封面</span> -->
            <el-upload
              class="upload-demo avatar-uploader"
              :action="this.$api.upload"
              :show-file-list="false"
              :on-success="coverImages"
              :before-upload="beforeAvatarUpload"
              :on-remove="removeUploadImage">
              <img v-if="contDetail.url" :src="contDetail.url" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon">上传封面</i>
              <!-- <div class="el-upload__text">上传封面</div> -->
            </el-upload>
          </div>
        </div>
        <div class="describ-box">
            <div class="describ-title">{{fromDate.solicitTitle}}</div>
            <div class="describ-msg">
              <span class="describ-name">征稿单位：{{fromDate.departmentName}}</span>
              <span class="describ-time">起止时间：{{fromDate.solicitStart}}-{{fromDate.solicitEnd}}</span>
            </div>
            <p class="describ-content">{{fromDate.solicitContent}}</p>
        </div>
      </div>
      <div class="contribute-btn">
        <el-button type="primary"
                   @click="submit">投稿</el-button>
        <el-button type="info"
                   @click="drafts">放入草稿箱</el-button>
      </div>
    </div>
    <!-- <no-permission v-else></no-permission> -->
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // 引入vue-ueditor-wrap
import { mapGetters } from 'vuex'
export default {
  name: 'Contribute',
  data () {
    return {
      isModify: false,
      fromDate: {},
      annexFileList: [], // 附件列表
      fileListCoverImage: [], // 封面
      editor: null,
      disabled: false,
      contDetail: {
        solicitId: '', // 稿件id
        articleTitle: '', // 稿件标题
        articleContent: '', // 文章内容
        articleSummary: '', // 文章摘要
        // coverImage: '',
        files: [], // 附件
        fileName: '', // 封面图片
        url: ''
      },
      msg: '',
      myConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        serverUrl: window.g.baseUrl + '/media/ueditor/config',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: window.g.baseRoute + '/gxzfw/ueditor/',
        // 编辑器自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: '600px',
        // 初始容器宽度
        initialFrameWidth: '820px',
        // 关闭自动保存
        enableAutoSave: false
      }
    }
  },
  components: {
    VueUeditorWrap // 注册组件
  },
  methods: {
    // 上传限制
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 配置秀米
    myInit () {
      window.UE.registerUI('dialog', function (editor, uiName) {
        var btn = new window.UE.ui.Button({
          name: 'xiumi-connect',
          title: '秀米',
          onclick: function () {
            var dialog = new window.UE.ui.Dialog({
              iframeUrl: window.g.baseRoute + '/gxzfw/ueditor/xiumi-ue-dialog-v5.html',
              editor: editor,
              name: 'xiumi-connect',
              title: '秀米图文消息助手',
              cssRules: 'width: ' + (window.innerWidth - 60) + 'px;' + 'height: ' + (window.innerHeight - 60) + 'px;'
            })
            dialog.render()
            dialog.open()
          }
        })

        return btn
      })
    },
    // 获取编辑详情
    getEditdetail () {
      this.$http.get(`${this.$api.editDetail}?id=${this.contDetail.solicitId}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            let datas = res.data.data
            if (datas.files) {
              datas.files.forEach(item => {
                this.annexFileList.push({ name: item.name, url: item.url })
              })
            } else {
              datas.files = []
            }
            this.fileListCoverImage.push({ name: 'coverImage.jpg', url: datas.url })
            this.contDetail = datas
            this.contDetail.files = datas.files // 给后台的附件数据
            this.contDetail.url = datas.url // 给后台的封面数据
            this.contDetail.articleTitle = datas.articleTitle // 标题
            this.msg = datas.articleContent // 整体内容
            this.fromDate = datas.solicitContributions
          } else {
            this.$message.error(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    // 提交稿件内容
    submit () {
      this.contDetail.articleContent = this.msg
      if (!this.contDetail.articleTitle) {
        this.$message.warning('稿件标题不能为空')
      } else {
        console.log(this.contDetail)
        this.$http.post(this.$api.submitContribute, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'MyContribute' })
            }
          })
          .catch(() => {
          })
      }
    },
    // 保存到草稿箱
    drafts () {
      this.contDetail.articleContent = this.msg
      if (!this.contDetail.articleTitle) {
        this.$message.warning('稿件标题不能为空')
      } else {
        this.$http.post(this.$api.saveContribute, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'MyDraft' })
            }
          })
          .catch(() => {
          })
      }
    },
    // 上传失败
    errorFile () {
      this.$message.warning('上传失败')
    },
    // 进度条设置
    uploadFileProcess (event, file, fileList) {
      this.fileArr = fileList
      this.fileArr.forEach(item => {
        if (item.percentage === 100) {
        } else {
          item.progressFlag = true
          item.progressPercent = Math.abs(item.percentage.toFixed(0))
        }
      })
    },
    // 删除附件
    removeUploadAnnex (res, file, fileList) {
      if (this.contDetail.files.length) {
        this.contDetail.files.forEach((item, index) => {
          if (item.url === res.url) {
            this.contDetail.files.splice(index, 1)
          }
        })
        // forEachSingleDelete(this.contDetail.files, res.response.message)
      }
    },
    // 删除图片
    removeUploadImage (res, file, fileList) {
      this.contDetail.fileName = '' // 给后台的封面数据
      this.contDetail.url = ''
    },
    // 上传成功附件列表
    successFileLists (res, file, fileList) {
      let getFile = {
        name: file.name,
        url: file.response.message
      }
      this.contDetail.files.push(getFile)
    },
    coverImages (res, file, fileList) {
      this.contDetail.fileName = file.name
      this.contDetail.url = file.response.message
    },
    // 获取征稿要求详情
    articleDetail () {
      this.$http.get(`${this.$api.getArticleDetail}?id=${this.contDetail.solicitId}`)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.fromDate = res.data.data
          }
        })
        .catch(() => {
        })
    }
  },
  mounted () {
    this.editor = this.$refs.editor
    this.myConfig.toolbars = [[
      'fullscreen', 'source', '|', 'undo', 'redo', '|',
      'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'formatmatch', 'autotypeset', 'blockquote', 'pasteplain', '|', 'forecolor', 'backcolor', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc', '|',
      'rowspacingtop', 'rowspacingbottom', 'lineheight', '|',
      'customstyle', 'paragraph', 'fontfamily', 'fontsize', '|',
      'directionalityltr', 'directionalityrtl', 'indent', '|',
      'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'touppercase', 'tolowercase', '|',
      'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter', '|',
      'simpleupload', 'insertimage', 'emotion', 'insertvideo', 'music', 'attachment', 'map', 'insertframe', 'insertcode', 'pagebreak', 'template', 'background', '|',
      'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
      'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
      'print', 'preview', 'drafts'
    ]]
  },
  created () {
    // console.log(this.$route)
    this.isModify = this.$route.query.isModify
    this.contDetail.solicitId = this.$route.query.id
    if (this.isModify) {
      this.getEditdetail()
      // this.articleDetail()
    } else {
      this.articleDetail()
    }
  },
  watch: { // 监听visible变化
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    },
    msg () {
      this.msg = this.msg.replace('crossorigin="anonymous"', '')
      var imgReg = /<img.*?(?:>|\/>)/gi
      // 匹配src属性
      var srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i
      if (this.msg.match(imgReg)) {
        var arr = this.msg.match(imgReg)
        this.imgsrcArr = []
        let ayy = []
        for (var i = 0; i < arr.length; i++) {
          var src = arr[i].match(srcReg)
          if (src[1].indexOf('http') === -1) {
            this.$message.warning('请输入正确图片路径')
          }
          // 获取图片地址
          if (src[1]) {
            ayy.push(src[1])
            var x = new Set(ayy) // 去重ES6实现 需ie9以上,谷歌23版本
          }
          this.imgsrcArr = [...x]
        }
      }
    }
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  }
}
</script>
<style>
.contribute-detail .el-input .el-input__inner {
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #dcdfe6;
  color: #2394e9;
}
.title-box .el-input__inner,
.title-box .el-input__inner:focus {
  border-radius: 0;
  border: none;
  border-bottom: 1px solid #dcdfe6;
  color: #333333;
  font-size: 22px;
}
.ueditor img{
  display: block;
  width: 100%;
}
.ueditor .edui-default .edui-editor-iframeholder{
  min-height: 400px !important;
}
.intelligence .ueditor .view{
  overflow: auto !important;
}
.edui-default .edui-toolbar .edui-for-disabled{
  display: none !important;
}
.ueditor .edui-default .edui1_iframeholder .view img{
  max-width: 100%;
}
</style>
<style scoped>
.contribute {
  width: 70%;
  background: #ffffff;
  box-sizing: border-box;
  padding: 36px 50px 70px;
}
.title-box {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.title-box .title-num {
  margin-left: 60px;
  margin-right: 40px;
}
.title-num span {
  color: #ff0000;
}
.title-box i {
  color: #2394e9;
  cursor: pointer;
}
.contribute-detail,
.author,
.photo {
  display: flex;
  justify-content: center;
  align-items: center;
}
.photo {
  margin-left: 30px;
}
.contribute-detail {
  margin-bottom: 35px;
}
.contribute-detail .el-input {
  width: 90px;
}
.contribute-btn {
  margin-top: 35px;
  text-align: center;
}
.contribute-btn .el-button {
  width: 158px;
  font-size: 18px;
}
.upload-box {
  margin-top: 20px;
}
.upload-box .el-button {
  border-radius: 0;
}
/* 添加 */
.dis-flex {
  display: flex;
  background: #ffffff;
  justify-content: space-between;
}
.upload-box .abstract {
  display: block;
  margin-bottom: 20px;
}
.ueditor{
  display: inline-block;
  width: 820px;
}
.avatar-uploader{
  margin-top: 25px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed  #8c939d
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
.up-cover{
  padding: 9px 15px;
  background-color: #409EFF;
  color: white;
  font-size: 12px
}
.describ-box {
  width: 30%;
  border-left: 1px solid #f5f5f5;
  margin: 15px 15px;
  padding-left: 15px;
}
.describ-title{
  width: 100%;
  height: 60px;
  line-height: 60px;
  font-size: 16px;
  font-weight: bold;
  color: #000000;
  text-align: center;
  border-bottom: 1px solid #f5f5f5;
}
.describ-msg{
  width: 100%;
  height: 60px;
  line-height: 30px;
  font-size: 12px;
  text-align: center;
}
.describ-name{
  display: block;
}
.describ-time{
  display: block;
}
.describ-content{
  width: 100%;
  height: 100%;
  margin-top: 10px;
  line-height: 20px;
  color: rgb(37, 36, 36);
}
</style>
