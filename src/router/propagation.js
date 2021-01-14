module.exports = [
  {
    path: '/propagation/exponent',
    name: 'EffectExponent',
    meta: {
      title: '传播力指数',
      requireAuth: true
    },
    component: () => import('@/views/propagation/EffectExponent'),
    children: [
      {
        path: '/propagation/exponent/wz',
        name: 'WebMonitor',
        meta: {
          title: '网站传播力',
          requireAuth: true
        },
        component: () => import('@/views/propagation/monitor/WebMonitor')
      },
      {
        path: '/propagation/exponent/wx',
        name: 'WxMonitor',
        meta: {
          title: '微信传播力',
          requireAuth: true
        },
        component: () => import('@/views/propagation/monitor/WxMonitor')
      },
      {
        path: '/propagation/exponent/wb',
        name: 'WbMonitor',
        meta: {
          title: '微博传播力',
          requireAuth: true
        },
        component: () => import('@/views/propagation/monitor/wbMonitor')
      }
    ]
  },
  {
    path: '/propagation/concern',
    name: 'EffectConcern',
    meta: {
      title: '媒体关注度',
      requireAuth: true
    },
    component: () => import('@/views/propagation/EffectConcern')
  },
  {
    path: '/propagation/articles',
    name: 'EffectArticle',
    meta: {
      title: '文章列表传播',
      requireAuth: true
    },
    component: () => import('@/views/propagation/EffectArticle')
  },
  {
    path: '/propagation/allmonitor/analysis',
    name: 'Analysis',
    meta: {
      title: '传播力分析',
      requireAuth: true
    },
    component: () => import('@/views/propagation/allmonitor/Analysis')
  },
  {
    path: '/propagation/articlesmonitor',
    name: 'EffectArticleMonitor',
    meta: {
      title: '文章实时监测',
      requireAuth: true
    },
    component: () => import('@/views/propagation/EffectArticleMonitor')
  },
  // {
  //   path: '/propagation/monitor/webmonitor',
  //   name: 'WebMonitor',
  //   meta: {
  //     title: '网站传播力',
  //     requireAuth: true
  //   },
  //   component: () => import('@/views/propagation/monitor/WebMonitor')
  // },
  {
    path: '/propagation/monitor/moremonitor',
    name: 'MoreMonitor',
    meta: {
      title: '网站传播力',
      requireAuth: true
    },
    component: () => import('@/views/propagation/monitor/MoreMonitor')
  },
  {
    path: '/propagation/center',
    name: 'DataCenter',
    component: () => import('@/views/propagation/DataCenter'),
    children: [
      {
        path: 'wx',
        name: 'DataCenterWx',
        meta: {
          title: '微信动态'
        },
        component: () => import('@/views/propagation/dataCenter/Wx')
      },
      {
        path: 'wb',
        name: 'DataCenterWb',
        meta: {
          title: '微博动态'
        },
        component: () => import('@/views/propagation/dataCenter/Wb')
      },
      {
        path: 'website',
        name: 'DataCenterWebsite',
        meta: {
          title: '网站动态'
        },
        component: () => import('@/views/propagation/dataCenter/Website')
      },
      {
        path: 'toutiao',
        name: 'DataCenterTouTiao',
        meta: {
          title: '今日头条动态'
        },
        component: () => import('@/views/propagation/dataCenter/TouTiao')
      },
      {
        path: 'yidian',
        name: 'DataCenterYiDian',
        meta: {
          title: '一点资讯动态'
        },
        component: () => import('@/views/propagation/dataCenter/YiDian')
      },
      {
        path: 'douyin',
        name: 'DataCenterDouYin',
        meta: {
          title: '抖音动态'
        },
        component: () => import('@/views/propagation/dataCenter/DouYin')
      },
      {
        path: 'centerdetail',
        name: 'CenterDetail',
        meta: {
          title: '账户详情'
        },
        component: () => import('@/views/propagation/starAccount/AccountDetail')
      },
      {
        path: 'userlist',
        name: 'UserList',
        meta: {
          title: '用户列表'
        },
        component: () => import('@/views/propagation/dataCenter/UserList')
      }
    ]
  },
  // 星标账户
  {
    path: '/propagation/star',
    name: 'StarAccount',
    component: () => import('@/views/propagation/StarAccount'),
    children: [
      {
        path: 'wx',
        name: 'StarAccountWx',
        meta: {
          title: '微信'
        },
        component: () => import('@/views/propagation/starAccount/Wx')
      },
      {
        path: 'wb',
        name: 'StarAccountWb',
        meta: {
          title: '微博'
        },
        component: () => import('@/views/propagation/starAccount/Wb')
      },
      {
        path: 'website',
        name: 'StarAccountWebsite',
        meta: {
          title: '网站'
        },
        component: () => import('@/views/propagation/starAccount/Website')
      },
      {
        path: 'toutiao',
        name: 'StarAccountTouTiao',
        meta: {
          title: '头条'
        },
        component: () => import('@/views/propagation/starAccount/TouTiao')
      },
      {
        path: 'douyin',
        name: 'StarAccountDouYin',
        meta: {
          title: '抖音'
        },
        component: () => import('@/views/propagation/starAccount/DouYin')
      },
      {
        path: 'yidian',
        name: 'StarAccountYiDian',
        meta: {
          title: '一点资讯'
        },
        component: () => import('@/views/propagation/starAccount/YiDian')
      },
      {
        path: 'accountdetail',
        name: 'AccountDetail',
        meta: {
          title: '账户详情'
        },
        component: () => import('@/views/propagation/starAccount/AccountDetail')
      }
    ]
  },
  // 设置
  {
    path: '/propagation/setup',
    name: 'SetUp',
    component: () => import('@/views/propagation/SetUp'),
    children: [
      {
        path: 'column',
        name: 'SetColumn',
        meta: {
          title: '栏目设置'
        },
        component: () => import('@/views/propagation/setup/SetColumn')
      },
      {
        path: 'account',
        name: 'SetAccount',
        meta: {
          title: '账户设置'
        },
        component: () => import('@/views/propagation/setup/SetAccount')
      },
      {
        path: 'appendcolum',
        name: 'AppendColum',
        meta: {
          title: '添加账户'
        },
        component: () => import('@/views/propagation/setup/AppendColum')
      },
      {
        path: 'addaccount',
        name: 'AddAccount',
        meta: {
          title: '新增账户'
        },
        component: () => import('@/views/propagation/setup/AddAccount')
      },
      {
        path: 'columndetail',
        name: 'ColumnDetail',
        meta: {
          title: '栏目详情'
        },
        component: () => import('@/views/propagation/setup/ColumnDetail')
      }
    ]
  }
]
