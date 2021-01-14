import axios from 'axios'
import { Message, Loading } from 'element-ui'
import store from '../store/index'
import router from '../router/router'
// import Qs from 'qs'
const tip = msg => {
  if (isPopMessage) {
    Message.error({
      message: msg,
      duration: 1000,
      forbidClick: true
    })
  }
}
const warningTip = msg => {
  if (isPopMessage) {
    Message.warning({
      message: msg,
      duration: 1000,
      forbidClick: true
    })
  }
}
const toLogin = () => {
  router.replace({
    name: 'Login'
  })
}
let needLoadingRequestCount = 0
export function showFullScreenLoading () {
  if (!needLoadingRequestCount) {
    startLoading()
  }
  needLoadingRequestCount++
}
export function tryHideFullScreenLoading () {
  if (needLoadingRequestCount <= 0) return
  needLoadingRequestCount--
  if (!needLoadingRequestCount) {
    endLoading()
  }
}
let loading = null
let isPopMessage = true
// const setTime = () => {
//   tryHideFullScreenLoading()
//   setTimeout(() => {
//     tryHideFullScreenLoading()
//   }, 1000)
// }
function startLoading () {
  loading = Loading.service({
    lock: true,
    text: '努力加载中……',
    background: 'rgba(0, 0, 0, 0.7)'
  })
}
function endLoading () {
  loading.close()
}
const errorHandle = (status, other) => {
  switch (status) {
    case 119:
      warningTip(other)
      break
    // 401: 未登录状态，跳转登录页
    case 400:
      tip(other)
      break
    case 401:
      toLogin()
      break
    // 404请求不存在
    case 404:
      tip('请求的资源不存在！')
      break
    case 500:
      tip('服务器错误！')
      break
    // 清除token并跳转登录页
    case 600:
      // store.commit('mutations/prevUrlName', router.currentRoute.name)
      tip('登录过期，请重新登录')
      setTimeout(() => {
        toLogin()
      }, 1000)
      store.commit('user/userSignout')
      break
    case 606:
      tip('您的账号在异地登录！')
      break
    case 700:
      tip('您没有相关操作权限！')
      break
    default:
      tip('系统异常，请稍后再试！')
  }
}
if (process.env.NODE_ENV === 'development') {
  var instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} else {
  instance = axios.create({
    baseURL: window.g.baseUrl,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
// 设置post请求头
// instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

instance.interceptors.request.use(
  config => {
    // 登录流程控制中，根据本地是否存在token判断用户的登录情况
    // 但是即使token存在，也有可能token是过期的，所以在每次的请求头中携带token
    // 后台根据携带的token判断用户的登录情况，并返回给我们对应的状态码
    // 而后我们可以在响应拦截器中，根据状态码进行一些统一的操作。
    if (router.currentRoute.name !== 'Login') {
      showFullScreenLoading()
    }
    const token = store.state.user.token
    token && (config.headers.Authorization = token)
    return config
  },
  error => Promise.error(error)
)
instance.interceptors.response.use(
  // 请求成功
  res => {
    tryHideFullScreenLoading()
    if (res.status === 200 && res.data.code === 200) {
      isPopMessage = true
      return Promise.resolve(res)
    } else {
      errorHandle(res.data.code, res.data.message)
      isPopMessage = true
      return Promise.reject(res)
    }
  },
  // 请求失败
  error => {
    tryHideFullScreenLoading()
    const { response } = error
    errorHandle(response.status || response, response.data.message)
    isPopMessage = true
    return Promise.reject(response)
  }
)
export default instance
