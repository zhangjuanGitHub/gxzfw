<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'CaliberPublic' }">公共素材</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
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
                :xl="20"
                class="cont-box"
                style="padding: 0"
        >
          <div class="tabs-card">
            <div class="card-name">
              <router-link :to="{name: 'CaliberPublic'}"
                           :class="{ 'is-active': routeName ==='CaliberPublic'}">
                <span>公共素材</span>
              </router-link>
            </div>
            <div class="card-name">
              <router-link :to="{name: 'CaliberPersonal'}"
                           :class="{ 'is-active': routeName ==='CaliberPersonal'}">
                <span>个人素材</span>
              </router-link>
            </div>
          </div>
          <div class="Matrix">
            <h2>新建公共素材</h2>
            <div class="headCont">
              <div class="form-box">
                <el-form :inline="false"
                         ref="ruleForm"
                         :model="ruleForm"
                         :rules="rules"
                         class="demo-form-inline margin-none">
                  <el-form-item label="素材内容:"
                                prop="materialContent">
                    <el-input size="small"
                              type="textarea"
                              :rows="4"
                              v-model="ruleForm.materialContent"
                              placeholder="请输入素材内容"></el-input>
                  </el-form-item>
                  <el-form-item label="适用情景:"
                                prop="application">
                    <el-input size="small"
                              type="textarea"
                              :rows="4"
                              v-model="ruleForm.application"
                              placeholder="请输入适用情景"></el-input>
                  </el-form-item>
                  <el-form-item class="text-right">
                    <el-button size="small"
                               @click="resetForm('ruleForm')">重置</el-button>
                    <el-button size="small"
                               type="primary"
                               @click="forwardSave('ruleForm')">保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <material-list :ruleForm="ruleForm"></material-list>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import vMenu from '@/views/reviews/components/Menu'
import MaterialList from '../components/MaterialList'
export default {
  data () {
    return {
      tableList: [],
      routeName: '',
      ruleForm: {
        materialContent: '',
        application: '',
        level: 1,
        ranDom: Math.random()
      },
      rules: {
        materialContent: [
          { required: true, message: '请输入素材内容', trigger: 'blur' }
        ],
        application: [
          { required: true, message: '请输入适用情景', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    getRandom () {
      this.ruleForm.ranDom = Math.random()
    },
    // 重置添加
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
    },
    blankUrl () {},
    viewDatas () {},
    forwardSave (ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.$http.post(this.$api.insertMaterial, this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$refs['ruleForm'].resetFields()
              this.getRandom()
            })
            .catch(() => {})
        }
      })
    },
    getData () {
      this.params.pageNum++
      this.getLogList()
    }
  },
  created () {
    this.routeName = this.$route.name
  },
  components: {
    vMenu,
    MaterialList
  }
}
</script>
<style scoped>
.Matrix {
  font-size: 14px;
  font-family: DengXian-Bold;
  padding: 20px;
}
.Matrix h2 {
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 13px;
  border-left: 3px solid #2f9ff3;
  padding-left: 8px;
  margin-bottom: 17px;
  font-size: 16px;
}
.Matrix .headCont {
  background-color: #eff1f4;
  border-radius: 10px;
  padding: 24px 12px;
  box-sizing: border-box;
}
.Matrix p span {
  display: inline-block;
  height: 29px;
  line-height: 29px;
}
.Matrix h2:nth-of-type(2) {
  margin-top: 14px;
}
.matrix-table .el-table thead tr th {
  background: linear-gradient(to top, #f3f2f2, #fff);
}
#pagin button {
  background-color: transparent;
}
.headCont .el-textarea {
  width: 650px;
}
.headCont .el-select {
  width: 220px;
}
.table-box {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #ccc;
}
.overflow-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.table-search {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
  padding: 3px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
/*网评*/
.cont-box {
  padding: 0 !important;
  box-sizing: border-box;
  min-height: 500px;
  background-color: #fff;
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
}
.tabs-card {
  display: flex;
  background-color: #f5f7fa;
  border-bottom: 1px solid #e4e7ed;
  margin: 0;
}
.card-name a {
  display: inline-block;
  padding: 0 20px;
  height: 40px;
  border-right: 1px solid #e4e7ed;
  box-sizing: border-box;
  line-height: 40px;
  display: inline-block;
  list-style: none;
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  position: relative;
}
.card-name .is-active {
  color: #2c8ae5;
  background-color: #fff;
  border-bottom-color: transparent;
}
.card-name img {
  vertical-align: middle;
  margin-right: 5px;
  margin-top: -3px;
}
.card-name span {
  line-height: 33px;
}
</style>
