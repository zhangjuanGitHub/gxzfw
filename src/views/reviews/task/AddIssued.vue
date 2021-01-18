<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">网评管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsIssued' }">任务下发</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ReviewsIssuedAdd' }">添加任务</el-breadcrumb-item>
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
        >
          <div class="add-issued-box">
            <div class="user-form-box">
              <el-form :model="ruleForm"
                       :rules="rules"
                       ref="ruleForm"
                       label-position="left"
                       label-width="100px">
                <el-form-item label="任务名称"
                              prop="taskName">
                  <el-input v-model="ruleForm.taskName"
                            placeholder="请输入任务名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="任务描述" prop="taskContent">
                  <el-input v-model="ruleForm.taskContent"
                            type="textarea"
                            maxlength="200"
                            show-word-limit
                            :rows="3"
                            placeholder="请输入任务描述"></el-input>
                </el-form-item>
                <el-form-item label="任务地址">
                  <el-input v-model="ruleForm.taskSite"
                            placeholder="请输入任务地址"></el-input>
                </el-form-item>
                <el-form-item label="任务类型"
                              prop="taskType">
                  <el-radio-group v-model="ruleForm.taskType">
                    <el-radio label="1">常规</el-radio>
                    <el-radio label="2">紧急</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="选择日期"
                              prop="date">
                  <el-date-picker v-model="ruleForm.date"
                                  type="daterange"
                                  format="yyyy-MM-dd"
                                  :clearable="false"
                                  value-format="yyyy-MM-dd"
                                  start-placeholder="开始日期"
                                  end-placeholder="结束日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="承办人" prop="undertaker">
                  <div class="undertaker-box">
                    <el-tag
                      v-for="(item, index) of labelOrganizerList"
                      :key="index"
                      closable
                      @close="handleDelete(item)"
                    >{{item.user_name}}</el-tag>
                  </div>
                  <el-button type="primary" size="small" @click="clickOrganizer">选择承办人</el-button>
                </el-form-item>
                <el-form-item label="上传附件" prop="picList">
                  <div class="user-upload-box">
                    <el-upload
                      class="upload-demo"
                      :action="this.$api.upload"
                      :headers="token"
                      :on-preview="handlePreview"
                      :on-remove="handleRemove"
                      :on-success="handleSuccess"
                      :on-error="handleError"
                      multiple
                      :file-list="ruleForm.picList">
                      <el-button size="small" type="primary">点击上传</el-button>
                      <div slot="tip" class="el-upload__tip">只能上传jpg/png/gif和office文件</div>
                    </el-upload>
                  </div>
                </el-form-item>
              </el-form>
              <div class="admin-btn-box">
                <el-button type="warning" @click="returnUrl">返回</el-button>
                <el-button @click="resetForm('ruleForm')" type="info">重置</el-button>
                <el-button type="primary" @click="submit('ruleForm')">保存</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-dialog title="选择承办人"
               :visible.sync="dialogFormVisible"
               :modal-append-to-body="false"
               width="1000px"
               @close="closeDialog">
      <div class="dialog-box">
        <div class="admin-tree">
          <div class="">
            <p class="font18">单位列表</p>
          </div>
          <div class="tree-box">
            <el-tree :data="treeData"
                     :props="defaultProps"
                     node-key="value"
                     :expand-on-click-node="false"
                     :default-expanded-keys="[1]"
                     @node-click="handleNodeClick"></el-tree>
          </div>
        </div>
        <div class="right-box">
          <div class="right-scroll-box margin-l-20">
            <p class="font18">承办人姓名</p>
            <div class="user-box scroll-box">
              <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              <el-checkbox-group v-model="checkList" class="checkbox-box" @change="handleCheckedCitiesChange">
                <el-checkbox v-for="(item) of organizerList" :key="item.id" :label="item.id">{{item.userName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="right-scroll-box margin-l-20">
            <p class="font18">已选择承办人</p>
            <div class="user-box scroll-box">
              <ul>
                <li class="scroll-box-li" v-for="(item) of fillterCheckList" :key="item.id">{{item.userName}}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirmDialog">确 定</el-button>
      </div>
    </el-dialog>
<!--    <scroll-data @getData="getData"-->
<!--                 :dataLess="dataLess"></scroll-data>-->
  </div>
</template>

<script>
import vMenu from '@/views/reviews/components/Menu'
// import { getRandomColor } from '@/libs/tools'
export default {
  data () {
    return {
      isIndeterminate: false,
      checkAll: false,
      checkList: [], // 承办人id列表
      constTreeData: [], // 全部的承办人
      fillterCheckList: [], // 已选择的承办人
      tranfserDom: '', // 滚动元素
      dialogFormVisible: false, // 弹框
      dataLess: false,
      routeName: '',
      token: { Authorization: '' },
      fileList: [],
      videoUploadPercent: 0, // 进度条
      videoFlag: false, // 控制进度条显示
      organizerList: [], // 承办人id列表
      labelOrganizerList: [], // 承办人外部文字列表
      ruleForm: {
        date: [],
        taskName: '', // 任务名称,
        taskContent: '', // 任务描述
        taskSite: '', // 任务地址
        taskType: '1', // 任务类型
        startTime: '', // 开始时间
        endTime: '', // 结束时间
        undertaker: [], // 承办人
        peopleSum: '', // 任务人数
        picList: [], // 上传图片
        fileList: [] // 上传附件
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      treeData: [], // 单位列表
      rules: {
        taskName: [
          { required: true, message: '请输入任务名称', trigger: 'blur' }
        ],
        taskContent: [
          { required: true, message: '请输入任务描述', trigger: 'blur' }
        ],
        taskSite: [
          { required: true, message: '请输入任务地址', trigger: 'blur' }
        ],
        taskType: [
          { required: true, message: '请输入任务类型', trigger: 'blur' }
        ],
        date: [
          { required: true, message: '请输入选择时间', trigger: 'blur' }
        ],
        undertaker: [
          { required: true, message: '请选择承办人', trigger: 'change' }
        ],
        peopleSum: [
          { required: true, message: '请输入任务人数', trigger: 'blur' },
          { type: 'number', message: '请输入数字' }
        ]
      },
      params: {
        pageNum: 1,
        pageSize: 100,
        departmentId: '',
        searchParam: '',
        startDate: '',
        endDate: ''
      }
    }
  },
  methods: {
    // 全选
    handleCheckAllChange (val) {
      if (val) {
        this.organizerList.forEach(item => {
          this.checkList.push(item.id)
        })
      } else {
        this.checkList = []
      }
      this.isIndeterminate = false
    },
    // 勾选承办人
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.organizerList.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.organizerList.length
    },
    submit (ruleForm) {
      if (this.checkList.length <= 0) {
        this.$message.warning('请选择承办人！')
        return false
      }
      this.ruleForm.undertaker = []
      this.ruleForm.undertaker = this.checkList
      this.$refs[ruleForm].validate((valid) => {
        if (valid) {
          this.ruleForm.startTime = this.ruleForm.date[0]
          this.ruleForm.endTime = this.ruleForm.date[1]
          this.$http.post(this.$api.addTask, this.ruleForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$router.push({ name: 'ReviewsIssued' })
            })
            .catch(() => {
            })
        }
      })
    },
    filterMethod (query, item) {
      return item.userName.indexOf(query) > -1
    },
    // 获取单位列表
    getDepartmentList () {
      this.$http.get(this.$api.listLevel)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.treeData = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 删除承办人
    handleDelete (value) {
      this.labelOrganizerList.forEach((item, index) => {
        if (item.id === value.id) {
          this.labelOrganizerList.splice(index, 1)
          this.checkList.splice(index, 1)
        }
        if (value.id === this.checkList[index]) {
          this.checkList.splice(index, 1)
        }
      })
    },
    // 取消弹框
    closeDialog () {
      this.dialogFormVisible = false
      this.organizerList = []
    },
    getFindUserName () {
      this.$http.post(this.$api.findUserName, this.checkList)
        .then(res => {
          this.labelOrganizerList = res.data.data
          this.labelOrganizerList = Array.from(new Set(this.labelOrganizerList))
        })
        .catch(() => {})
    },
    // 确定弹框
    confirmDialog () {
      this.getFindUserName()
      this.dialogFormVisible = false
    },
    // 点击选择承办人
    clickOrganizer () {
      this.dialogFormVisible = true
      this.getDepartmentList()
      this.getOrganizerList()
    },
    // 点击单位
    handleNodeClick (data) {
      this.params.departmentId = data.value
      this.organizerList = []
      this.getOrganizerList()
    },
    // 获取承办人列表
    getOrganizerList () {
      this.dataLess = false
      this.$http.post(this.$api.userList, this.params)
        .then(res => {
          if (res.data.data.content.length) {
            let datas = res.data.data.content
            this.organizerList.push(...datas)
            this.constTreeData = datas
            if (datas.length < 31) {
              this.dataLess = true // 小于32
            }
            let that = this
            that.tranfserDom = document.getElementsByClassName('el-checkbox-group')[0]
            that.tranfserDom.addEventListener('scroll', that.$throttle(that.getOnScroll, 1000, 1000))
          }
        })
        .catch(() => {
        })
    },
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.labelOrganizerList = []
    },
    returnUrl () {
      this.$router.push({ name: 'ReviewsIssued' })
    },
    // 上传头像
    getProgress (event, file, fileList) {
      let fileArr = fileList
      fileArr.forEach(item => {
        if (item.percentage === 100) {
        } else {
          item.progressFlag = true
          this.videoUploadPercent = Math.abs(item.percentage.toFixed(0))
        }
      })
    },
    // 上传失败
    handleError () {
      this.$message.error('上传失败，请稍后重试！')
    },
    // 查看附件
    handlePreview (file) {
      window.open(file.accessoryUrl, '_blank')
    },
    // 删除附件
    handleRemove (file, fileList) {
      this.ruleForm.picList.forEach((item, index) => {
        if (file.accessoryUrl === item.accessoryUrl) {
          this.ruleForm.picList.splice(index, 1)
        }
      })
    },
    // 上传附件成功
    handleSuccess (event, file, fileList) {
      this.ruleForm.picList.push({ name: file.name, accessoryName: file.name, accessoryUrl: file.response.message })
    },
    addIssued () {},
    getSource () {},
    getData () {
      this.params.pageNum++
      this.getLogList()
    },
    // 获取时间
    getDateInfo () {
    },
    // 搜索
    searchList () {
      if ((this.date && this.date.length) || this.params.searchParam.trim()) {
        this.params.pageNum = 1
        this.tableList = []
        this.getLogList()
      } else {
        this.$message.warning('请输入关键字！')
      }
    },
    getOnScroll () {
      let scrollHeight = this.tranfserDom.scrollHeight
      let offsetHeight = this.tranfserDom.offsetHeight
      let scrollTop = this.tranfserDom.scrollTop
      if ((scrollTop + offsetHeight + 20 && !this.dataLess) >= scrollHeight) {
        this.params.pageNum++
        this.getOrganizerList()
      }
    }
  },
  created () {
    this.routeName = this.$route.name
    // this.getLogList()
    this.token.Authorization = this.$store.state.user.token
    // this.getOrganizerList()
  },
  mounted () {
  },
  components: {
    vMenu
  },
  watch: {
    checkList (newVal, oldVal) {
      if (newVal) {
        this.fillterCheckList = []
        this.constTreeData.forEach((item, index) => {
          newVal.forEach((key, j) => {
            if (item.id === key) {
              this.fillterCheckList.push(item)
              this.fillterCheckList = Array.from(new Set(this.fillterCheckList))
            }
          })
        })
      }
    }
  }
}
</script>
<style scoped>
.user-form-box {
  background: #fff;
  padding: 20px;
}
.user-upload-box {
  display: flex;
  padding-top: 20px;
}
.user-upload-box p {
  width: 100px;
  font-size: 16px;
  color: #333333;
}
.dialog-box {
  display: flex;
}
.admin-tree-title p {
  color: #2f9ff3;
}
.admin-title-span {
  margin-left: 12px;
  font-size: 16px;
  line-height: 18px;
}
.admin-tree-title p::before {
  width: 4px;
  height: 16px;
  content: "";
  background: #309ade;
  position: absolute;
}
.undertaker-box {
  width: 380px;
  display: flex;
  flex-wrap: wrap;
}
  .font18 {
    font-size: 18px;
    margin-bottom: 20px;
  }
  .checkbox-box {
    display: flex;
    flex-direction: column;
  }
  .select-box ul li{
    margin-bottom: 5px;
  }
  .scroll-box {
    height: 470px;
    overflow: hidden;
    overflow-y: scroll;
  }
  .right-box {
    display: flex;
    flex: 1;
  }
  .admin-tree, .user-box {
    width: 320px;
  }
  .tree-box {
    height: 470px;
    overflow-y: scroll;
  }
  .margin-l-20 {
    margin-left: 20px;
  }
  .scroll-box-li {
    font-size: 14px;
    line-height: 19px;
  }
</style>
