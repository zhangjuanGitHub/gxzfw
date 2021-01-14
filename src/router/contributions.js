module.exports = [
  {
    path: '/contributions',
    name: 'Contributions',
    meta: {
      title: '策划征稿'
    },
    component: () => import('@/views/contributions/Contributions')
  },
  {
    path: '/contributions/issue/list',
    name: 'IssueList',
    meta: {
      title: '议题列表'
    },
    component: () => import('@/views/contributions/issue/IssueList')
  },
  {
    path: '/contributions/issue/mylist',
    name: 'MyIssueList',
    meta: {
      title: '我的议题'
    },
    component: () => import('@/views/contributions/issue/MyIssue')
  },
  {
    path: '/contributions/issue/write',
    name: 'WriteIssue',
    meta: {
      title: '发起议题'
    },
    component: () => import('@/views/contributions/issue/WriteIssue')
  },
  {
    path: '/contributions/issue/details',
    name: 'IssueDetails',
    meta: {
      title: '议题详情'
    },
    component: () => import('@/views/contributions/issue/IssueDetails')
  },
  {
    path: '/contributions/interview/list',
    name: 'InterviewList',
    meta: {
      title: '约访列表'
    },
    component: () => import('@/views/contributions/interview/InterviewList')
  },
  {
    path: '/contributions/interview/write',
    name: 'WriteInterview',
    meta: {
      title: '发起约访'
    },
    component: () => import('@/views/contributions/interview/WriteInterview')
  },
  {
    path: '/contributions/interview/mylist',
    name: 'MyInterview',
    meta: {
      title: '我的约访'
    },
    component: () => import('@/views/contributions/interview/MyInterview')
  },
  {
    path: '/contributions/interview/details',
    name: 'InterviewDetails',
    meta: {
      title: '约访详情'
    },
    component: () => import('@/views/contributions/interview/InterviewDetails')
  },
  {
    path: '/contributions/online/list',
    name: 'OnlineArticleList',
    meta: {
      title: '在线征稿'
    },
    component: () => import('@/views/contributions/online/OnlineArticleList')
  },
  {
    path: '/contributions/online/mylist',
    name: 'MyArticle',
    meta: {
      title: '我的征稿'
    },
    component: () => import('@/views/contributions/online/MyArticle')
  },
  {
    path: '/contributions/online/write',
    name: 'WriteArticle',
    meta: {
      title: '发起征稿'
    },
    component: () => import('@/views/contributions/online/WriteArticle')
  },
  {
    path: '/contributions/online/article',
    name: 'ArticleList',
    meta: {
      title: '稿件列表'
    },
    component: () => import('@/views/contributions/online/ArticleList')
  },
  {
    path: '/contributions/online/details',
    name: 'ArticleDetail',
    meta: {
      title: '稿件详情'
    },
    component: () => import('@/views/contributions/online/ArticleDetail')
  },
  {
    path: '/contributions/online/myConList',
    name: 'MyContribute',
    meta: {
      title: '我的投稿'
    },
    component: () => import('@/views/contributions/online/MyContribute')
  },
  {
    path: '/contributions/online/draft',
    name: 'MyDraft',
    meta: {
      title: '草稿箱'
    },
    component: () => import('@/views/contributions/online/MyDraft')
  },
  {
    path: '/contributions/online/writeCon',
    name: 'WriteContribute',
    meta: {
      title: '发起投稿'
    },
    component: () => import('@/views/contributions/online/WriteContribute')
  },
  {
    path: '/contributions/online/select',
    name: 'SelectContribute',
    meta: {
      title: '选择投稿'
    },
    component: () => import('@/views/contributions/online/SelectContribute')
  }
]
