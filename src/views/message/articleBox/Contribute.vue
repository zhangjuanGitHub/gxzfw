<!--
 * @Email: 您选择的账号不在服务区
 * @Author: MaiChao
 * @Date: 2020-03-30 14:08:08
 * @LastEditors: MaiChao
 * @LastEditTime: 2021-01-11 17:03:04
-->
<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Contribute' }">我要投稿</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <div class="dis-flex">
        <div class="contribute">
          <!-- 渠道 -->
          <div class="upload-box channel">
            <span class="channel-title">选择渠道:</span>
            <el-radio-group v-model="contDetail.publishChannel"
                            @change="getChannel">
              <el-radio label="platform">平台</el-radio>
              <el-radio label="weixin">微信</el-radio>
              <el-radio label="weibo">微博文章</el-radio>
              <el-radio label="weiboText">微博</el-radio>
            </el-radio-group>
          </div>
          <!-- 标题 -->
          <div class="title-box"
               v-if="contDetail.publishChannel!=='weiboText'">
            <el-input v-model="contDetail.articleTitle"
                      ref="contribute"
                      maxlength="32"
                      show-word-limit></el-input>
          </div>
          <!-- 作者 摄影 -->
          <div class="contribute-detail"
               v-if="contDetail.publishChannel!=='weiboText'">
            <div class="author">
              <p>原作者:</p>
              <el-input size="small"
                        v-model="contDetail.originalAuthor"
                        :disabled="disabled"></el-input>
            </div>
            <div class="photo">
              <p>摄影摄像:</p>
              <el-input size="small"
                        v-model="contDetail.cameristName"
                        :disabled="disabled"></el-input>
            </div>
          </div>
          <!-- 编辑器 -->
          <vue-ueditor-wrap ref="editor"
                            @beforeInit="myInit"
                            v-model="msg"
                            :config="myConfig"
                            class="ueditor"
                            v-if="contDetail.publishChannel!=='weiboText'"></vue-ueditor-wrap>
          <!-- 附件 -->
          <div class="upload-box contri-file-list"
               v-if="contDetail.publishChannel==='platform'">
            <v-upload @getAttachmentUrl="getAttachmentFiles"
                      @removeAttachmentFiles="removeAttachmentFiles"
                      :listType="listType"
                      :showList="showList"
                      :isMultiple="isMultiple"
                      :limitList="limitList"
                      :fileTip="fileTip"
                      :isPlatform="isPlatform"></v-upload>
          </div>
          <!-- 封面 -->
          <div class="upload-box contri-img-cover"
               v-if="contDetail.publishChannel!=='weiboText'">
            <el-button size="small"
                       type="primary"
                       @click="showCover"
                       class="select-cover-btn"
                       :disabled="imgsrcArr.length<1">选择封面</el-button>
            <v-upload @getAttachmentUrl="getAttachmentUrl"
                      :headUrl="contDetail.coverImage"
                      :listType="listType"
                      :showList="showListFalse"
                      :isMultiple="isNotMultiple"
                      :acceptType="acceptTypeImg"></v-upload>
          </div>
          <!-- 摘要 -->
          <div class="upload-box"
               v-if="contDetail.publishChannel!=='weiboText'">
            <span class="abstract">文章摘要</span>
            <el-input type="textarea"
                      placeholder="请输入文章摘要"
                      v-model="contDetail.articleSummary"
                      maxlength="120"
                      :rows="6"
                      show-word-limit></el-input>
          </div>
          <!-- 微博头条文章 -->
          <div class="upload-box"
               v-if="contDetail.publishChannel==='weiboText'">
            <el-input type="textarea"
                      placeholder="请输入文章内容"
                      v-model="contDetail.articleContent"
                      maxlength="140"
                      :rows="6"
                      show-word-limit></el-input>
          </div>
          <!-- 微博头条配图 -->
          <div class="upload-box wbtt-box"
               v-if="contDetail.publishChannel==='weiboText'">
            <el-button size="small"
                       type="primary"
                       disabled>选择图片</el-button>
            <v-upload @getAttachmentUrl="getImgArr"
                      @removeAttachmentFiles="removeImgs"
                      :listType="listTypeCard"
                      :showList="showList"
                      :isMultiple="isMultiple"
                      :limitList="limitImg"
                      :fileTip="ImgTip"
                      :acceptType="acceptTypeImg"
                      :class="{hide:hideUploadEdit}"></v-upload>
          </div>
        </div>
        <div class="select-box"
             v-if="contDetail.publishChannel!=='weiboText'">
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
          </el-tabs>
        </div>
        <!-- 手机预览 -->
        <div class="mobile-preview"
             v-if="showPreview">
          <div class="preview-box"
               :style="{backgroundImage: phoneUrl}">
            <div class="preview-container"
                 v-if="contDetail.publishChannel === 'platform' || contDetail.publishChannel === 'weibo'">
              <div class="preview-content wbpreview"
                   v-html="msg || '没有内容哦'"></div>
            </div>
            <div class="preview-container"
                 v-else-if="contDetail.publishChannel === 'weixin'">
              <div class="preview-title"
                   v-html="contDetail.articleTitle || '请输入标题'"></div>
              <div class="preview-name"><span v-html="contDetail.originalAuthor || '请输入原作者'"></span><span>今天</span></div>
              <div class="preview-content"
                   v-html="msg || '没有内容哦'"></div>
            </div>
            <div class="preview-container"
                 v-else-if="contDetail.publishChannel=='weiboText'">
              <div class="preview-content wbpreview"
                   v-html="contDetail.articleContent || '没有内容哦'"></div>
              <div class="weibotext_box">
                <div class="weibotext_imgOne"
                     v-if="contDetail.files.length === 1">
                  <ul v-for="(item, index) of contDetail.files"
                      :key="index">
                    <li><img :src="item.filePath"
                           alt=""></li>
                  </ul>
                </div>
                <div class="weibotext_imgTwo"
                     v-else-if="contDetail.files.length === 2 || contDetail.files.length === 4">
                  <ul v-for="(item, index) of contDetail.files"
                      :key="index">
                    <li><img :src="item.filePath"
                           alt=""></li>
                  </ul>
                </div>
                <div class="weibotext_imgElse"
                     v-else>
                  <ul v-for="(item, index) of contDetail.files"
                      :key="index">
                    <li><img :src="item.filePath"
                           alt=""></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="preview-btn">
            <div class="close-preview"
                 @click="closePreviewBox"><i class="el-icon-close"></i></div>
          </div>
        </div>
      </div>
      <div class="contribute-btn">
        <el-button type="primary"
                   @click="update"
                   v-if="isArchive==='4'||isArchive==='1'">保存稿件</el-button>
        <el-button type="primary"
                   @click="preseRvation"
                   v-if="isArchive==='6'">保存稿件</el-button>
        <div v-if='!isArchive'>
          <el-button type="primary"
                     @click="preseRvation">新建稿件</el-button>
          <el-button type="info"
                     @click="updataRow">提交审核</el-button>
        </div>
        <el-button style="margin-left: 10px"
                   type="primary"
                   @click="showPreviewBox"
                   :disabled="showPreview">预览</el-button>
      </div>
      <ul v-show="visible"
          :style="{left:left+'px',top:top+'px'}"
          class="contextmenu">
        <li @click="setUpload">设为封面</li>
      </ul>
      <el-dialog title="选择图片设为封面"
                 :visible.sync="showArr"
                 width="45%"
                 :modal-append-to-body="false"
                 center>
        <div class="cover-box">
          <div v-for="item in imgsrcArr"
               :key="item"
               class="img-card">
            <img :src="item"
                 class="image">
            <div style="padding: 14px;">
              <div class="bottom clearfix">
                <el-button type="text"
                           class="button"
                           @click="setCover(item)">设为封面</el-button>
              </div>
            </div>
          </div>
        </div>
      </el-dialog>
      <el-dialog title="提交审核"
                 :modal-append-to-body='false'
                 :visible.sync="changeVisible"
                 width="50%">
        <div class="user-list">
          <el-radio-group v-model="getRadio"
                          label-width="100px">
            <!-- <el-radio v-for="item in this.checkdData"
                      :label="item.id"
                      :key="item.id">{{item.userName}}</el-radio> -->
            <div v-if="!this.checkdData.length">
              <div class="change_sort">
                <el-radio v-for="item in this.sortList[0]"
                          :label="item.id"
                          :key="item.id">{{item.userName}}</el-radio>
              </div>
              <div class="change_sort">
                <el-radio v-for="item in this.sortList[1]"
                          :label="item.id"
                          :key="item.id">{{item.userName}}</el-radio>
              </div>
              <div class="change_sort">
                <el-radio v-for="item in this.sortList[2]"
                          :label="item.id"
                          :key="item.id">{{item.userName}}</el-radio>
              </div>
            </div>
            <div v-else>
              <el-radio v-for="item in this.checkdData"
                        :label="item.id"
                        :key="item.id">{{item.userName}}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="overClick">取 消</el-button>
          <el-button type="primary"
                     @click="updataClick">确定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="请选择投稿方式"
                 :modal-append-to-body='false'
                 :visible.sync="wxPreview"
                 width="40%">
        <div class="publish-list">
          <el-radio-group v-model="publishChannel">
            <el-radio-button :label="3">
              <div class="weixin"
                   @click="wxPreview=false">
                <img :src="require('@/assets/images/home/meiti.png')">
                <p class="public-name">融媒体系统</p>
              </div>
            </el-radio-button>
            <el-radio-button :label="6">
              <div class="xiumi"
                   @click="openXiumi">
                <img :src="require('@/assets/images/home/xiumi.png')">
                <p class="public-name">秀米编辑器</p>
              </div>
            </el-radio-button>
            <!-- <el-radio-button :label="9">
                <div class="weixin">
                  <img :src="require('@/assets/image/home/build.png')">
                  <p class="public-name">微信公众号</p>
                </div>
              </el-radio-button> -->
          </el-radio-group>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="wxPreview=false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import vUpload from '@/components/UploadAll.vue'
