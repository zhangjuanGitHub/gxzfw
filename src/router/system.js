module.exports = [
  {
    path: '/system/department',
    name: 'SystemDepartment',
    meta: {
      title: '单位管理'
    },
    component: () => import('@/views/system/SystemDepartment')
  },
  {
    path: '/system/branch',
    name: 'SystemBranch',
    meta: {
      title: '部门管理'
    },
    component: () => import('@/views/system/SystemBranch')
  },
  {
    path: '/system/area',
    name: 'SystemArea',
    meta: {
      title: '地区管理'
    },
    component: () => import('@/views/system/SystemArea')
  },
  {
    path: '/system/department/add',
    name: 'SystemDepartmentAdd',
    meta: {
      title: '添加单位'
    },
    component: () => import('@/views/system/DepartmentAdd')
  },
  {
    path: '/system/branch/add',
    name: 'SystemBranchAdd',
    meta: {
      title: '添加部门'
    },
    component: () => import('@/views/system/BranchAdd')
  },
  {
    path: '/system/role',
    name: 'SystemRole',
    meta: {
      title: '角色管理'
    },
    component: () => import('@/views/system/SystemRole')
  },
  {
    path: '/system/role/add',
    name: 'SystemRoleAdd',
    meta: {
      title: '添加角色'
    },
    component: () => import('@/views/system/RoleAdd')
  },
  {
    path: '/system/user',
    name: 'SystemUser',
    meta: {
      title: '用户管理'
    },
    component: () => import('@/views/system/SystemUser')
  },
  {
    path: '/system/set',
    name: 'SystemSet',
    meta: {
      title: '系统设置'
    },
    component: () => import('@/views/system/SystemSet')
  },
  {
    path: '/system/check',
    name: 'CheckSet',
    meta: {
      title: '审核人设置'
    },
    component: () => import('@/views/system/CheckSet')
  },
  {
    path: '/system/rule',
    name: 'SystemRule',
    meta: {
      title: '系统规则'
    },
    component: () => import('@/views/system/SystemRule')
  },
  {
    path: '/system/user/add',
    name: 'SystemUserAdd',
    meta: {
      title: '添加用户-基本信息'
    },
    component: () => import('@/views/system/UserAdd')
  },
  {
    path: '/system/user/add/access',
    name: 'SystemUserAddData',
    meta: {
      title: '添加用户-可访问数据'
    },
    component: () => import('@/views/system/UserAddData')
  },
  {
    path: '/system/user/add/pass',
    name: 'SystemUserAddPass',
    meta: {
      title: '添加用户-修改密码'
    },
    component: () => import('@/views/system/UserAddPass')
  },
  {
    path: '/system/log',
    name: 'SystemLog',
    meta: {
      title: '操作日志'
    },
    component: () => import('@/views/system/SystemLog')
  },
  {
    path: '/book',
    name: 'UserSetBook',
    meta: {
      title: '通讯录'
    },
    component: () => import('@/views/userset/Book')
  },
  {
    path: '/user/info',
    name: 'AuthUser',
    meta: {
      title: '个人中心'
    },
    component: () => import('@/views/userset/User')
  },
  {
    path: '/userset/message',
    name: 'SystemMessage',
    meta: {
      title: '系统消息'
    },
    component: () => import('@/views/userset/SystemMessage')
  },
  // 修改密码
  {
    path: '/user/settings',
    name: 'AuthSettings',
    meta: {
      title: '安全设置'
    },
    component: () => import('@/views/userset/Settings')
  },
  // CMS绑定
  {
    path: '/user/cms',
    name: 'UserCms',
    meta: {
      title: 'CMS绑定'
    },
    component: () => import('@/views/userset/CMS')
  },
  // 约访消息
  {
    path: '/userset/Interview',
    name: 'Interview',
    meta: {
      title: '约访消息'
    },
    component: () => import('@/views/userset/Interview')
  },
  // 议题消息
  {
    path: '/userset/Issue',
    name: 'SystemIssue',
    meta: {
      title: '议题消息'
    },
    component: () => import('@/views/userset/Issue')
  },
  // 在线沟通
  {
    path: '/userset/station',
    name: 'Station',
    meta: {
      title: '在线沟通'
    },
    component: () => import('@/views/userset/Station')
  },
  // 响应消息
  {
    path: '/userset/forward',
    name: 'Forward',
    meta: {
      title: '响应消息'
    },
    component: () => import('@/views/userset/Forward')
  },
  {
    path: '/book',
    component: () => import('@/views/userset/Book'),
    children: [
      {
        path: 'directly',
        name: 'Directly',
        meta: {
          title: '直属团队'
        },
        component: () => import('@/views/userset/book/Directly')
      },
      {
        path: 'directly/binding1',
        name: 'Binding1',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding1')
      },
      {
        path: 'newsletter/binding2',
        name: 'Binding2',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding2')
      },
      {
        path: 'review/binding3',
        name: 'Binding3',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding3')
      },
      {
        path: 'expert/binding4',
        name: 'Binding4',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding4')
      },
      {
        path: 'bookbigv/binding5',
        name: 'Binding5',
        meta: {
          title: '绑定账户'
        },
        component: () => import('@/views/userset/book/bindlist/Binding5')
      },
      {
        path: 'newsletter',
        name: 'Newsletter',
        meta: {
          title: '通讯员团队'
        },
        component: () => import('@/views/userset/book/Newsletter')
      },
      {
        path: 'review',
        name: 'Review',
        meta: {
          title: '网评员团队'
        },
        component: () => import('@/views/userset/book/Review')
      },
      {
        path: 'expert',
        name: 'Expert',
        meta: {
          title: '专家学者团队'
        },
        component: () => import('@/views/userset/book/Expert')
      },
      {
        path: 'bookbigv',
        name: 'Bookbigv',
        meta: {
          title: '网红大V团队'
        },
        component: () => import('@/views/userset/book/Bigv')
      }
    ]
  }
]
