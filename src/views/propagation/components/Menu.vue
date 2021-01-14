<template>
  <el-menu :default-active="getRouterPath"
           class="aside-menu-style"
           :unique-opened="true">
    <el-submenu index="one" v-if="this.userInfo.cid">
      <template slot="title">
        <span>我的栏目</span>
      </template>
      <el-menu-item-group>
        <el-menu-item v-for="(item, id) in columnMenu"
                      :key="id"
                      @click="handleSelect(item)"
                      :index='item.id.toString()'>
          <el-popover
            :ref="`popover-${item.$index}`"
            placement="left-start"
            :visible-arrow="true"
            trigger="click">
            <div style="text-align: center; margin: 0" >
              <div class="star-account" v-for="(ayy, index) in userCont" :key="index" @click="routeDetail(item,ayy,index)">
                <span v-html="ayy.name" class="account-button" v-if="userCont.length>0"></span>
              </div>
              <div v-if="userCont.length<=0" class="account-none" @click="openUser(item,id)">暂无关注账号</div>
            </div>
            <!-- <span slot="reference" v-if="item.level===1">{{item.column_name}}<i>(省动态)</i></span>
            <span slot="reference" v-else-if="item.level===2">{{item.column_name}}<i>(市动态)</i></span>
            <span slot="reference" v-else-if="item.level===3">{{item.column_name}}<i>(区动态)</i></span> -->
            <span slot="reference">{{item.column_name}}</span>
          </el-popover>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index='effect'>
      <template slot="title">
        <span>传播分析</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="exponent"
                      @click="handleSelect('exponent')">
          <span slot="title">传播力指数</span>
        </el-menu-item>
        <el-menu-item index="concern"
                      @click="handleSelect('concern')">
          <span slot="title">网站媒体关注度</span>
        </el-menu-item>
        <el-menu-item index="articles"
                      @click="handleSelect('articles')">
          <span slot="title">文章传播列表</span>
        </el-menu-item>
        <el-menu-item index="articlesmonitor"
                      @click="handleSelect('articlesmonitor')">
          <span slot="title">文章实时监测</span>
        </el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-menu-item index="star"
                  @click="handleSelect('star')" class="bigdata-menu">
      <span slot="title">星标账户</span>
    </el-menu-item>
    <el-menu-item class="bigdata-menu"
                  index="setup"
                  @click="handleSelect('setup')" v-permission="402">
      <span slot="title">设置</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Menu',
  data () {
    return {
      showPopover: false,
      colum: {},
      visible: false,
      columName: 'DataCenterWx',
      userCont: []
    }
  },
  mounted () {
    if (!this.columnMenu) {
      this.$http.get(this.$api.queryMeColumn)
        .then(res => {
          if (res.data.code === 200) {
            this.$store.commit('mutations/columnMenu', res.data.data)
          }
        })
        .catch(() => { })
    }
  },
  methods: {
    handleSelect (change) {
      let params = {
        typeId: 1,
        cid: change.id
      }
      switch (this.$route.path.split('/')[3]) {
        case 'wx':
          params.typeId = 1
          this.columName = 'DataCenterWx'
          break
        case 'wb':
          params.typeId = 2
          this.columName = 'DataCenterWb'
          break
        case 'website':
          params.typeId = 3
          this.columName = 'DataCenterWebsite'
          break
        case 'toutiao':
          params.typeId = 4
          this.columName = 'DataCenterTouTiao'
          break
        case 'douyin':
          params.typeId = 5
          this.columName = 'DataCenterDouYin'
          break
        case 'yidian':
          params.typeId = 6
          this.columName = 'DataCenterYiDian'
          break
      }
      this.userCont = []
      switch (change) {
        case 'star':
          this.$router.push({ name: 'StarAccountWx' })
          break
        case 'exponent':
          this.$router.push({ name: 'WxMonitor', query: { tabs: 'wx' } })
          break
        case 'concern':
          this.$router.push({ name: 'EffectConcern' })
          break
        case 'articles':
          this.$router.push({ name: 'EffectArticle' })
          break
        case 'articlesmonitor':
          this.$router.push({ name: 'EffectArticleMonitor' })
          break
        case 'setup':
          this.$router.push({ name: 'SetColumn' })
          break
        default:
          this.$router.push({ name: this.columName, query: { dis: change.id } })
          this.$http.post(this.$api.queryAttentionAccount, params)
            .then(res => {
              if (res.data.code === 200) {
                this.userCont = res.data.data
                if (this.userCont.length > 4) {
                  this.userCont.length = 4
                }
              }
            })
            .catch(() => {
            })
          break
      }
    },
    routeDetail (item, ayy, index) {
      this.$refs[`popover-${item.$index}`][index].doClose()
      this.$router.push({ name: 'CenterDetail', query: { id: ayy.accId, type: ayy.type, come: item.id } })
    },
    openUser (item, index) {
      this.$refs[`popover-${item.$index}`][index].doClose()
      this.$router.push({ name: 'UserList', query: { dis: item.id, tabs: this.$route.path.split('/')[3] } })
    }
  },
  computed: {
    ...mapGetters('mutations',
      {
        columnMenu: 'columnMenu'
      }),
    ...mapState({
      userInfo: state => state.user.userInfo // 是否存在用户信息
    }),

    getRouterPath () {
      let routerPath = this.$route.path.split('/')[2]
      let routerParams = this.$route.query.dis
      var reg = /^[1-9][0-9]*$/
      switch (this.$route.query.statisType) {
        case 'wx':
          routerPath = 'statisticswx'
          break
        case 'wb':
          routerPath = 'statisticswb'
          break
        case 'toutiao':
          routerPath = 'statisticstd'
          break
        case 'yd':
          routerPath = 'statisticsyd'
          break
      }
      if (this.$route.query.come) {
        return this.$route.query.come.toString()
      } else if (reg.test(routerParams)) {
        return routerParams.toString()
      } else {
        return routerPath
      }
    }
  },
  watch: {
    $router () {
      console.log(this.$route.query.dis)
    }
  }
}
</script>
<style lang="scss">
@import "../bigData";
</style>
<style scoped>
.el-menu {
  border: none;
}
.el-submenu {
  border-bottom: 3px solid #f5f5f5;
}
.colum-img {
  margin-right: 5px;
}
.el-menu-item-group .el-menu-item {
  border-top: 1px solid #f5f5f5;
}
.bigdata-menu {
  border-top: 1px solid #f5f5f5;
}
.big-data-ul img {
  width: 20px;
}
.star-account{
  border: 1px solid #adadad;
  border-radius: 5px;
  margin-bottom: 3px;
  padding: 8px 0;
}
.star-account:hover{
  background-color: #ecf5ff;
}
.account-button{
  cursor: pointer;
}
.account-none{
  text-decoration: underline;
  color: #409eff;
  cursor: pointer;
}
</style>
