<template>
  <div id="user-list">
    <!-- 搜索栏 -->
    <div class="data-search">
      <div class="data-center-header">
        <el-form ref="accountfrom"
                 :model="accountfrom"
                 label-width="60px">
          <el-form-item label="关键字"
                        prop="keyword">
            <el-input v-model="accountfrom.keyword"
                      size="small"
                      placeholder="请输入内容"></el-input>
          </el-form-item>
          <el-form-item label="地区"
                        prop="districts">
            <el-cascader :options="screenData"
                         size="small"
                         v-model="accountfrom.districts"
                         placeholder="全部"
                         :show-all-levels="false"
                         :props="{ checkStrictly: true }"
                         clearable></el-cascader>
          </el-form-item>
          <div class="reroder">
            <el-button type="primary"
                       size="small"
                       @click="searchList">筛选</el-button>
            <el-button size="small"
                       @click="resetForm('accountfrom')">重置</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <!-- 微博列表 -->
    <div class="account-list"
         v-if="tabs==='wb'">
      <div class="account-list-box"
           v-for="(item, index) in accountList"
           :key="index">
        <div class="account-img"
             @click="routeBank(item.wbid, index)">
          <img class="head-img"
               :src="item.headimg">
        </div>
        <div class="account-name">
          <h2 @click="routeBank(item.wbid, index)"
              v-html="item.nick"></h2>
          <p>{{item.unit}}</p>
          <div class="cancel">
            <p v-if="item.status ===1"
               class="active"
               @click="removeActive(item,index)">取消星标</p>
            <p v-else
               class="active2"
               @click="cancelActive(item,index)">添加星标</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 微信列表 -->
    <div class="account-list"
         v-if="tabs==='wx'">
      <div class="account-list-box"
           v-for="(item, index) in accountList"
           :key="index">
        <div class="account-img"
             @click="routeBank(item.wxid, index)">
          <div class="head-img"
               :style="{ 'backgroundImage': 'url(' + item.avatar + ')' }">
          </div>
        </div>
        <div class="account-name">
          <h2 @click="routeBank(item.wxid, index)"
              v-html="item.nickname"></h2>
          <p>{{item.uint}}</p>
          <div class="cancel">
            <p v-if="item.status ===1"
               class="active"
               @click="removeActive(item,index)">取消星标</p>
            <p v-else
               class="active2"
               @click="cancelActive(item,index)">添加星标</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 网站列表 -->
    <div class="account-list"
         v-if="tabs==='website'">
      <div class="account-list-box"
           v-for="(item, index) in accountList"
           :key="index">
        <div class="account-img"
             @click="routeBank(item.id, index)">
          <el-image :src="require('@/assets/images/gh.png')"
                    :fit="'cover'"
                    lazy></el-image>
        </div>
        <div class="account-name">
          <h2 @click="routeBank(item.id, index)"
              v-html="item.name"></h2>
          <p>{{item.city}}</p>
          <p class="web-blank"
             @click="checked(item.url)">{{item.url}}</p>
          <div class="cancel">
            <p v-if="item.status ===1"
               class="active"
               @click="removeActive(item,index)">取消星标</p>
            <p v-else
               class="active2"
               @click="cancelActive(item,index)">添加星标</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 头条列表 -->
    <div class="account-list"
         v-if="tabs==='toutiao'">
      <div class="account-list-box"
           v-for="(item, index) in accountList"
           :key="index">
        <div class="account-img"
             @click="routeBank(item.id, index)">
          <el-image :src="item.avatar_img"
                    :fit="'cover'"
                    lazy></el-image>
        </div>
        <div class="account-name">
          <h2 @click="routeBank(item.id, index)"
              v-html="item.name"></h2>
          <p>{{item.unit_name}}</p>
          <div class="cancel">
            <p v-if="item.status ===1"
               class="active"
               @click="removeActive(item,index)">取消星标</p>
            <p v-else
               class="active2"
               @click="cancelActive(item,index)">添加星标</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 抖音列表 -->
    <div class="account-list"
         v-if="tabs==='douyin'">
      <div class="account-list-box"
           v-for="(item, index) in accountList"
           :key="index">
        <div class="account-img"
             @click="routeBank(item.id, index)">
          <el-image :src="item.avatar_img"
                    :fit="'fill'"
                    lazy></el-image>
        </div>
        <div class="account-name">
          <h2 @click="routeBank(item.id, index)">{{item.nickname}}</h2>
          <p>{{item.unit_name}}</p>
          <div class="cancel">
            <p v-if="item.status ===1"
               class="active"
               @click="removeActive(item,index)">取消星标</p>
            <p v-else
               class="active2"
               @click="cancelActive(item,index)">添加星标</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 一点列表 -->
    <div class="account-list"
         v-if="tabs==='yidian'">
      <div class="account-list-box"
           v-for="(item, index) in accountList"
           :key="index">
        <div class="account-img"
             @click="routeBank(item.id, index)">
          <el-image :src="item.channel_cover"
                    :fit="'cover'"
                    lazy></el-image>
        </div>
        <div class="account-name">
          <h2 @click="routeBank(item.id, index)"
              v-html="item.media_name"></h2>
          <p>{{item.unit_name}}</p>
          <div class="cancel">
            <p v-if="item.status ===1"
               class="active"
               @click="removeActive(item,index)">取消星标</p>
            <p v-else
               class="active2"
               @click="cancelActive(item,index)">添加星标</p>
          </div>
        </div>
      </div>
    </div>
    <!-- 暂无用户信息 -->
    <div v-if="dataNull"
         class="text-center">
      <img :src="require('@/assets/images/empty-data.png')">
    </div>
    <!-- <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data> -->
    <pagination @pagingChange="getPagingChange"
                :total="total"
                ref="child"></pagination>
    <!-- 选择文件夹 -->
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal="ismodal"
                 @close="getDialog()"
                 center
                 width="30%">
        <span>请选择文件夹:</span>
        <el-select v-model="value"
                   placeholder="请选择"
                   size="small"
                   @change="disableds">
          <el-option v-for="item in options"
                     :key="item.id"
                     :label="item.folderName"
                     :value="item.id">
          </el-option>
        </el-select>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     :disabled="openIsDisabled"
                     @click="setDialogText()">确 定</el-button>
          <el-button @click="getDialog()">取 消</el-button>
          <el-button type="success"
                     @click="openNew()">新建文件夹</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import pagination from '@/components/Pagination.vue'
