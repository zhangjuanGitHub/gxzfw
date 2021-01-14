module.exports = [
  {
    path: '/message',
    name: 'MessageHome',
    meta: {
      title: '中央信息厨房'
    },
    component: () => import('@/views/message/Message')
  },
  {
    path: '/message/articlebox',
    name: 'MessageArticleBox',
    meta: {
      title: '最新稿件'
    },
    component: () => import('@/views/message/Article')
  },
  {
    path: '/message/articlebox/teammessage',
    name: 'TeamMessage',
    meta: {
      title: '团队推荐'
    },
    component: () => import('@/views/message/articleBox/TeamMessage')
  },
  {
    path: '/message/articlebox/contribute',
    name: 'Contribute',
    meta: {
      title: '我要投稿'
    },
    component: () => import('@/views/message/articleBox/Contribute')
  },
  {
    path: '/message/articlebox/mymessageList',
    name: 'MyMessageList',
    meta: {
      title: '我的稿件'
    },
    component: () => import('@/views/message/articleBox/MyMessageList')
  },
  {
    path: '/message/articlebox/roughList',
    name: 'RoughList',
    meta: {
      title: '稿件校对'
    },
    component: () => import('@/views/message/articleBox/RoughList')
  },
  {
    path: '/message/articlebox/auditlist',
    name: 'AuditList',
    meta: {
      title: '审核稿件',
      requireAuth: true,
      permission: [306]
    },
    component: () => import('@/views/message/articleBox/AuditList')
  },
  {
    path: '/message/articlebox/release',
    name: 'Release',
    meta: {
      title: '发布稿件',
      requireAuth: true,
      permission: [307]
    },
    component: () => import('@/views/message/articleBox/Release')
  },
  {
    path: '/message/manage/matrix',
    name: 'ManageMatrix',
    meta: {
      title: '新媒体矩阵管理',
      requireAuth: true
    },
    component: () => import('@/views/message/manage/ManageList')
  },
  {
    path: '/message/crosseditor',
    name: 'CrossEditor',
    meta: {
      title: '跨平台编辑器',
      requireAuth: true
    },
    component: () => import('@/views/message/CrossEditor')
  },
  {
    path: '/message/manage/matrix/details',
    name: 'MatrixDetail',
    meta: {
      title: '响应结果'
    },
    component: () => import('@/views/message/manage/ShowMatrix')
  },
  // {
  //   path: '/message/manage/list',
  //   name: 'ManageAccountList',
  //   meta: {
  //     title: '账号管理'
  //   },
  //   component: () => import('@/views/message/manage/AccountList')
  // },
  // {
  //   path: '/message/manage/account',
  //   name: 'ManageAddAccount',
  //   meta: {
  //     title: '授权账号管理'
  //   },
  //   component: () => import('@/views/message/manage/Account')
  // },
  // {
  //   path: '/message/manage/list/review',
  //   name: 'ReList',
  //   meta: {
  //     title: '审核中的账号'
  //   },
  //   component: () => import('@/views/message/manage/ReviewList')
  // },
  {
    path: '/message/newscloud',
    name: 'NewsCloud',
    component: () => import('@/views/message/NewsBox'),
    children: [
      {
        path: 'wx',
        name: 'NewsCloudWx',
        meta: {
          title: '微信'
        },
        component: () => import('@/views/message/news/Wx')
      },
      {
        path: 'wb',
        name: 'NewsCloudWb',
        meta: {
          title: '微博'
        },
        component: () => import('@/views/message/news/Wb')
      },
      {
        path: 'wz',
        name: 'NewsCloudWz',
        meta: {
          title: '网站'
        },
        component: () => import('@/views/message/news/Wx')
      },
      {
        path: 'tt',
        name: 'NewsCloudTt',
        meta: {
          title: '今日头条'
        },
        component: () => import('@/views/message/news/TouTiao')
      },
      {
        path: 'dy',
        name: 'NewsCloudDy',
        meta: {
          title: '抖音'
        },
        component: () => import('@/views/message/news/Wx')
      }
    ]
  },
  {
    path: '/message/articlebox/copydetail',
    name: 'CopyDetail',
    meta: {
      title: '关联稿件'
    },
    component: () => import('@/views/message/articleBox/CopyDetail')
  },
  {
    path: '/message/articlebox/publishdetail',
    name: 'PublishDetail',
    meta: {
      title: '发布情况'
    },
    component: () => import('@/views/message/articleBox/PublishDetail')
  },
  {
    path: '/message/articlebox/outpublishdetail',
    name: 'OutPublishDetail',
    meta: {
      title: '外部投稿'
    },
    component: () => import('@/views/message/articleBox/OutPublishDetail')
  },
  {
    path: '/message/articlebox/manuscriptdetail',
    name: 'ManuscriptDetail',
    meta: {
      title: '稿件详情'
    },
    component: () => import('@/views/message/articleBox/ManuscriptDetail')
  },
  {
    path: '/message/articlebox/auditdetail',
    name: 'AuditDetail',
    meta: {
      title: '审核详情'
    },
    component: () => import('@/views/message/articleBox/AuditDetail')
  },
  {
    path: '/message/videobox',
    name: 'MessageVideo',
    meta: {
      title: '视频池'
    },
    component: () => import('@/views/message/Video')
  },
  {
    path: '/message/videobox/myvideolist',
    name: 'MyVideoList',
    meta: {
      title: '我的视频'
    },
    component: () => import('@/views/message/videoBox/MyVideoList')
  },
  {
    path: '/message/videobox/uploadvideo',
    name: 'UploadVideo',
    meta: {
      title: '新建视频'
    },
    component: () => import('@/views/message/videoBox/UploadVideo')
  },
  {
    path: '/message/imagebox',
    name: 'MessageImage',
    meta: {
      title: '图片池'
    },
    component: () => import('@/views/message/Image')
  },
  {
    path: '/message/imagebox/myimagelist',
    name: 'MyImageList',
    meta: {
      title: '我的相册'
    },
    component: () => import('@/views/message/imageBox/MyImageList')
  },
  {
    path: '/message/imagebox/createimage',
    name: 'CreateImage',
    meta: {
      title: '新建相册'
    },
    component: () => import('@/views/message/imageBox/CreateImage')
  },
  {
    path: '/message/imagebox/imagedetails',
    name: 'ImageDetails',
    meta: {
      title: '图片详情'
    },
    component: () => import('@/views/message/imageBox/ImageDetails')
  },
  // {
  //   path: '/message/intelligence',
  //   component: () => import('@/views/message/Intellect'),
  //   children: [
  //     {
  //       path: 'intelligencenew',
  //       component: () => import('@/views/message/intelligence/IntelligenceNew'),
  //       children: [
  //         {
  //           path: 'major',
  //           name: 'Major',
  //           meta: {
  //             title: '重大节日'
  //           },
  //           component: () => import('@/views/message/articleBox/Major')
  //         },
  //         {
  //           path: 'history',
  //           name: 'History',
  //           meta: {
  //             title: '历史上的今天'
  //           },
  //           component: () => import('@/views/message/articleBox/History')
  //         }
  //       ]
  //     }
  //   ]
  // },
  {
    path: '/message/intelligence/intelligenceeditor',
    name: 'IntelligenceEditor',
    meta: {
      title: '智能编辑'
    },
    component: () => import('@/views/message/intelligence/IntelligenceEditor')
  },
  {
    path: '/message/intelligence/template',
    name: 'Template',
    meta: {
      title: '写作模板'
    },
    component: () => import('@/views/message/intelligence/Template')
  },
  {
    path: '/message/intelligence/intelligencenew/major',
    name: 'Major',
    meta: {
      title: '重大节日'
    },
    component: () => import('@/views/message/articleBox/Major')
  },
  {
    path: '/message/intelligence/intelligencenew/history',
    name: 'History',
    meta: {
      title: '历史上的今天'
    },
    component: () => import('@/views/message/articleBox/History')
  },
  {
    path: '/message/components/calendar',
    name: 'Calendar',
    meta: {
      title: 'Calendar'
    },
    component: () => import('@/views/message/components/Calendar')
  }
]
