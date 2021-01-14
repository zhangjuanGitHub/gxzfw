<template>
  <div class="data-center">
    <div class="data-search">
      <div class="data-center-header">
        <el-form ref="form"
                 :model="form"
                 label-width="60px">
          <div class="reroder"
               v-if="!deleteOne">
            <el-button size="small"
                       type="primary"
                       @click="newFolder"
                       v-if="!accountShow">新建</el-button>
            <div class="modify"
                 v-if="!accountShow">
              <el-button size="small"
                         @click="modifyFolder"
                         v-if="modify">取消修改</el-button>
              <el-button size="small"
                         @click="modifyFolder"
                         v-else>修改</el-button>
            </div>
            <el-button size="small"
                       @click="backFolder"
                       v-if="accountShow"
                       >返回</el-button>
            <el-button size="small" type="danger"
                       @click="delFolder"
                       v-if="!accountShow">删除</el-button>
          </div>
          <div v-if="deleteOne"
               class="reroder">
            <el-button type="danger"
                       @click="confirmRawDelete"
                       size="small">确认删除</el-button>
            <el-button @click="cancelDel"
                       size="small">取消删除</el-button>
          </div>
        </el-form>
      </div>
    </div>
    <div v-if="accountShow">
      <!-- 微信列表 -->
      <div class="account-list">
        <div class="list-box"
             v-if="dataNull">
          <el-image :src="require('@/assets/images/empty-data.png')"
                    :fit="'fill'"></el-image>
          <p><router-link class="text-click" :to="{name:'UserList',query:{dis:this.form.cid,tabs:'wx'}}">暂无数据,请前往添加</router-link></p>
        </div>
        <div class="account-list-box"
             v-else
             v-for="(item, index) in accountList"
             :key="item.accountid">
          <el-badge :value="item.unreadCount"
                    :max="99"
                    :hidden="!item.unreadCount"
                    class="news-item">
            <div class="account-img"
                 @click="routeBank(item, index)">
              <div class="head-img"
                   :style="{ 'backgroundImage': 'url(' + item.avatar + ')' }">
              </div>
            </div>
          </el-badge>
          <div class="account-name">
            <h2 v-html="item.nickname"></h2>
            <p>{{item.province}}</p>
            <div class="cancel active"
                 @click="cancelActive(item,index)">
              <p>取消星标</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="folder-list"
         v-else>
      <div class="folder-detail"
           v-for="(item, index) in folderList"
           :key="index">
        <el-image v-if="item.img"
                  style="width: 340px; height: 220px"
                  :src="item.img"
                  :fit="'fill'"
                  lazy
                  @click="getStars(item,index)"></el-image>
        <el-image v-else
                  style="width: 340px; height: 220px"
                  :src="require('@/assets/images/dataimg/filter.png')"
                  :fit="'fill'"
                  lazy
                  @click="getStars(item,index)">
          <div slot="error"
               class="image-slot">
          </div>
        </el-image>
        <p v-text="item.folderName"
           @click="getStars(item,index)"></p>
        <p class="modify-bottom"
           v-if="modify && item.isDel!==0"
           @click="setfolder(item,index)">
          修改
        </p>
        <div class="delete"
             v-if="deleteOne && item.isDel!==0">
          <el-checkbox-group v-model="item.deleteCheckBoxList"
                             @change="delOne(item, index)">
            <el-checkbox class="search-box-checkbox"
                         :label="item.id">删除</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal="ismodal"
                 @close="getDialog()"
                 center
                 width="30%">
        <div class="folderSet">
          <span class="lable-name">文件夹名:</span>
          <el-input size="small"
                    v-model="folderName"></el-input>
        </div>
        <div class="folderSet">
          <span class="lable-name">封面图:</span>
          <v-upload @getAttachmentUrl="getAttachmentUrl"
                    :headUrl="dialogImageUrl"
                    :listType="listType"
                    :showList="showList"
                    :isMultiple="isMultiple"
                    :headToken="token"
                    :acceptType="acceptType"></v-upload>
          <!-- <el-upload class="avatar-uploader"
                     :action="this.$api.upload"
                     :headers="token"
                     drag
                     :show-file-list="false"
                     accept=".jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF"
                     :on-success="handlePictureCardPreview"
                     :on-remove="handleRemove"
                     :before-upload="beforeUpload"
                     :on-progress="getProgress">
            <img v-if="dialogImageUrl && !videoFlag"
                 :src="dialogImageUrl"
                 class="avatar">
            <el-progress v-if="videoFlag"
                         type="circle"
                         :percentage="videoUploadPercent"
                         style="margin-top:30px;"></el-progress>
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em style="display:block">点击上传</em></div>
          </el-upload> -->
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="determine()"
                     v-if="modify">确 定</el-button>
          <el-button type="primary"
                     @click="setDialogText()"
                     v-else>确 定</el-button>
          <el-button @click="getDialog()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import vUpload from '@/components/UploadAll.vue'
