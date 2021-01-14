<template>
  <div class="admin-tabs-box container"
       v-if="$isPermission(703) || $isPermission(703)">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'SystemRule' }">系统规则</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
      <div class="admin-box">
      <el-row :gutter="10">
        <el-col :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu></v-menu>
        </el-col>
        <el-col :xs="21"
                :sm="21"
                :md="21"
                :lg="20"
                :xl="20">
                <!-- <div class="admin-log">
        <p class="admin-log-p"><span class="admin-log-span">系统规则</span></p>
      </div> -->
          <div>
            <div class="admin-right-box admin-table">
              <div class="setting-box">
                <el-form ref="form"
                        :model="form"
                        :rules="rules"
                        label-width="200px"
                        label-position="left">
                  <el-form-item label="是否定期备份："
                                prop="isPlace">
                    <el-radio-group v-model="form.isPlace">
                      <el-radio label="1">是</el-radio>
                      <el-radio label="2">否</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="定期备份周期："
                                prop="cycle">
                    <el-input v-model="form.cycle"
                              size="small"
                              placeholder="请输入定期备份周期">
                      <template>
                        <template slot="append">天</template>
                      </template>
                    </el-input>
                  </el-form-item>
                  <el-form-item label="已备份数据保留天数："
                                prop="placeCycle">
                    <el-input size="small"
                              placeholder="已备份数据保留天数"
                              v-model="form.placeCycle">
                      <template slot="append">天</template>
                    </el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary"
                              size="medium"
                              @click="debouncedGetAnswer('form')" class="form-button">确认</el-button>
                     <el-button
                              size="medium"
                              @click="restCycle('form')" class="form-button">清空</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    </div>
  </div>
  <no-permission v-else></no-permission>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
import { mapGetters } from 'vuex'
export default {
  data () {
    const isNum = (rule, value, callback) => {
      if (value) {
        var reg = /^[1-9][0-9]*$/
        if (!reg.test(value)) {
          callback(new Error('请输入数字!'))
        } else {
          callback()
        }
      } else {
        callback(new Error('请输入'))
      }
    }
    return {
      form: {
        id: '',
        isPlace: '',
        cycle: '',
        placeCycle: ''
      },
      rules: {
        isPlace: [
          { required: true, message: '请选择是否定期归档', trigger: 'change' }
        ],
        cycle: [
          { required: true, message: '请输入归档周期', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ],
        placeCycle: [
          { required: true, message: '请输入保留天数', trigger: 'blur' },
          { validator: isNum, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    restCycle (formName) {
      this.$refs[formName].resetFields()
    },
    getJobConfig () {
      this.$http.get(this.$api.getJobConfig)
        .then(res => {
          let data = res.data.data
          if (data) {
            data.isPlace = data.isPlace === 1 ? '1' : '2'
            this.form = data
          }
        })
        .catch(() => { })
    },
    handleClick (item) {
      this.$router.push({ name: item })
    },
    sendData () {
      this.form.isPlace = this.form.isPlace
      this.$http.post(this.$api.editJobConfig, this.form)
        .then(res => {
          this.$message.success('操作成功！')
        })
        .catch(() => { })
    },
    onSubmit (form) {
      if (this.form.isPlace === '2') {
        this.sendData()
      } else {
        this.$refs[form].validate((valid) => {
          if (valid) {
            this.sendData()
          }
        })
      }
    }
  },
  created () {
    this.getJobConfig()
    this.debouncedGetAnswer = this.$debounce(this.onSubmit, 500)
  },
  mounted () {
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    vMenu
  }
}
</script>

<style scoped>
.admin-log-p:before {
  width: 4px;
  height: 16px;
  z-index: 1;
}
.info-span {
  margin-left: 12px;
  line-height: 20px;
}
.margin-p {
  margin-top: 30px;
}
.admin-form-box {
  background-color: #f5f5f5;
}
.setting-box {
  min-height: 500px;
  padding: 15px;
  background-color: #fff
}
.admin-table .el-input {
  width: 350px
}
.form-button{
  margin: 20px;
}
</style>
