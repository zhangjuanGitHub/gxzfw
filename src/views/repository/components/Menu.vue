<template>
  <el-menu
    :default-active="getRoutePath"
    @select="handleSelect"
    :unique-opened="true"
    class="el-menu-vertical-demo hotnews-box">
    <el-submenu index="1">
      <template slot="title">
        <span>热点新闻</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="jc">政法要闻</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="media">政法新媒体</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="ranking">热点排行</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
    <el-submenu index="3">
      <template slot="title">
        <span>媒体素材库</span>
      </template>
      <el-menu-item-group>
        <el-menu-item index="newscloud">个人文档素材库</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="publicnews">公共文档素材库</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="person">个人图像资料库</el-menu-item>
      </el-menu-item-group>
      <el-menu-item-group>
        <el-menu-item index="public">公共图像资料库</el-menu-item>
      </el-menu-item-group>
      <!-- <el-menu-item-group>
        <el-menu-item index="clap">随手拍</el-menu-item>
      </el-menu-item-group> -->
    </el-submenu>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Menu',
  data () {
    return {
      activeName: ''
    }
  },
  methods: {
    handleSelect (change) {
      switch (change) {
        case 'jc':
          this.$router.push({ name: 'Inspect' })
          break
        case 'clap':
          this.$router.push({ name: 'ClapAtWill' })
          break
        case 'media':
          this.$router.push({ name: 'NewMediaWx' })
          break
        case 'ranking':
          this.$router.push({ name: 'HotRankingWx' })
          break
        case 'topic':
          this.$router.push({ name: 'TopicList' })
          break
        case 'newscloud':
          this.$router.push({ name: 'NewCloudWx' })
          break
        case 'publicnews':
          this.$router.push({ name: 'PublicNewsWx' })
          break
        case 'public':
          this.$router.push({ name: 'publicImage' })
          break
        case 'person':
          this.$router.push({ name: 'personImage' })
          break
        case 'setup':
          this.$router.push({ name: 'SetColumn' })
          break
        default:
          this.$router.push({ name: 'DataCenterWx', query: { dis: change } })
          break
      }
    }
  },
  created () {},
  mounted () {
    if (!this.columnMenu) {
      this.$http
        .get(this.$api.queryColumn)
        .then(res => {
          if (res.data.code === 200) {
            this.$store.commit('mutations/columnMenu', res.data.data)
          }
        })
        .catch(() => {})
    }
  },
  computed: {
    ...mapGetters('mutations', {
      columnMenu: 'columnMenu'
    }),
    getRoutePath () {
      return this.$route.path.split('/')[2]
    }
    // getRouteName () {
    //   let routeName = this.$route.name
    //   if (routeName.substring(0, 8) === 'NewMedia') {
    //     return 'NewMediaWx'
    //   } else {
    //     return routeName
    //   }
    // }
  }
}
</script>

<style scoped>
</style>
