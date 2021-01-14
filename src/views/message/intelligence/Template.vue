<template>
<div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
       <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
       <el-breadcrumb-item :to="{ name: 'IntelligenceEditor' }">智能辅助</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Template' }">写作模板</el-breadcrumb-item>
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
          <div class="template">
            <div class="dis-flex">
              <div class="contribute">
                <!-- <div class="title-box">
                  <el-input v-model="contDetail.articleTitle"
                            ref="contribute"
                            maxlength="50"
                            show-word-limit></el-input>
                </div>
                <div class="contribute-detail">
                  <div class="author">
                    <p>原作者:</p>
                    <el-input size="small"
                              v-model="contDetail.originalAuthor"
                              ></el-input>
                  </div>
                  <div class="photo">
                    <p>摄像:</p>
                    <el-input size="small"
                              v-model="contDetail.cameristName"
                              ></el-input>
                  </div>
                </div> -->
                <vue-ueditor-wrap ref="editor" :init="myInit"  v-model="msg"  :config="myConfig" class="ueditor"></vue-ueditor-wrap>
                <div class="upload-box">
                  <span class="classification">模板分类:</span>
                  <el-select v-model="contDetail.typeId" placeholder="请选择模板类型">
                    <el-option label="检察人物" :value="1">
                    </el-option>
                    <el-option label="专题模板" :value="2">
                    </el-option>
                    <el-option label="日报模板" :value="3">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="select-box template">
                <el-tabs v-model="activeName"
                        @tab-click="getwriteQuery(activeName)">
                  <el-tab-pane label="检察人物"
                              name="1">
                    <div class="photo-cont" v-if="dataShow">
                      <div v-for="(item,index) in queryList"
                                :key="index"  >
                          <div class="photo-show" v-html="item.coverImage" @click="pushMsg(item)"></div>
                          <div class="checkBox" v-if="showDelete">
                            <el-checkbox-group v-model="ids">
                              <el-checkbox  :label="item.id">删除</el-checkbox>
                            </el-checkbox-group>
                          </div>
                       </div>
                    </div>
                    <div v-else class="photo-cont">
                      <img class="box-none"
                                :src="require('@/assets/images/empty-data.png')">
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="专题模板"
                              name="2">
                    <div class="photo-cont" v-if="dataShow">
                      <div  v-for="(item,index) in queryList"
                                :key="index"  >
                          <div class="photo-show" v-html="item.coverImage" @click="pushMsg(item)"></div>
                          <div class="checkBox" v-if="showDelete">
                            <el-checkbox-group v-model="ids">
                              <el-checkbox  :label="item.id">删除</el-checkbox>
                            </el-checkbox-group>
                          </div>
                       </div>
                    </div>
                    <div v-else class="photo-cont">
                      <img class="box-none"
                                :src="require('@/assets/images/empty-data.png')">
                    </div>
                  </el-tab-pane>
                  <el-tab-pane label="日报模板"
                              name="3">
                   <div class="photo-cont" v-if="dataShow">
                      <div  v-for="(item,index) in queryList"
                                :key="index"  >
                          <div class="photo-show" v-html="item.coverImage" @click="pushMsg(item)"></div>
                          <div class="checkBox" v-if="showDelete">
                            <el-checkbox-group v-model="ids">
                              <el-checkbox  :label="item.id">删除</el-checkbox>
                            </el-checkbox-group>
                          </div>
                       </div>
                    </div>
                    <div v-else class="photo-cont">
                      <img class="box-none"
                                :src="require('@/assets/images/empty-data.png')">
                    </div>
                  </el-tab-pane>
                </el-tabs>
                <div v-if="dataShow">
                  <div class="deleteMb" v-if="showDelete">
                  <el-button type="primary" size="small" class="deleteMb"  @click="writeDelete">确定删除</el-button>
                  <el-button  size="small" class="deleteMb"  @click="showDelete=false">取消删除</el-button>
                  </div>
                  <el-button type="danger" size="small" class="deleteMb" @click="showDelete=true" v-else>删除模板</el-button>
                </div>
              </div>
            </div>
            <div class="contribute-btn">
              <el-button type="primary"
                        @click="writeUpdate" v-if="contDetail.id">更新模板</el-button>
              <el-button type="primary"
                        @click="submit" v-else>保存到模板</el-button>
              <el-button
                        @click="restWrite">新建</el-button>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // 引入vue-ueditor-wrap