export default {
  data () {
    return {
      total: 0, // 总数
      wbId: '',
      dataNull: false,
      dataLess: false,
      dialogVisible: false,
      openIsDisabled: true,
      ismodal: false,
      value: '',
      ids: '',
      screenData: [],
      accountfrom: {
        districts: [],
        keyword: '',
        cid: 1,
        publishTime: [],
        sortDirection: '',
        sortField: '',
        pageNum: 1,
        pageSize: 20
      },
      UserList: true,
      openName: '',
      type: '',
      tabs: '',
      starApi: '',
      parameter: {},
      options: [],
      accountList: []
    }
  },
  created () {
    this.dis = parseInt(this.$route.query.dis)
    this.accountfrom.cid = this.dis
    this.tabs = this.$route.query.tabs
    this.getRouterData()
    this.getScreenlist()
  },
  components: {
    pagination
  },
  methods: {
    // 分页
    getPagingChange (change) {
      this.accountfrom.pageNum = change.page
      this.accountfrom.pageSize = change.size
      this.getRouterData()
    },
    // 获取全市用户信息
    getRouterData () {
      switch (this.tabs) {
        case 'wx':
          this.type = 1
          this.address = this.$api.wxUserList
          this.openName = 'StarAccountWx'
          break
        case 'wb':
          this.type = 2
          this.address = this.$api.wbUserList
          this.openName = 'StarAccountWb'
          break
        case 'website':
          this.type = 3
          this.address = this.$api.wzUserList
          this.openName = 'StarAccountWebsite'
          break
        case 'toutiao':
          this.type = 4
          this.address = this.$api.ttUserList
          this.openName = 'StarAccountTouTiao'
          break
        case 'douyin':
          this.type = 5
          this.address = this.$api.dyUserList
          this.openName = 'StarAccountDouYin'
          break
        case 'yidian':
          this.type = 6
          this.address = this.$api.ydUserList
          this.openName = 'StarAccountYiDian'
          break
      }
      this.dataNull = false
      this.$http.post(this.address, this.accountfrom)
        .then(res => {
          if (res.data.code === 200 && res.data.data.list) {
            this.accountList = res.data.data.list
            this.total = res.data.data.count
          } else {
            this.accountList = []
            this.dataNull = true
          }
        }
        ).catch(() => { })
    },
    // 分页
    // getData () {
    //   this.accountfrom.pageNum++
    //   this.getRouterData()
    // },
    // 获取地区列表
    getScreenlist () {
      let row = {
        cid: this.accountfrom.cid,
        type: this.type
      }
      this.$http.post(this.$api.findLevelDistricts, row)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 添加星标
    modifyStar () {
      switch (this.tabs) {
        case 'wb':
          this.parameter.accountId = this.ids.wbid
          break
        case 'wx':
          this.parameter.accountId = this.ids.wxid
          break
        case 'website':
          this.parameter.accountId = this.ids.id
          break
        case 'toutiao':
          this.parameter.accountId = this.ids.id
          break
        case 'douyin':
          this.parameter.accountId = this.ids.id
          break
        case 'yidian':
          this.parameter.accountId = this.ids.id
          break
      }
      this.parameter.typeId = this.type
      this.parameter.cid = this.accountfrom.cid
      this.parameter.folderId = this.value
      this.$http.post(this.$api.addAttention, this.parameter)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功!')
            this.accountfrom.pageNum = 1
            this.accountList = []
            this.getRouterData()
          }
        })
        .catch(() => {
        })
    },
    // 点击星标
    cancelActive (item, index) {
      this.dialogVisible = true
      this.status = 1
      this.getFolder(item)
    },
    // 取消星标
    removeActive (item, index) {
      this.$message.warning('请在星标账户中取消！')
    },
    // 获取用户详情
    routeBank (userId, index) {
      this.$router.push({ name: 'CenterDetail', query: { id: userId, type: this.tabs, come: this.$route.query.dis } })
    },
    checked (url) {
      window.open(url, '_blank')
    },
    // 获取文件夹信息
    getFolder (item) {
      this.ids = item
      let accountfrom = {
        typeId: this.type,
        pageSize: '30',
        pageNum: '1'
      }
      this.$http.post(this.$api.showFolder, accountfrom)
        .then(res => {
          if (res.data.code === 200 && res.data.data.content) {
            this.options = res.data.data.content
            // let splice = {
            //   folderName: '新建文件夹',
            //   id: this.tabs
            // }
            // this.options.splice(this.options.length, 0, splice)
          }
        })
        .catch(() => {
        })
    },
    openNew () {
      this.$router.push({ name: this.openName, query: { newFolder: true } })
    },
    disableds () {
      this.openIsDisabled = false
      if (this.value === this.tabs) {
        this.$router.push({ name: this.openName, query: { newFolder: true } })
      }
    },
    // 重置
    resetForm (form) {
      this.dataNull = false
      this.$refs[form].resetFields()
      this.accountfrom.pageNum = 1
      this.accountList = []
      this.$refs.child.handleCurrentChange(this.accountfrom.pageNum)
      this.getRouterData()
    },
    // 筛选
    searchList () {
      this.accountfrom.pageNum = 1
      this.accountList = []
      this.$refs.child.handleCurrentChange(this.accountfrom.pageNum)
      this.getRouterData()
    },
    // 确定
    setDialogText () {
      if (this.value) {
        this.dialogVisible = false
        this.modifyStar()
      } else {
        this.$message.warning('请选择文件夹!')
      }
    },
    getDialog () { this.dialogVisible = false }
  }
}

