module.exports = [
  // 网评管理
  {
    path: '/reviews/task/binding',
    name: 'ReviewsBinding',
    meta: {
      title: '政法网军'
    },
    component: () => import('@/views/reviews/task/Binding')
  },
  {
    path: '/reviews/task/issued',
    name: 'ReviewsIssued',
    meta: {
      title: '任务下发'
    },
    component: () => import('@/views/reviews/task/Issued')
  },
  {
    path: '/reviews/task/issued/add',
    name: 'ReviewsIssuedAdd',
    meta: {
      title: '任务发布'
    },
    component: () => import('@/views/reviews/task/AddIssued')
  },
  {
    path: '/reviews/task/issued/view',
    name: 'ReviewsIssuedView',
    meta: {
      title: '任务查看'
    },
    component: () => import('@/views/reviews/task/IssuedView')
  },
  {
    path: '/reviews/task/receive/feedback',
    name: 'ReviewsFeedback',
    meta: {
      title: '任务反馈'
    },
    component: () => import('@/views/reviews/task/Feedback')
  },
  {
    path: '/reviews/task/receive',
    name: 'ReviewsReceive',
    meta: {
      title: '执行任务'
    },
    component: () => import('@/views/reviews/task/Receive')
  },
  {
    path: '/reviews/task/assessment',
    name: 'ReviewsAssess',
    meta: {
      title: '任务考核'
    },
    component: () => import('@/views/reviews/task/Assessment')
  },
  {
    path: '/reviews/task/recording',
    name: 'ReviewsRecording',
    meta: {
      title: '工作记录'
    },
    component: () => import('@/views/reviews/task/Recording')
  },
  {
    path: '/reviews/caliber/box/public',
    name: 'CaliberPublic',
    meta: {
      title: '公共素材'
    },
    component: () => import('@/views/reviews/caliber/Public')
  },
  {
    path: '/reviews/caliber/box/personal',
    name: 'CaliberPersonal',
    meta: {
      title: '个人素材'
    },
    component: () => import('@/views/reviews/caliber/Personal')
  },
  {
    path: '/reviews/handle/admin',
    name: 'ReviewsAdmin',
    meta: {
      title: '平台账号备忘录'
    },
    component: () => import('@/views/reviews/HandleAdmin')
  }
]
