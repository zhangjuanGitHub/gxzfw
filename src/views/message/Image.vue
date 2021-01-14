<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageImage' }">图片池</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-if="$isPermission(1)">
      <image-search @deleteItem="getChildDelete"
                    @cancelDelete="getChildCancelDelete"
                    @confirmDelete="getChildConfirmDelete"
                    :isCancelDetele="isCancelDetele"
                    :isDeleteItem="isDeleteItem"
                    @ruleForm="getList"></image-search>
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
            <div class="img-btn-box"
                 v-if="isDeleteItem">
              <el-checkbox-group v-model="item.deleteCheckBoxList"
                                 @change="getDeleteCheckbox(item)">
                <el-checkbox class="search-box-checkbox"
                             :label="item.id">删除</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-col>
          <div v-if="dataNull"
               class="text-center">
            <img :src="require('@/assets/images/empty-data.png')">
          </div>
        </el-row>
      </div>
    </div>
    <no-permission v-else></no-permission>
  </div>
</template>

<script>
import ImageSearch from '@/views/message/components/ImageSearch'
export default {
  name: 'ImageList',
  props: ['myImgs'],
  data () {
    return {
      dataNull: false,
      filterList: [], // 选中删除的列表
      isDeleteItem: false, // 删除按钮
      isCancelDetele: false,
      routerName: '',
      image: [],
      praimgs: {
        pageNum: '',
        pageSize: ''
      },
      ids: [],
      detail: this.$route.params.id
    }
  },
  methods: {
    // 获取点击删除按钮
    getChildDelete () {
      this.isDeleteItem = true
    },
    // 获取点击取消删除按钮
    getChildCancelDelete () {
      this.isDeleteItem = false
    },
    // 获取点击确认删除按钮
    getChildConfirmDelete () {
      this.filterList.forEach(item => {
        this.image.forEach((val, index) => {
          if (item.id === val.id) {
            this.image.splice(index, 1)
            this.isDeleteItem = false
            this.isCancelDetele = false
          }
        })
        this.ids.push(item.id)
      })
      let obj = { ids: this.ids }
      this.$http.post(this.$api.photolistdelete, obj)
        .then(res => {
          this.$message.success(res.data.message)
        })
        .catch(() => {
        })
    },
    // 获取选择删除的列表
    getDeleteCheckbox (item, scope) {
      this.filterList = this.image.filter(val => val.deleteCheckBoxList >= 1)
      if (this.filterList.length >= 1) {
        this.isCancelDetele = true
      } else {
        this.isCancelDetele = false
      }
    },
    // 获取相册列表
    getList (ruleForm) {
      this.image = ruleForm
      this.image.length !== 0 ? this.dataNull = false : this.dataNull = true
    },
    // 下载
    downImg (imgsrc, name) {
      console.log(imgsrc.coverImage)
    }
  },
  created () {
    this.routerName = this.$route.name
  },
  components: {
    ImageSearch
  },
  computed: {
    // 控制下载按钮
    isimageDetail () {
      if (this.routerName === 'ImageDetails') {
        return true
      } else {
        return false
      }
    },
    // 删除按钮
    isimageDelete () {
      if (this.routerName !== 'MessageHome') {
        return true
      } else {
        return false
      }
    },
    // 我的相册列表下载/删除/张数
    isMyImageList () {
      if (this.routerName === 'MyImageList') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
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
</style>
