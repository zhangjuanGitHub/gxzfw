import axios from '../libs/axios'
import api from '../api/api'
import store from './index'
import { Message } from 'element-ui'
const tip = msg => {
  Message.error({
    message: msg,
    duration: 1000,
    forbidClick: true
  })
}
const actions = {
  getLoginInfoAction () {
    axios.get(api.captcha)
      .then(res => {
        let loginInfo = {
          websiteName: res.data.data.websiteName,
          imgCode: res.data.message
        }
        store.commit('mutations/setLoginInfo', loginInfo)
      })
      .catch((err) => {
        tip(err.message)
        sessionStorage.clear() // 清除缓存
      })
  }
}
export default {
  namespaced: true, // 命名空间
  actions
}
