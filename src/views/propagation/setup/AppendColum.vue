<template>
  <div class="install">
    <div class="cloum-set">
      <div class="account-set">
        <div class="cloum-type">
          <el-radio-group v-model="resource"
                          @change="selectRadio">
            <el-radio label="1">微信</el-radio>
            <el-radio label="2">微博</el-radio>
            <el-radio label="3">网站</el-radio>
            <el-radio label="4">头条</el-radio>
            <el-radio label="5">抖音</el-radio>
            <el-radio label="6">一点</el-radio>
          </el-radio-group>
          <div class="seach">
            <el-input v-model="cloumKey" placeholder="请输入账户关键字" size="small"></el-input>
          </div>
          <div class='button'>
            <el-button @click="cloumKeySeach"
                      size="small"
                      type="primary">搜索</el-button>
            <el-button @click="debouncedGetAnswer"
                      size="small"
                      type="primary">确定添加</el-button>
            <el-button @click="backUrl"
                      size="small">返回</el-button>
          </div>
        </div>
        <div class="account-list">
          <div class="account-list-box"
               v-for="(item,index) in accountList"
               :key="index">
            <!-- 微信 -->
            <div class="account-details"
                 v-if="resource === '1'">
              <div class="account-img">
               <div v-if="item.avatar" class="head-image"
                     @click="showDetail(item.wxid)"
                     :style="{ 'backgroundImage': 'url(' + item.avatar + ')' }">
                </div>
                <el-image v-else class="head-image"
                          :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.wxid)"
                          fit="fill"></el-image>
              </div>
              <div class="account-name">
                <h2 v-html="item.nickname"></h2>
                  <p v-html="item.region"></p>
              </div>
              <div class="delete-checkbox-box">
                <el-checkbox-group v-model="addCheckBoxList">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.wxid">添加</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 微博 -->
            <div class="account-details"
                 v-if="resource === '2'">
              <div class="account-img">
               <el-image v-if="item.headimg" class="head-image"
                          :src="item.headimg"
                          @click="showDetail(item.wbid)"
                          fit="fill"></el-image>
                <el-image v-else class="head-image"
                          :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.wbid)"
                          fit="fill"></el-image>
              </div>
              <div class="account-name">
                <h2 v-html="item.nick"></h2>
                  <p v-html="item.region"></p>
              </div>
              <div class="delete-checkbox-box">
                <el-checkbox-group v-model="addCheckBoxList">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.wbid">添加</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 网站 -->
            <div class="account-details"
                 v-if="resource === '3'">
              <div class="account-img">
                <el-image class="head-image"
                          :src="require('@/assets/images/gh.png')"
                          fit="fill"
                          @click="showDetail(item.id)"></el-image>
              </div>
              <div class="account-name">
                <h2 v-html="item.name"></h2>
                <p v-html="item.city">}</p>
              </div>
              <div class="delete-checkbox-box">
                <el-checkbox-group v-model="addCheckBoxList">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id">添加</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 头条 -->
            <div class="account-details"
                 v-if="resource === '4'">
              <div class="account-img">
                <el-image class="head-image" v-if="item.avatar_img" :src="item.avatar_img"
                          @click="showDetail(item.id)"
                          fit="fill"></el-image>
                <el-image v-else :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.id)"
                          fit="fill"></el-image>
              </div>
              <div class="account-name">
                <h2 v-html="item.name">{{item.name}}</h2>
                  <p v-html="item.briefIntroduction"></p>
              </div>
              <div class="delete-checkbox-box">
                <el-checkbox-group v-model="addCheckBoxList">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id">添加</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 抖音 -->
            <div class="account-details"
                 v-if="resource === '5'">
              <div class="account-img">
                <el-image class="head-image" v-if="item.avatar_img" :src="item.avatar_img"
                          @click="showDetail(item.id)"
                          fit="fill"></el-image>
                <el-image v-else :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.id)"
                          fit="fill"></el-image>
              </div>
              <div class="account-name">
               <h2 v-html="item.nickname"></h2>
                  <p v-html="item.city"></p>
              </div>
              <div class="delete-checkbox-box">
                <el-checkbox-group v-model="addCheckBoxList">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id">添加</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <!-- 一点 -->
            <div class="account-details"
                 v-if="resource === '6'">
              <div class="account-img">
                <el-image class="head-image" v-if="item.channel_cover" :src="item.channel_cover"
                          @click="showDetail(item.id)"
                          fit="cover"></el-image>
                <el-image v-else :src="require('@/assets/images/gh.png')"
                          @click="showDetail(item.id)"
                          fit="cover"></el-image>
              </div>
              <div class="account-name">
                <h2 v-html="item.media_name"></h2>
                  <p v-html="item.province"></p>
              </div>
              <div class="delete-checkbox-box">
                <el-checkbox-group v-model="addCheckBoxList">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id">添加</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div v-if="dataNull"
             class="min-height text-center">
          <img :src="require('@/assets/images/empty-data.png')"
               alt="">
        </div>
      </div>
    </div>
    <el-dialog :modal-append-to-body="false"
               :visible.sync="dialogFormVisible"
               width="40%">
      <account-details :accountDetails="accountDetails"></account-details>
    </el-dialog>
    <pagination @pagingChange="getPagingChange"
                :total="total"
                ref="child"></pagination>
    <!-- <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data> -->
  </div>