</script>
<style scoped>
#user-list {
  box-sizing: border-box;
  min-height: 500px;
  padding: 20px;
}
#user-list .account-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
#user-list .account-list-box {
  width: 25%;
  display: flex;
  cursor: pointer;
  margin: 27px 0;
}
#user-list .account-list::after {
  content: '';
  flex: auto;
}
.account-list .account-name {
  margin-left: 10px;
}
#user-list .account-list .account-name h2 {
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 20px;
  font-weight: bold;
  color: black;
  line-height: 32px;
  margin-top: 5px;
}
.account-name p {
  font-size: 12px;
  line-height: 22px;
  cursor: pointer;
}
.account-name span {
  line-height: 22px;
}
#user-list .news {
  position: absolute;
  left: 70px;
  top: 0px;
  z-index: 999;
}
.account-name .cancel p {
  width: 60px;
  height: 20px;
  text-align: center;
  border-radius: 3px;
  line-height: 20px;
  margin-top: 5px;
}
.account-name .active {
  background-color: #6db8ef;
  color: #fff;
}
.account-name .active2 {
  background-color: #cbcbcb;
  color: #fff;
}
.data-center-header {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 0 15px;
  font-size: 14px;
  color: #333;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.data-center-header {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
}
.data-center-header .el-form {
  display: flex;
  justify-content: space-between;
}
.data-center-header .el-form .el-form-item {
  margin: 0;
  margin-right: 20px;
}
.head-img {
  width: 80px;
  height: 80px;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  margin-right: 10px;
  background-position: center;
}
.account-img .el-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
}
.data-center-header .el-form-item .el-checkbox:last-child {
  margin-left: -70px;
}
.data-search .el-input {
  width: 240px;
}
.reroder {
  width: 170px;
  line-height: 40px;
}
.web-blank {
  color: #6db8ef;
  text-decoration: underline;
  cursor: pointer;
  width: 160px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
