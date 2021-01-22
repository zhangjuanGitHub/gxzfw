export default {
  captcha: '/media/sys/user/captcha', // GET 获取验证码
  login: '/media/sys/user/login', // POST 登录
  info: '/media/sys/user/info', // GET 获取用户信息
  yqController: '/media/sys/user/yuqing', // GET 获取舆情跳转链接
  getOpinionUrl: '/media/opinion/getOpinionUrl',
  logout: '/media/sys/user/logout ', // GET 退出登录
  component_login_page: '/media/oauth/weixin/component_login_page', // GET 微信授权请求链接地址
  delete_self_authorizer: '/media/oauth/common/delete_self_authorizer', // GET 删除授权账户
  // 首页
  home_todo: '/media/home/count/todo', // 首页待处理数据条数
  myArticle: '/media/home/count/article', // 获取当月我的投稿图表数据
  allArticle: '/media/home/count/unitArticle', // 获取当月所有投稿图表数据
  // 单位管理
  departmentList: '/media/sys/department/listLevelByAreaId', // POST 部门管理>查询部门
  // areaList: '/media/sys/area/listAreaByUser', // GET 部门管理>获取状态树地区列表
  listAreaLevelByUser: '/media/sys/area/listLevelChildIncludeSelf', // GET 部门管理>获取状态树地区列表
  departmentSave: '/media/sys/department/save', // POST 部门管理>添加部门
  departmentUpdate: '/media/sys/department/update', // POST 部门管理>编辑部门
  depListSelect: '/media/sys/department/listLevelOfDepartment', // GET 部门管理>添加部门所属部门
  departmentdelete: '/media/sys/department/delete', // GET 部门管理>单个删除
  deleteBatch: '/media/sys/department/deleteBatch', // POST 部门管理>批量删除
  getDepartment: '/media/sys/department/getDepartment', // GET 部门管理>部门详情（编辑）
  listBindChildUser: '/media/sys/user/listBindChildUser', // GET 获取所有用户
  bindAuthorizerToUser: '/media/oauth/common/bindAuthorizerToUser', // POST 确定绑定
  // 部门管理
  getBranchList: '/media/sys/section/listLevelByDepartmentId', // GET 获取部门列表
  createBranch: '/media/sys/section/save', // POST 创建部门
  updateBranch: '/media/sys/section/update', // POST 修改部门
  deleteBranch: '/media/sys/section/delete', // GET 删除部门
  branchListLevel: '/media/sys/section/listLevelForSelect', // GET 部门层级列表
  getOneBranch: '/media/sys/section/get', // GET 获取某一个部门信息
  // 角色管理
  roleList: '/media/sys/role/list', // POST 角色管理>角色列表
  functionList: '/media/sys/function/list', // GET 角色管理>获取角色权限树形结构
  roleUpdate: '/media/sys/role/update', // POST 角色管理>编辑角色
  roleTreeData: '/media/sys/role/get', // GET 角色管理>查询已勾选的权限
  roleDelete: '/media/sys/role/delete', // GET 角色管理>删除单个角色
  roleDeleteBatch: '/media/sys/role/deleteBatch', // POST 角色管理>批量删除角色
  getRoleDetails: '/media/sys/role/getRole', // GET 角色管理>获取角色信息（编辑）
  saveRole: '/media/sys/role/save', // GET 角色管理>添加角色
  // 用户管理
  listLevel: '/media/sys/department/listLevelChildIncludeSelf', // GET 用户管理>获取部门层级
  userList: '/media/sys/user/list', // POST 用户管理>用户列表
  userSave: '/media/sys/user/save', // POST 用户管理>添加用户
  userUpdate: '/media/sys/user/update', // POST 用户管理>编辑
  ruleUserList: '/media/sys/role/listByUserId', // GET 用户管理>管理角色列表
  userDelete: '/media/sys/user/delete', // GET 用户管理>单个删除用户
  userDeleteBatch: '/media/sys/user/deleteBatch', // POST 用户管理>批量删除用户
  getUserDetails: '/media/sys/user/getUser', // GET 用户管理>获取用户信息（编辑）
  listLevelOfUser: '/media/sys/department/listLevelOfUser', // GET 用户管理>获取可访问数据部门层级
  saveDataDepartmentIds: '/media/sys/user/saveDataDepartmentIds', // GET 用户管理>保存可访问数据部门层级
  getDataDepartmentIds: '/media/sys/user/getDataDepartmentIds', // GET 用户管理>获取用户已经勾选的可访问数据
  // 系统设置
  save_base: '/media/sys/setting/save_base', // POST 系统设置
  get_base: '/media/sys/setting/get_base', // GET 获取系统设置
  // 审核人设置
  getOrgList: '/media/sysRevRanking/query', // GET 获取排序后的审核人列表
  saveSort: '/media/sysRevRanking/save ', // POST 保存审核列表
  // 日志
  logList: '/media/sys/oplog/list', // POST 日志列表
  // upload: 'http://172.16.65.213/product/media/common/file/upload', // POST 上传
  upload: window.g.baseUrl + '/media/common/file/upload', // POST 上传
  // upload: 'http://192.168.10.68:9998/product/media/common/file/upload', // POST 上传
  download: window.g.baseUrl + '/media/common/file/download', // GET 文件下载
  // download: 'http://192.168.10.68:9998/product/media/common/file/download', // GET 文件下载
  // 稿件
  getHistory: '/media/cik/article/v2/getHistory', // 单个历史稿件
  listVerifyUser: '/media/cik/article/v2/listVerifyUser', // 校对用户
  overVerify: '/media/cik/article/v2/overVerify', // 校对完成
  history: '/media/cik/article/v2/listHistory', // 历史稿件
  submitToVerify: '/media/cik/article/v2/submitToVerify', // 提交校对
  sendList: 'media/cik/article/send/list', // 投稿记录
  sendEms: '/media/cik/article/v2/sendEms', // 投稿邮箱
  isPublish: 'media/cik/article/v2/listPublish', // 发布记录
  listPublishUser: '/media/cik/article/v2/listPublishUser', // 发布用户
  updateFinishTrue: '/media/cik/article/v2/updateArticle', // 编辑稿件
  listRecord: '/media/cik/article/v2/listRecord', // 流程图
  listRecordLog: '/media/cik/article/v2/listRecordLog', // 流程图
  toRecall: '/media/cik/article/v2/toRecall', // 撤回稿件
  overCheck: '/media/cik/article/v2/overCheck', // get 结束审核
  toCheck: '/media/cik/article/v2/toCheck', // post 审核稿件
  listCheckRecord: '/media/cik/article/v2/listCheckRecord', // get 审核记录
  listInsidePublish: '/media/cik/article/v2/listInsidePublish', // post 发布稿件列表
  listInside: '/media/cik/article/v2/listInside', // post 单位稿件
  listPublic: '/media/cik/article/v2/listPublic', // post 公共稿件
  copyPublishChannel: '/media/cik/article/v2/copyPublishChannel', // get 复制稿件
  submitToPublish: '/media/cik/article/v2/submitToPublish', // get 提交发布
  listLevelChildIncludeSelf: '/media/sys/area/listLevelChildIncludeSelf', // GET 地区列表查询
  listSelect: '/media/sys/department/listLevelChildIncludeSelf', // GET 部门
  listOrganizationType: '/media/organization/listOrganizationType', // GET 获取职能信息
  getUserContact: '/media/sys/user/getUserContact', // GET 获取投稿用户信息
  authorizer: '/media/oauth/common/list_self_authorizer', // 获取所有授权账号
  horizer: '/media/oauth/common/listAuthorizer', // 获取所有授权账号
  outPublish: '/media/cik/article/v2/toPublish', // 发布稿件到微信微博
  readArticle: '/media/cik/article/v2/toRead', // GET 设置稿件已读
  FinishTrue: '/media/cik/article/v2/createArticle', // POST 新建投稿
  finishFalse: '/media/cik/article/v2/saveFinishFalse', // POST 新建草稿
  Mypublish: '/media/cik/article/submitToWaitingPublish', // POST 我的稿件加到待发布
  publish: '/media/cik/article/updateToWaitingPublish', // POST 他人稿件加到待发布
  listWebsite: '/media/cik/cms/listWebsite', // GET 获取发布站点
  chekedPublish: '/media/cik/cms/publishToWebsite', // POST 发布至外网
  submit: '/media/cik/article/v2/saveFinishTrue', // POST 放入草稿箱
  seve: '/media/cik/article/v2/updateFinishFalse', // POST 放入草稿箱
  finishFalseToTrue: 'media/cik/article/v2/finishFalseToTrue', // get 完成草稿
  listByDepartment: '/media/sys/user/listByDepartment', // get 变更用户列表
  listCheckUser: '/media/cik/article/v2/listCheckUser', // get 审核用户列表
  changeCheck: '/media/cik/article/v2/changeReviewer', // get 审核变更
  ownerChange: '/media/cik/article/v2/ownerChange', // get 变更所属
  submitToCheck: '/media/cik/article/v2/submitToCheck', // get 提交审核
  advise: '/media/cik/article/v2/toAdvise', // POST 团队推荐 *
  listAdvise: '/media/cik/article/v2/listAdvise', // POST 查询团队推荐
  articleList: '/media/cik/article/v2/listPublic', // POST 查询稿件列表
  articleSelf: '/media/cik/article/v2/listSelfFinishTrue', // POST 我的稿件
  listInsideVerify: '/media/cik/article/v2/listInsideVerify', // 校对列表
  listDraft: '/media/cik/article/v2/listSelfFinishFalse', // POST 我的草稿
  articleCheck: '/media/cik/article/check', // POST 稿件审核
  articleGrade: '/media/cik/article/v2/toGrade', // POST 稿件评级
  listCheck: '/media/cik/article/v2/listInsideCheck', // POST 待审核列表
  articlelistdelete: '/media/cik/article/deleteBatch', // POST 批量删除稿件 *
  articleDelete: '/media/cik/article/v2/deleteArticle', // GET 单个删除稿件
  deleteFinishFalse: '/media/cik/article/v2/deleteFinishFalse', // GET 删除草稿
  deleteFinishTrue: '/media/cik/article/v2/deleteFinishTrue', // GET 删除我的稿件
  getArticleHead: '/media/cik/article/getArticleHead', // GET 获取稿件头部信息
  articleDetail: '/media/cik/article/v2/get', // GET 获取稿件详情
  getPlaceArticle: '/media/mr/placeArticle/get', // 获取归档信息详情
  editorPraise: '/media/cik/article/editorPraise', // GET 编辑表扬 *
  articletoUse: '/media/cik/article/v2/toLike', // GET 稿件点赞
  articlenoUse: '/media/cik/article/noUse', // GET 不采用稿件
  articleLook: '/media/cik/article/look', // GET 设置稿件已读 *
  provinceUse: '/media/cik/article/provinceUse', // GET 省院公众号采用 *
  publishlist: '/media/cik/article/listWaitingPublish', // POST 查询待发布稿件
  publishDetail: '/media/cik/article/v2/listCopyBase', // POST 查询发布详情
  // publishDetail: '/media/cik/article/listPublishById', // POST 查询发布详情
  republish: '/media/cik/article/republish', // GET 重新发布稿件
  deletePublish: '/media/cik/article/deletePublish', // GET 删除发布记录
  list_festivals_countdown: '/media/major/festivals/list_festivals_countdown?size=3', // GET 获取重大节日倒计时接口
  list_festivals_public: '/media/major/festivals/list_festivals_public', // GET 获取公共节日
  list_festivals_introduce: '/media/major/festivals/list_festivals_introduce', // GET 获取节日介绍
  list_festivals_tagging_calendar: '/media/major/festivals/list_festivals_tagging_calendar', // GET 获取日历节日
  saveHistory: '/media/todayInHistory/saveHistory', // 添加重大节日
  save_festivals_tagging: '/media/major/festivals/save_festivals_tagging', // 添加历史上的今天
  // 稿件批注
  addPostil: '/media/cik/postil/addPostil', // POST 添加批注
  getcomments: '/media/cik/postil/findPostilList', // POST 查询批注
  deleteComments: '/media/cik/postil/delectPostil', // POST 删除批注
  getCommentStatus: '/media/cik/postil/updateStatus', // POST 改变批注已读、未读
  addPostilReply: '/media/cik/postil/addPostilReply', // POST 添加批注回复
  deleteReply: '/media/cik/postil/delectPostilReply', // POST 删除批注回复
  getAppComment: '/media/cik/postil/url/appPostil', // GET 获取APP端批注
  // 图片
  photoUpdate: '/media/cik/album/update', // POST 更新图片
  PhotoList: '/media/mr/group/list', // POST 查询图片列表
  SaveList: '/media/cik/album/save', // POST 新建相册
  photolistSelf: '/media/mr/group/list', // POST 我的相册
  photodelete: '/media/cik/album/deleteSelf', // GET 单个删除相册
  photoDetail: '/media/mr/file/list', // GET 相册详情
  deletePicture: '/media/cik/album/deletePicture', // GET 删除相册图片
  photolistdelete: '/media/cik/album/deleteBatch', // POST 批量删除相册
  // 视频
  videoList: '/media/mr/group/list', // POST 查询视频列表
  videoSave: '/media/cik/video/save', // POST 新建视频
  videolistSelf: '/media/mr/group/list', // POST 我的视频
  videodelete: '/media/cik/video/deleteSelf', // GET 单个删除视频
  videouse: '/media/cik/video/use', // GET 视频采用
  videolistdelete: '/media/cik/video/deleteBatch', // POST 批量删除视频
  // 随手拍
  getClapList: '/media/ssp/moments/list', // POST 获取随手拍列表
  // 管理与考核矩阵账号
  assessmentAccountList: '/media/mac/account/list', // POST 查询账号列表
  assessAccountDelete: '/media/mac/account/deleteAccount', // POST 删除账号
  getAccount: '/media/mac/account/getAccount', // GET 获取单个账号详情
  saveAccount: '/media/mac/account/saveAccount', // POST 添加更新账号
  listUnCheckAccount: '/media/mac/account/listUnCheckAccount', // POST 查询未审核的账号
  getCountNum: '/media/mac/account/getCount', // GET 获取总数以及待审核数
  // 管理与考核 ===> 考核设置榜单
  wxSettings: '/media/maa/updateWxSettings', // POST 更改微信考核设置
  wbSettings: '/media/maa/updateWbSettings', // POST 更改微博考核设置
  ttSettings: '/media/maa/updateJrttSettings', // POST 更改头条考核设置
  showWxSettings: '/media/maa/showWxSettings', // GET 微信考核设置展示
  showWbSettings: '/media/maa/showWbSettings', // GET 微博考核设置展示
  showJrttSettings: '/media/maa/showJrttSettings', // POST 头条考核设置展示
  showMaaGenSettings: '/media/maa/showMaaGenSettings', // GET 查看总榜与贡献考核设置
  updateMaaGenSettings: '/media/maa/updateMaaGenSettings', // POST 添加或修改总榜与考核设置
  // 管理与考核 ===> 榜单
  showFunction: '/media/maa/showFunction', // GET 根据用户不同查询职能信息（职能下拉框)
  showListType: '/media/maa/showListType', // GET 查看榜单类型（1：市级榜 2：全省区县榜
  queryWxArea: '/media/maa/queryWxArea', // GET 查询微信榜单地区
  queryWbArea: '/media/maa/queryWbArea', // GET 查询微博榜单地区
  wzAreaList: '/media/maa/wzAreaList', // GET 查询微博榜单地区
  showWxList: '/media/maa/showWxList', // POST 根据条件查看微信榜单
  showWbList: '/media/maa/showWbList', // POST 根据条件查看微博榜单
  showJrttList: '/media/maa/queryJrttList', // POST 根据条件查看头条榜单
  showAocamList: '/media/maa/showAocamList', // POST 查看稿件贡献考核
  showQxAocamList: '/media/maa/showQxAocamList', // POST 稿件贡献考核中查询某一地区中各区县的榜单(点击某一地区时的弹窗接口)
  showWzList: '/media/maa/showWzList', // POST 门户网站考核查询(包括升降序)(监测)
  monthWzList: '/media/maa/monthWzList', // POST 门户网站中点击月份下的数字弹框接口(监测)
  showGenList: '/media/maa/showGenList', // GET 总榜核算
  genListAcc: '/media/maa/genListAcc', // POST 发布总榜核算
  queryGenList: '/media/maa/queryGenList', // GET 总体排行
  showRegionList: '/media/maa/showRegionList', // POST 查询各区县榜单
  showChannelList: '/media/maa/showList', // POST 查询各渠道排行榜
  // 管理与考核 ===> 矩阵管理转发
  forwardSave: '/media/mac/forward/save', // POST 新建转发
  listAll: '/media/sys/department/listAll', // POST 响应范围
  listForward: '/media/mac/forward/listForward', // POST 当前用户转发记录
  listForwardResult: '/media/mac/forward/listForwardResult', // GET 查询转发结果
  listNoForward: '/media/mac/forward/findNotForward', // POST 查询未响应结果
  // 媒体互动
  listIssus: '/media/mdi/issue/listIssue', // POST 查询全部议题
  saveIssus: '/media/mdi/issue/saveIssue', // POST 发布议题
  updateIssus: '/media/mdi/issue/updateIssue', // POST 编辑议题
  getIssus: '/media/mdi/issue/getIssue', // GET 获取议题信息(用于编辑)
  deleteIssus: '/media/mdi/issue/deleteIssue', // GET 删除议题
  listSelfIssus: '/media/mdi/issue/listSelfIssue', // POST 我的议题列表
  getIssusWithDetails: '/media/mdi/issue/getIssueWithDetails', // GET 获取议题信息(包含回复)
  saveIssusDetails: '/media/mdi/issue/saveIssueDetails', // POST 回复议题
  // 约访
  listLevelChildByTop: '/media/sys/area/listLevelChildByTop', // GET 约访地区
  listInterview: '/media/mdi/interview/listInterview', // POST 查询全部约访
  saveInterview: '/media/mdi/interview/saveInterview', // POST 发起约访
  updateInterview: '/media/mdi/interview/updateInterview', // POST 编辑约访
  deleteInterview: '/media/mdi/interview/deleteInterview', // GET 删除约访
  // interviewAreaList: '/media/sys/area/listAllAreaNoParent', // GET 约访地区
  replyInterview: '/media/mdi/interview/replyInterview', // POST 回复约访（同意，拒绝）
  listSelfInterview: '/media/mdi/interview/listSelfInterview', // POST 我的约访记录
  listLevelChildByAreaId: '/media/sys/department/listLevelChildByAreaId', // GET 约访单位
  // listByParam: '/media/sys/department/listByParam', // POST 约访单位名称
  getInterviewView: '/media/mdi/interview/getInterviewView', // GET 获取单个约访信息
  appraiseInterview: '/media/mdi/interview/appraiseInterview', // POST 评价约访
  // 在线征稿
  listArticle: '/media/solicit/contributions/list', // POST 获取征稿列表
  myArticleList: '/media/solicit/contributions/myList', // POST 我的征稿
  myContributeList: '/media/solicit/contributions/article/myList', // POST 我的投稿
  contributeList: '/media/solicit/contributions/article/list', // POST 稿件列表
  myDraftList: '/media/solicit/contributions/article/myDraftList', // POST 我的草稿箱
  deleteArticle: '/media/solicit/contributions/delete', // GET 删除征稿
  deleteContribute: '/media/solicit/contributions/article/delete', // GET 删除投稿
  submitArticle: '/media/solicit/contributions/saveOrUpdate', // POST 发起征稿
  getArticleDetail: '/media/solicit/contributions/get', // GET 获取征稿详情
  getReadDetail: '/media/solicit/contributions/read', // GET 阅读征稿
  submitContribute: '/media/solicit/contributions/article/submit', // POST 发起投稿
  saveContribute: '/media/solicit/contributions/article/draft', // POST 保存到草稿箱
  editDetail: '/media/solicit/contributions/article/get', // GET 获取编辑投稿信息
  checkArticle: '/media/solicit/contributions/article/check', // POST 审核稿件
  getContribute: '/media/cik/article/v2/myListToSolicit', // POST 获取投稿列表
  selectContribute: '/media/solicit/contributions/article/batchSave', // POST 选择投稿
  // 大V
  listBigv: '/media/mdi/bigv/listBigv', // POST 查询所有大V
  getBigvDetails: '/media/mdi/bigv/getBigv', // GET 大V详情
  // 真相大白
  listRumorVerificate: '/media/rumor/verificate/listRumorVerificate', // POST 获取列表
  listSelfRumorVerificate: '/media/rumor/verificate/listSelfRumorVerificate', // POST 我的列表
  questionRumorVerificate: '/media/rumor/verificate/questionRumorVerificate', // POST 发起求证
  updateRumorVerificate: '/media/rumor/verificate/updateRumorVerificate', // POST 编辑求证
  getRumorVerificate: '/media/rumor/verificate/getRumorVerificate', // GET 获取编辑求证信息
  getRumorVerificateView: '/media/rumor/verificate/getRumorVerificateView', // GET 获取求证详情
  answerRumorVerificate: '/media/rumor/verificate/answerRumorVerificate', // POST 回复求证
  // 消息
  listForwardMessage: '/media/mac/forward/listForwardMessage', // 转发消息
  answerForwardMessage: '/media/mac/forward/answerForwardMessage', // 转发消息已读/未读
  readMessage: '/media/sys/message/readMessage', // GET 已读
  systemMessage: '/media/sys/message/list', // POST 系统消息
  deleteMessage: '/media/sys/message/deleteMessage', // GET 删除系统消息
  listInterviewMessage: '/media/mdi/interview/listInterviewMessage', // POST 约访消息
  listIssueMessage: '/media/mdi/issue/listIssueMessage', // POST 议题消息
  deleteIssueMessage: '/media/mdi/issue/deleteIssueMessage', // POST 删除议题消息
  deleteInterviewMessage: '/media/mdi/interview/deleteInterviewMessage', // POST 删除约访消息
  listMessageCha: '/media/message/chat/listMessageChat', // POST 获取站内消息
  deleteMessageChat: '/media/message/chat/deleteMessageChat', // GET 删除站内消息
  saveMessageChat: '/media/message/chat/saveMessageChat', // POST 发送站内消息
  queryDepartment: '/media/sys/department/listLevelChildByTop', // GET 绑定单位列表
  partmentList: '/media/mailList/list', // POST 绑定列表
  queryUserList: '/media/mailList/queryUserList', // POST 绑定部门用户
  binding: '/media/mailList/binding', // POST 点击绑定
  partmenDelete: '/media/mailList/delete', // POST 删除用户
  // 传播力监测 微博
  findWbCentre: '/media/nmcm/weibo/findWbCentre', // POST 获取星标账户
  findByWbId: '/media/nmcm/weibo/findByWbId', // GET 获取账户信息
  findArticles: '/media/nmcm/weibo/findWeiboArticles', // GET 获取个人文章信息
  updateCreate: '/media/nmcm/weibo/updateCreate', // GET 修改关注状态
  insetColArticleId: '/media/nmcm/weibo/insetColArticleId', // GET 点击文章获取wbid和文章id.
  // 传播力监测 微信
  findWxCentre: '/media/nmcm/weixin/findWxCentre', // POST 获取星标账户
  findByWxId: '/media/nmcm/weixin/findByWxId', // GET 获取账户信息
  findWxArticles: '/media/nmcm/weixin/findWeixinArticles', // GET 获取个人文章信息
  wxCreate: '/media/nmcm/weixin/updateCreate', // GET 修改关注状态
  wxArticleId: '/media/nmcm/weixin/insetColArticleId', // GET 点击文章获取wbid和文章id.
  selectWeixin: '/media/wxSpreadPower/findWxAccount', // 微信公众号下拉框
  findWxDistricts: '/media/wxSpreadPower/findWxDistricts', // 微信公众号下拉框
  // 传播力监测 网站
  findWzCentre: '/media/nmcm/website/findWzCentre', // POST 获取星标账户
  findByWzId: '/media/nmcm/website/findByWzId', // GET 获取账户信息
  findWzArticles: '/media/nmcm/website/findwzArticles', // GET 获取个人文章信息
  wzCreate: '/media/nmcm/website/updateCreate', // GET 修改关注状态
  wzArticleId: '/media/nmcm/website/insetColArticleId', // GET 点击文章获取wbid和文章id
  // 传播力监测 头条
  findTdCentre: '/media/nmcm/TodayHead/findJrttCentre', // POST 获取星标账户
  findByTdId: '/media/nmcm/TodayHead/findByJrttId', // GET 获取账户信息
  findTdArticles: '/media/nmcm/TodayHead/findJrttArticles', // GET 获取个人文章信息
  tdCreate: '/media/nmcm/TodayHead/updateCreate', // GET 修改关注状态
  tdArticleId: '/media/nmcm/TodayHead/insetColArticleId', // GET 点击文章获取wbid和文章id
  // 传播力监测 一点
  findYdCentre: '/media/nmcm/yd/findJrttCentre', // POST 获取星标账户
  findByYdId: '/media/nmcm/yd/findByYdId', // GET 获取账户信息
  findYdArticles: '/media/nmcm/yd/findYdArticle', // GET 获取个人文章信息
  ydCreate: '/media/nmcm/yd/updateCreate', // GET 修改关注状态
  ydArticleId: '/media/nmcm/yd/insetColArticleId', // GET 点击文章获取wbid和文章id
  // 全市动态
  findwbCityArticles: '/media/nmcm/weibo/findCityArticles', // POST wb全市账户的文章
  findbyCity: '/media/nmcm/weibo/findbyCity', // POST wb全市动态下的用户信息
  wxArticles: '/media/nmcm/weixin/findCityArticles', // POST 微信全市账户的文章
  wxCity: '/media/nmcm/weixin/findbyCity', // POST 微信全市动态下的用户信息
  wzArticles: '/media/nmcm/website/findCityPaper', // POST 网站全市用户文章
  wzCity: '/media/nmcm/website/findbyCity', // POST 网站全市动态下的帐户信息
  tdArticles: '/media/nmcm/TodayHead/findCityArticles', // POST 头条全市用户文章
  tdCity: '/media/nmcm/TodayHead/findbyCity', // POST 头条全市动态下的帐户信息
  ydArticles: '/media/nmcm/yd/findCityArticles', // POST 一点全市用户文章
  ydCity: '/media/nmcm/yd/findbyCity', // POST 一点全市动态下的帐户信息
  adviseExternal: '/media/nme/article/adviseExternal', // POST 推荐外部文章
  findChannels: '/media/nmcm/website/findChannels', // POST 栏目选择
  // 微博
  findLevelDistricts: '/media/nmcm/findLevelDistricts', // post 栏目账户地区
  wbUserList: '/media/nmcm/weibo/findUserList', // POST 查询账号列表操作接口
  wbNewsList: '/media/nmcm/weibo/findNewsList', // POST 查询新闻列表操作接口
  wbPersonNews: '/media/nmcm/weibo/findPersonNews', // POST 查询个人账号新闻列表操作接口
  wbById: '/media/nmcm/weibo/findById', // GET 查询个人账号信息操作接口
  // 微信
  wxUserList: '/media/nmcm/weixin/findUserList', // POST 查询账号列表操作接口
  wxNewsList: '/media/nmcm/weixin/findNewsList', // POST 查询新闻列表操作接口
  wxPersonNews: '/media/nmcm/weixin/findPersonNews', // POST 查询个人账号新闻列表操作接口
  wxById: '/media/nmcm/weixin/findById', // GET 查询个人账号信息操作接口
  // 网站
  wzUserList: '/media/nmcm/website/findUserList', // POST 查询账号列表操作接口
  wzNewsList: '/media/nmcm/website/findNewsList', // POST 查询新闻列表操作接口
  wzPersonNews: '/media/nmcm/website/findPersonNews', // POST 查询个人账号新闻列表操作接口
  wzById: '/media/nmcm/website/findById', // GET 查询个人账号信息操作接口
  // 头条
  ttUserList: '/media/nmcm/jrtt/findUserList', // POST 查询账号列表操作接口
  ttNewsList: '/media/nmcm/jrtt/findNewsList', // POST 查询新闻列表操作接口
  ttPersonNews: '/media/nmcm/jrtt/findPersonNews', // POST 查询个人账号新闻列表操作接口
  ttById: '/media/nmcm/jrtt/findById', // GET 查询个人账号信息操作接口
  // 抖音
  dyUserList: '/media/nmcm/dy/findUserList', // POST 查询账号列表操作接口
  dyNewsList: '/media/nmcm/dy/findNewsList', // POST 查询新闻列表操作接口
  dyPersonNews: '/media/nmcm/dy/findPersonNews', // POST 查询个人账号新闻列表操作接口
  dyById: '/media/nmcm/dy/findById', // GET 查询个人账号信息操作接口
  // 一点
  ydUserList: '/media/nmcm/yd/findUserList', // POST 查询账号列表操作接口
  ydNewsList: '/media/nmcm/yd/findNewsList', // POST 查询新闻列表操作接口
  ydPersonNews: '/media/nmcm/yd/findPersonNews', // POST 查询个人账号新闻列表操作接口
  ydById: '/media/nmcm/yd/findById', // GET 查询个人账号信息操作接口
  // 传播力监测账户设置
  getAccInfo: '/media/nmcm/getAccInfo', // POST 查询账号并进行展示
  updateStatus: '/media/nmcm/updateStatus', // GET 栏目禁用/启用
  addAccount: '/media/nmcm/addAccount', // POST 添加账号
  queryProvince: '/media/nmcm/queryProvince', // GET 查询省份
  queryCity: '/media/nmcm/queryCity', // GET 查询某省所包括的市
  inquireTotalOfAccounts: '/media/nmcm/inquireTotalOfAccounts', // GET 账号设置中统计账号总数
  deleteByIds: '/media/nmcm/deleteByIds', // GET 账号设置中删除账号
  queryInfoById: '/media/nmcm/queryInfoById', // GET 查询某一账号的详细信息
  // 传播力监测栏目设置
  queryColumn: '/media/nmcm/queryColumn', // GET 左侧栏目展示接口
  queryMeColumn: '/media/nmcm/queryMeColumn', // GET 设置栏目信息展示
  updateIsShowDown: '/media/nmcm/updateIsShowDown', // GET 是否向下级展示接口
  addColumn: '/media/nmcm/addColumn', // POST 添加栏目
  updateColumn: '/media/nmcm/updateColumn', // POST 修改栏目操作接口
  delectColumn: '/media/nmcm/delectColumn', // GET 删除栏目操作接口
  queryAccByColId: '/media/nmcm/queryAccByColId', // POST 查询某一栏目关注账号列表
  queryNoAddAcc: '/media/nmcm/queryNoAddAcc', // POST 栏目添加账号时查询此栏目未添加的账号列表
  deleteAccForCol: '/media/nmcm/deleteAccForCol', // GET 栏目设置中删除账号
  addAccForCol: '/media/nmcm/addAccForCol', // POST 栏目设置中添加账号
  customColumn: '/media/nmcm/customColumn', // POST 设置栏目标题及简介
  // 传播力监测文章传播力监测
  userTextList: '/media/webPower/text/userTextList',
  validate: '/media/webPower/text/validate',
  simList: '/media/webPower/text/simList',
  countSimList: '/media/webPower/text/countSimList',
  insert: '/media/webPower/insert', // post 新建任务
  // 榜单
  // showWxList: '/media/maa/showWxList', // POST 根据条件查看微信榜单(应用)
  // showWbList: '/media/maa/showWbList', // POST 根据条件查看微博榜单(应用)
  // showJrttList: '/media/maa/queryJrttList', // POST 根据条件查看头条榜单(应用)
  // 月度排行
  rankList: '/media/maa/jcAllRanking', // 总体排行(应用)
  // 个人中心
  getSelfInfo: '/media/sys/user/getSelf', // GET 获取个人信息
  updateSelfInfo: '/media/sys/user/updateSelf', // POST 更新个人信息
  updateSelfSecurity: '/media/sys/user/updateSelfSecurity', // POST 修改密码
  getCmsUserIdUrl: '/media/cik/cms/getCmsUserIdUrl', // GET CMS获取当前登录用户ID链接
  saveCmsUserId: '/media/cik/cms/saveCmsUserId', // GET 用户绑定CMS系统userId
  getCmsUserId: '/media/cik/cms/getCmsUserId', // GET 获取用户绑定CMS系统userId
  // 素材资源存储
  groupList: '/media/mr/group/list', // POST 获取图片、视频文件夹列表
  downloadFile: window.g.baseUrl + '/media/mr/file/downloadFile', // ,媒体资源库下载
  // downloadFile: 'http://192.168.10.68:9998/product/media/mr/file/downloadFile', // ,媒体资源库下载
  // fileAdd: '/media/mr/file/add', // POST 上传图片、视频
  // groupAdd: '/media/mr/group/add', // POST 添加图片、视频文件夹
  editGroupOrFile: '/media/mr/file/editGroupOrFile', // POST 上传图片、视频,添加图片、视频文件夹
  chunkUpload: '/media/upload/chunkUpload', // POST 切片视频
  fileList: '/media/mr/file/list', // POST 图片、视频单个列表
  groupDelete: '/media/mr/group/delete', // GET 删除组别
  fileDelete: '/media/mr/file/delete', // GET 删除单个文件
  groupEdit: '/media/mr/group/edit', // POST 编辑组别
  getFileDetails: '/media/mr/file/getFile', // GET 获取单个文件信息
  getVideoThumbnails: '/media/mr/file/getVideoThumbnails', // GET 编辑视频时获取视频分时段的缩略图
  updateNewFile: '/media/mr/file/updateNewFile', // GET 音视频剪辑或者视频截取
  listPublishArticle: '/media/nme/article/listPublishArticle', // POST 已发布的文章列表
  placeArticleList: '/media/mr/placeArticle/list', // POST 查询归档信息列表
  getJobConfig: '/media/mr/placeArticle/getJobConfig', // GET 获取定时归档周期和更新归档定时删除周期
  editJobConfig: '/media/mr/placeArticle/editJobConfig', // GET 更新定时归档周期和更新归档定时删除周期
  articleDeleteAll: '/media/mr/placeArticle/deleteAll', // POST 删除所有归档信息
  queryIsbinding: '/media/mailList/queryIsbinding', // GET 绑定用户
  siteChart8: '/media/webPower/hotWordCloud', // POST 词云
  updateNewscloud: '/media/mac/newscloud/updateNewscloud', // POST 分享文档素材
  // 智能辅助
  articleAnalyse: 'media/intelligentAssistant/articleAnalyse', // POST 智能助手
  // 热点新闻
  hotFindArticles: '/media/bdc/hot/findArticles', // 网站新闻
  WxfindCityArticles: '/media/bdc/hot/findWxArticles', // 检察新媒体微信
  WbfindCityArticles: '/media/bdc/hot/findWbArticles', // 检察新媒体微博
  TtfindCityArticles: '/media/bdc/hot/findJrttArticles', // 检察新媒体今日头条
  listWholeHotNews: '/media/hotNews/listWholeHotNews', // 社会热点全国
  listBeijingHotNews: '/media/hotNews/listBeijingHotNews', // 社会热点北京
  listHistory: '/media/todayInHistory/listHistory', // 历史上的今天
  addSpecial: '/media/bdc/special/addSpecial', // 添加追踪
  upSpecial: '/media/bdc/special/upSpecial', // POST 修改专题某一项
  findOne: '/media/bdc/special/findOne', // GET 获取专题某一项信息
  findSpecial: '/media/bdc/special/findSpecial', // 专题列表
  findCityArticles: '/media/mac/newscloud/findNewscloud', // 检察新闻云
  findOneNewscloud: '/media/mac/newscloud/findOneNewscloud', // 新闻编辑
  delNewscloud: '/media/mac/newscloud/delNewscloud', // 删除单个新闻
  delectSpecial: '/media/bdc/special/delectSpecial', // POST 删除传播列表
  findLabel: '/media/mac/newscloud/findLabel', // GET 标签
  addNewscloud: '/media/mac/newscloud/addNewscloud ', // POST 添加到新闻云素材
  findHotRanking: '/media/bdc/hot/findHotRanking', // POST 热点排行
  findShaft: '/media/bdc/special/findShaft', // GET 专题追踪时间线
  findChart: '/media/bdc/special/findChart', // GET 专题折线图数据
  findKeywords: '/media/bdc/special/findKeywords', // GET 专题热词云
  // 人员信息管理
  listActivityResults: '/media/activity/listActivityResults', // 上报汇总
  saveActivityResults: '/media/activity/saveActivityResults', // 成果上报
  gatherForwardMessage: '/media/mac/forward/gatherForwardMessage', // 响应性评估
  // 发布会预约
  listSelfConference: '/media/conference/listSelfConference', // POST 发布会预约-我的申请
  saveConference: '/media/conference/saveConference', // POST 发布会预约-我的申请-提交申请
  updateConference: '/media/conference/updateConference', // POST 发布会预约-我的申请-编辑申请
  deleteConference: '/media/conference/deleteConference', // GET 发布会预约-我的申请-删除申请
  listConference: '/media/conference/listConference', // POST 发布会预约-发布会列表
  checkConference: '/media/conference/checkConference', // POST 发布会预约-发布会列表-审核
  uploadSiteRecord: '/media/conference/uploadSiteRecord', // POST 发布会预约-我的申请-上传会场照片
  conferenceGatherArea: '/media/conference/conferenceGatherArea', // GET 发布会统计-发布会总计
  conferenceGatherMonth: '/media/conference/conferenceGatherMonth', // GET 发布会统计-按月统计单位发布会数量
  lineChartConferenceMonth: '/media/conference/lineChartConferenceMonth', // GET 发布会统计-发布会召开折线图
  // 写作模板
  writeSave: '/media/writeTemplate/save', // POST 添加模板 参数:(typeId 模板类型id;coverImage 封面图;content 内容)
  writeDelete: '/media/writeTemplate/delete', // GET 删除模板 参数:(ids 删除模板id)
  writeUpdate: '/media/writeTemplate/update', // POST 更新模板 参数:(id 模板id;userId 用户id;departmentId 部门id;typeId 类型id;coverImage 封面;content 内容)
  writeQuery: '/media/writeTemplate/query', // GET 根据模板类型查询个人模板 参数:(typeId 模板类型id)
  writeQueryAll: '/media/writeTemplate/queryAll', // GET 根据类型查询所有模板 参数:(typeId 模板类型id)
  addCollection: '/media/writeTemplate/addCollection', // POST 添加收藏接口 参数:(wid 模板id)
  deleteCollection: '/media/writeTemplate/deleteCollection', // GET 删除收藏模板接口 参数:(单wid/多ids)
  deleteCollections: '/media/writeTemplate/deleteCollections', // GET 删除收藏模板接口 参数:(单wid/多ids)
  queryCollection: '/media/writeTemplate/queryCollection', // GET 查询收藏模板 参数:无
  // 网评管理
  addTask: '/media/comment/task/addTask', // POST 添加任务
  findTask: '/media/comment/task/findTask', // POST 任务列表
  delectTask: '/media/comment/task/delectTask', // GET 删除单个任务
  findOneTask: '/media/comment/task/findOneTask', // GET 查看任务
  issuedTask: '/media/comment/task/isuedTask', // GET 下发任务
  updateTask: '/media/comment/task/updateTask', // GET 审结任务
  findExecuteTask: '/media/comment/task/findExecuteTask', // POST 执行任务
  addFeedback: '/media/comment/task/addFeedback', // POST 填写反馈任务
  findResultTask: '/media/comment/task/findResultTask', // POST 工作记录
  findAddressBook: '/media/comment/task/findAddressBook', // POST 辅助处理员
  deleteAddressBook: '/media/comment/task/delectAddressBook', // POST 删除处置管理员
  insertAddressBook: '/media/comment/task/insertAddressBook', // POST 新增处置管理员
  updateAddressBook: '/media/comment/task/updateAddressBook', // POST 修改处置管理员
  findOneAddressBook: 'media/comment/task/findOneAddressBook', // GET 查询单条数据
  findComPlatformType: '/media/comment/task/findComPlatformType', // GET 处置管理员平台类型
  findMaterial: '/media/comment/task/findMaterial', // POST 口径库列表
  delectMaterial: '/media/comment/task/delectMaterial', // POST 口径库删除
  insertMaterial: '/media/comment/task/insertMaterial', // POST 口径库添加
  findOneMaterial: '/media/comment/task/findOneMaterial', // POST 口径库查询单挑数据
  updateMaterial: '/media/comment/task/updateMaterial', // POST 口径库修改
  findCountTask: '/media/comment/task/findCountTask', // POST 考核列表
  findUserName: '/media/comment/task/findUserName', // POST 获取承办人列表
  importMaterial: window.g.baseUrl + '/media/comment/task/importMaterial', // 口径库导入模板
  // importMaterial: 'http://192.168.10.13:29998/gxjcy/media/comment/task/importMaterial', // 口径库导入模板
  importAddress: window.g.baseUrl + '/media/comment/task/importAddress', // 辅助处置管理员导入模板
  // importAddress: 'http://192.168.10.13:29998/gxjcy/media/comment/task/importAddress', // 辅助处置管理员导入模板
  getAddress: window.g.baseUrl + '/media/comment/task/getAddress', // GET 下载辅助处置管理员模板
  getMaterial: window.g.baseUrl + '/media/comment/task/getMaterial', // GET 下载口径库模板
  mergeChunkUpload: '/media/upload/mergeChunkUpload', // 合并接口
  // 新媒体影响力 首页
  totalData: '/media/websiteSpreadPower/findPropagationPowerRanking', // POST 网站发稿信息
  totalWeb2: '/media/websiteSpreadPower/findReprintReprintVolumeAnalysis', // GET 网站稿件比例
  findSpreadAnalyze: '/media/wxSpreadPower/findSpreadAnalyze', // GET 微信传播力
  findWxSum: '/media/wxSpreadPower/findWxSum', // GET 微信稿件统计
  // 新媒体影响力 网站
  queryChannel: '/media/webPower/queryChannel', // 频道列表
  allInfo: '/media/webPower/webInfo', // POST 发稿网站
  siteChart2Line: '/monitor/chuanboli/opinion/siteChart2Line', // POST 发稿总量 多线折线图
  siteChart2Circle: '/monitor/chuanboli/opinion/siteChart2Circle', // POST 发稿总量分析图 饼状图
  siteChart1: '/media/webPower/powerAnalysis', // POST 传播力指数 折线图
  siteChart3: '/media/webPower/trendChartOfTransferredLoad', // POST 网站传播力走势 柱状图
  siteChart4: '/media/webPower/proportionReprintedByWebsites', // POST 被各类型网站转载占比
  totalDataByDate: '/media/webPower/anaOfEachChannel', // POST 各频道发稿维度分析
  siteChart5: '/media/webPower/reprintWebsiteTop10', // POST 转载网站top10
  siteChart6: '/media/webPower/channelPublishingAnalysis', // POST 频道发稿分析 横向柱状图
  siteHot: '/media/webPower/popularArticlesTop10', // POST 热门文章
  sitearea: '/media/webPower/regionalAnalysis', // POST 分布地图
  // 新媒体影响力 微信
  tongjiWeixin: '/media/wxSpreadPower/findWxBehavioralData', // POST 微信传播力 排名数据
  chart1Weixin: '/monitor/chuanboli/weixin/chart1Weixin', // POST 发稿量走势
  findArticleCountAnalyze: '/media/wxSpreadPower/findArticleCountAnalyze', // POST 阅读量走势
  chart3Weixin: '/monitor/chuanboli/weixin/chart3Weixin', // POST 点赞量走势
  chart4Weixin: '/media/wxSpreadPower/findWxByTransshipmentSum', // POST 被转载量走势
  chart5Weixin: '/media/wxSpreadPower/findWxByTransshipmentTop', // POST 转载公众号top10
  reprintWeixin: '/media/wxSpreadPower/findArticleCount/top10', // POST 转载网站top10
  hotWeixin: '/media/wxSpreadPower/findHotArticleTop', // GET 热门文章列表
  // 新媒体影响力 微博
  findWbNameList: '/media/wbSpreadPower/findWbNameList', // 获取微博下拉列表
  wbCountAnalyze: '/media/wbSpreadPower/findArticleCountAnalyze', // 发稿量趋势
  wbSpreadAnalyze: '/media/wbSpreadPower/findSpreadAnalyze', // 发稿量趋势
  findCityRankingTop: '/media/wbSpreadPower/findCityRankingTop', // 区县微博号top10
  findHotArticlesTop: '/media/wbSpreadPower/findHotArticlesTop', // 热门文章top10
  findBehavioralData: '/media/wbSpreadPower/findBehavioralData', // 微博行为数据
  findPropagationPath: '/media/wbSpreadPower/findPropagationPath', // 微博传播路径
  Hierarchy: '/media/wbSpreadPower/findPropagationPathHierarchy', // 微博传播量分析
  // 媒体关注度
  channelChart1: '/media/websiteSpreadPower/findWebsiteGroupingCountByType', // chart1Weixin // POST 被各类型网站转载 图表
  channelChart2: '/media/websiteSpreadPower/findWebsiteGroupingCountBySiteName', // chart1Weixin // POST 综合top10转载网站
  chartTop: '/media/websiteSpreadPower/findWebsiteSimByType', // chart1Weixin // POST 被各类型网站转载（单个网站的信息）
  siteHotArticles: '/media/websiteSpreadPower/findByMediaArticlesTop', // findByMediaArticlesTop // POST 关注 top10
  // 文章传播列表
  findSim: '/media/websiteSpreadPower/findByReprintedOfMedia', // POST 被互联网转载的文章。
  paperSpread: '/media/websiteSpreadPower/findWebsiteArticleById', // GET 查询文章内容详情展示
  papersList: '/media/websiteSpreadPower/findNewsList', // POST 文章传播详情
  paperChart2: '/media/websiteSpreadPower/findByVariousTypesOfWebsiteReprinted', // POST 被各类型网站转载占比 --饼状图
  paperChart1: '/media/websiteSpreadPower/findByReprintedOfTrend', // POST 被转载量走势 --折线图
  paperArea: '/media/websiteSpreadPower/findByReprintedMediaRegionalTop', // POST 地域分析(可以用在影响地域分析和转载媒体地域排名top10)
  // 文章监测分析
  deleteByUtids: '/media/webPower/text/deleteByUtids', // POST 删除
  findArticleByUtId: '/media/websiteSpreadPower/findArticleByUtId', // GET 查询文章内容详情展示
  realZhuan: '/monitor/chuanboli/realTime/zhuan', // POST 被互联网转载的文章折线图。
  realQudao: '/monitor/chuanboli/realTime/qudao', // POST 渠道 饼状图
  realTop10: '/monitor/chuanboli/realTime/top10', // POST 转载top10图表
  // 视频会议
  meetingList: '/media/video/meeting/list', // post 会议列表
  createMeeting: '/media/video/meeting/createMeeting', // post 创建会议
  meetingDetail: '/media/video/meeting/get', // get 会议详情
  meetingEnd: '/media/video/meeting/end', // get 结束会议
  meetingModify: '/media/video/meeting/modify', // get 会议修改
  joinMeeting: '/media/video/meeting/joinMeeting', // get 加入会议
  startMeeting: '/media/video/meeting/startMeeting', // get 开始会议
  meetingDelete: '/media/video/meeting/delete', // get 取消会议
  inviteeUser: '/media/video/meeting/inviteeUser', // get 获取邀请用户
  recordDetail: '/media/video/meeting/record/detail', // post 获取会议详情
  recordList: '/media/video/meeting/list', // post 获取会议记录列表
  downloadRecord: '/media/video/export/downloadRecord', // get 导出会议记录
  // 直播在线
  createLive: '/media/video/live/createLive', // post 创建直播
  modify: '/media/video/live/modify', // post 修改直播名
  modifyTiming: '/media/video/live/modifyTiming', // post 修改倒计时
  modifyWatchWay: '/media/video/live/modifyWatchWay', // post 修改观看权限
  getLiveDetail: '/media/video/live/get', // get 获取直播详情
  myList: '/media/video/live/myList', // post 我的直播列表
  todayList: '/media/video/live/todayList', // post 今日直播列表
  tomorrowList: '/media/video/live/tomorrowList', // post 直播预告
  deleteLive: '/media/video/live/delete', // get 删除直播
  // 星标账户文件夹
  queryAttentionAccount: '/media/nmcm/queryAttentionAccount', // 获取星标用户
  addAttention: '/media/nmcm/addAttention', // 添加星标
  updateAttention: '/media/nmcm/updateAttention', // 取消星标账户
  findAttention: '/media/nmcm/findAttention', // 查询星标账户
  showFolder: '/media/nmcm/findFolderList', // POST 查询文件夹
  createFolder: '/media/nmcm/addFolder', // POST 创建文件夹
  updateFolder: '/media/nmcm/updateFolder', // POST 修改文件夹
  deleteFolderById: '/media/nmcm/deleteFolder', // GET 删除文件夹
  wxExportpost: '/media/exportSpreadPower/wxExport', // 下载传播力

  // 稿件发布
  localPublicList: '/media/cik/article/v2/localPublicList', // 获取本地素材（微信 微博）
  getArticleList: '/media/cik/article/v2/articleList', // 获取组合列表
  mergeArticle: '/media/oauth/weixin/material/mergeArticle', // 微信 组合生成本地素材
  deleteMergeArticle: '/media/oauth/weixin/material/deleteMergeArticle', // 删除本地组合素材
  materialList: '/media/oauth/weixin/material/materialList', // 素材库 - (从微信拉取的素材)
  mergeList: '/media/cik/article/merge/mergeList', // 素材库 - (从本地组合的素材)
  weixinList: '/media/oauth/weixin/list', // 获取当前用户认证的微信账号
  pullMaterialNews: '/media/oauth/weixin/material/pullMaterialNews', // 手动拉取指定微信公众号图文素材
  materialToArticle: '/media/oauth/weixin/material/materialToArticle', // 添加到我的稿件
  mergeUpload: '/media/oauth/weixin/material/mergeUpload', // 本地素材上传成微信永久素材
  weixinPub: '/media/oauth/weixin/material/publish', // 将微信永久图文素材发布
  wxPublishInfo: '/media/oauth/weixin/publish/pushInfo', // 推送账号获取
  // pushInfo: '/media/oauth/weixin/publish/publishInfo', // 微信发布账号获取
  wbPublishInfo: '/media/oauth/weibo/publish/accountInfo', // 微博发布账号获取
  getMaterialNews: '/media/oauth/weixin/material/getMaterialNews', // 素材库发布展示详情
  publishWeixin: '/media/oauth/weixin/publish/publish', // 发布账号获取
  bindUser: '/media/oauth/common/bindAuthorizerToUser', // cms绑定
  bindDelete: '/media/oauth/common/delete_self_authorizer', // cms删除账号
  weiboText: '/media/oauth/weibo/publish/text', // 短微博发布接口
  wxHistory: '/media/oauth/weixin/publish/history', // 微信发布记录
  wbHistory: '/media/oauth/weibo/publish/history', // 微博发布记录
  weiboPub: '/media/oauth/weibo/publish/push', // 将微博永久图文素材发布
  emailAuth: '/media/mail/auth/authorize', // 邮箱认证
  emailMyList: '/media/mail/auth/myList', // 邮箱认证
  xiumi: '/media/xiumi/auth/authorize', // 跳转秀米
  component_qrcode_page: '/media/oauth/weixin/authorize', // GET 微信授权请求链接地址
  authorize: '/media/oauth/weibo/authorize', // GET 微博认证授权请求地址
  wbrepublish: '/media/oauth/weibo/publish/republish', // 微博重新发布
  wxrepublish: '/media/oauth/weixin/publish/republish' // 微信重新发布
}
