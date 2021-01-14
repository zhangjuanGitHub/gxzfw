module.exports = [
  {
    path: '/assessment/list',
    component: () => import('@/views/assessment/AssessmentBox.vue'),
    children: [
      {
        path: 'wx',
        name: 'AssessmentWx',
        meta: {
          title: '微信考核'
        },
        component: () => import('@/views/assessment/assessment/Wx')
      },
      {
        path: 'wb',
        name: 'AssessmentWb',
        meta: {
          title: '微博考核'
        },
        component: () => import('@/views/assessment/assessment/Wb')
      },
      {
        path: 'website',
        name: 'AssessmentWebsite',
        meta: {
          title: '门户网站考核'
        },
        component: () => import('@/views/assessment/assessment/Website')
      },
      {
        path: 'toutiao',
        name: 'AssessmentToutiao',
        meta: {
          title: '头条考核'
        },
        component: () => import('@/views/assessment/assessment/TouTiao')
      },
      {
        path: 'yidian',
        name: 'AssessmentYiDian',
        meta: {
          title: '一点考核'
        },
        component: () => import('@/views/assessment/assessment/YiDian')
      }
    ]
  },
  {
    path: '/assessment/response',
    name: 'Response',
    meta: {
      title: '响应性评估'
    },
    component: () => import('@/views/assessment/Response.vue')
  },
  {
    path: '/assessment/construct',
    component: () => import('@/views/assessment/Construct.vue'),
    children: [
      {
        path: 'total',
        name: 'AssessmentTotal',
        meta: {
          title: '总体考核'
        },
        component: () => import('@/views/assessment/assessment/Total')
      },
      {
        path: 'totalassessment',
        name: 'TotalAssessment',
        meta: {
          title: '总榜核算'
        },
        component: () => import('@/views/assessment/assessment/TotalAssessment')
      },
      {
        path: 'setting',
        name: 'AssessmentSetting',
        meta: {
          title: '考核设置'
        },
        component: () => import('@/views/assessment/assessment/Setting')
      }
    ]
  },
  {
    path: '/assessment/contribution',
    name: 'Contribution',
    component: () => import('@/views/assessment/Contribution'),
    children: [
      {
        path: 'manuscript',
        name: 'Manuscript',
        meta: {
          title: '单位统计'
        },
        component: () => import('@/views/assessment/assessment/Manuscript')
      },
      {
        path: 'personal',
        name: 'Personal',
        meta: {
          title: '个人统计'
        },
        component: () => import('@/views/assessment/assessment/Personal')
      }
    ]
  },
  {
    path: '/assessment/propaganda',
    name: 'Propaganda',
    component: () => import('@/views/assessment/Propaganda'),
    children: [
      {
        path: 'summary',
        name: 'Summary',
        meta: {
          title: '上报汇总'
        },
        component: () => import('@/views/assessment/propaganda/Summary')
      },
      {
        path: 'achievement',
        name: 'Achievement',
        meta: {
          title: '成果上报'
        },
        component: () => import('@/views/assessment/propaganda/Achievement')
      }
    ]
  },
  {
    path: '/assessment/account',
    name: 'MatrixList',
    component: () => import('@/views/assessment/AssessmentList'),
    children: [
      {
        path: 'matrix',
        name: 'AccountMatrix',
        meta: {
          title: '矩阵管理'
        },
        component: () => import('@/views/assessment/account/Matrix')
      },
      {
        path: 'matrix/details',
        name: 'MatrixDetails',
        meta: {
          title: '转发结果'
        },
        component: () => import('@/views/assessment/account/ShowMatrix')
      },
      {
        path: 'list',
        name: 'AssessmentAccountList',
        meta: {
          title: '账号管理'
        },
        component: () => import('@/views/assessment/account/AccountList')
      },
      {
        path: 'list/add',
        name: 'AssessmentAddAccount',
        meta: {
          title: '添加账号'
        },
        component: () => import('@/views/assessment/account/AddAccount')
      },
      {
        path: 'list/review',
        name: 'ReviewList',
        meta: {
          title: '审核中的账号'
        },
        component: () => import('@/views/assessment/account/ReviewList')
      }
    ]
  },
  {
    path: '/assessment/address',
    component: () => import('@/views/assessment/AddressBook'),
    children: [
      {
        path: 'directly',
        name: 'AddressDirectly',
        meta: {
          title: '人员通讯录'
        },
        component: () => import('@/views/userset/book/Directly')
      },
      {
        path: 'directly/binding1',
        name: 'AddressBinding1',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding1')
      },
      {
        path: 'newsletter/binding2',
        name: 'AddressBinding2',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding2')
      },
      {
        path: 'review/binding3',
        name: 'AddressBinding3',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding3')
      },
      {
        path: 'expert/binding4',
        name: 'AddressBinding4',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding4')
      },
      {
        path: 'bookbigv/binding5',
        name: 'AddressBinding5',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding5')
      },
      {
        path: 'newsletter',
        name: 'AddressNewsletter',
        meta: {
          title: '通讯员团队'
        },
        component: () => import('@/views/userset/book/Newsletter')
      },
      {
        path: 'review',
        name: 'AddressReview',
        meta: {
          title: '网评员团队'
        },
        component: () => import('@/views/userset/book/Review')
      },
      {
        path: 'expert',
        name: 'AddressExpert',
        meta: {
          title: '专家学者团队'
        },
        component: () => import('@/views/userset/book/Expert')
      },
      {
        path: 'bookbigv',
        name: 'AddressBookbigv',
        meta: {
          title: '网红大V团队'
        },
        component: () => import('@/views/userset/book/Bigv')
      }
    ]
  }
]
