<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'DataCenterWx', query:{dis:this.cid}}">新媒体传播力</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'StarAccountWx'}">星标账户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="bigData-box">
      <el-row :gutter="10">
        <el-col :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu @colum="GetColum"></v-menu>
        </el-col>
        <el-col :xs="21"
                :sm="21"
                :md="21"
                :lg="20"
                :xl="20" class="reset">
          <el-tabs type="border-card"
                   v-model="activeName"
                   @tab-click="handleClick(activeName)">
            <el-tab-pane name="/propagation/star/wx">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/manage/wx.png')">微信</span>
            </el-tab-pane>
            <el-tab-pane name="/propagation/star/wb">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/manage/wb.png')">微博</span>
            </el-tab-pane>
            <el-tab-pane name="/propagation/star/website">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/manage/wz.png')">门户网站</span>
            </el-tab-pane>
            <el-tab-pane name="/propagation/star/toutiao">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/manage/tt.png')">今日头条</span>
            </el-tab-pane>
            <el-tab-pane name="/propagation/star/douyin">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/dy.png')">抖音</span>
            </el-tab-pane>
            <el-tab-pane name="/propagation/star/yidian">
              <span class="bigData-span"
                    slot="label"><img :src="require('@/assets/images/manage/yd.png')">一点资讯</span>
            </el-tab-pane>
            <router-view></router-view>
          </el-tabs>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import vMenu from '@/views/propagation/components/Menu'
export default {
  name: 'Assessment',
  data () {
    return {
      cid: '',
      activeName: '',
      headerCard: [],
      columName: ''
    }
  },
  methods: {
    handleClick (activeName) {
      this.$router.push({ path: activeName })
    },
    // 栏目名称
    GetColum (res) {
      this.columName = res.name
      this.dis = res.dis
    }
  },
  created () {
    if (this.userInfo.cid) {
      this.cid = this.userInfo.cid
    }
    switch (this.$route.query.type) {
      case 'wx':
        this.activeName = '/propagation/star/wx'
        break
      case 'wb':
        this.activeName = '/propagation/star/wb'
        break
      case 'website':
        this.activeName = '/propagation/star/website'
        break
      case 'yd':
        this.activeName = '/propagation/star/yidian'
        break
      case 'td':
        this.activeName = '/propagation/star/toutiao'
        break
      case 'douyin':
        this.activeName = '/propagation/star/douyin'
        break
      default:
        this.activeName = this.$route.path
        break
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo // 是否存在用户信息
    })
  },
  watch: {
    $route () {
      switch (this.$route.query.type) {
        case 'wx':
          this.activeName = '/propagation/star/wx'
          break
        case 'wb':
          this.activeName = '/propagation/star/wb'
          break
        case 'website':
          this.activeName = '/propagation/star/website'
          break
        case 'yd':
          this.activeName = '/propagation/star/yidian'
          break
        case 'td':
          this.activeName = '/propagation/star/toutiao'
          break
        default:
          this.activeName = this.$route.path
          break
      }
    }
  },
  components: {
    vMenu
  }
}
</script>

<style lang="scss" scoped>
@import "./bigData";
.bigData-span {
  display: flex;
  align-items: center;
}
.bigData-span img {
  margin-right: 5px;
}
.reset{
  padding: 0 !important;
}
</style>
