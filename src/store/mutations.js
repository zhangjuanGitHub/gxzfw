// import axios from '../libs/axios'
// import api from '../api/api'
// import { Message } from 'element-ui'
// const tip = msg => {
//   Message.error({
//     message: msg,
//     duration: 1000,
//     forbidClick: true
//   })
// }
const state = {
  loading: false,
  prevUrlName: null,
  permissionList: [],
  columnMenu: null,
  captchaInfo: {}, // 登录信息（验证码、网站名称、是否登陆、token）
  setWebSiteName: '' // 网站名称
}
// getters
const getters = {
  getPermission: state => {
    let permission = {}
    for (let i = 0; i < state.permissionList.length; i++) {
      permission[state.permissionList[i]] = state.permissionList[i]
    }
    return permission
  },
  permissionList: state => {
    return state.permissionList
  },
  columnMenu: state => {
    return state.columnMenu
  }
}
const mutations = {
  // 清空
  emptyState (state) {
    state = {}
  },
  // 全局加载中
  loading (state, val) {
    state.loading = val
  },
  // 登录信息（验证码、网站名称、是否登陆、token）
  setLoginInfo (state, valJson) {
    state.captchaInfo = valJson
  },
  // 单独网站名称
  setWebSiteName (state, val) {
    state.setWebSiteName = val
  },
  // 清除url
  clearPrevUrlName (state, val) {
    state.prevUrlName = val
  },
  // 保存url
  prevUrlName (state, val) {
    state.prevUrlName = val
  },
  // 权限列表
  permissionList (state, val) {
    state.permissionList = val
  },
  // 传播力监测菜单
  columnMenu (state, val) {
    state.columnMenu = val
  }
}
export default {
  namespaced: true,
  state,
  getters,
  mutations
}