import VueUeditorWrap from 'vue-ueditor-wrap' // 引入vue-ueditor-wrap
import { mapGetters } from 'vuex'
export default {
  name: 'Contribute',
  data () {
    return {
      xiumiUrl: '', // 秀米链接
      publishChannel: '', // 投稿渠道选择
      wxPreview: false, // 微信投稿渠道
      initEditor: '', // 初始化editor
      isInit: false, // 是否初始化
      hideUpload: false,
      listType: 'text',
      listTypeCard: 'picture-card',
      showList: true,
      showListFalse: false,
      isMultiple: true,
      isNotMultiple: false,
      limitList: 5,
      limitImg: 9,
      isPlatform: true,
      fileTip: '附件最多上传数量为5个',
      ImgTip: '图片最多上传数量为9个',
      acceptTypeImg: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      headUrl: '',
      hideUploadEdit: false,
      dialogImageUrl: '',
      ImageUrlVisible: false,
      page: '',
      thisRouter: '',
      thisId: '',
      thisStatus: '',
      getRadio: '', // 选中数据
      checkdData: [],
      changeVisible: false,
      imgArr: [
        { img: require('@/assets/images/message/wx.png') },
        { img: require('@/assets/images/message/wb.png') },
        { img: require('@/assets/images/message/wx-meng.png') },
        { img: require('@/assets/images/message/wb-meng.png') }
      ],
      showArr: false, // 文章封面预览
      imgsrcArr: [], // 文章内容图片列表
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
      fileList: [], // 附件列表
      fileListCoverImage: [], // 封面
      editor: null,
      disabled: false,
      newsURL: require('@/assets/images/message/radio.png'),
      phoneUrl: 'url(' + require('@/assets/images/phone.png') + ')',
      showPreview: false,
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
      sortList: [[], [], []],
      contDetail: {
        id: '', // 稿件id
        publishChannel: '',
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
        // 地址 + 接口名称
        serverUrl: window.g.baseUrl + '/media/ueditor/config',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        // 地址 + 项目前缀 + 请求文件名称
        // UEDITOR_HOME_URL: window.g.baseUrl + '/ueditor/',
        // UEDITOR_HOME_URL: 'http://192.168.10.6:8084/ueditor/',
        UEDITOR_HOME_URL: '/ueditor/',
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
    VueUeditorWrap, // 注册组件
    vUpload
  },
  methods: {
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
      const isLt10M = file.size / 1024 / 1024 < 2
      if (!isLt10M) {
        this.contDetail.coverImage = ''
        this.$message.warning('上传封面大小不能超过 2MB!')
      } else {
        this.contDetail.coverImage = file.response.message
      }
    },
    // 上传九图成功
    getImgArr (file) {
      let getFile = {
        fileName: file.name,
        filePath: file.response.message
      }
      this.contDetail.files.push(getFile)
      this.hideUploadEdit = this.contDetail.files.length >= 9
    },
    // 删除九图
    removeImgs (file) {
      if (this.contDetail.files.length === 0) {
        this.contDetail.files = []
      } else {
        this.contDetail.files.splice(file, 1)
      }
      this.hideUploadEdit = this.contDetail.files.length >= 9
    },
    uploadEdit (file) {
      return this.xianZhi(file)
    },
    xianZhi (file) {
      const isLimit = file.size / 1024 / 1024 <= 9
      if (
        ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].indexOf(file.type) === -1
      ) {
        this.$message.error('上传图片只能是 jpg/jpeg/gif/png格式!')
        return false
      }
      if (!isLimit) {
        this.$message.error('上传图片大小不能超过" + 5 + "MB!')
        return false
      }
    },
    // 获取排序后的审核人顺序
    getSortList () {
      this.$http.get(this.$api.getOrgList)
        .then(res => {
          let datas = res.data.data
          datas.map((val) => {
            if (val.level === '1') {
              this.sortList[0].push({ 'id': val.user_id, 'userName': val.user_name })
            } else if (val.level === '2') {
              this.sortList[1].push({ 'id': val.user_id, 'userName': val.user_name })
            } else {
              this.sortList[2].push({ 'id': val.user_id, 'userName': val.user_name })
            }
          })
        })
        .catch(() => { })
    },
    updataRow () {
      this.checkdData = []
      this.$http.get(this.$api.listCheckUser)
        .then(res => {
          if (!this.sortList[0].length && !this.sortList[1].length && !this.sortList[2].length) {
            this.$http.get(this.$api.listCheckUser)
              .then(res => {
                if (res.data.code === 200) {
                  this.changeVisible = true
                  this.checkdData = res.data.data
                }
              })
              .catch(() => { })
          } else {
            this.changeVisible = true
            // this.checkdData = this.sortList
          }
        })
        .catch(() => { })
    },
    // 确认提交
    updataClick () {
      if (this.getRadio) {
        this.contDetail.checkUserIds = this.getRadio
        this.preseRvation()
      } else {
        this.$message.warning('请选择提交用户')
      }
    },
    // 取消提交
    overClick () {
      this.checkdData = []
      this.getRadio = ''
      this.changeVisible = false
    },
    // 打开文章封面图片预览
    showCover () {
      this.showArr = true
    },
    setCover (item) {
      this.showArr = false
      this.fileListCoverImage = []
      this.contDetail.coverImage = item
      let cover = { name: 'articlePic', url: item }
      this.fileListCoverImage.push(cover)
      // this.showArr = false
    },
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
    // 查看预览
    showPreviewBox () {
      if (this.contDetail.publishChannel) {
        this.showPreview = true
      } else {
        this.$message.warning('请先选择渠道哦')
      }
    },
    // 关闭预览
    closePreviewBox () {
      this.showPreview = false
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
              // iframeUrl: 'https://xiumi.us/studio/v5#/paper/for/new/cube/0',
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
      window.UE.registerUI('135editor', function (editor, uiName) {
        var btn = new window.UE.ui.Button({
          name: 'btn-dialog-' + uiName,
          className: 'edui-for-135editor',
          title: '135编辑器',
          onclick: function () {
            var editor135 = window.open(
              'https://www.135editor.com/simple_editor.html?callback=true&appkey=')
            window.addEventListener('message', function (event) {
              if (typeof event.data !== 'string') {
                if (event.data.ready) {
                  editor135.postMessage(editor.getContent(), '*')
                }
                return
              };
              editor.setContent(event.data)
              editor.fireEvent('catchRemoteImage')
            }, false)
          }
        })
        return btn
      }, undefined)
    },
    // 获取编辑详情
    getEditdetail () {
      // this.disabled = true
      let routerParams = this.$route.query
      let editdetailId = routerParams.id
      this.isArchive = routerParams.isArchive
      // isArchive === 1  2 复制 3 编辑 6 引用
      if (this.isArchive === '6') {
        this.$http.get(`${this.$api.findOneNewscloud}/${editdetailId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              let datas = res.data.data
              if (datas.files) {
                datas.files.forEach(item => {
                  this.fileList.push({ name: item.fileName, url: item.filePath })
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
              // this.contDetail.articleContent = datas.articleContent.replace(/<.*?>/g, '').replace(/\s/ig, '').substring(0, 140)
              var imgReg = /<img.*?(?:>|\/>)/gi
              // 匹配src属性
              var srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i
              var arr = this.msg.match(imgReg)
              this.imgsrcArr = []
              let ayy = []
              for (var i = 0; i < arr.length; i++) {
                var src = arr[i].match(srcReg)
                // 获取图片地址
                if (src[1]) {
                  ayy.push(src[1])
                  var x = new Set(ayy) // 去重ES6实现 需ie9以上,谷歌23版本
                }
                this.imgsrcArr = [...x]
              }
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
      } else {
        this.$http.get(`${this.$api.articleDetail}` + `?id=${editdetailId}`)
          .then(res => {
            if (res.data.code === 200 && res.data.data) {
              let datas = res.data.data
              if (datas.files) {
                datas.files.forEach(item => {
                  this.fileList.push({ name: item.fileName, url: item.filePath })
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
              // this.contDetail.articleContent = datas.articleContent.replace(/<.*?>/g, '').replace(/\s/ig, '').substring(0, 140)
              var imgReg = /<img.*?(?:>|\/>)/gi
              // 匹配src属性
              var srcReg = /src=[\\'\\"]?([^\\'\\"]*)[\\'\\"]?/i
              var arr = this.msg.match(imgReg)
              this.imgsrcArr = []
              let ayy = []
              for (var i = 0; i < arr.length; i++) {
                var src = arr[i].match(srcReg)
                // 获取图片地址
                if (src[1]) {
                  ayy.push(src[1])
                  var x = new Set(ayy) // 去重ES6实现 需ie9以上,谷歌23版本
                }
                this.imgsrcArr = [...x]
              }
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
        this.getImgDetail()
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
    changeValue (value) {
      this.params.groupId = value
      this.myAlbumDetail = []
      if (this.activeName === 'image') {
        this.getImgDetail()
      }
    },
    // 打开秀米
    openXiumi () {
      window.open(this.xiumiUrl, '_black')
      this.wxPreview = false
    },
    // 清除数据
    cleanUp () {
      this.msg = ''
      this.contDetail.articleTitle = ''
      this.contDetail.articleContent = ''
      this.contDetail.originalAuthor = ''
      this.contDetail.files = []
      this.contDetail.cameristName = ''
      this.contDetail.articleSummary = ''
    },
    getChannel () {
      this.showPreview = false
      if (this.isArchive !== '6') {
        this.cleanUp()
      }
      if (this.contDetail.publishChannel === 'weiboText' && this.isArchive === '6') {
        this.contDetail.articleContent = this.msg.replace(/<.*?>/ig, '').replace(/&nbsp;/ig, '').replace(/\s/ig, '').substring(0, 140)
      }
      if (this.contDetail.publishChannel === 'weixin' && this.isArchive !== '6') {
        this.wxPreview = true
        this.$http.get(this.$api.xiumi, { params: { id: this.$route.query.id } })
          .then(res => {
            if (res.data.code === 200) {
              this.xiumiUrl = res.data.data.authorizeUrl
            }
          })
          .catch(() => {
          })
      }
    },
    // 新建稿件
    preseRvation () {
      if (this.contDetail.publishChannel === 'weiboText') {
        this.$http.post(this.$api.FinishTrue, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              this.$router.push({ name: 'MyMessageList' })
            }
          })
          .catch(() => {
          })
      } else {
        this.contDetail.articleContent = this.msg
        if (!this.contDetail.publishChannel) {
          this.$message.warning('稿件渠道不能为空')
        } else if (!this.contDetail.articleTitle) {
          this.$message.warning('稿件标题不能为空')
        } else if (!this.contDetail.originalAuthor) {
          this.$message.warning('原作者不能为空')
        } else if (!this.contDetail.coverImage) {
          this.$message.warning('封面图不能为空')
        } else if (!this.contDetail.articleSummary) {
          this.$message.warning('文章摘要不能为空')
        } else {
          this.$http.post(this.$api.FinishTrue, this.contDetail)
            .then(res => {
              if (res.data.code === 200) {
                this.$router.push({ name: 'MyMessageList' })
              }
            })
            .catch(() => {
            })
        }
      }
    },
    // 保存稿件
    update () {
      if (this.contDetail.publishChannel === 'weiboText') {
        this.$http.post(this.$api.updateFinishTrue, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              if (this.isArchive === '1') {
                this.$router.push({ name: 'AuditDetail', query: { id: this.thisId, status: this.thisStatus } })
              } else {
                this.$router.push({ name: 'ManuscriptDetail', query: { id: this.thisId, status: this.thisStatus, page: this.page } })
              }
            }
          })
          .catch(() => {
          })
      } else {
        this.contDetail.articleContent = this.msg
        if (!this.contDetail.publishChannel) {
          this.$message.warning('稿件渠道不能为空')
        } else if (!this.contDetail.articleTitle) {
          this.$message.warning('稿件标题不能为空')
        } else if (!this.contDetail.originalAuthor) {
          this.$message.warning('原作者不能为空')
        } else if (!this.contDetail.coverImage) {
          this.$message.warning('封面图不能为空')
        } else if (!this.contDetail.articleSummary) {
          this.$message.warning('文章摘要不能为空')
        } else {
          this.$http.post(this.$api.updateFinishTrue, this.contDetail)
            .then(res => {
              if (res.data.code === 200) {
                if (this.isArchive === '1') {
                  this.$router.push({ name: 'AuditDetail', query: { id: this.thisId, status: this.thisStatus } })
                } else {
                  this.$router.push({ name: 'ManuscriptDetail', query: { id: this.thisId, status: this.thisStatus, page: this.page } })
                }
              }
            })
            .catch(() => {
            })
        }
      }
    },
    // 保存稿件
    submit () {
      // if (this.initEditor.getContent()) {
      //   this.msg = this.initEditor.getContent()
      // }

      this.contDetail.articleContent = this.msg
      if (this.contDetail.publishChannel === 'weiboText') {
        this.$http.post(this.$api.submit, this.contDetail)
          .then(res => {
            if (res.data.code === 200) {
              if (this.isArchive === '1') {
                this.$router.push({ name: 'AuditDetail', query: { id: this.id, status: this.checkStatus } })
              } else {
                this.$router.push({ name: 'ManuscriptDetail', query: { id: this.id, status: this.checkStatus, page: this.page } })
              }
            }
          })
          .catch(() => {
          })
      } else {
        if (!this.contDetail.publishChannel) {
          this.$message.warning('稿件渠道不能为空')
        } else if (!this.contDetail.articleTitle) {
          this.$message.warning('稿件标题不能为空')
        } else if (!this.contDetail.originalAuthor) {
          this.$message.warning('原作者不能为空')
        } else if (!this.contDetail.coverImage) {
          this.$message.warning('封面图不能为空')
        } else {
          this.$http.post(this.$api.submit, this.contDetail)
            .then(res => {
              if (res.data.code === 200) {
                this.$router.push({ name: 'MyMessageList' })
              }
            })
            .catch(() => {
            })
        }
      }
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
            this.value = this.myAlbum[this.myAlbum.length - 1].id
            this.changeValue(this.value)
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
            // this.$message.warning('暂无内容!')
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
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => { //  这里的vm指的就是vue实例，可以用来当做this使用
      vm.thisRouter = from.name
      vm.thisId = from.query.id
      vm.thisStatus = from.query.status
    })
  },
  mounted () {
    // var oMeta = document.createElement('meta')
    // oMeta.name = 'referrer'
    // oMeta.content = 'never'
    // document.getElementsByTagName('head')[0].appendChild(oMeta)
    this.editor = this.$refs.editor
  },
  created () {
    this.thisStatus = this.$route.query.status
    this.isArchive = this.$route.query.isArchive
    this.page = this.$route.query.page
    this.getImageList()
    this.getMyImage()
    this.getSortList()
    this.thisId = this.$route.query.id
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
@import '../message';
.wbtt-box .avatar-uploader-icon {
  font-size: 30px;
  margin-top: 60px;
  margin-left: -32px;
}
// .wbtt-box .el-upload--picture-card {
//   width: 180px;
//   height: 180px;
// }
</style>
<style>
.preview-content p,
.preview-content-two p,
.preview-content-three p {
  line-height: 1.5;
}
.preview-content img,
.preview-content video,
.preview-content section,
.preview-content p {
  max-width: 100%;
}
.weibotext_imgOne img {
  max-width: 100%;
}
.weibotext_imgTwo img {
  width: 49%;
}
.weibotext_imgElse img {
  width: 32.333%;
}
.weibotext_imgTwo img,
.weibotext_imgElse img {
  height: 90px;
  float: left;
  margin: 0.5% 0.5%;
}
</style>
<style scoped>
.weibotext_box {
  margin-top: 10px;
}
.mobile-preview {
  width: 365px;
  height: 630px;
  position: absolute;
  right: -50px;
  bottom: -50px;
  /* top: 150px; */
}
.preview-box {
  width: 315px;
  height: 630px;
  background-repeat: no-repeat;
  background-size: 100%;
  border-radius: 50px;
  float: left;
}
.preview-container {
  width: 265px;
  height: 545px;
  margin: 43px 25px 10px 25px;
  overflow: scroll;
}
.preview-container .wbpreview {
  margin-top: 10px;
}
.preview-title {
  width: 100%;
  font-size: 18px;
  line-height: 1.4;
  margin-top: 5px;
  margin-bottom: 14px;
  font-weight: 400;
}
.preview-name {
  width: 100%;
  font-size: 12px;
  margin-bottom: 22px;
  line-height: 20px;
}
.preview-name span:nth-of-type(1) {
  color: #576b95;
}
.preview-name span:nth-of-type(2) {
  margin-left: 15px;
  color: rgba(0, 0, 0, 0.3);
}
.preview-content {
  width: 100%;
}
.preview-btn {
  width: 50px;
  height: 630px;
  float: left;
}
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
  display: flex;
  justify-content: center;
}
.contribute-btn .el-button {
  width: 158px;
  font-size: 18px;
}
.upload-box .el-button {
  border-radius: 0;
  margin: 10px 0;
}
/* 添加 */
.dis-flex {
  display: flex;
  background: #ffffff;
  justify-content: space-between;
  position: relative;
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
  margin: 20px 0;
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
.ueditor {
  display: inline-block;
  width: 820px;
}
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
.cover-box {
  height: 550px;
  overflow-y: scroll;
  display: flex;
  flex-wrap: wrap;
}
.cover-box .img-card {
  width: 30%;
  max-height: 270px;
  margin-bottom: 15px;
  margin-right: 3%;
  background-color: #f5f5f5;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.cover-box:after {
  content: '';
  flex: auto;
}
.cover-box .img-card img {
  width: 100%;
  height: 200px;
}
.cover-box .img-card .clearfix {
  text-align: center;
}
.channel-title {
  display: inline-block;
  width: 80px;
  height: 32px;
  line-height: 32px;
}
.upload-box .el-radio-group {
  margin-right: 70px;
}
.channel {
  background-color: #f5f5f5;
  margin-bottom: 20px;
}
.wbtt-box .bottom10,
.select-cover-btn {
  margin-bottom: 10px;
}
.user-list .el-radio-group {
  width: 100%;
}
.publish-list .el-radio-group {
  display: flex;
  justify-content: space-around;
}
</style>
