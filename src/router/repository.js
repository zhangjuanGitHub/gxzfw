module.exports = [
  {
    path: '/repository/jc',
    name: 'RepositoryBox',
    component: () => import('@/views/repository/RepositoryBox'),
    children: [
      {
        path: 'inspect',
        name: 'Inspect',
        meta: {
          title: '政法要闻'
        },
        component: () => import('@/views/repository/Inspect')
      }
    ]
  },
  {
    path: '/repository/media',
    component: () => import('@/views/repository/NewMediaBox'),
    children: [
      {
        path: 'wx',
        name: 'NewMediaWx',
        meta: {
          title: '微信'
        },
        component: () => import('@/views/repository/newMedia/Wx')
      },
      {
        path: 'wb',
        name: 'NewMediaWb',
        meta: {
          title: '微博'
        },
        component: () => import('@/views/repository/newMedia/Wb')
      },
      {
        path: 'douy',
        name: 'NewMediaDouy',
        meta: {
          title: '抖音'
        },
        component: () => import('@/views/repository/newMedia/Douy')
      },
      {
        path: 'tout',
        name: 'NewMediaTout',
        meta: {
          title: '今日头条'
        },
        component: () => import('@/views/repository/newMedia/Tout')
      }
    ]
  },
  {
    path: '/repository/ranking',
    component: () => import('@/views/repository/HotRankingBox'),
    children: [
      {
        path: 'wx',
        name: 'HotRankingWx',
        meta: {
          title: '微信'
        },
        component: () => import('@/views/repository/ranking/Wx')
      },
      {
        path: 'wb',
        name: 'HotRankingWb',
        meta: {
          title: '微博'
        },
        component: () => import('@/views/repository/ranking/Wb')
      },
      {
        path: 'tout',
        name: 'HotRankingTout',
        meta: {
          title: '今日头条'
        },
        component: () => import('@/views/repository/ranking/Tout')
      }
    ]
  },
  // {
  //   path: '/repository/ranking',
  //   name: 'Ranking',
  //   meta: {
  //     title: '热点排行'
  //   },
  //   component: () => import('@/views/repository/Ranking')
  // },
  {
    path: '/repository/clap',
    name: 'ClapAtWill',
    meta: {
      title: '随手拍'
    },
    component: () => import('@/views/repository/ClapAtWill')
  },
  {
    path: '/repository/topic',
    name: 'TopicList',
    meta: {
      title: '专题列表'
    },
    component: () => import('@/views/repository/TopicList')
  },
  {
    path: '/repository/trace',
    name: 'Trace',
    meta: {
      title: '传播路径'
    },
    component: () => import('@/views/repository/Trace')
  },
  {
    path: '/repository/public/image',
    name: 'publicImage',
    meta: {
      title: '图片库',
      requireAuth: true
    },
    component: () => import('@/views/repository/public/ImageList')
  },
  {
    path: '/repository/public/video',
    name: 'publicVideo',
    meta: {
      title: '视频库',
      requireAuth: true
    },
    component: () => import('@/views/repository/public/VideoList')
  },
  {
    path: '/repository/person/image',
    name: 'personImage',
    meta: {
      title: '图片库',
      requireAuth: true
    },
    component: () => import('@/views/repository/person/ImageList')
  },
  {
    path: '/repository/person/video',
    name: 'personVideo',
    meta: {
      title: '视频库',
      requireAuth: true
    },
    component: () => import('@/views/repository/person/VideoList')
  },
  {
    path: '/repository/newscloud',
    name: 'NewCloud',
    component: () => import('@/views/repository/NewsBox'),
    children: [
      {
        path: 'wx',
        name: 'NewCloudWx',
        meta: {
          title: '微信'
        },
        component: () => import('@/views/repository/news/Wx')
      },
      {
        path: 'wb',
        name: 'NewCloudWb',
        meta: {
          title: '微博'
        },
        component: () => import('@/views/repository/news/Wb')
      },
      {
        path: 'wz',
        name: 'NewCloudWz',
        meta: {
          title: '网站'
        },
        component: () => import('@/views/repository/news/Website')
      },
      {
        path: 'tt',
        name: 'NewCloudTt',
        meta: {
          title: '今日头条'
        },
        component: () => import('@/views/repository/news/TouTiao')
      },
      {
        path: 'dy',
        name: 'NewCloudDy',
        meta: {
          title: '抖音'
        },
        component: () => import('@/views/repository/news/Wx')
      }
    ]
  },
  {
    path: '/repository/publicnews',
    name: 'PublicNews',
    component: () => import('@/views/repository/PublicNewsBox'),
    children: [
      {
        path: 'wx',
        name: 'PublicNewsWx',
        meta: {
          title: '微信'
        },
        component: () => import('@/views/repository/publicNews/Wx')
      },
      {
        path: 'wb',
        name: 'PublicNewsWb',
        meta: {
          title: '微博'
        },
        component: () => import('@/views/repository/publicNews/Wb')
      },
      {
        path: 'wz',
        name: 'PublicNewsWz',
        meta: {
          title: '网站'
        },
        component: () => import('@/views/repository/publicNews/Website')
      },
      {
        path: 'tt',
        name: 'PublicNewsTt',
        meta: {
          title: '今日头条'
        },
        component: () => import('@/views/repository/publicNews/TouTiao')
      }
    ]
  },
  {
    path: '/repository/publiccreateimage',
    name: 'PublicCreateImage',
    meta: {
      title: '新建相册',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/PublicCreateImage')
  },
  {
    path: '/repository/personcreateimage',
    name: 'PersonCreateImage',
    meta: {
      title: '新建相册',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/PersonCreateImage')
  },
  {
    path: '/repository/publicuploadvideo',
    name: 'PublicUploadVideo',
    meta: {
      title: '上传视频',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/PublicUploadVideo')
  },
  {
    path: '/repository/personuploadvideo',
    name: 'PersonUploadVideo',
    meta: {
      title: '上传视频',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/PersonUploadVideo')
  },
  {
    path: '/repository/playvideo',
    name: 'PlayVideo',
    meta: {
      title: '播放视频',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/PlayVideo')
  },
  {
    path: '/repository/picturedetail/:id/:isPublic',
    name: 'pictureDetail',
    meta: {
      title: '图片库',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/pictureDetail')
  },
  {
    path: '/repository/audiodetail/:id/:isPublic/:item',
    name: 'AudioDetail',
    meta: {
      title: '视频库',
      requireAuth: true
    },
    component: () => import('@/views/repository/components/audioDetail')
  }
]
