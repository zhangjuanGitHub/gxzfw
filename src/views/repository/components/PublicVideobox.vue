<template>
  <div class="videobox Picturebox">
    <div class="videobox-seach">
      <el-form :inline="true"
               :model="ruleForm"
               ref="ruleForm"
               v-if="!batchDelete"
               class="demo-form-inline">
        <el-form-item prop="time"
                      label="上传时间:">
          <el-date-picker v-model="ruleForm.time"
                          type="daterange"
                          size="small"
                          range-separator="-"
                          format="yyyy-MM-dd"
                          value-format="yyyy-MM-dd"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <!--        <el-form-item prop="userName"-->
        <!--                      label="上传人:">-->
        <!--          <el-input v-model="ruleForm.userName"-->
        <!--                    placeholder="请输入上传人"></el-input>-->
        <!--        </el-form-item>-->
        <el-form-item prop="groupName"
                      label="关键字:">
          <el-input v-model="ruleForm.groupName"
                    size="small"
                    placeholder="请输入关键字"></el-input>
        </el-form-item>
        <el-form-item prop="calcFileName">
          <el-checkbox-group v-model="ruleForm.calcFileName">
            <el-checkbox :label="1">类别名称</el-checkbox>
            <el-checkbox :label="2">视频名称</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('ruleForm')">筛选</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <div v-if="batchDelete"
           class="confirmdelete">
        <span class="delete-text">* 请勾选需要批量删除的视频集</span>
        <el-button type="danger"
                   @click="confirmRawDelete">确认删除</el-button>
        <el-button @click="cancleDelete">取消删除</el-button>
      </div>
      <div class="operation"
           v-if="!batchDelete">
        <el-tooltip content="新建类别"
                    class="testxinjian"
                    placement="top">
          <el-button type="primary"
                     @click="newsFile">
            <i class="el-icon-plus"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip content="删除类别"
                    placement="top">
          <el-button @click="deleteGroup">
            <i class="el-icon-delete"></i>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="video-box">
      <el-row :gutter="36"
              class="el-col-box">
        <el-col :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
                :xl="8"
                v-for="(item, index) of video"
                :key="index">
          <div>
            <el-card shadow="hover"
                     :body-style="{ padding: '0px' }">
              <!-- <router-link :to="{name: 'AudioDetail', params: {id:item.id, isPublic: item.isPublic}}"> -->
                <div class="image-box"
                     :style="{background: 'url('+ item.thumbnailUrl + ') no-repeat center/cover'}"
                     @click="getVideoDetail(item)">
                </div>
              <!-- </router-link> -->
              <div class="card-details">
                <div class="card-num-box">
                  <p class="card-details-title details-span"
                     v-text="item.userName"></p>
                  <div class="card-operation">
                    <el-tooltip content="上传" placement="top">
                      <i class="el-icon-upload2"
                          @click="videoUpload(item)"></i>
                    </el-tooltip>
                    <el-tooltip content="下载" placement="top">
                      <i class="el-icon-download"
                          @click="downloadFile(item.id)"></i>
                    </el-tooltip>
                    <!-- <el-tooltip content="删除" placement="top">
                      <i class="el-icon-delete"
                          v-if="!batchDelete  && item.isDefault !== 1"
                          @click="deleteBox(index, item)"></i>
                    </el-tooltip> -->
                  </div>
                </div>
                <div class="details clearfix">
                  <span class="time-style"
                        v-text="item.createTimeFmt"></span>
                </div>
              </div>
            </el-card>
            <div class="operate-box">
              <div class="my-video-list"
                   v-if="!batchDelete">
                <el-input v-model="item.groupName"
                          :disabled="!item.isEdit">
                </el-input>
                <el-tooltip content="编辑" placement="top">
                    <i @click="editGroupName('edit', item, index)"
                        v-if="!item.isEdit  && item.isDefault !== 1"
                        class="el-input__icon el-icon-edit cursor"></i>
                  </el-tooltip>
                  <el-tooltip content="提交" placement="top">
                    <i @click="editGroupName('confirmEdit', item, index)"
                        v-if="item.isEdit && item.isDefault !== 1"
                        class="el-input__icon el-icon-check cursor"></i>
                  </el-tooltip>
              </div>
              <div class="delete-checkbox-box"
                   v-if="batchDelete && item.isDefault !== 1 && item.isShare !== 1">
                <el-checkbox-group v-model="item.deleteCheckBoxList"
                                   @change="getDeleteCheckbox(item, index)">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id"
                               :disabled="item.isDefault !== 2 && item.isShare !== 1">删除</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div v-if="dataNull"
         class="text-center">
      <img :src="require('@/assets/images/empty-data.png')"
           alt="">
    </div>
    <!--    <diaing :isDiaingShow="dialogVisible"-->
    <!--            :deleteItem="deleteItem"-->
    <!--            @confirmDelete="getConfirmDelete"-->
    <!--            @closeModal="getCloseModal">-->
    <!--    </diaing>-->
    <el-dialog :visible.sync="dialogVisible"
               :modal-append-to-body='false'
               @close="getCloseModal"
               class="dialog-public"
               width="30%">
      <p class="text-center dialong-about">您确定要执行此操作吗?</p>
      <div class="dialog-check">
        <el-checkbox v-model="checked">是否删除类别下的视频？</el-checkbox>
      </div>
      <span slot="footer"
            class="dialog-footer">
        <el-button @click="getCloseModal">取 消</el-button>
        <el-button type="primary"
                   @click="getConfirmDelete">确 定</el-button>
      </span>
    </el-dialog>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import { mapGetters, mapState } from 'vuex'
