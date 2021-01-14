<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'IntelligenceEditor' }">智能辅助</el-breadcrumb-item>
        <el-breadcrumb-item >智能编辑</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="hotnews-box">
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
          <div class="intelligence">
            <div>
              <div class="dis-flex">
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
                  <vue-ueditor-wrap
                            ref="editor"
                            @beforeInit="myInit"
                            v-model="msg"
                            :config="myConfig"
                            class="ueditor"
                            v-if="contDetail.publishChannel!=='weiboText'"></vue-ueditor-wrap>
                  <div class="upload-box  contri-file-list">
                    <v-upload @getAttachmentUrl="getAttachmentFiles"
                              @removeAttachmentFiles="removeAttachmentFiles"
                              :listType="listType"
                              :showList="showList"
                              :isMultiple="isMultiple"
                              :limitList="limitList"
                              :fileTip="fileTip"
                              :isPlatform="isPlatform"></v-upload>
                  </div>
                  <div class="upload-box contri-img-cover">
                    <v-upload @getAttachmentUrl="getAttachmentUrl"
                              :headUrl="contDetail.coverImage"
                              :listType="listType"
                              :showList="showListFalse"
                              :isMultiple="isNotMultiple"
                              :acceptType="acceptTypeImg"></v-upload>
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
                                   :src="item.thumbnailUrl"
                                   @contextmenu.prevent="openMenu($event,item)">
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
                                   :src="item.thumbnailUrl"
                                   @contextmenu.prevent="openMenu($event,item)">
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
                    <el-tab-pane label="智能助手"
                                 name="third">
                      <div class="intell-cont">
                        <el-input type="textarea"
                                  :rows="15"
                                  placeholder="请输入内容"
                                  v-model="textarea">
                        </el-input>
                      </div>
                      <div class="operate">
                        <el-radio-group v-model="radio">
                          <el-radio label="textsummary">自动摘要</el-radio>
                          <el-radio label="keywords">关键词</el-radio>
                          <el-radio label="sentences">关键句</el-radio>
                          <el-radio label="opinion">专家观点</el-radio>
                        </el-radio-group>
                      </div>
                      <div class="result">
                        <span class="box-title">执行结果:
                          <div class="implement">
                            <el-button type="primary"
                                       size="small"
                                       @click="opearte">执行</el-button>
                          </div>
                        </span>
                        <div ref="code"
                             class="result-cont"
                             v-html="textResult">
                        </div>
                        <div class="result-btn">
                          <el-button size="small"
                                     type="primary"
                                     @click="copyResult">一键复制</el-button>
                          <el-button size="small"
                                     @click="clearResult">清空</el-button>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="模板库"
                                 name="fourth">
                      <el-select class="write-query"
                                 v-model="classType"
                                 placeholder="请选择模板类型"
                                 @change="getwriteQuery(classType)">
                        <el-option label="检察人物"
                                   value="1">
                        </el-option>
                        <el-option label="专题模板"
                                   value="2">
                        </el-option>
                        <el-option label="日报模板"
                                   value="3">
                        </el-option>
                      </el-select>
                      <div class="class-cont"
                           v-if="dataShow">
                        <div v-for="(item,index) in queryList"
                             :key="index">
                          <div class="class-show"
                               v-html="item.coverImage"
                               @click="pushMsg(item)"></div>
                          <div class="checkBox">
                            <i v-if="item.isCollection===1"
                               class="el-icon-star-on"
                               @click="deleteCollection(item)"></i>
                            <i v-if="item.isCollection===0"
                               class="el-icon-star-off"
                               @click="addCollection(item)"></i>
                          </div>
                        </div>
                      </div>
                      <div v-else
                           class="class-cont">
                        <img class="box-none"
                             :src="require('@/assets/images/empty-data.png')">
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="我的收藏"
                                 name="fifth">
                      <div v-if="dataShow">
                        <div class="deleteMb"
                             v-if="showDelete">
                          <el-button type="primary"
                                     size="small"
                                     class="deleteMb"
                                     @click="writeDelete">确定删除</el-button>
                          <el-button size="small"
                                     class="deleteMb"
                                     @click="showDelete=false">取消删除</el-button>
                        </div>
                        <el-button type="danger"
                                   size="small"
                                   class="deleteMb"
                                   @click="showDelete=true"
                                   v-else>取消收藏</el-button>
                      </div>
                      <div class="class-cont"
                           v-if="dataShow">
                        <div v-for="(item,index) in queryCollec"
                             :key="index">
                          <div class="class-show"
                               v-html="item.coverImage"
                               @click="pushMsg(item)"></div>
                          <div class="checkBox"
                               v-if="showDelete">
                            <el-checkbox-group v-model="ids">
                              <el-checkbox :label="item.id">删除</el-checkbox>
                            </el-checkbox-group>
                          </div>
                        </div>
                      </div>
                      <div v-else
                           class="class-cont">
                        <img class="box-none"
                             :src="require('@/assets/images/empty-data.png')">
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>
              <div class="contribute-btn">
                <el-button type="primary"
                           @click="submit">投稿</el-button>
                <!-- <el-button type="info"
                          @click="drafts">放入草稿箱</el-button> -->
              </div>
              <el-dialog class="publish"
                         title="发布到:"
                         :modal="ismodal"
                         center
                         :visible.sync="dialogVisible"
                         width="50%">
                <el-tree :props="defaultProps"
                         ref="tree"
                         :data="accountList"
                         show-checkbox
                         highlight-current
                         node-key="channelId"
                         :default-expand-all='true'
                         @check-change="handleCheckChange">
                </el-tree>
                <span slot="footer"
                      class="dialog-footer">
                  <el-button @click="dialogVisible = false">取 消</el-button>
                  <el-button type="primary"
                             @click="chekedPublish">确 定</el-button>
                </span>
              </el-dialog>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <ul v-show="visible"
        :style="{left:left+'px',top:top+'px'}"
        class="contextmenu">
      <li @click="setUpload">设为封面</li>
    </ul>
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // 引入vue-ueditor-wrap
import { mapGetters } from 'vuex'
import vMenu from '@/views/message/components/Menu'
import vUpload from '@/components/UploadAll.vue'
export default {
  name: 'Contribute',
  data () {
    return {
      listType: 'text',
      showList: true,
      showListFalse: false,
      isMultiple: true,
      isNotMultiple: false,
      limitList: 5,
      isPlatform: true,
      fileTip: '附件最多上传数量为5个',
      acceptTypeImg: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      visible: false,
      rightClickItem: '',
      top: 0,
      left: 0, // 鼠标右键参数
      ids: [], // 取消模板收藏
      dataShow: false,
      showDelete: false,
      queryList: [],
      queryCollec: [], // 收藏列表
      collection: '',
      classType: '1',
      textarea: '', // 智能助手文本
      textResult: '', // 执行结果文本
      radio: '', // 智能助手单选值
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
      initEditor: '',
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
        // serverUrl: 'http://35.201.165.105:8000/controller.php',
        serverUrl: window.g.baseUrl + '/media/ueditor/config',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: window.g.baseUrl + '/ueditor/',
        // UEDITOR_HOME_URL: '/ueditor/',
        // 编辑器自动被内容撑高
        autoHeightEnabled: false,
        // 关闭自动保存
        enableAutoSave: true
      }
    }
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
    myInit (editorId) {
      this.initEditor = window.UE.getEditor(editorId)
      window.UE.registerUI('dialog', function (editor, uiName) {
        var btn = new window.UE.ui.Button({
          name: 'xiumi-connect',
          title: '秀米',
          onclick: function () {
            var dialog = new window.UE.ui.Dialog({
              iframeUrl: window.g.baseUrl + '/ueditor/xiumi-ue-dialog-v5.html',
              // iframeUrl: '/ueditor/xiumi-ue-dialog-v5.html',
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
    // 执行结果单选值
    opearte () {
      let params = {
        t: this.radio,
        content: this.textarea
      }
      // console.log(params)
      this.$http.post(this.$api.articleAnalyse, params)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.textResult = res.data.data
          }
        })
    },
    // 一键复制
    copyResult () {
      var Url2 = this.textResult.replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, '').replace(/<[^>]+?>/g, '').replace(/\s+/g, ' ').replace(/ /g, ' ').replace(/>/g, ' ')
      var oInput = document.createElement('input')
      oInput.value = Url2
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功!')
        oInput.className = 'oInput'
        oInput.style.display = 'none'
      } else {
        this.$message.error('您的浏览器暂不支持自动复制，请手动复制!')
      }
    },
    // 取消
    clearResult () {
      this.textarea = ''
      this.textResult = ''
    },
    // 获取编辑详情
    getEditdetail () {
      // this.disabled = true
      let routerParams = this.$route.query
      let editdetailId = routerParams.id
      this.isArchive = routerParams.isArchive
      // isArchive === 1 引用 2 复制 3 编辑
      if (this.isArchive === '1') {
        this.$http.get(`${this.$api.getPlaceArticle}?articleId=${editdetailId}`)
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
              this.contDetail = datas
              // this.contDetail.coverImage = datas.coverImage // 给后台的封面数据
              this.contDetail.files = datas.files // 给后台的附件数据
              this.articleTitle = datas.articleTitle // 标题
              this.editorContent = datas.articleContent // 整体内容
              this.editor.txt.html(this.editorContent)
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
              this.contDetail = datas
              // this.contDetail.coverImage = datas.coverImage // 给后台的封面数据
              this.contDetail.files = datas.files // 给后台的附件数据
              this.articleTitle = datas.articleTitle // 标题
              this.editorContent = datas.articleContent // 整体内容
              this.editor.txt.html(this.editorContent)
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
      this.showDelete = false
      if (this.activeName === 'image') {
        this.ruleForm1.groupType = 1
        this.ruleForm.groupType = 1
        this.getImageList()
      } else if (this.activeName === 'video') {
        this.ruleForm1.groupType = 2
        this.ruleForm.groupType = 2
        this.getMyVideo()
        this.getVideoList()
      } else if (this.activeName === 'fourth') {
        this.getwriteQuery()
      } else if (this.activeName === 'fifth') {
        this.getqueryCollection()
      }
    },
    // 获取选中
    handleCheckChange (data, checked, node) {
      this.checkArr = this.$refs.tree.getCheckedNodes(true)
    },
    // 发布到外网
    Mypublish () {
      this.$http.get(this.$api.listWebsite)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.accountList = res.data.data
            this.dialogVisible = true
          }
        })
        .catch(() => {
        })
    },
    // 点击确定发布
    chekedPublish () {
      let publicCont = {
        channels: [],
        articleTitle: this.contDetail.articleTitle,
        articleContent: this.editorContent,
        articleId: this.$route.query.id
      }
      this.checkArr.forEach(item => {
        let chekedALL = {}
        chekedALL.channelId = item.channelId
        chekedALL.websiteId = item.websiteId
        chekedALL.channelAllPathStr = item.channelAllPathStr
        publicCont.channels.push(chekedALL)
      })
      this.$http.post(this.$api.chekedPublish, publicCont)
        .then(res => {
          if (res.data.code === 200) {
            this.dialogVisible = false
            this.$message.success(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    // 下拉选择触发
    changeValue (vlaue) {
      this.params.groupId = vlaue
      this.myAlbumDetail = []
      if (this.activeName === 'image') {
        this.getImgDetail()
      }
    },
    // 获取input焦点
    setFocus () {
      this.$refs['contribute'].focus()
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
              this.$router.push({ name: 'MyMessageList' })
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
    // 上传附件成功
    getAttachmentFiles (file) {
      let getFile = {
        fileName: file.name,
        filePath: file.response.message
      }
      this.contDetail.files.push(getFile)
    },
    // 删除附件
    removeAttachmentFiles (file) {
      if (this.contDetail.files.length) {
        this.contDetail.files.forEach((item, index) => {
          if (file.url) {
            if (item.filePath === file.url) {
              this.contDetail.files.splice(index, 1)
            }
          } else {
            if (item.filePath === file.response.message) {
              this.contDetail.files.splice(index, 1)
            }
          }
        })
      }
    },
    // 上传封面成功
    getAttachmentUrl (file) {
      this.contDetail.coverImage = file.response.message
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
            this.$message.warning('个人视频库暂无内容!')
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
    // // 引用图片
    // getImage (item) {
    //   this.msg = this.msg + '<img src=' + item.uploadPath + '></img>'
    // },
    // // 引用视频链接
    // getvideo (item, index) {
    //   // let radiobox = '<a href=' + item.uploadPath + ' target="_blank" style="display:block;width:395px;height:261px;margin:0 auto;"><img src=' + item.thumbnailUrl + ' style="width:100%;height:100%;"/></a>'
    //   let radiobox = '<p><video width="320" height="240" src=' + item.uploadPath + ' controls="controls">您的浏览器不支持 HTML5 video 标签。</video></p><p></p>'
    //   this.msg = this.msg + radiobox
    // },
    // 引用图片
    getImage (item, index, ev) {
      // this.msg = this.msg + '<img src=' + item.uploadPath + '></img>'
      var that = this
      that.initEditor.ready(function () {
        that.initEditor.execCommand('insertimage', {
          src: item.uploadPath,
          width: 300
        })
      })
    },
    // 引用视频链接
    getvideo (item, index) {
      // let radiobox = '<a href=' + item.uploadPath + ' target="_blank" style="display:block;width:395px;height:261px;margin:0 auto;"><img src=' + item.thumbnailUrl + ' style="width:100%;height:100%;"/></a>'
      let radiobox = '<p><video width="320" height="240" src=' + item.uploadPath + ' controls="controls">您的浏览器不支持 HTML5 video 标签。</video></p><p></p>'
      // this.msg = this.msg + radiobox
      var that = this
      that.initEditor.ready(function () {
        that.initEditor.execCommand('inserthtml', radiobox)
      })
    },
    // 引用模板
    pushMsg (item) {
      this.msg = item.content
    },
    // 获取模板
    getwriteQuery (tab) {
      let id = ''
      if (tab) {
        id = parseInt(tab)
      } else {
        id = 1
      }
      this.$http.get(this.$api.writeQueryAll, { params: { typeId: id } })
        .then(res => {
          if (res.data.data) {
            this.queryList = res.data.data
            if (this.queryList.length > 0) {
              this.dataShow = true
            } else {
              this.dataShow = false
            }
          }
        })
        .catch(() => {
        })
    },
    // 获取收藏
    getqueryCollection () {
      this.$http.get(this.$api.queryCollection)
        .then(res => {
          if (res.data.data) {
            this.queryCollec = res.data.data
            if (this.queryCollec.length > 0) {
              this.dataShow = true
            } else {
              this.dataShow = false
            }
          } else {
            this.queryCollec = []
            this.dataShow = false
          }
        })
        .catch(() => {
          this.queryCollec = []
          this.dataShow = false
        })
    },
    // 添加收藏
    addCollection (item) {
      this.$http.post(this.$api.addCollection, { wid: item.id })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('添加收藏成功!')
            this.getwriteQuery(this.classType)
          }
        })
        .catch(() => {
        })
    },
    // 取消收藏单
    deleteCollection (item) {
      this.$http.get(this.$api.deleteCollection, { params: { wid: item.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('取消收藏成功!')
            this.getwriteQuery(this.classType)
          }
        })
        .catch(() => {
        })
    },
    // 取消收藏(多)
    writeDelete () {
      if (this.ids.length !== 0) {
        let row = {
          ids: this.ids.join(',')
        }
        this.$http.get(this.$api.deleteCollections, { params: row })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('取消收藏成功!')
              this.getqueryCollection()
              this.showDelete = false
            }
          })
          .catch(() => {
          })
      } else {
        this.$message.warning('请选择删除的模板!')
      }
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
  },
  components: {
    vMenu,
    vUpload,
    VueUeditorWrap // 注册组件
  }
}
</script>
<style lang="scss">
@import '../message';
</style>
<style scoped>
.avatar-uploader {
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
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 18px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #8c939d;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
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
  width: 700px;
  min-height: 600px;
}
.back-box {
  float: right;
  margin-right: 10px;
  margin-top: -28px;
}
.box-title {
  display: block;
  height: 28px;
  line-height: 28px;
}
.contribute {
  width: 66%;
  background: #fff;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  padding: 15px 25px 70px;
}
.result-cont {
  min-height: 325px;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 5px 15px;
  margin-top: 10px;
}
.result-btn {
  margin-top: 35px;
  text-align: center;
}
.el-radio-group {
  display: inline-block;
  line-height: 1;
  display: flex;
  vertical-align: middle;
}
.operate .el-radio-group .el-radio {
  margin: 15px 5px 15px 0;
}
.implement {
  float: right;
}
.class-cont .class-show {
  width: 100%;
  background-color: #fff;
  overflow: scroll;
  font-size: 12px;
  min-height: 50px;
  max-height: 400px;
  border: 1px solid #f5f5f5;
  padding: 0 10px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  margin-top: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12);
}
.checkBox {
  text-align: center;
  margin: 15px 0;
  cursor: pointer;
}
.deleteMb {
  display: flex;
  justify-content: flex-end;
  float: right;
  margin-bottom: 15px;
}
.write-query {
  width: 100%;
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
.el-icon-star-on{
  color: rgb(255, 196, 0);
}
</style>
