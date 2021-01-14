<template>
  <div class="addAccount">
    <el-form :model="ruleForm"
             ref="ruleForm"
             label-width="100px"
             :rules="rules"
             label-position="left">
      <el-form-item class="bordno"
                    label="账号类型:"
                    prop="accountType">
        <el-radio-group v-model="ruleForm.accountType">

        </el-radio-group>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName.number"
                    prop="accountNumber">
        <el-input v-model="ruleForm.accountNumber"
                  placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item class="typtext"
                    :label="accountName.name"
                    prop="accountName">
        <el-input v-model="ruleForm.accountName"
                  placeholder="请输入账号名称"></el-input>
      </el-form-item>
      <el-form-item label="省市"
                    prop="provinceDistrict">
        <el-cascader v-model="ruleForm.provinceDistrict"
                     :props="defaultProps"
                     :options="citys"
                     @change="handleChange"
                     placeholder="请选择省市"></el-cascader>
      </el-form-item>
      <el-form-item label="职能"
                    prop="organizationType">
        <el-select v-model="ruleForm.organizationType"
                   placeholder="请选择选择职能">
          <el-option label="政法委"
                     :value="1"></el-option>
          <el-option label="公安"
                     :value="2"></el-option>
          <el-option label="检察院"
                     :value="3"></el-option>
          <el-option label="法院"
                     :value="4"></el-option>
          <el-option label="司法"
                     :value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="typtext"
                    label="行政编码"
                    prop="adminCode">
        <el-input v-model="ruleForm.adminCode"
                  placeholder="请输入行政编码"></el-input>
      </el-form-item>
      <el-form-item label="单位级别"
                    prop="unitLevel">
        <el-select v-model="ruleForm.unitLevel"
                   placeholder="请选择单位级别">
          <el-option label="省/直辖市"
                     :value="1"></el-option>
          <el-option label="地市级"
                     :value="2"></el-option>
          <el-option label="区县"
                     :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="typtext"
                    label="单位名称"
                    prop="unitName">
        <el-input v-model="ruleForm.unitName"
                  placeholder="请输入单位名称"></el-input>
      </el-form-item>
      <el-form-item label="采集状态"
                    prop="isCollect">
        <el-select v-model="ruleForm.isCollect"
                   placeholder="请选择信息状态">
          <el-option label="采集"
                     :value="1"></el-option>
          <el-option label="不采集"
                     :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="footer">
        <el-button type="primary"
                   @click="submitForm('ruleForm')">提交</el-button>
        <el-button type="info"
                   @click="resetForm('ruleForm')">重置</el-button>
        <el-button @click="backUrl"
                   v-if="!this.formData">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object
    }
  },
  data () {
    return {
      defaultProps: {
        value: 'name',
        label: 'name',
        children: 'child'
      },
      citys: null,
      value: '',
      value1: '',
      keyword: '',
      ruleForm: {
        id: '', // 编辑
        accountType: 'weixin', // 账号类型
        accountName: '', // 账号名称
        accountNumber: '', // 账号
        organizationType: '', // 职能
        adminCode: '', // 编码
        unitLevel: '', // 单位等级
        provinceDistrict: '', // 省
        unitName: '', // 单位名称
        isCollect: '' // 采集状态
      },
      rules: {
        accountType: [
          { required: true, message: '请选择账号类型', trigger: 'change' }
        ],
        accountNumber: [
          { required: true, message: '请输入账号', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请输入账号名称', trigger: 'change' }
        ],
        provinceDistrict: [
          { required: true, message: '请选择省市', trigger: 'change' }
        ],
        organizationType: [
          { required: true, message: '请选择职能', trigger: 'change' }
        ],
        adminCode: [
          { required: true, message: '请输入行政编码', trigger: 'change' }
        ],
        unitLevel: [
          { required: true, message: '请选择单位级别', trigger: 'change' }
        ],
        unitName: [
          { required: true, message: '请输入单位名称', trigger: 'change' }
        ],
        isCollect: [
          { required: true, message: '请选择采集状态', trigger: 'change' }
        ]
      },
      addAccountimg: {

      }
    }
  },
  methods: {
    submitForm (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.ruleForm.provinceDistrict = this.ruleForm.provinceDistrict.join(',')
          this.$http.post(this.$api.saveAccount, this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$emit('closeModal', false)
              this.$router.replace({ name: 'ManageAccountList' })
            })
            .catch(() => { })
        }
      })
    },
    handleChange (item) {
      console.log(item)
    },
    backUrl () {
      this.$router.push({ name: 'ManageAccountList' })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted () {
    // this.citys = citys
    if (this.formData) {
      if (this.formData.provinceDistrict) {
        this.formData.provinceDistrict = this.formData.provinceDistrict.split(',')
      }
      this.ruleForm = this.formData
    }
  },
  watch: {
    formData (newVal, oldVal) {
      if (newVal) {
        if (newVal.provinceDistrict) {
          newVal.provinceDistrict = newVal.provinceDistrict.split(',')
        }
        this.ruleForm = newVal
      }
    }
  },
  computed: {
    accountName () {
      let account = {}
      switch (this.ruleForm.accountType) {
        case 'weixin':
          account.number = '微信号'
          account.name = '微信名'
          break
        case 'weibo':
          account.number = '微博uid'
          account.name = '微博名'
          break
        case 'website':
          account.number = '网站地址'
          account.name = '网站名'
          break
        case 'toutiao':
          account.number = '头条号'
          account.name = '头条名'
          break
        case 'yidian':
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
.addAccount {
  padding: 0 10px;
}
.addAccount .el-radio-group img {
  vertical-align: middle;
  margin-right: 13px;
}
.bordno {
  border-bottom: 1px solid #ddd;
}
.addAccount .el-button i img {
  vertical-align: middle;
  margin-right: 11px;
}
.addAccount .footer {
  margin-top: 60px;
}
</style>
