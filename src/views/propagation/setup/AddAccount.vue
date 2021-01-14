<template>
  <div class="add-account">
    <el-form :model="rulefrom"
             ref="rulefrom"
             label-width="90px"
             class="addaccount-form"
             :rules="rules">
      <el-form-item class="bordno"
                    label="账号类型:"
                    prop="type">
        <el-radio-group v-model="rulefrom.type">
          <el-radio label="1"><img :src="addAccountimg.weixin">微信</el-radio>
          <el-radio label="2"><img :src="addAccountimg.weibo">微博</el-radio>
          <el-radio label="3"><img :src="addAccountimg.wanzhan">网站</el-radio>
          <el-radio label="4"><img :src="addAccountimg.toutiao">头条</el-radio>
          <el-radio label="5"><img :src="addAccountimg.douyin">抖音</el-radio>
          <el-radio label="6"><img :src="addAccountimg.yidian">一点</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName.number"
                    prop="number">
        <el-input v-model="rulefrom.number"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName.name"
                    prop="name">
        <el-input v-model="rulefrom.name"></el-input>
      </el-form-item>
      <el-form-item label="省份"
                    class="typtext"
                    prop="provice">
        <el-select v-model="rulefrom.provice"
                   @change="getProvince"
                   placeholder="请选择省份">
          <el-option v-for="(item, index) of province"
                     :value="item"
                     :key="index"
                     :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地区"
                    class="typtext"
                    prop="area">
        <el-select @visible-change="getCity"
                   v-model="rulefrom.area"
                   placeholder="请选择地区">
          <el-option v-for="(item, index) of queryCity"
                     :label="item"
                     :value="item"
                     :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="typtext"
                    prop="code"
                    label="行政编码">
        <el-input v-model="rulefrom.code"></el-input>
      </el-form-item>
      <el-form-item label="单位级别"
                    class="typtext"
                    prop="level">
        <el-select v-model="rulefrom.level">
          <el-option label="1"
                     value="1"></el-option>
          <el-option label="2"
                     value="2"></el-option>
          <el-option label="3"
                     value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="typtext"
                    prop="departmentName"
                    label="单位名称">
        <el-input v-model="rulefrom.departmentName"></el-input>
      </el-form-item>
      <el-form-item label="信息状态"
                    class="typtext"
                    prop="signal">
        <el-select v-model="rulefrom.signal">
          <el-option label="采集"
                     value="1"></el-option>
          <el-option label="不采集"
                     value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="footer"
                    v-if="addShow">
        <el-button type="primary"
                   @click="onSubmit('rulefrom')">提交</el-button>
        <el-button type="info"
                   @click="resetForm('rulefrom')">重置</el-button>
        <el-button @click="conBack">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script scoped>
export default {
  props: ['accountDetails', 'isDisabled'],
  data () {
    return {
      province: [],
      queryCity: [],
      rulefrom: {
        type: '1',
        number: '',
        name: '',
        provice: '',
        area: '',
        code: '',
        level: '',
        departmentName: '',
        signal: '1'
      },
      rules: {
        number: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
        ],
        provice: [
          { required: true, message: '请选择省份', trigger: 'blur' }
        ],
        // city: [
        //   { required: true, message: '请选择地区', trigger: 'blur' }
        // ],
        // code: [
        //   { required: true, message: '请输入行政编码', trigger: 'blur' }
        // ],
        // level: [
        //   { required: true, message: '请选择单位级别', trigger: 'blur' }
        // ],
        // companyName: [
        //   { required: true, message: '请输入单位名称', trigger: 'blur' }
        // ],
        signal: [
          { required: true, message: '请选择信息状态', trigger: 'blur' }
        ]
      },
      addAccountimg: {
        weixin: require('@/assets/images/dataimg/u5586.png'),
        weibo: require('@/assets/images/dataimg/u1770.png'),
        wanzhan: require('@/assets/images/dataimg/u5607.png'),
        toutiao: require('@/assets/images/dataimg/u1766.png'),
        douyin: require('@/assets/images/dy.png'),
        yidian: require('@/assets/images/yd.png')
      },
      addShow: true
    }
  },
  created () {
    this.queryProvince()
    if (this.$route.name === 'AddAccount') {
      this.addShow = true
    } else {
      this.addShow = false
    }
    this.debouncedGetAnswer = this.$debounce(this.onSubmit, 500)
  },
  methods: {
    getProvince () {
      this.queryCity = []
      this.rulefrom.area = ''
    },
    getCity (item) {
      if (item && this.rulefrom.provice) {
        this.$http.get(`${this.$api.queryCity}/?province=${this.rulefrom.provice}`)
          .then(res => {
            this.queryCity = res.data.data
          })
          .catch(() => { })
      }
    },
    // 获取省份
    queryProvince () {
      this.$http.get(this.$api.queryProvince)
        .then(res => {
          if (res.data.data) {
            this.province = res.data.data
          }
        })
        .catch(() => { })
    },
    onSubmit (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.addAccount, this.rulefrom)
            .then(res => {
              this.$message.success(res.data.message)
              // this.$router.replace({ name: 'SetAccount' })
            })
            .catch(() => { })
        }
      })
    },
    conBack () {
      this.$router.back(-1)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  computed: {
    accountName () {
      let account = {}
      switch (this.rulefrom.type) {
        case '1':
          account.number = '微信号'
          account.name = '微信名'
          break
        case '2':
          account.number = '微博uid'
          account.name = '微博名'
          break
        case '3':
          account.number = '网站地址'
          account.name = '网站名'
          break
        case '4':
          account.number = '头条号'
          account.name = '头条名'
          break
        case '5':
          account.number = '抖音号'
          account.name = '抖音名'
          break
        case '6':
          account.number = '一点号'
          account.name = '一点名'
          break
      }
      return account
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

.addaccount-form .el-input,
.addaccount-form .el-select {
  width: 285px;
}
.add-account .el-button {
  width: 100px;
  border-radius: 10px;
  text-align: center;
  font-weight: bold;
}
.add-account .footer {
  margin-top: 20px;
}
</style>
