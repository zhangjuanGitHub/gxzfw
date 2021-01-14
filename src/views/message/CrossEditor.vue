<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ManageMatrix' }">新媒体矩阵</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'CrossEditor' }">跨平台编辑器</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="dis-flex cross-editor">
        <div class="contribute">
          <div class="title-box">
            <el-input v-model="contDetail.articleTitle"
                      ref="contribute"
                      maxlength="64"
                      show-word-limit></el-input>
          </div>
          <div class="contribute-detail">
            <div class="author">
              <p>原作者:</p>
              <el-input size="small"
                        v-model="contDetail.originalAuthor"
                        :disabled="disabled"></el-input>
            </div>
            <div class="photo">
              <p>摄像:</p>
              <el-input size="small"
                        v-model="contDetail.cameristName"
                        :disabled="disabled"></el-input>
            </div>
          </div>
          <vue-ueditor-wrap ref="editor"  :init="myInit"  v-model="msg"  :config="myConfig" class="ueditor"></vue-ueditor-wrap>
          <div class="upload-box">
            <el-upload class="upload-demo"
                       :action="this.$api.upload"
                       :on-success="successFileLists"
                       :on-remove="removeUploadAnnex"
                       :on-progress="uploadFileProcess"
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
              :on-remove="removeUploadImage">
              <img v-if="contDetail.coverImage" :src="contDetail.coverImage" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon">上传封面</i>
            </el-upload>
          </div>
          <div class="upload-box">
            <span class="abstract">文章摘要</span>
            <el-input type="textarea"
                      placeholder="请输入文章摘要"
                      v-model="contDetail.articleSummary"
                      maxlength="320"
                      :rows="6"
                      show-word-limit></el-input>
          </div>
        </div>
        <div class="select-box">
          <el-tabs v-model="activeName"
                   @tab-click="handleClick">
            <el-tab-pane label="图片库"
                         name="image">
              <span class="box-title">公共图片库:</span>
              <el-button size="mini"
                         class="back-box"
                         v-if="publicShow"
                         @click="BackAlbum"
                         type="primary">返回</el-button>
              <div class="photo-cont">
                <div class="photo-show"
                     v-if="publicShow">
                  <div v-if="publicShow"
                       class="image-line">
                    <div class="image-box"
                         v-for="(item,index) in AlbumDetail"
                         :key="index">
                      <img @click="getImage(item,index,$event)"
                           :src="item.thumbnailUrl" @contextmenu.prevent="openMenu($event,item)">
                    </div>
                  </div>
                  <div v-else>
                    <img class="box-none"
                         :src="require('@/assets/images/empty-data.png')">
                  </div>
                </div>
                <div class="photo-show"
                     v-else>
                  <div class="image-box"
                       v-for="(item,index) in Album"
                       :key="index"
                       @click="getAlbumDetail(item,index)">
                    <!-- <el-image :src="item.coverImage"
                              fit="fill"
                              style="height:120px">
                    </el-image> -->
                    <img :src="item.thumbnailUrl">
                    <p class="time-list">
                      <span>{{item.createTime}}</span>
                    </p>
                    <p class="photo-name">{{item.groupName}}</p>
                  </div>
                </div>
              </div>
              <div class="use-photo">
                <span class="box-title">个人图片库:</span>
                <el-select v-model="value"
                           placeholder="请选择"
                           size="small"
                           @change="changeValue">
                  <el-option v-for="item in myAlbum"
                             :key="item.id"
                             :label="item.groupName"
                             :value="item.id">
                  </el-option>
                </el-select>
                <div class="photo-cont">
                  <div class="photo-show"
                       v-if="imgLength">
                    <div class="image-box"
                         v-for="(item,index) in myAlbumDetail"
                         :key="index">
                      <img @click="getImage(item,index,$event)"
                           :src="item.thumbnailUrl" @contextmenu.prevent="openMenu($event,item)">
                    </div>
                  </div>
                  <div class="photo-show"
                       v-else>
                    <img class="box-none"
                         :src="require('@/assets/images/empty-data.png')">
                  </div>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="视频库"
                         name="video">
              <div class="photo-cont">
                <span class="box-title">公共视频库:</span>
                <div class="video-detail"
                     v-if="publicShow">
                  <el-button size="mini"
                             class="back-box back-size"
                             v-if="publicShow"
                             @click="BackAlbum"
                             type="primary">返回</el-button>
                  <div class="photo-show"
                       v-if="publicShow">
                    <div v-if="publicShow"
                         class="image-line">
                      <div class="image-box"
                           v-for="(item,index) in AlbumDetail"
                           :key="index">
                        <img @click="getvideo(item,index)"
                             :src="item.thumbnailUrl">
                      </div>
                    </div>
                    <div v-else>
                      <img class="box-none"
                           :src="require('@/assets/images/empty-data.png')">
                    </div>
                  </div>
                </div>
                <div v-else
                     class="photo-show">
                  <div class="image-box"
                       v-for="(item,index) in video"
                       :key="index"
                       @click="getAlbumDetail(item,index)">
                    <img :src="item.thumbnailUrl">
                    <p class="time-list">
                      <span>{{item.createTime}}</span>
                    </p>
                    <p class="photo-name">{{item.groupName}}</p>
                  </div>
                </div>
              </div>
              <div class="use-photo">
                <div class="photo-cont">
                  <span class="box-title">个人视频库:</span>
                  <div class="video-detail"
                       v-if="imgLength">
                    <el-button size="mini"
                               class="back-box"
                               v-if="imgLength"
                               @click="BackMyVideo"
                               type="primary">返回</el-button>
                    <div class="photo-show"
                         v-if="imgLength">
                      <div v-if="imgLength"
                           class="image-line">
                        <div class="image-box"
                             v-for="(item,index) in myAlbumDetail"
                             :key="index">
                          <img @click="getvideo(item,index)"
                               :src="item.thumbnailUrl">
                        </div>
                      </div>
                      <div v-else>
                        <img class="box-none"
                             :src="require('@/assets/images/empty-data.png')">
                      </div>
                    </div>
                  </div>
                  <div v-else
                       class="photo-show">
                    <div class="image-box"
                         v-for="(item,index) in myVideo"
                         :key="index"
                         @click="getVideoDetail(item,index)">
                      <img :src="item.thumbnailUrl">
                      <p class="time-list">
                        <span>{{item.createTime}}</span>
                      </p>
                      <p class="photo-name">{{item.groupName}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <div class="contribute-btn">
        <div>
          <el-button type="primary"
                     @click="preseRvation">新建稿件</el-button>
          <el-button type="info"
                     @click="finishFalse">新建草稿</el-button>
        </div>
      </div>
    </div>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
        <li @click="setUpload">设为封面</li>
      </ul>
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
      visible: false,
      rightClickItem: '',
      top: 0,
      left: 0, // 鼠标右键参数
      dialogVisible: false,
      ismodal: false, // 遮罩
      accountList: [], // 站点账户列表
      checkArr: [], // 选中站点
      defaultProps: {
        children: 'channels',
        label: 'channelName',
        channelId: 'channelId',
        websiteId: 'websiteId',
        channelAllPathStr: 'channelAllPathStr'
      },
      files: [],
      activeName: 'image',
      value: '',
      isArchive: '',
      albumIndex: '1',
      annexFileList: [], // 附件列表
      fileListCoverImage: [], // 封面
      editor: null,
      disabled: false,
      newsURL: require('@/assets/images/message/radio.png'),
      // 添加
      ruleForm: {
        pageNum: 1,
        pageSize: 32,
        groupType: 1, // 1图片组，2视频组
        isPublic: 1, // 1公共资源， 2个人资源
        userName: '', // 上传人
        createTimeFmt: '', // 搜索，开始时间
        updateTimeFmt: '', // 搜索，结束时间
        groupName: '', // 关键词
        selectFileName: '', // 搜索范围，1检索组别名称，2检索文件名称，3同时检索前两项
        calcFileName: [1],
        time: []
      },
      // 添加
      ruleForm1: {
        pageNum: 1,
        pageSize: 32,
        groupType: 1, // 1图片组，2视频组
        isPublic: 2, // 1公共资源， 2个人资源
        userName: '', // 上传人
        createTimeFmt: '', // 搜索，开始时间
        updateTimeFmt: '', // 搜索，结束时间
        groupName: '', // 关键词
        selectFileName: '', // 搜索范围，1检索组别名称，2检索文件名称，3同时检索前两项
        calcFileName: [1],
        time: []
      },
      params: {
        groupId: '',
        pageNum: 1,
        pageSize: 30,
        keyword: ''
      },
      contDetail: {
        id: '', // 稿件id
        articleTitle: '', // 稿件标题
        articleContent: '', // 文章内容
        articleSummary: '', // 文章摘要
        coverImage: '', // 封面图片
        originalAuthor: '', // 作者
        cameristName: '', // 摄影
        files: [] // 附件
      },
      imgLength: false,
      publicLength: false,
      publicShow: false,
      Album: [], // 公共图片库
      AlbumDetail: [], // 公共图片详情
      video: [], // 公共视频库
      videoDetail: [], // 公共视频详情
      myAlbum: [], // 个人图片库
      myAlbumDetail: [], // 个人图片详情
      myVideoDetail: [], // 个人视频库详情
      myVideo: [], // 个人视频库
      tableData: [], // 文章引用
      msg: '',
      myConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        serverUrl: window.g.baseUrl + '/media/ueditor/config',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: window.g.baseRoute + '/gxjcy/ueditor/',
        // 编辑器自动被内容撑高
        autoHeightEnabled: false,
        // 初始容器高度
        initialFrameHeight: '600px',
        // 初始容器宽度
        initialFrameWidth: '820px',
        // 关闭自动保存
        enableAutoSave: false,
        toolbars: [[
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
      }
    }
  },
  components: {
    VueUeditorWrap // 注册组件
  },
  methods: {
    // 打开关闭弹框方法
    openMenu (e, item) {
      this.rightClickItem = item
      var st = document.documentElement.scrollTop
      var x = e.clientX
      var y = e.clientY + st
      this.top = y
      this.left = x
      this.visible = true
    },
    closeMenu () {
      this.visible = false
    },
    // 设置当前图片为封面
    setUpload () {
      this.fileListCoverImage = []
      this.contDetail.coverImage = this.rightClickItem.uploadPath
      let cover = { name: 'articlePic', url: this.rightClickItem.uploadPath }
      this.fileListCoverImage.push(cover)
    },
    // 配置秀米
    myInit () {
      window.UE.registerUI('dialog', function (editor, uiName) {
        var btn = new window.UE.ui.Button({
          name: 'xiumi-connect',
          title: '秀米',
          onclick: function () {
            var dialog = new window.UE.ui.Dialog({
              iframeUrl: window.g.baseRoute + '/gxjcy/ueditor/xiumi-ue-dialog-v5.html',
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
      // this.disabled = true
      let routerParams = this.$route.query
      let editdetailId = routerParams.id
      this.isArchive = routerParams.isArchive
      // isArchive === 1 引用 2 复制 3 编辑
      if (this.isArchive === '1') {
        this.$http.get(`${this.$api.findOneNewscloud}/${editdetailId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              let datas = res.data.data
              if (datas.files) {
                datas.files.forEach(item => {
                  this.annexFileList.push({ name: item.fileName, url: item.filePath })
                })
              } else {
                datas.files = []
              }
              this.fileListCoverImage.push({ name: 'articlePic', url: datas.articlePic })
              this.contDetail.originalAuthor = datas.numberName // 作者
              this.contDetail.coverImage = datas.articlePic // 给后台的封面数据
              this.contDetail.files = datas.files // 给后台的附件数据
              this.contDetail.articleTitle = datas.articleTitle // 标题
              this.msg = datas.articleContent // 整体内容
              // this.editor.txt.html(this.msg)
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
      } else {
        this.$http.get(`${this.$api.articleDetail}/${editdetailId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              let datas = res.data.data
              if (datas.files) {
                datas.files.forEach(item => {
                  this.annexFileList.push({ name: item.fileName, url: item.filePath })
                })
              } else {
                datas.files = []
              }
              this.fileListCoverImage.push({ name: 'coverImage.jpg', url: datas.coverImage })
              this.contDetail = datas
              this.contDetail.files = datas.files // 给后台的附件数据
              this.contDetail.coverImage = datas.coverImage // 给后台的封面数据
              this.articleTitle = datas.articleTitle // 标题
              this.msg = datas.articleContent // 整体内容
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
      }
    },
    uploadSectionFile (params) {
      this.mrFiles.push(params.file)
    },
    // tab切换触发
    handleClick (tab, event) {
      this.publicShow = false
      this.imgLength = false
      this.publicLength = false
      if (this.activeName === 'image') {
        this.ruleForm1.groupType = 1
        this.ruleForm.groupType = 1
        this.getImageList()
      } else if (this.activeName === 'video') {
        this.ruleForm1.groupType = 2
        this.ruleForm.groupType = 2
        this.getMyVideo()
        this.getVideoList()
      }
    },
    // 获取选中
    handleCheckChange (data, checked, node) {
      this.checkArr = this.$refs.tree.getCheckedNodes(true)
    },
    // 下拉选择触发
    changeValue (vlaue) {
      this.params.groupId = vlaue
      this.myAlbumDetail = []
      if (this.activeName === 'image') {
        this.getImgDetail()
      }
    },
    // 新建稿件
    preseRvation () {
      this.contDetail.articleContent = this.msg
      if (!this.contDetail.articleTitle) {
        this.$message.warning('稿件标题不能为空')
      } else if (!this.contDetail.originalAuthor) {
        this.$message.warning('作者不能为空')
      } else {
        this.$http.post(this.$api.FinishTrue, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'MessageArticleBox' })
            }
          })
          .catch(() => {
          })
      }
    },
    // 新建草稿
    finishFalse () {
      this.contDetail.articleContent = this.msg
      if (!this.contDetail.articleTitle) {
        this.$message.warning('稿件标题不能为空')
      } else if (!this.contDetail.originalAuthor) {
        this.$message.warning('作者不能为空')
      } else {
        // if (this.$route.query.isArchive === '3') {
        //   delete this.contDetail.id
        // }
        this.$http.post(this.$api.finishFalse, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'RoughList' })
            }
          })
          .catch(() => {
          })
      }
    },
    // 提交稿件内容
    submit () {
      this.contDetail.articleContent = this.msg
      if (!this.contDetail.articleTitle) {
        this.$message.warning('稿件标题不能为空')
      } else if (!this.contDetail.originalAuthor) {
        this.$message.warning('作者不能为空')
      } else {
        if (this.$route.query.isArchive !== '3') {
          delete this.contDetail.id
        }
        this.$http.post(this.$api.submit, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'MessageArticleBox', query: { changeSide: false } })
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
      } else if (!this.contDetail.originalAuthor) {
        this.$message.warning('作者不能为空')
      } else {
        if (this.$route.query.isArchive !== '3') {
          delete this.contDetail.id
        }
        this.$http.post(this.$api.seve, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'RoughList' })
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
          if (item.filePath === res.url) {
            this.contDetail.files.splice(index, 1)
          }
        })
        // forEachSingleDelete(this.contDetail.files, res.response.message)
      }
    },
    // 删除图片
    removeUploadImage (res, file, fileList) {
      this.contDetail.coverImage = '' // 给后台的封面数据
    },
    // 上传成功附件列表
    successFileLists (res, file, fileList) {
      let getFile = {
        fileName: file.name,
        filePath: file.response.message
      }

      this.contDetail.files.push(getFile)
    },
    coverImages (res, file, fileList) {
      this.contDetail.coverImage = res.message
    },
    BackAlbum () {
      this.publicShow = false
    },
    // 返回个人视频
    BackMyVideo () {
      this.imgLength = false
    },
    // 获取公共图片列表
    getImageList () {
      this.$http.post(this.$api.PhotoList, this.ruleForm)
        .then(res => {
          this.Album = res.data.data.content
        })
        .catch(() => {
        })
    },
    // 获取个人图片列表
    getMyImage () {
      this.$http.post(this.$api.photolistSelf, this.ruleForm1)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.myAlbum = res.data.data.content
          }
        })
        .catch(() => { })
    },
    // 获取图片详情
    getImgDetail (item) {
      let detail = {
        groupId: '',
        keyword: '',
        pageNum: 1,
        pageSize: 32
      }
      if (item) {
        detail.groupId = item.id
      } else {
        detail.groupId = this.params.groupId
      }
      this.$http.post(this.$api.photoDetail, detail)
        .then(res => {
          this.myAlbumDetail = res.data.data.page.content
          if (this.myAlbumDetail.length) {
            // this.publicShow = false
            this.imgLength = true
          } else {
            this.imgLength = false
            this.$message.warning('暂无内容!')
          }
        })
        .catch(() => { })
    },
    getAlbumDetail (item) {
      let detail = {
        groupId: '',
        keyword: '',
        pageNum: 1,
        pageSize: 32
      }
      if (item) {
        detail.groupId = item.id
      } else {
        detail.groupId = this.params.groupId
      }
      this.$http.post(this.$api.photoDetail, detail)
        .then(res => {
          this.AlbumDetail = res.data.data.page.content
          if (this.AlbumDetail.length) {
            this.publicShow = true
          } else {
            this.publicShow = false
            this.$message.warning('暂无内容!')
          }
        })
        .catch(() => { })
    },
    // 获取视频详情
    getVideoDetail (item) {
      let detail = {
        groupId: '',
        keyword: '',
        pageNum: 1,
        pageSize: 32
      }
      if (item) {
        detail.groupId = item.id
      } else {
        detail.groupId = this.params.groupId
      }
      this.$http.post(this.$api.photoDetail, detail)
        .then(res => {
          this.myAlbumDetail = res.data.data.page.content
          if (this.myAlbumDetail.length) {
            this.imgLength = true
          } else {
            this.imgLength = false
            this.$message.warning('暂无视频')
          }
        })
        .catch(() => { })
    },
    // 获取个人视频列表
    getMyVideo () {
      this.ruleForm1.groupType = 2
      this.$http.post(this.$api.videolistSelf, this.ruleForm1)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.myVideo = res.data.data.content
          }
        })
        .catch(() => {
        })
    },
    // 获取公共视频列表
    getVideoList () {
      this.ruleForm.groupType = 2
      this.$http.post(this.$api.videoList, this.ruleForm)
        .then(res => {
          if (res.data.code === 200 && res.data.data.content) {
            this.video = res.data.data.content
          }
        })
        .catch(() => {
        })
    },
    // 引用图片
    getImage (item, index, ev) {
      // this.editor.cmd.do('insertHTML', '<img src=' + item.thumbnailUrl + '></img>')
      this.msg = this.msg + '<img src=' + item.uploadPath + '></img>'
    },
    // 引用视频链接
    getvideo (item, index) {
      // let radiobox = '<a href=' + item.uploadPath + ' target="_blank" style="display:block;width:395px;height:261px;margin:0 auto;"><img src=' + item.thumbnailUrl + ' style="width:100%;height:100%;"/></a>'
      let radiobox = '<p><video width="320" height="240" src=' + item.uploadPath + ' controls="controls">您的浏览器不支持 HTML5 video 标签。</video></p><p></p>'
      this.msg = this.msg + radiobox
    }
  },
  mounted () {
    this.editor = this.$refs.editor
    this.getImageList()
    this.getMyImage()
    if (this.$route.query.id) {
      this.getEditdetail()
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
<style lang="scss">
 @import "resour";
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
.select-box {
  width: 30%;
  background: #ffffff;
  border-left: 1px solid #f5f5f5;
  margin: 15px;
  padding-left: 15px;
}

.photo-cont .select {
  box-sizing: border-box;
  padding: 10px;
  border-bottom: 2px solid #ccc;
}
.photo-cont .select span {
  color: #ff0000;
  font-size: 14px;
}
.photo-cont .photo-show {
  margin: 0 10px;
  height: 520px;
  border-bottom: 1px solid #f5f5f5;
  overflow-y: auto;
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
}
.use-photo {
  margin-top: 10px;
}
.use-photo .el-select {
  margin-left: 5px;
}
.photo-show .image-line {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
}
.photo-show .el-button {
  height: 29px;
  position: absolute;
  right: 10px;
  top: 5px;
}
.photo-cont .photo-show::-webkit-scrollbar {
  display: none;
}
.photo-cont .image-box {
  width: 47%;
  position: relative;
  cursor: pointer;
}
.photo-cont .photo-show img {
  width: 100%;
  height: 120px;
  margin-top: 10px;
}
.photo-name {
  margin-top: 10px;
}
.time-list {
  color: #fff;
  width: 100%;
  height: 22px;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: space-between;
  position: absolute;
  bottom: 25px;
  left: 0px;
  padding: 5px;
  box-sizing: border-box;
}
.time-list span {
  display: inline-block;
  font-size: 10px;
}
.time-list span:last-child {
  text-align: right;
}

.use-photo .photo-cont .image-box {
  margin-bottom: 10px;
}
.upload-box .abstract {
  display: block;
  margin-bottom: 20px;
}
.photo-cont .photo-show .box-none {
  height: 333px;
}
.quote-article {
  color: #2394e9;
  text-decoration: underline;
  cursor: pointer;
}
.wangeditor-box {
  width: 820px;
  min-height: 600px;
}
.back-box {
  float: right;
  margin-right: 10px;
}
.back-size {
  margin-top: -29px;
}
.box-title {
  display: inline-block;
  height: 28px;
  line-height: 28px;
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
    color: #fff;
    font-size: 12px
  }
   /*右键菜单样式*/
  .contextmenu {
  margin: 0;
  background: #fff;
  z-index: 3000;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}

.contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}

.contextmenu li:hover {
  background: #eee;
}
</style>
