/*
 * @Author: weipeng
 * @Description: 路由
 * @Date: 2020-08-17 11:28:53
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-08 09:34:22
 */
module.exports = [
  // {
  //   path: '/articlepublic/manage/matrix',
  //   name: 'ManageMatrix',
  //   meta: {
  //     title: '新媒体矩阵管理',
  //     requireAuth: true
  //   },
  //   component: () => import('@/views/articlepublic/manage/ManageList')
  // },
  // {
  //   path: '/articlepublic/manage/maillist',
  //   name: 'MailList',
  //   meta: {
  //     title: '人员通讯录',
  //     requireAuth: true
  //   },
  //   component: () => import('@/views/articlepublic/manage/MailList')
  // },
  // {
  //   path: '/articlepublic/manage/matrix/details',
  //   name: 'MatrixDetail',
  //   meta: {
  //     title: '响应结果'
  //   },
  //   component: () => import('@/views/articlepublic/manage/ShowMatrix')
  // },
  {
    path: '/articlepublic/manage/accountlist',
    name: 'ManageAccountList',
    meta: {
      title: '账号管理'
    },
    component: () => import('@/views/articlepublic/manage/AccountList')
  },
  {
    path: '/articlepublic/manage/account',
    name: 'ManageAddAccount',
    meta: {
      title: '授权账号管理'
    },
    component: () => import('@/views/articlepublic/manage/Account')
  },
  {
    path: '/articlepublic/manage/list/review',
    name: 'ReList',
    meta: {
      title: '审核中的账号'
    },
    component: () => import('@/views/articlepublic/manage/ReviewList')
  },
  {
    path: '/articlepublic/material/wxmaterial',
    meta: {
      title: '微信发布'
    },
    component: () => import('@/views/articlepublic/material/WxMaterial'),
    children: [
      {
        path: '/articlepublic/material/wxmaterial/local',
        name: 'LocalArticleWx',
        meta: {
          title: '本地稿件'
        },
        component: () => import('@/views/articlepublic/components/LocalArticle')
      },
      {
        path: '/articlepublic/material/wxmaterial/material',
        name: 'MaterialWx',
        meta: {
          title: '素材库'
        },
        component: () => import('@/views/articlepublic/components/Material')
      },
      {
        path: '/articlepublic/material/wxmaterial/record',
        name: 'PublicRecordWx',
        meta: {
          title: '发布记录'
        },
        component: () => import('@/views/articlepublic/components/PublicRecord')
      }
    ]
  },
  {
    path: '/articlepublic/material/wbmaterial',
    meta: {
      title: '微博发布'
    },
    component: () => import('@/views/articlepublic/material/WbMaterial'),
    children: [
      {
        path: '/articlepublic/material/wbmaterial/local',
        name: 'LocalArticleWb',
        meta: {
          title: '本地稿件'
        },
        component: () => import('@/views/articlepublic/components/LocalArticle')
      },
      {
        path: '/articlepublic/material/wbmaterial/material',
        name: 'MaterialWb',
        meta: {
          title: '素材库'
        },
        component: () => import('@/views/articlepublic/components/Material')
      },
      {
        path: '/articlepublic/material/wbmaterial/record',
        name: 'PublicRecordWb',
        meta: {
          title: '发布记录'
        },
        component: () => import('@/views/articlepublic/components/PublicRecord')
      }
    ]
  },
  {
    path: '/articlepublic/material/dymaterial',
    meta: {
      title: '抖音发布'
    },
    component: () => import('@/views/articlepublic/material/DyMaterial'),
    children: [
      {
        path: '/articlepublic/material/dymaterial/local',
        name: 'LocalArticleDy',
        meta: {
          title: '本地稿件'
        },
        component: () => import('@/views/articlepublic/components/LocalArticle')
      },
      {
        path: '/articlepublic/material/dymaterial/material',
        name: 'MaterialDy',
        meta: {
          title: '素材库'
        },
        component: () => import('@/views/articlepublic/components/Material')
      },
      {
        path: '/articlepublic/material/dymaterial/record',
        name: 'PublicRecordDy',
        meta: {
          title: '发布记录'
        },
        component: () => import('@/views/articlepublic/components/PublicRecord')
      }
    ]
  },
  {
    path: '/articlepublic/material/emailpublic',
    name: 'EmailPublic',
    meta: {
      title: '外部投稿'
    },
    component: () => import('@/views/articlepublic/material/EmailPublic')
  },
  {
    path: '/articlepublic/material/compose',
    name: 'Compose',
    meta: {
      title: '稿件组合'
    },
    component: () => import('@/views/articlepublic/material/Compose')
  }
]
