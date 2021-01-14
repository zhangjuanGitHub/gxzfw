const state = {
  userInfo: null, // 用户信息
  token: null,
  userOne: 1,
  userTwo: 1,
  noReadMessageNum: null, // 未读系统消息
  chatMessageList: [], // 站内消息列表（聊天）
  chatMessageNum: 0, // 站内消息条数，控制查看更多显示隐藏
  singleScrollBottom: [], // 单发信息，每次滚动到最底部
  messageChat: {} // 判断外层列表是否有当前条新消息，有则消息状态改为有消息，没有则新添加一条
}
const getters = {
  getChatMessageList: state => {
    return state.chatMessageList
  }
}
const mutations = {
  // 获取token
  userToken (state, val) {
    state.token = val
  },
  // 获取用户信息
  userInfo (state, val) {
    state.userInfo = val
    state.noReadMessageNum = val.noReadMessageNum // 消息数量
  },
  // 更新未读消息(减)
  messageNumMinus (state, val) {
    if (state.noReadMessageNum) state.noReadMessageNum = state.noReadMessageNum - 1
  },
  // 更新未读消息(加)
  messageNumAdd (state, val) {
    state.noReadMessageNum = state.noReadMessageNum + 1
  },
  // 拉取历史站内消息、更多消息
  chatMoreMessageList (state, val) {
    state.chatMessageNum = val.length
    state.chatMessageList.unshift(...val.reverse())
  },
  // 单个回复聊天消息
  chatSingleMessageList (state, val) {
    state.singleScrollBottom = val
    state.chatMessageList.push(...val.content)
    state.messageChat = val.messageChat
  },
  // 清空站内消息
  clearChatMessageList (state) {
    state.chatMessageList = []
    state.singleScrollBottom = []
    state.chatMessageNum = 0
  },
  // 退出
  userSignout (state) {
    state.userInfo = null
    state.token = null
    sessionStorage.clear()
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  getters
}
