import Vue from 'vue'
import Router from 'vue-router'
import store from '../store/index'
import assessment from './assessment'
import contributions from './contributions'
import message from './message'
import system from './system'
import propagation from './propagation'
import repository from './repository'
import Home from '@/views/Home'
import articlepublic from './articlepublic'
import Login from '@/views/auth/Login'
// import { mapState } from 'vuex'
Vue.use(Router)
let routes = [
  // 重定向
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/auth/login',
    name: 'Login',
    meta: {
      title: '登录'
    },
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    meta: {
      title: '首页'
    },
    component: Home
  },
  {
    path: '/null',
    name: 'Null',
    meta: {
      title: '功能模块正在开发,敬请期待~'
    },
    component: () => import('@/views/Null.vue')
  },
  {
    path: '/switch',
    name: 'Switch',
    meta: {
      title: '功能模块正在开发,敬请期待~'
    },
    component: () => import('@/views/auth/Switch.vue')
  },
  {
    path: '/empty',
    name: 'EmptyView',
    meta: {
      title: ''
    },
    component: () => import('../components/EmptyView')
  }
]
routes = routes.concat(assessment) // 管理与考核
routes = routes.concat(contributions) // 策划征稿
routes = routes.concat(message) // 中央信息厨房
routes = routes.concat(system) // 系统管理
routes = routes.concat(articlepublic) // 稿件发布
routes = routes.concat(repository) // 媒体资源库
routes = routes.concat(propagation) // 传播力监测
const router = new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? window.g.base : '/',
  linkActiveClass: 'is-active',
  routes,
  // 滚动行为
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
router.beforeEach((to, from, next) => {
  // 验证登录
  if (store.state.user.token) {
    next()
  } else {
    if (to.name === 'Login') {
      if (store.state.user.token) {
        this.$message.error('已经登录！')
        this.$router.replace({ name: 'Home' })
      } else {
        store.dispatch('actions/getLoginInfoAction') // 获取验证码、系统名称
      }
      next()
    } else {
      next({ name: 'Login' })
    }
  }
  // next()
  if (to.matched.some(r => r.meta.requireAuth)) {
    if (!store.state.user.token) {
      next({ name: 'Login' })
      // store.commit('mutations/prevUrlName', to.name)
      store.commit('user/USER_SIGNOUT')
      store.commit('user/USER_TOKEN', null)
    } else {
      next()
    }
  } else {
    next()
  }
  if (to.name !== null) {
    if (!store.state.user.token) {
      next({ name: 'Login' })
    } else {
      next()
    }
    // store.commit('mutations/prevUrlName', to.name)
    // store.commit('user/USER_SIGNOUT')
    // store.commit('user/USER_TOKEN', null)
  } else {
    next()
  }
  // meta title
  let routeWebsiteName = store.state.mutations.setWebSiteName
  if (to.meta.title) {
    if (to.meta.title === '首页') {
      document.title = routeWebsiteName || '融媒体应用系统'
    } else {
      document.title = to.meta.title + '-' + routeWebsiteName || '融媒体应用系统'
    }
  } else {
    document.title = routeWebsiteName || '融媒体应用系统'
  }
})
export default router
