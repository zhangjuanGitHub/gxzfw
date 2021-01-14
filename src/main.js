import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'
import ElementUI from 'element-ui'
import { debounce, throttle } from 'lodash'
import directives from './libs/global_directive' // 全局指令
import components from './libs/global_components' // 全局组件
import { isPermission, getMonth } from './libs/tools' // 全局方法
import api from './api/api'
import axios from './libs/axios'
import './assets/css/reset.css'
import './assets/css/public.css'
import './assets/css/change-ele.css'
import './assets/iconfont/iconfont.css'
import jsPlumb from 'jsplumb'
// import '../public/UEditor/ueditor.config'
// import '../public/UEditor/ueditor.all.min.js'
// import '../public/UEditor/lang/zh-cn/zh-cn.js'
// import '../public/UEditor/ueditor.parse.min.js'
// 引入动态效果
Vue.config.productionTip = false
Vue.prototype.$api = api
Vue.prototype.$http = axios
Vue.prototype.$debounce = debounce
Vue.prototype.$throttle = throttle
Vue.prototype.$isPermission = isPermission
Vue.prototype.$_getMonth = getMonth
Vue.prototype.$jsPlumb = jsPlumb.jsPlumb
Vue.use(ElementUI)
Vue.use(directives)
Vue.use(components)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
