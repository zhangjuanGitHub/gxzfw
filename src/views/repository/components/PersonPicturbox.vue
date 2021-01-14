<template>
  <div class="Picturebox">
    <div class="Picturebox-seach">
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
            <el-checkbox :label="1">相册名称</el-checkbox>
            <el-checkbox :label="2">图片名称</el-checkbox>
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
        <span class="delete-text">* 请勾选需要批量删除的图片集</span>
        <el-button type="danger"
                   @click="confirmRawDelete">确认删除</el-button>
        <el-button @click="cancleDelete">取消删除</el-button>
      </div>
      <div class="operation"
           v-if="!batchDelete">
        <el-tooltip content="新建相册"
                    placement="top">
          <el-button type="primary"
                     @click="newsFile">
            <i class="el-icon-plus"></i>
          </el-button>
        </el-tooltip>
        <el-tooltip content="删除相册"
                    placement="top">
          <el-button @click="deleteGroup">
            <i class="el-icon-delete"></i>
          </el-button>
        </el-tooltip>
      </div>
    </div>
    <div class="img-box">
      <el-row :gutter="36"
              class="el-col-box">
        <el-col :xs="24"
                :sm="12"
                :md="8"
                :lg="8"
                :xl="8"
                v-for="(item, index) of image"
                :key="index">
          <div>
            <el-card shadow="hover"
                     :body-style="{ padding: '0px' }">
              <router-link :to="{name: 'pictureDetail', params: {id:item.id, isPublic: item.isPublic}}">
                <div class="image-box">
                  <!--                  <img :src="item.thumbnailUrl" alt="">-->
                  <el-image :src="item.thumbnailUrl || defaultCover"
                            fit="fill"
                            style="height:200px;"></el-image>
                </div>
              </router-link>
              <div class="card-details">
                <div class="card-num-box">
                  <p class="card-details-title details-span"
                     v-text="item.userName"></p>
                  <div class="card-operation">
                    <div class="popper-box">
                      <el-popover placement="top"
                                  width="160"
                                  v-model="item.isPop">
                        <p>{{item.isShare === 2 ? '是否共享到公共资源库？' : '是否取消共享？'}}</p>
                        <div style="text-align: right; margin-top: 10px">
                          <el-button size="mini"
                                     type="text"
                                     @click="share(item, index, false)">取消</el-button>
                          <el-button type="primary"
                                     size="mini"
                                     @click="confirmEditGroupName(item, index)">确定</el-button>
                        </div>
                      </el-popover>
                    </div>
                    <el-tooltip content="分享" placement="top">
                      <i class="el-icon-share"
                         @click="share(item, index, true)"></i>
                    </el-tooltip>
                    <el-tooltip content="上传" placement="top">
                      <i class="el-icon-upload2"
                        @click="imageUpload(item)"></i>
                    </el-tooltip>
                    <el-tooltip content="下载" placement="top">
                      <i class="el-icon-download"
                        @click="downloadFile(item.id)"></i>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                      <i class="el-icon-delete"
                          v-if="!batchDelete && item.isDefault !== 1"
                          @click="deleteBox(index, item)"></i>
                    </el-tooltip>
                  </div>
                </div>
                <div class="details clearfix">
                  <span class="time-style"
                        v-text="item.createTimeFmt"></span>
                </div>
              </div>
            </el-card>
            <div class="operate-box">
              <div class="my-image-list"
                   v-if="!batchDelete">
                <el-input v-model="item.groupName"
                          :disabled="!item.isEdit">
                </el-input>
                <!-- <span> -->
                  <el-tooltip content="编辑" placement="top">
                    <i @click="editGroupName('edit', item, index, item.isEditGroupName)"
                        v-if="!item.isEdit && item.isDefault !== 1"
                        class="el-input__icon el-icon-edit cursor"></i>
                  </el-tooltip>
                  <el-tooltip content="提交" placement="top">
                    <i @click="editGroupName('confirmEdit', item, index, item.isEditGroupName)"
                        v-if="item.isEdit &&item.isDefault !== 1"
                        class="el-input__icon el-icon-check cursor"></i>
                  </el-tooltip>
                <!-- </span> -->
              </div>
              <div class="delete-checkbox-box"
                   v-if="batchDelete && item.isDefault !== 1 && item.isShare !== 1">
                <el-checkbox-group v-model="item.deleteCheckBoxList"
                                   @change="getDeleteCheckbox(item, index)">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id">删除</el-checkbox>
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
    <el-dialog :visible.sync="dialogVisible"
               :modal-append-to-body='false'
               @close="getCloseModal"
               class="dialog-public"
               width="30%">
      <p class="text-center dialong-about">您确定要执行此操作吗?</p>
      <div class="dialog-check">
        <el-checkbox v-model="checked">是否删除相册下的图片？</el-checkbox>
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
      dataLess: false, // 数量小于时
      dataNull: false, // 数据为空时
      batchDelete: false, // 为true时，筛选条件隐藏，小删除按钮隐藏
      checked: false, // 是否删除库下的所有
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
        groupType: 1, // 1图片组，2视频组
        isPublic: 2, // 1公共资源， 2个人资源
        userName: '', // 上传人
        createTimeFmt: '', // 搜索，开始时间
        updateTimeFmt: '', // 搜索，结束时间
        groupName: '', // 关键词
        selectFileName: '', // 搜索范围，1检索组别名称，2检索文件名称，3同时检索前两项
        calcFileName: [1],
        time: []
      },
      image: []
    }
  },
  methods: {
    getData () {
      this.ruleForm.pageNum++
      this.getImageList()
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
      this.$set(this.image, index, item)
    },
    // 下载
    downloadFile (id) {
      window.location.href = `${this.$api.downloadFile}?groupId=${id}&authCode=${this.token}`
    },
    // 取消共享
    share (item, index, isShow) {
      item.isPop = isShow
      this.$set(this.image, index, item)
      // this.confirmEditGroupName(item, index)
    },
    // 编辑
    editGroupName (params, item, index, rawName) {
      if (params === 'edit') {
        item.isEdit = true
        this.$set(this.image, index, item)
      } else {
        // 修改
        if (rawName !== item.groupName) {
          // 因为修改名称和是否共享是同一个接口，故先把共享取反，调用确认编辑时再取反，维持原数据
          item.isShare = item.isShare === 2 ? 1 : 2
          this.confirmEditGroupName(item, index)
        } else {
          // 没有做任何修改
          item.isEdit = false
          this.$set(this.image, index, item)
        }
      }
    },
    // 确认编辑
    confirmEditGroupName (item, index) {
      item.isPop = false // 隐藏popper
      let row = {
        id: item.id,
        groupName: item.groupName,
        isShare: item.isShare === 2 ? 1 : 2 // 取反操作，只要点击了确认共享按钮，直接取反，修改组别名称时不需要改变共享状态，则在上方editGroupName方法先进行取反，此处再进行取反，得正
      }
      this.$http.post(this.$api.groupEdit, row)
        .then(res => {
          if (res.data.code === 200) {
            item.isEdit = false
            this.$set(this.image, index, item)
            this.$message.success('操作成功！')
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
        let filterData = this.image.filter(item => item.deleteCheckBoxList === true)
        if (filterData.length === 0) {
          this.$message.warning('请选择需要删除的数据！')
          return false
        }
        filterData.forEach((item) => {
          ids.push(item.id)
        })
      }
      this.$http.get(this.$api.groupDelete, { params: { ids: ids.join(','), delFile: delFile } })
        .then(res => {
          if (res.data.code === 200) {
            ids.forEach((item) => {
              this.image.forEach((val, index) => {
                if (item === val.id) {
                  this.image.splice(index, 1)
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
    // 单独删除组别
    deleteBox (index, item) {
      this.dialogVisible = true
      this.deleteItem = item
      this.deleteItem.index = index
    },
    emptyParams () {
      this.ruleForm.pageNum = 1
      this.dataNull = false // 去掉空提示
      this.dataLess = false
      this.image = []
      this.getImageList()
    },
    // 筛选
    submitForm () {
      if (this.ruleForm.calcFileName.length && this.ruleForm.time) {
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
    imageUpload (item) {
      this.$router.push({ name: 'PersonCreateImage', query: { item: JSON.stringify(item) } })
    },
    newsFile () {
      this.$router.push({ name: 'PersonCreateImage' })
    },
    // 获取图片列表
    getImageList () {
      this.ruleForm.createTimeFmt = (this.ruleForm.time && this.ruleForm.time[0]) || ''
      this.ruleForm.updateTimeFmt = (this.ruleForm.time && this.ruleForm.time[1]) || ''
      this.$http.post(this.$api.groupList, this.ruleForm)
        .then(res => {
          if (res.data.data.content.length && res.data.code === 200) {
            let content = res.data.data.content
            this.image.push(...content)
            this.image.forEach(item => {
              item.isEdit = false // 添加控制编辑字段
              item.isEditGroupName = item.groupName // 添加记录原始组别名字字段
              item.isPop = false // 添加分享弹出字段
              item.deleteCheckBoxList = false// 添加删除选中字段
            })
            if (content.length < 20) {
              this.dataLess = true
            }
            // this.$refs['ruleForm'].resetFields()
          } else {
            this.dataNull = true
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getImageList()
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    }),
    ...mapState({
      token: state => state.user.token
    }),
    // 关键词筛选，和类别、名称配合搜索
    getFileName () {
      let num = ''
      if (this.ruleForm.groupName) {
        // 单勾选则传对应值，双勾选传3
        num = 0
        num += this.ruleForm.calcFileName.length >= 2 ? 3 : this.ruleForm.calcFileName[0]
      }
      return num
    }
  },
  components: {
    ScrollData
  }
}
</script>
<style lang="scss">
@import "../resour";
</style>
<style scoped>
.Picturebox {
  padding: 20px;
}
.Picturebox-seach {
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 10px;
  display: flex;
  justify-content: space-between;
}

.Picturebox .el-date-editor.el-input {
  width: 120px;
}

.Picturebox .el-form .el-form-item {
  margin-right: 5px;
  margin-bottom: 0px;
}

.Picturebox .el-checkbox {
  margin-right: 5px;
}
.Picturebox .el-button {
  width: 70px;
  height: 29px;
  border-radius: 0;
  padding: 0px;
}
.Picturebox .operation .el-button {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  font-size: 16px;
  color: #fff;
}
.Picturebox .operation .el-button:last-child {
  background-color: #c86cdf;
}
.Picturebox-foot {
  margin-top: 14px;
  float: right;
}
#pagin button {
  background-color: transparent;
}
.Picturebox .image-box {
  width: 320px;
  height: 200px;
  overflow: hidden;
}
.Picturebox .img-box .el-col {
  position: relative;
}
.Picturebox .details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.Picturebox .card-details {
  min-height: 80px;
  padding: 16px;
}
.Picturebox .card-num-box {
  display: flex;
  justify-content: space-between;
}
.Picturebox .card-details-title,
.Picturebox .details-span,
.Picturebox .time-style {
  font-size: 16px;
}
.Picturebox .card-details-title {
  color: #333333;
  line-height: 2;
}
.Picturebox .card-operation {
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
.Picturebox .card-operation i:first-child {
  color: #1783ff;
}
.Picturebox .card-operation i:nth-of-type(3) {
  color: #c86cdf;
}
.Picturebox .details-span {
  color: #1783ff;
  display: inline-block;
  width: 60%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.Picturebox .time-style {
  color: #b2b2b2;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.Picturebox .my-image-list {
  width: 80%;
  padding: 0px;
  margin: 0 auto;
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
.img-box {
  margin-top: 15px;
  display: flex;
}
.el-icon-upload2 {
  color: #1783ff;
}
.el-col-box {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
</style>
