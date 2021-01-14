<template>
  <el-menu :default-active="getRouterPath"
           @select="handleSelect"
           class="el-menu-vertical-demo assessment-book">
    <el-menu-item class="assessment-menu"
                  index="list">
      <img class="assessment-img"
           :src="require('@/assets/images/manage/list.png')">
      <span slot="title">新媒体工作量考核</span>
    </el-menu-item>
    <el-menu-item class="assessment-menu"
                  index="propaganda">
      <img class="assessment-img"
           :src="require('@/assets/images/manage/Propaganda.png')">
      <span slot="title">新闻宣传工作运营</span>
    </el-menu-item>
    <el-menu-item class="assessment-menu"
                  index="contribution">
      <img class="assessment-img"
           :src="require('@/assets/images/manage/contribution.png')">
      <span slot="title">投稿贡献统计</span>
    </el-menu-item>
    <el-menu-item class="assessment-menu"
                  index="construct">
      <img class="assessment-img"
           :src="require('@/assets/images/manage/construct.png')">
      <span slot="title">新媒体建设评估</span>
    </el-menu-item>
    <el-menu-item class="assessment-menu"
                  index="response">
      <img class="assessment-img"
           :src="require('@/assets/images/manage/response.png')">
      <span slot="title">响应性评估</span>
    </el-menu-item>
    <!--    <el-menu-item class="assessment-menu"-->
    <!--                  v-if="$isPermission(1)"-->
    <!--                  index="account">-->
    <!--      <img class="assessment-img"-->
    <!--           :src="require('@/assets/images/manage/matrix.png')">-->
    <!--      <span slot="title">新媒体账号管理</span>-->
    <!--    </el-menu-item>-->
    <!-- <el-menu-item class="assessment-menu"
                  v-permission="506"
                  index="AddressDirectly">
      <img class="assessment-img"
           src="@/assets/images/resimg/user.png"
           alt="">
      <span slot="title">人员通讯录</span>
    </el-menu-item> -->
    <!--    <el-submenu index="1">-->
    <!--      <template slot="title"><img class="assessment-img" src="@/assets/images/resimg/user.png"-->
    <!--                                     alt="">人员通讯录</template>-->
    <!--      <el-menu-item-group>-->
    <!--        <el-menu-item index="AddressDirectly">直属团队</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--      <el-menu-item-group>-->
    <!--        <el-menu-item index="AddressNewsletter">通讯员团队</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--      <el-menu-item-group>-->
    <!--        <el-menu-item index="AddressReview">网评员团队</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--      <el-menu-item-group>-->
    <!--        <el-menu-item index="AddressExpert">专家学者团队</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--      <el-menu-item-group>-->
    <!--        <el-menu-item index="AddressBookbigv">网红大V团队</el-menu-item>-->
    <!--      </el-menu-item-group>-->
    <!--    </el-submenu>-->
    <!--    <el-menu-item class="assessment-menu"-->
    <!--                  v-if="$isPermission(1)"-->
    <!--                  index="Directly">-->
    <!--      <img class="assessment-img"-->
    <!--           :src="require('@/assets/images/manage/matrix.png')">-->
    <!--      <span slot="title">人员通讯录</span>-->
    <!--    </el-menu-item>-->
  </el-menu>
</template>

<script>
export default {
  name: 'Menu',
  data () {
    return {
    }
  },
  methods: {
    handleSelect (change) {
      switch (change) {
        case 'list':
          this.$router.push({ name: 'AssessmentWx' })
          break
        case 'construct':
          this.$router.push({ name: 'AssessmentTotal' })
          break
        case 'account':
          this.$router.push({ name: 'AssessmentAccountList' })
          break
        case 'contribution':
          this.$router.push({ name: 'Manuscript' })
          break
        case 'response':
          this.$router.push({ name: 'Response' })
          break
        case 'propaganda':
          this.$router.push({ name: 'Summary' })
          break
        case 'Directly':
          this.$router.push({ name: 'Directly' })
          break
        default:
          this.$router.push({ name: change })
          break
      }
    }
  },
  created () { },
  components: {},
  computed: {
    getRouterPath () {
      let routePath = this.$route.path.split('/')[2]
      let routePath2 = this.$route.path.split('/')[3]
      if (routePath === 'address') {
        return routePath.slice(0, 1).toUpperCase() + routePath.slice(1) + routePath2.slice(0, 1).toUpperCase() + routePath2.slice(1)
      }
      return routePath
    }
  }
}
</script>

<style scoped>
.assessment-img {
  width: 25px;
  height: 25px;
  margin-right: 5px;
}
</style>