</template>
<script>
// import scrollData from '@/components/ScrollData'
import pagination from '@/components/Pagination.vue'
import AccountDetails from '@/views/propagation/setup/AccountDetails'
export default {
  data () {
    return {
      accountDetails: '',
      dataNull: false,
      cloumKey: '',
      addCheckBoxList: [], // 需要添加的数据
      total: 0, // 总数
      isDislabe: false,
      resource: '1', // 账号类型
      dialogFormVisible: false,
      activeName: 'first',
      accountList: [],
      addAccountimg: {
        weixin: require('@/assets/images/dataimg/u5586.png'),
        weibo: require('@/assets/images/dataimg/u1770.png'),
        wanzhan: require('@/assets/images/dataimg/u5607.png'),
        toutiao: require('@/assets/images/dataimg/u1766.png')
      },
      page: {
        pageNum: 1,
        pageSize: 20
      }
    }
  },
  methods: {
    backUrl () {
      this.$router.go(-1)
    },
    // 选择单选框
    selectRadio () {
      this.accountList = []
      this.page.pageNum = 1
      this.$refs.child.handleCurrentChange(this.page.pageNum)
      this.getList()
    },
    // 分页
    getPagingChange (change) {
      this.page.pageNum = change.page
      this.page.pageSize = change.size
      this.getList()
    },
    // 下拉组件
    // getData () {
    //   this.page.pageNum++
    //   this.getList()
    // },
    // 获取列表
    getList () {
      this.dataNull = false
      let row = {
        type: parseInt(this.resource) || 1,
        cid: this.cid,
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        keyword: this.cloumKey
      }
      this.$http.post(this.$api.queryNoAddAcc, row)
        .then(res => {
          if (res.data.data && res.data.data.list.length) {
            this.accountList = res.data.data.list
            this.total = res.data.data.count
          }
          if (!this.accountList.length) {
            this.total = 0
            this.dataNull = true
          }
        })
        .catch(() => { })
    },
    cloumKeySeach () {
      this.accountList = []
      this.page.pageNum = 1
      this.$refs.child.handleCurrentChange(this.page.pageNum)
      this.getList()
    },
    // 确认添加
    confirmAdd () {
      if (!this.addCheckBoxList.length) {
        this.$message.warning('请选择要添加的账号！')
        return false
      }
      let row = {
        type: this.resource,
        cid: this.cid,
        ids: this.addCheckBoxList.join(',')
      }
      this.$http.post(this.$api.addAccForCol, row)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.$router.push({ name: 'ColumnDetail', query: { columDetail: this.cid } })
          }
        })
        .catch(() => { })
      this.addCheckBoxList = []
    },
    // 显示详情
    showDetail (id) {
      let type = this.resource
      this.$http.get(this.$api.queryInfoById, { params: { type: type, id: id } })
        .then(res => {
          if (res.data.data) {
            this.accountDetails = res.data.data.list[0]
            this.accountDetails.type = type
          }
        })
        .catch(() => { })
      this.dialogFormVisible = true
    }
  },
  created () {
    this.cid = this.$route.query.cid
    this.getList()
    this.debouncedGetAnswer = this.$debounce(this.confirmAdd, 500)
  },
  components: {
    AccountDetails,
    pagination
  }
}
</script>
<style scoped>
.account-set {
  min-height: 500px;
  box-sizing: border-box;
  overflow: hidden;
}
.account-set .set-title {
  font-size: 16px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin-bottom: 20px;
}
.account-set .set-title i {
  font-style: normal;
  text-decoration: underline;
  margin: 0 5px;
  color: #2899ed;
  cursor: pointer;
}
.account-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.cloum-set .account-list-box {
  width: 25%;
  display: flex;
  justify-content: space-around;
  margin: 40px 0 20px 0;
  text-align: center;
}
.cloum-set .set-img img {
  vertical-align: middle;
  margin-right: 5px;
}
.delete-checkbox-box {
  margin-top: 10px;
}
.cloum-set .account-list .account-name h2 {
  font-size: 16px;
  font-weight: bold;
  color: black;
  line-height: 40px;
  margin-top: 5px;
}
.cloum-set .account-name p {
  font-size: 12px;
  color: #ccc;
  line-height: 14px;
  cursor: pointer;
}
.cloum-set .button {
  float: right;
  margin-right: 15px;
}
.cloum-set .button .el-button {
  border-radius: 3px;
}
.cloum-set .button i {
  margin-right: 5px;
}
.cloum-set .set-img {
  display: inline-block;
  height: 100%;
  width: 100%;
}
.cloum-set .el-radio{
  line-height: 32px;
}
.cloum-set .el-radio-group img {
  vertical-align: middle;
  margin-right: 13px;
}
.cloum-set .cloum-type {
  line-height: 28px;
  display: flex;
  justify-content: space-between
}
.account-img {
  cursor: pointer;
}
.account-img .head-image {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin: 0px auto;
  overflow: hidden;
  background-position: center;
}
.account-set .el-button {
  width: 80px;
}
.seach{
  width: 230px;
}
</style>
