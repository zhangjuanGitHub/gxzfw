<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome' }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageImage' }">图片池</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MyImageList' }">我的相册</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="my-img-list">
      <p class="my-img-title">我的相册列表</p>
    </div>
    <div class="img-box">
      <el-row :gutter="36">
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
            <router-link :to="{name: 'ImageDetails', query: {id:item.id}}">
              <div class="image-box"
                   :style="{background: 'url('+ item.coverImage + ') no-repeat center', backgroundSize: 'cover',backgroundPosition:'left top'}">
              </div>
              <div class="card-details">
                <div class="card-num-box">
                  <p class="card-details-title"
                     v-text="item.albumName"></p>
                  <p class="card-num-p"><span class="img-num">{{item.pictureNum}}</span>张</p>
                </div>
                <div class="details clearfix">
                  <span class="details-span"
                        v-text="item.createUserName"></span>
                  <time class="time-style"
                        v-text="item.createTime"></time>
                </div>
              </div>
            </router-link>
          </el-card>
          <div class="img-btn-box">
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
    </div>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
  </div>
</template>

<script>
import vDiaing from '@/views/system/components/Diaing'
export default {
  name: 'MyImaageList',
  data () {
    return {
      image: [],
      dataNull: false,
      dialogVisible: false,
      deleteItem: {},
      praimgs: {
        pageNum: '1',
        pageSize: '12'
      }
    }
  },
  methods: {
    // 获取我的相册列表
    getImglist () {
      this.$http.post(this.$api.photolistSelf, this.praimgs)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.image = res.data.data.content
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
    // 确认删除
    getConfirmDelete (item, index) {
      this.$http.get(this.$api.photodelete, { params: { id: item.id } })
        .then(res => {
          this.$message.success(res.data.message)
          this.image.forEach((val, index) => {
            if (item.id === val.id) {
              this.image.splice(index, 1)
            }
          })
          this.getImglist()
        })
        .catch(() => {
        })
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    }
  },
  created () {
    this.getImglist()
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
.img-btn-box .img-btn-delete {
  border-radius: 0;
  border: none;
  color: #fff;
  background: #bc8dee;
}
.img-btn-box a {
  color: #ffffff;
}
</style>