import { mapGetters } from 'vuex'
import vMenu from '@/views/message/components/Menu'
export default {
  name: 'Contribute',
  data () {
    return {
      dataShow: false,
      showDelete: false,
      ids: [], // 被删除模板列表
      activeName: '1',
      queryList: [], // 模板列表
      editor: null,
      contDetail: {
        content: '', // 文章内容
        coverImage: '', // 封面图片
        typeId: '' // 选择类型
      },
      msg: '',
      myConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: 'http://35.201.165.105:8000/controller.php',
        serverUrl: window.g.baseUrl + '/media/ueditor/config',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: window.g.baseRoute + '/gxjcy/ueditor/',
        // UEDITOR_HOME_URL: '/ueditor/',
        // 编辑器自动被内容撑高
        autoHeightEnabled: false,
        // 关闭自动保存
        enableAutoSave: true
      }
    }
  },
  methods: {
    // 配置秀米
    myInit () {
      window.UE.registerUI('dialog', function (editor, uiName) {
        var btn = new window.UE.ui.Button({
          name: 'xiumi-connect',
          title: '秀米',
          onclick: function () {
            var dialog = new window.UE.ui.Dialog({
              iframeUrl: window.g.baseRoute + '/gxjcy/ueditor/xiumi-ue-dialog-v5.html',
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
    // 保存模板
    submit () {
      this.contDetail.content = this.msg
      this.contDetail.coverImage = '<div>' + this.msg + '</div>'
      this.$http.post(this.$api.writeSave, this.contDetail)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('添加成功!')
            this.getwriteQuery(this.activeName)
          }
        })
        .catch(() => {
        })
    },
    // 重置
    restWrite () {
      this.contDetail = {}
      this.msg = ''
    },
    // 更新模板
    writeUpdate () {
      this.contDetail.content = this.msg
      this.contDetail.coverImage = '<div>' + this.msg + '</div>'
      this.$http.post(this.$api.writeUpdate, this.contDetail)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('更新成功!')
            this.getwriteQuery(this.activeName)
            this.contDetail = {}
            this.msg = ''
          }
        })
        .catch(() => {
        })
    },
    // 获取模板
    getwriteQuery (tab) {
      let id = ''
      if (tab) {
        id = parseInt(tab)
      } else {
        id = 1
      }
      this.$http.get(this.$api.writeQuery, { params: { typeId: id } })
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
    // 删除模板
    writeDelete () {
      if (this.ids.length !== 0) {
        let row = {
          ids: this.ids.join(',')
        }
        this.$http.get(this.$api.writeDelete, { params: row })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除模板成功!')
              this.getwriteQuery(this.activeName)
              this.showDelete = false
            }
          })
          .catch(() => {
          })
      } else {
        this.$message.warning('请选择删除的模板!')
      }
    },
    // 引用模板
    pushMsg (item) {
      this.msg = item.content
      this.contDetail = item
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
    this.getwriteQuery()
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
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
  components: {
    vMenu,
    VueUeditorWrap // 注册组件
  }
}
</script>
<style lang="scss">
@import "../message";
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
.photo-cont .photo-show {
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
  margin-bottom: 15px;
  box-shadow:  0 2px 4px rgba(0, 0, 0, .12)
}
.checkBox{
   text-align: center;
   margin: 15px 0;
}
.photo-show .image-line {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  justify-content: space-between;
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
.photo-cont .box-none {
  display: block;
  margin: 0 auto;
}
.quote-article {
  color: #2394e9;
  text-decoration: underline;
  cursor: pointer;
}
.wangeditor-box {
  min-height: 600px;
}
.back-box {
  float: right;
  margin-right: 10px;
}
.template {
  position: relative;
}
.el-icon-plus {
  font-size: 20px;
  color: #2c9df1;
  border: 2px solid #2c9df1;
  position: absolute;
  top: 10px;
  right: -5px;
}
.box-group {
  position: absolute;
  top: 44px;
  right: -13px;
}
.el-checkbox {
  display: block;
}
.deleteMb{
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
}
</style>
