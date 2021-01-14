<template>
  <div class="launchVisit container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'OnlineArticleList' }">在线征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'WriteArticle' }">发起征稿</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="Issue-form">
        <el-form label-width="100px"
                 :model="ruleForm"
                 ref="ruleForm"
                 :rules="rules"
                 label-position='right'>
          <el-form-item label="征稿主题"
                        prop="solicitTitle">
            <el-input type="text"
                      placeholder="请输入征稿主题"
                      v-model="ruleForm.solicitTitle"
                      maxlength="35"
                      show-word-limit>
            </el-input>
          </el-form-item>
          <el-form-item label="征稿要求"
                        prop="solicitContent">
            <el-input v-model="ruleForm.solicitContent"
                      type='textarea'
                      :rows="6"
                      placeholder="请输入征稿要求"></el-input>
          </el-form-item>
          <el-form-item label="征稿范围"
                        class="small-width"
                        prop="scopes">
            <el-cascader :options="areaList"
                        v-model="ruleForm.scopes"
                        placeholder="请选择单位"
                        :show-all-levels="false"
                        :props="{ checkStrictly: true, multiple: true, emitPath: false }"
                        clearable></el-cascader>
          </el-form-item>
          <el-form-item label="起止日期" prop="startEndTime">
            <el-date-picker v-model="ruleForm.startEndTime"
                            type="daterange"
                            format="yyyy - MM - dd "
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="封面" prop="url" class="contri-upload">
            <v-upload @getAttachmentUrl="getAttachmentUrl"
                        :headUrl="ruleForm.url"
                        :listType="listType"
                        :showList="showList"
                        :isMultiple="isMultiple"
                        :acceptType="acceptType"></v-upload>
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
import vUpload from '@/components/UploadAll.vue'
export default {
  data () {
    return {
      listType: 'text',
      showList: false,
      isMultiple: false,
      headUrl: '',
      acceptType: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      routeId: '', // 编辑
      areaList: [], // 地区列表
      depList: [],
      ruleForm: {
        solicitTitle: '', // 主题
        solicitContent: '', // 要求
        scopes: '', // 范围
        startEndTime: '', // 起止时间
        url: '', // 封面
        fileName: ''
      },
      rules: {
        solicitTitle: [
          { required: true, message: '请输入征稿主题', trigger: 'blur' }
        ],
        solicitContent: [
          { required: true, message: '请输入征稿要求', trigger: 'blur' }
        ],
        scopes: [
          { required: true, message: '请选择范围', trigger: 'change' }
        ],
        startEndTime: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请上传', trigger: 'blur' }
        ]
      }
    }
  },
  components: {
    vUpload
  },
  methods: {
    getAttachmentUrl (file) {
      this.ruleForm.url = file.response.message
      this.ruleForm.fileName = file.name
    },
    // 地区
    getAreaList () {
      this.$http.get(this.$api.queryDepartment)
        .then(res => {
          if (res.data.data.length) {
            this.areaList = res.data.data
          }
        })
        .catch(() => { })
    },
    // 提交
    saveDatas (form) {
      // let apiName = null
      // this.routeId ? apiName = 'updateRumorVerificate' : apiName = 'questionRumorVerificate'
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.submitArticle, this.ruleForm)
            .then(res => {
              this.$router.push({ name: 'MyArticle' })
              this.$message.success('操作成功！')
            })
            .catch(() => { })
        }
      })
    },
    conBack () {
      this.$router.push({ name: 'OnlineArticleList' })
    }
  },
  created () {
    this.getAreaList()
    // this.getDepList()
    if (this.$route.query.id) {
      this.routeId = this.$route.query.id
      this.$http.get(`${this.$api.getArticleDetail}?id=${this.routeId}`)
        .then(res => {
          this.ruleForm = res.data.data
        })
        .catch(() => { })
    }
  }
}
</script>
<style lang="scss">
@import "../contributions.scss";
.contri-upload .el-form-item__content {
  line-height: 15px;
}
</style>
<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.Issue-form {
  width: 1100px;
  background-color: #fff;
  border: 1px solid rgba(204, 204, 204, 0.38);
  margin: 0 auto;
  box-sizing: border-box;
  padding: 50px 36px;
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
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed  #8c939d
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
