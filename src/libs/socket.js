import store from '../store/index'
import router from '../router/router'
import { Message } from 'element-ui'
var websocket
let sendTime = null
let reconnectTime = null
websocket = null
let num = 1
function getWebIp () {
  return window.g.WebIp
}
function getUserToken () {
  return store.state.user.token
}
function getUserId () {
  return store.state.user.userInfo.userId
}
function initWebSocket () {
  if (store.state.user.token) {
    try {
      var wsurl = `${getWebIp()}/${getUserId()}/${getUserToken()}?authCode=${getUserToken()}`
      websocket = new WebSocket(wsurl)
      if (websocket) {
        // 接收消息
        websocket.onmessage = function (e) {
          getWsMessage(e)
        }
        // 开始连接
        websocket.onopen = function (e) {
          getWsOpen(e)
        }
        // 发生错误
        websocket.onerror = function () {
          getWsError()
        }
        websocket.onclose = function () {
          getWsClose()
        }
      }
    } catch (e) {
      if (router.currentRoute.name !== 'Login') {
        Message.warning({
          message: '当前浏览器不支持websocket，建议您升级浏览器！',
          duration: 1000
        })
      }
    }
  }
}
// 开始连接
function getWsOpen (e) {
  console.log('连接成功！')
}
// 接收消息
function getWsMessage (e) {
  // code 状态 200=>系统消息, 201=>站内消息(聊天)，606=>异地登录
  if (e && e.data) {
    let datas = e && e.data ? JSON.parse(e.data) : null
    console.log(datas.data)
    switch (datas.code) {
      case 200:
        Message({
          message: datas.message,
          duration: 1000
        })
        store.commit('user/messageNumAdd')
        break
      case 201:
        store.commit('user/chatMoreMessageList', datas.data.content)
        break
      case 202:
        store.commit('user/chatSingleMessageList', datas.data)
        break
      case 606:
        getWsClose()
        Message.error({
          message: datas.message,
          duration: 1000
        })
        localStorage.clear()
        store.commit('user/userSignout')
        router.replace({ name: 'Login' })
        break
    }
  }
}
// 重新连接
function reconnect () {
  reconnectTime = setTimeout(() => {
    num++
    if (num < 10 && store.state.user.token && websocket.readyState !== 1) {
      initWebSocket()
    } else {
      reconnectTime && setTimeout(reconnectTime)
      num = 1
      return false
    }
  }, 5000)
}
function getWsError () {
  console.log('发生错误！')
}
// 连接关闭
function getWsClose () {
  sendTime && clearInterval(sendTime)
  console.log('连接关闭！')
  reconnect()
}
function sendMessage (data) {
  if (websocket && websocket.readyState === 1) {
    websocket.send(data)
  } else {
    initWebSocket()
  }
}
sendTime = setInterval(() => {
  sendMessage('{ "data": "保持连接" }')
}, 50000)
export default {
  getWsOpen,
  getWsClose,
  sendMessage,
  initWebSocket
}
