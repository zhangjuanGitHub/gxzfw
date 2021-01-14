<template>
  <div class="hello">
    <vue-ueditor-wrap ref="editor"  :init="myInit"  v-model="msg"  :config="myConfig" class="ueditor"></vue-ueditor-wrap>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap' // 引入vue-ueditor-wrap
export default {
  name: 'HelloWorld',
  components: {
    VueUeditorWrap// 注册组件
  },
  data () {
    return {
      msg: '123',
      myConfig: {
        // 如果需要上传功能,找后端小伙伴要服务器接口地址
        // serverUrl: 'http://api.demo.com/ueditor/upload',
        // 你的UEditor资源存放的路径,相对于打包后的index.html
        UEDITOR_HOME_URL: '/UEditor/',
        // 编辑器自动被内容撑高
        autoHeightEnabled: true,
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
          'simpleupload', 'insertimage', 'emotion', 'scrawl', 'insertvideo', 'music', 'attachment', 'map', 'insertframe', 'insertcode', 'pagebreak', 'template', 'background', '|',
          'horizontal', 'date', 'time', 'spechars', 'snapscreen', 'wordimage', '|',
          'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', 'charts', '|',
          'print', 'preview', 'drafts'
        ]]
      }

    }
  },
  methods: {
    myInit () {
      window.UE.registerUI('dialog', function (editor, uiName) {
        var btn = new window.UE.ui.Button({
          name: 'xiumi-connect',
          title: '秀米',
          onclick: function () {
            var dialog = new window.UE.ui.Dialog({
              iframeUrl: '/UEditor/xiumi-ue-dialog-v5.html',
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
    }
  }
}
</script>

<style scoped>
.ueditor{
  display: inline-block;
  width: 820px;
}
</style>
