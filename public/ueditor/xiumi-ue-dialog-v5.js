/**
 * Created by shunchen_yang on 16/10/25.
 */
window.UE.registerUI('dialog', function (editor, uiName) {
  var btn = new window.UE.ui.Button({
    name: 'xiumi-connect',
    title: '秀米',
    onclick: function () {
      console.log(editor)
      var dialog = new window.UE.ui.Dialog({
        iframeUrl: window.g.baseRoute + '/media/ueditor/xiumi-ue-dialog-v5.html', // 将此处的值改为实际的文件路径
        // iframeUrl: 'http://47.93.1.52/media/ueditor/xiumi-ue-dialog-v5.html', // 将此处的值改为实际的文件路径
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