import '@/libs/date_format.js'
import ScrollData from '@/components/ScrollData'
export default {
  data () {
    return {
      defaultCover: require('@/assets/images/default-thum.png'),
      dataNull: false, // 数据为空时
      dataLess: false, // 数据数量小于32时
      batchDelete: false, // 为true时，筛选条件隐藏，小删除按钮隐藏
      checked: false,
      dialogVisible: false, // 模态框
      deleteItem: '', // 需要删除的数据
      pickerOptions: {
        shortcuts: [{
          text: '最近一个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近半年',
          onClick (picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      ruleForm: {
        pageNum: 1,
        pageSize: 32,
        groupType: 2, // 1图片组，2视频组
        isPublic: 1, // 1公共资源， 2个人资源
        userName: '', // 上传人
        createTimeFmt: '', // 搜索，开始时间
        updateTimeFmt: '', // 搜索，结束时间
        groupName: '', // 关键词
        selectFileName: '', // 搜索范围，1检索组别名称，2检索文件名称，3同时检索前两项
        calcFileName: [1],
        time: []
      },
      video: []
    }
  },
  methods: {
    getVideoDetail (item) {
      let newItem = {
        isDefault: item.isDefault,
        id: item.id,
        groupName: item.groupName,
        createTimeFmt: item.createTimeFmt
      }
      this.$router.push({ name: 'AudioDetail', params: { id: item.id, isPublic: item.isPublic, item: JSON.stringify(newItem) } })
    },
    getData () {
      this.ruleForm.pageNum++
      this.getVideoList()
    },
    // 取消批量删除
    cancleDelete () {
      this.batchDelete = !this.batchDelete
    },
    // 确认批量删除
    confirmRawDelete () {
      this.checked = true // 批量删除默认删除底下所有
      this.getConfirmDelete()
    },
    // 点击批量删除
    deleteGroup () {
      this.batchDelete = true
    },
    // 勾选删除
    getDeleteCheckbox (item, index) {
      this.$set(this.video, index, item)
    },
    downloadFile (id) {
      window.location.href = `${this.$api.downloadFile}?groupId=${id}&authCode=${this.token}`
    },
    editGroupName (params, item, index) {
      if (params === 'edit') {
        item.isEdit = true
        this.$set(this.video, index, item)
      } else {
        // 没有做任何修改
        if (item.isEditGroupName !== item.groupName) {
          this.confirmEditGroupName(item, index)
        } else {
          item.isEdit = false
          this.$set(this.video, index, item)
        }
      }
    },
    // 确认编辑
    confirmEditGroupName (item, index) {
      item.isPop = false // 隐藏popper
      let row = {
        id: item.id,
        groupName: item.groupName,
        isShare: 2
      }
      this.$http.post(this.$api.groupEdit, row)
        .then(res => {
          if (res.data.code === 200) {
            item.isEdit = false
            this.$set(this.video, index, item)
            this.$message.success('修改成功！')
            // 修改完成重新赋值
            item.isEditGroupName = item.groupName
          }
        })
        .catch(() => {
          item.groupName = item.isEditGroupName
        })
    },
    // 取消删除
    getCloseModal () {
      this.dialogVisible = false
    },
    // 确认删除
    getConfirmDelete () {
      let delFile = this.checked ? 1 : 2
      this.dialogVisible = false // 隐藏弹出框
      let ids = []
      if (this.deleteItem.id) { // 单个删除
        ids.push(this.deleteItem.id)
      } else { // 批量删除
        let filterData = this.video.filter(item => item.deleteCheckBoxList === true)
        filterData.forEach((item) => {
          ids.push(item.id)
        })
      }
      this.$http.get(this.$api.groupDelete, { params: { ids: ids.join(','), delFile: delFile } })
        .then(res => {
          if (res.data.code === 200) {
            ids.forEach((item) => {
              this.video.forEach((val, index) => {
                if (item === val.id) {
                  this.video.splice(index, 1)
                }
              })
            })
            this.checked = false
            this.batchDelete = false
            this.$message.success('删除成功！')
            this.emptyParams()
          }
        })
        .catch(() => {
          this.checked = false
        })
    },
    // 删除组别
    deleteBox (index, item) {
      this.dialogVisible = true
      this.deleteItem = item
      this.deleteItem.index = index
    },
    emptyParams () {
      this.ruleForm.pageNum = 1 // 页数为1
      this.dataNull = false // 去掉空提示
      this.dataLess = false
      this.video = []
      this.getVideoList()
    },
    // 筛选
    submitForm () {
      if (this.ruleForm.calcFileName.length || this.ruleForm.time) {
        this.ruleForm.selectFileName = this.getFileName
        this.emptyParams()
      } else {
        this.$message.warning('请勾选根据相册名称或图片名称筛选！')
      }
    },
    // 重置
    resetForm () {
      this.$refs['ruleForm'].resetFields()
      this.emptyParams()
    },
    videoUpload (item) {
      this.$router.push({ name: 'PublicUploadVideo', query: { item: JSON.stringify(item) } })
    },
    newsFile () {
      this.$router.push({ name: 'PublicUploadVideo' })
    },
    // 获取列表
    getVideoList () {
      this.ruleForm.createTimeFmt = (this.ruleForm.time && this.ruleForm.time[0]) || ''
      this.ruleForm.updateTimeFmt = (this.ruleForm.time && this.ruleForm.time[1]) || ''
      this.$http.post(this.$api.groupList, this.ruleForm)
        .then(res => {
          if (res.data.data.content.length && res.data.code === 200) {
            let content = res.data.data.content
            this.video.push(...content)
            this.video.forEach(item => {
              item.isEdit = false // 添加控制编辑字段
              item.isEditGroupName = item.groupName // 添加记录原始组别名字字段
              item.isPop = false
              item.deleteCheckBoxList = false// 添加删除选中字段
            })
            if (content.length < 20) {
              this.dataLess = true
            }
          } else {
            this.dataNull = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getVideoList()
    // this.debouncedGetAnswer = this._.debounce(this.editGroupName, 300)
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    }),
    ...mapState({
      token: state => state.user.token
    }),
    loading () {
      return this.$store.state.mutations.loading
    },
    getFileName () {
      let num = ''
      if (this.ruleForm.groupName) {
        num = 0
        num += this.ruleForm.calcFileName.length >= 2 ? 3 : this.ruleForm.calcFileName[0]
      }
      return num
    },
    isSubmit () {
      let boolean = true
      let form = this.ruleForm
      if ((form.groupName && form.calcFileName.length >= 0) || (form.time && form.time.length >= 1) || form.userName) {
        boolean = false
      }
      return boolean
    }
  },
  components: {
    ScrollData
  }
}
</script>
<style scoped>
.videobox-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 10px;
  display: flex;
  justify-content: space-between;
}
.videobox {
  min-height: 500px;
  padding: 20px;
}
.videobox .operation {
  display: flex;
  align-items: center;
}
.videobox-foot {
  margin-top: 14px;
  float: right;
}
#pagin button {
  background-color: transparent;
}
.videobox .image-box {
  height: 200px;
  overflow: hidden;
}
.videobox .details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.videobox .card-details {
  min-height: 80px;
  padding: 16px;
}
.videobox .card-num-box {
  display: flex;
  justify-content: space-between;
}
.videobox .card-details-title,
.videobox .details-span,
.videobox .time-style {
  font-size: 16px;
}
.videobox .card-details-title {
  color: #333333;
  line-height: 2;
}
.videobox .card-operation {
  font-size: 16px;
  line-height: 2;
  cursor: pointer;
  flex: 1;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-left: 20px;
  position: relative;
}
.videobox .card-operation i:first-child {
  color: #1783ff;
}
.videobox .card-operation i:nth-of-type(3) {
  color: rgb(221, 53, 53);
}
.videobox .card-operation i:nth-of-type(2) {
  color: #c86cdf;
}
.videobox .details-span {
  color: #1783ff;
  display: inline-block;
  width: 60%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.videobox .time-style {
  color: #b2b2b2;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.videobox .my-video-list {
  width: 80%;
  margin: 0 auto;
  padding: 0px;
  text-align: center;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialong-about {
  font-size: 18px;
}
.dialog-check {
  text-align: center;
  margin-top: 20px;
}
.popper-box {
  position: absolute;
  top: -90px;
  left: -70px;
}
.operate-box {
  margin: 15px 0;
}
.delete-checkbox-box {
  text-align: center;
}
.confirmdelete {
  width: 100%;
  text-align: right;
  line-height: 40px;
}
.delete-text {
  color: #1c8ee4;
  margin-right: 50px;
  font-size: 16px;
}
.video-box {
  margin-top: 15px;
  display: flex;
}
.el-col-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
