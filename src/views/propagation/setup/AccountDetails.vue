<template>
  <div class="add-account">
    <el-form :model="dynamicValidateForm"
             label-width="83px"
             disabled>
      <el-form-item class="bordno"
                    label="账号类型:"
                    prop="type">
        <el-radio-group v-model="accountDetails.type">
          <el-radio label="1"
                    v-if="accountDetails.type === '1'"><img :src="addAccountimg.weixin">微信</el-radio>
          <el-radio label="2"
                    v-else-if="accountDetails.type === '2'"><img :src="addAccountimg.weibo">微博</el-radio>
          <el-radio label="3"
                    v-else-if="accountDetails.type === '3'"><img :src="addAccountimg.wangzhan">网站</el-radio>
          <el-radio label="4"
                    v-else-if="accountDetails.type === '4'"><img :src="addAccountimg.toutiao">今日头条</el-radio>
          <el-radio label="5"
                    v-else-if="accountDetails.type === '5'"><img :src="addAccountimg.douyin">抖音</el-radio>
          <el-radio label="6"
                    v-else-if="accountDetails.type === '6'"><img :src="addAccountimg.yidian">一点资讯</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + '名'"
                    v-if="accountDetails.type === '1'">
        <el-input v-model="accountDetails.nickname"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + '名'"
                    v-else-if="accountDetails.type === '2'">
        <el-input v-model="accountDetails.nick"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + '名'"
                    v-else-if="accountDetails.type === '3'">
        <el-input v-model="accountDetails.name"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + '名'"
                    v-else-if="accountDetails.type === '4'">
        <el-input v-model="accountDetails.nick"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + '名'"
                    v-else-if="accountDetails.type === '5'">
        <el-input v-model="accountDetails.nickname"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + '名'"
                    v-else-if="accountDetails.type === '6'">
        <el-input v-model="accountDetails.media_name"></el-input>
      </el-form-item>
      <!--      ///////////////////////区分微信、微博、网站、头条//////////////////////////-->
      <el-form-item class="typtext"
                    :label="accountName + 'id'"
                    v-if="accountDetails.type === '1'">
        <el-input v-model="accountDetails.name"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + 'id'"
                    v-else-if="accountDetails.type === '2'">
        <el-input v-model="accountDetails.uid"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + 'id'"
                    v-else-if="accountDetails.type === '4'">
        <el-input v-model="accountDetails.media_id"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + 'id'"
                    v-else-if="accountDetails.type === '5'">
        <el-input v-model="accountDetails.uid"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName + 'id'"
                    v-else-if="accountDetails.type === '6'">
        <el-input v-model="accountDetails.channel_id"></el-input>
      </el-form-item>
      <!--      ///////////////////////区分微信、微博、网站、头条//////////////////////////-->
      <el-form-item label="省份"
                    class="typtext">
        <el-input v-model="accountDetails.province"></el-input>
      </el-form-item>
      <el-form-item label="地区"
      v-if="accountDetails.type === '3'"
                    class="typtext">
        <el-input v-model="accountDetails.city"></el-input>
      </el-form-item>
      <el-form-item label="地区" v-else
                    class="typtext">
        <el-input v-model="accountDetails.region"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    v-if="accountDetails.type === '1'"
                    label="单位名称">
        <el-input v-model="accountDetails.uint"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    v-else-if="accountDetails.type === '2'"
                    label="单位名称">
        <el-input v-model="accountDetails.unit"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    v-else-if="accountDetails.type === '3'"
                    label="单位名称">
        <el-input v-model="accountDetails.unit_name"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    v-else-if="accountDetails.type === '4'"
                    label="单位名称">
        <el-input v-model="accountDetails.unit_name"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    v-else-if="accountDetails.type === '5'"
                    label="单位名称">
        <el-input v-model="accountDetails.unit_name"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    v-else-if="accountDetails.type === '6'"
                    label="单位名称">
        <el-input v-model="accountDetails.unit_name"></el-input>
      </el-form-item>
      <!--      ///////////////////////区分微信、微博、网站、头条//////////////////////////-->
    </el-form>
  </div>
</template>
<script scoped>
export default {
  props: ['accountDetails'],
  data () {
    return {
      dynamicValidateForm: {
        type: '',
        number: '',
        name: '',
        provice: '',
        city: '',
        code: '',
        level: '',
        companyName: '',
        signal: ''
      },
      addAccountimg: {
        weixin: require('@/assets/images/dataimg/u5586.png'),
        weibo: require('@/assets/images/dataimg/u1770.png'),
        wangzhan: require('@/assets/images/dataimg/u5607.png'),
        toutiao: require('@/assets/images/dataimg/u1766.png'),
        douyin: require('@/assets/images/dy.png'),
        yidian: require('@/assets/images/yd.png')
      }
    }
  },
  created () {
  },
  methods: {
  },
  computed: {
    accountName () {
      let name = ''
      switch (this.accountDetails.type) {
        case '1':
          name = '微信'
          break
        case '2':
          name = '微博'
          break
        case '3':
          name = '网站'
          break
        case '4':
          name = '头条'
          break
        case '5':
          name = '抖音'
          break
        case '6':
          name = '一点'
          break
      }
      return name
    }
  }
}
</script>

<style scoped>
.add-account .el-radio-group img {
  vertical-align: middle;
  margin-right: 13px;
}

.bordno {
  border-bottom: 1px solid #ddd;
}

.typtext .el-input {
  width: 285px;
}
.add-account .el-button {
  width: 100px;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
}
.add-account .el-button i {
  font-size: 16px;
  margin-right: 11px;
  vertical-align: middle;
  margin-top: -3px;
}
.add-account .footer {
  margin-top: 20px;
}
</style>