import { mapState } from 'vuex'
export default {
  data () {
    return {
      listType: 'text',
      showList: false,
      isMultiple: false,
      acceptType: '.jpg,.jpeg,.png,.gif,.JPG,.PNG,.JPEG,.GIF',
      token: { Authorization: '' },
      videoUploadPercent: 0, // 进度条
      videoFlag: false, // 控制进度条显示
      value: '',
      type: '',
      dataNull: false,
      creadApi: '',
      folderName: '', // 文件夹名
      dialogImageUrl: '', // 封面图
      dialogVisible: false, // 新建文件夹弹框
      ismodal: false, // 遮罩
      photo: false, // 上传预览图
      accountShow: false, // 用户详情显示/隐藏
      modify: false, // 修改文件
      deleteOne: false, // 删除文件夹
      accountList: [], // 用户详情
      folderList: [], // 文件夹详情
      fileList: [],
      screenData: [],
      form: { // 表单
        districts: [],
        name: '',
        cid: 1,
        pageNum: 1,
        pageSize: 20
      },
      accountfrom: { // 参数
        typeId: 1,
        pageNum: 1,
        pageSize: 30
      }
    }
  },
  created () {
    this.form.cid = this.userInfo.cid
    if (this.$route.query.newFolder) {
      this.dialogVisible = true
    }
    this.token.Authorization = this.$store.state.user.token
    this.getFolder()
    // this.getStars()
  },
  methods: {
    getAttachmentUrl (url) {
      this.dialogImageUrl = url.response.message
    },
    // getProgress (event, file, fileList) {
    //   this.fileArr = fileList
    //   this.fileArr.forEach(item => {
    //     if (item.percentage === 100) {
    //     } else {
    //       item.progressFlag = true
    //       this.videoUploadPercent = Math.abs(item.percentage.toFixed(0))
    //     }
    //   })
    // },
    // beforeUpload (file) {
    //   this.videoFlag = true
    // },
    // handlePictureCardPreview (event, file, fileList) {
    //   this.videoUploadPercent = 100
    //   this.videoFlag = false
    //   this.dialogImageUrl = file.response.message
    // },
    // handleRemove (file) {
    //   console.log(file)
    // },
    // 星标状态修改
    cancelActive (item, index) {
      let params = {
        accountId: item.wxid,
        folderId: this.accountfrom.folderId,
        typeId: 1,
        cid: this.form.cid
      }
      this.$http.post(this.$api.updateAttention, params)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.accountList.splice(index, 1)
            if (this.accountList.length === 0) {
              this.dataNull = true
            }
          }
        }).catch(() => {
        })
    },
    routeBank (item, index) {
      this.$router.push({ name: 'AccountDetail', query: { id: item.wxid, type: 'wx' } })
    },
    // 获取文件夹
    getFolder () {
      this.$http.post(this.$api.showFolder, this.accountfrom)
        .then(res => {
          this.folderList = res.data.data.content
          this.folderList.forEach(item => {
            item.deleteCheckBoxList = false// 添加删除选中字段
          })
        })
        .catch(() => {
        })
    },
    // 打开弹框
    newFolder () {
      this.modify = false
      this.deleteOne = false
      this.dialogVisible = true
      this.folderName = ''
      this.fileList = []
      this.dialogImageUrl = ''
    },
    // 新建 点击确定
    setDialogText () {
      this.dialogVisible = false
      let setfolder = {
        typeId: 1,
        folderName: this.folderName,
        img: this.dialogImageUrl
      }
      this.$http.post(this.$api.createFolder, setfolder)
        .then(res => {
          this.$message.success('操作成功!')
          this.getFolder()
        })
        .catch(() => {
        })
    },
    // 关闭弹框
    getDialog () {
      this.dialogVisible = false
    },
    // 获取地区列表
    getScreenlist () {
      let row = {
        folderId: this.accountfrom.folderId,
        type: this.accountfrom.type
      }
      this.$http.post(this.$api.findAreaDistricts, row)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData = res.data.data
          }
        })
        .catch(() => {
        })
    },
    // 获取星标用户
    getStars (item, index) {
      this.accountShow = true
      this.accountList = []
      this.accountfrom.folderId = item.id
      this.$http.post(this.$api.findAttention, this.accountfrom)
        .then(res => {
          if (res.data.code === 200) {
            console.log(123)
            this.dataNull = false
            if (res.data.data.list.length) {
              this.accountList = res.data.data.list
            } else {
              this.accountList = res.data.data
            }
          } else {
            this.accountList = []
            this.dataNull = true
          }
        })
        .catch(() => {
          this.dataNull = true
        })
    },
    // 筛选
    getScreen () {
      this.getStars()
    },
    // 重置
    reset (formName) {
      this.$refs[formName].resetFields()
      this.getStars()
    },
    // 返回文件夹
    backFolder () {
      this.getFolder()
      this.accountShow = false
    },
    // 修改文件夹
    modifyFolder () {
      this.modify = !this.modify
      this.deleteOne = false
    },
    // 删除文件夹
    delFolder () {
      this.deleteOne = true
      this.modify = false
    },
    // 取消删除
    cancelDel () {
      this.deleteOne = false
      this.folderList.forEach(item => {
        item.deleteCheckBoxList = false
      })
    },
    // 勾选删除
    delOne (item, index) {
      this.$set(this.folderList, index, item)
    },
    // 确定删除
    confirmRawDelete () {
      let params = {
        ids: []
      }
      let filterData = this.folderList.filter(item => item.deleteCheckBoxList === true)
      filterData.forEach((item) => {
        params.ids.push(item.id)
      })
      this.$http.post(this.$api.deleteFolderById, params)
        .then(res => {
          if (res.data.code === 200) {
            params.ids.forEach((item) => {
              this.folderList.forEach((val, index) => {
                if (item === val.id) {
                  this.folderList.splice(index, 1)
                }
              })
            })
            this.$message.success(res.data.message)
            this.deleteOne = false
          }
        })
        .catch(() => { })
    },
    // 修改
    setfolder (item, index) {
      this.fileList = []
      this.id = item.id
      this.folderName = item.folderName
      this.dialogImageUrl = item.img
      this.dialogVisible = true
      if (item.img) {
        let creads = {
          name: '',
          url: this.dialogImageUrl
        }
        this.fileList.push(creads)
      }
    },
    // 修改 确定
    determine () {
      this.dialogVisible = false
      this.modify = false
      let setfolder = {
        typeId: 1,
        id: this.id,
        folderName: this.folderName,
        img: this.dialogImageUrl
      }
      this.$http.post(this.$api.updateFolder, setfolder)
        .then(res => {
          if (res.data.code === 200) {
            this.getFolder()
          }
        })
        .catch(() => {
        })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo // 是否存在用户信息
    })
  },
  components: {
    vUpload
  }
}

