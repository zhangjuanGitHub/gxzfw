<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome' }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageImage' }">图片池</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'ImageDetails' }">我的相册</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="my-img-list">
      <p class="my-img-title">{{imageBox.albumName}}</p>
      <p class="my-img-date">
        {{imageBox.createTime}}</p>
    </div>
    <div class="img-box">
      <el-row :gutter="36"
              class="upload-min-height">
        <el-col :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                v-for="(item, index) of image"
                :key="index"
                class="el-col-box">
          <el-card shadow="hover"
                   :body-style="{ padding: '0px' }">
            <div class="image-box"
                 @click="openOut(item)"
                 :style="{background: 'url('+ item.pictureLink + ') no-repeat center', backgroundSize: 'cover',backgroundPosition:'left top'}">
            </div>
            <div class="card-details">
              <div class="card-num-box">
                <p class="card-details-title"
                   v-text="item.pictureName"></p>
              </div>
              <div class="details clearfix">
                <span class="details-span"
                      v-text="item.createUserName"></span>
                <time class="time-style"
                      v-text="item.createTime"></time>
              </div>
            </div>
          </el-card>
          <div class="img-btn-box">
            <el-button @click="downloadFile(item)"
                       class="img-btn-down"
                       size="small"
                       icon="el-icon-download">下载</el-button>
            <el-button class="img-btn-delete"
                       size="small"
                       icon="el-icon-delete"
                       @click="deleteRow(item, index)">删除</el-button>
          </div>
        </el-col>
        <div v-if="dataNull"
             class="text-center">
          <img :src="require('@/assets/images/empty-data.png')">
        </div>
      </el-row>
      <div class="upload-btn-box">
        <el-button type="primary"
                   @click="getKeyword">继续上传</el-button>
        <el-button @click="backRouter"
                   type="info">返回</el-button>
      </div>
    </div>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="imageDelete"
              @closeModal="getCloseModal"></v-diaing>
    <el-dialog :visible.sync="showImage"
               max-width="50%"
               :modal-append-to-body='false'
               center>
      <img :src="shows"
           style="width:100%;">
    </el-dialog>
  </div>
</template>

<script>
import vDiaing from '@/views/system/components/Diaing'
import { mapState } from 'vuex'
export default {
  name: 'MyImaageList',
  data () {
    return {
      image: [],
      imageBox: {},
      dialogVisible: false,
      showImage: false,
      shows: '',
      deleteItem: {},
      dataNull: false,
      detail: '',
      praimgs: {
        pageNum: '1',
        pageSize: '12'
      }
    }
  },
  methods: {
    // 获取我的相册详情
    getImgdetail () {
      this.$http.get(this.$api.photoDetail, { params: { id: this.detail } })
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.imageBox = res.data.data
            this.image = res.data.data.pictures
            if (this.image.length < 1) {
              this.dataNull = true
            }
          }
        })
        .catch(() => {
        })
    },
    // 点击删除当前
    deleteRow (item, index) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = item.id
    },
    // 确定删除
    imageDelete (item, index) {
      this.$http.get(this.$api.deletePicture, { params: { pictureId: item.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.image.forEach((val, index) => {
              if (item.id === val.id) {
                this.image.splice(index, 1)
                if (this.image.length < 1) {
                  this.dataNull = true
                }
              }
            })
          }
        })
        .catch(() => {
        })
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    openOut (item) {
      this.showImage = true
      this.shows = item.pictureLink
    },
    getKeyword () {
      this.$router.push({ name: 'CreateImage', query: { id: this.detail } })
    },
    backRouter () {
      this.$router.push({ name: 'MyImageList' })
    },
    // 下载
    downloadFile (item) {
      // console.log(item.pictureName)
      window.location.href = `${this.$api.downloadFile}?filePath=${item.pictureLink}`
    }
  },
  created () {
    this.detail = this.$route.query.id
    this.getImgdetail()
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading,
      token: state => state.user.token
    })
  },
  components: {
    vDiaing
  }
}
</script>

<style scoped>
.my-img-list {
  padding: 48px 5px 15px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid rgba(221, 221, 221, 1);
  margin-bottom: 32px;
}
.my-img-title {
  font-size: 22px;
  color: #333333;
}
.my-img-date {
  font-size: 16px;
  color: #39a3f2;
}
.my-img-name {
  margin-right: 30px;
}
.el-col-box {
  margin-bottom: 30px;
}
.image-box {
  cursor: pointer;
  height: 170px;
  overflow: hidden;
}
.card-details {
  padding: 16px 16px 26px;
}
.details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.card-details-title,
.details-span,
.time-style {
  font-size: 16px;
}
.card-details-title {
  height: 32px;
  color: #333333;
  line-height: 2;
  flex: 1;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.details-span {
  display: inline-block;
  width: 100px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #1783ff;
}
.time-style {
  color: #b2b2b2;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.img-box {
  margin-bottom: 22px;
}
.card-num-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.card-num-p {
  width: 50px;
  text-align: right;
}
.card-num-box .img-num {
  color: #1783ff;
  margin-right: 3px;
}
.img-btn-box {
  text-align: center;
  margin-top: 18px;
}
.img-btn-box .img-btn-delete,
.img-btn-box .img-btn-down {
  border-radius: 0;
  border: none;
  color: #fff;
}
.img-btn-box .img-btn-down {
  background: #1783ff;
}
.img-btn-box .img-btn-delete {
  background: #bc8dee;
}
.img-btn-box a {
  color: #ffffff;
}
.upload-btn-box {
  text-align: right;
}
.upload-min-height {
  min-height: 500px;
}
</style>
