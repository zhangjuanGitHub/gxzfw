import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import mutations from './mutations'
import actions from './actions'
import createPersistedState from 'vuex-persistedstate'
Vue.use(Vuex)
const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    user,
    mutations,
    actions
  },
  strict: debug,
  plugins: [
    createPersistedState({
      key: 'user',
      storage: window.localStorage
    })
  ]
})