</script>
<style lang="scss">
@import "../bigData";
</style>
<style scoped>
.data-center {
  box-sizing: border-box;
  min-height: 500px;
}
.data-center .account-list {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
}
.data-center .account-list .list-box {
  width: 100%;
}
.account-list .list-box .el-image {
  display: block;
  width: 280px;
  height: 280px;
  margin: 30px auto;
}
.list-box p {
  text-align: center;
}
.data-center .account-list-box {
  width: 25%;
  display: flex;
  cursor: pointer;
  margin-top: 20px;
}
.data-center .account-list::after {
  content: "";
  flex: auto;
}
.account-name {
  margin-left: 10px;
}
.data-center .account-list .account-name h2 {
  font-size: 20px;
  font-weight: bold;
  color: black;
  line-height: 32px;
  margin-top: 5px;
}
.account-name p {
  width: 170px;
  font-size: 12px;
  line-height: 14px;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.account-name .cancel p {
  width: 60px;
  height: 20px;
  text-align: center;
  border-radius: 3px;
  line-height: 20px;
  margin-top: 5px;
}
.account-name .active p {
  background-color: #6db8ef;
  color: #fff;
}
.account-name .active2 p {
  background-color: #cbcbcb;
  color: #fff;
}
.data-center-header {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 0 15px;
  font-size: 14px;
  color: #333;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.data-center-header .el-form {
  display: flex;
  justify-content: space-between;
}
.data-center-header .el-form .el-form-item {
  margin-right: 20px;
  margin-bottom: 0;
}
.data-center-header .el-button {
  border-radius: 0px;
  vertical-align: middle;
}
.data-center-header .el-form-item .el-checkbox:last-child {
  margin-left: -70px;
}
.reroder {
  padding: 4px 15px;
  position: absolute;
  right: 15px;
}
.head-img {
  width: 80px;
  height: 80px;
  border: 1px solid #ccc;
  overflow: hidden;
  position: relative;
  border-radius: 50%;
  margin-right: -5px;
  background-position: center;
}
.user-dialog .data-page {
  top: 0px;
  overflow: hidden;
}
.user-dialog .el-checkbox-group img {
  vertical-align: middle;
  margin-right: 13px;
}
.folderSet {
  width: 80%;
  display: flex;
  margin-top: 10px;
}
.folderSet span {
  margin-right: 10px;
  line-height: 32px;
}
.folder-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.folderSet .el-input {
  width: 190px;
}
.folder-detail {
  cursor: pointer;
  border-radius: 5px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.folder-detail .el-image {
  border-radius: 5px 5px 0 0;
}
.folder-detail p {
  text-align: center;
  margin: 10px 0;
}
.folder-list::after {
  content: "";
  width: 340px;
}
.modify-bottom {
  color: #6db8ef;
  text-decoration: underline;
}
.delete {
  color: #f56c6c;
  text-decoration: underline;
  text-align: center;
  margin-top: 5px;
}
.modify {
  display: inline-block;
  margin: 0 10px;
}
.lable-name {
  width: 60px;
}
</style>
