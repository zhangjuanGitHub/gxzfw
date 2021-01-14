<template>
  <div class="launchVisit container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'InterviewList' }">约访列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'WriteInterview' }">发起约访</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="Issue-form">
        <el-form label-width="100px"
                 :model="ruleForm"
                 ref="ruleForm"
                 :rules="rules"
                 label-position='left'>
          <el-form-item label="约访主题"
                        prop="interviewTheme">
            <el-input type="text"
                      placeholder="请输入约访主题"
                      v-model="ruleForm.interviewTheme"
                      maxlength="35"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="描述"
                        prop="interviewDescribe">
            <el-input v-model="ruleForm.interviewDescribe"
                      type='textarea'
                      :rows="6"
                      placeholder="为了能顺利约访，请详细说明约访的用意"></el-input>
          </el-form-item>
          <el-form-item label="地区"
                        class="small-width"
                        prop="targetAreaId">
            <el-cascader :options="areaList"
                        v-model="ruleForm.targetAreaId"
                        placeholder="请选择地区"
                        @change="getAreaChange"
                        :show-all-levels="false"
                        :props="{ checkStrictly: true, emitPath: false }"
                        clearable></el-cascader>
          </el-form-item>
          <el-form-item label="单位名称"
                        class="small-width"
                        prop="targetDepartmentId">
            <el-cascader :options="depList"
                        v-model="ruleForm.targetDepartmentId"
                        placeholder="请选择单位"
                        :show-all-levels="false"
                        :props="{ checkStrictly: true, emitPath: false }"
                        clearable></el-cascader>
          </el-form-item>
        </el-form>
        <div class="buttons">
          <el-button type="primary"
                     @click="saveDatas('ruleForm')">发送</el-button>
          <el-button @click="conBack">取消</el-button>
        </div>
      </div>
      <!-- <no-permission v-else></no-permission> -->
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      routeId: '', // 编辑
      areaList: [], // 地区列表
      depList: [],
      ruleForm: {
        interviewTheme: '', // 主题
        interviewDescribe: '', // 描述
        targetAreaId: '', // 地区
        targetDepartmentId: '' // 单位
      },
      rules: {
        interviewTheme: [
          { required: true, message: '请输入约访主题', trigger: 'blur' }
        ],
        interviewDescribe: [
          { required: true, message: '请输入约访描述', trigger: 'blur' }
        ],
        targetAreaId: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        targetDepartmentId: [
          { required: true, message: '请选择单位', trigger: 'change' }
        ]
      }
    }
  },
  created () {
    this.getAreaList()
    if (this.$route.query.id) {
      this.routeId = this.$route.query.id
      this.$http.get(`${this.$api.getInterviewView}?id=${this.routeId}`)
        .then(res => {
          this.ruleForm = res.data.data
          this.getDepList()
        })
        .catch(() => { })
    }
  },
  methods: {
    getAreaChange () {
      if (this.ruleForm.targetAreaId) {
        this.ruleForm.targetDepartmentId = ''
        this.depList = []
        this.getDepList()
      }
    },
    // 单位列表
    getDepList () {
      this.$http.get(`${this.$api.listLevelChildByAreaId}?areaId=${this.ruleForm.targetAreaId}`)
        .then(res => {
          if (res.data.data.length) {
            this.depList = res.data.data
          }
        })
        .catch(() => { })
    },
    // 地区
    getAreaList () {
      this.$http.get(this.$api.listLevelChildByTop)
        .then(res => {
          if (res.data.data.length) {
            this.areaList = res.data.data
          }
        })
        .catch(() => { })
    },
    // 提交
    saveDatas (form) {
      let apiName = null
      this.routeId ? apiName = 'updateInterview' : apiName = 'saveInterview'
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api[apiName], this.ruleForm)
            .then(res => {
              this.$router.push({ name: 'MyInterview' })
              this.$message.success(res.data.message)
            })
            .catch(() => { })
        }
      })
    },
    conBack () {
      this.$router.push({ name: 'MyInterview' })
    }
  },
  mounted () {
    setInterval(function () {
      document.querySelectorAll('.el-cascader-node__label').forEach(el => {
        el.onclick = function () {
          if (this.previousElementSibling) this.previousElementSibling.click()
        }
      })
    }, 1000)
  }
}
</script>
<style lang="scss">
@import "../contributions.scss";
</style>
<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.Issue-form {
  width: 1100px;
  height: 621px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.38);
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 36px 0 34px;
}
.buttons {
  padding-top: 50px;
}
.buttons {
  text-align: center;
}
.buttons .el-button {
  width: 150px;
}
</style>
