<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome',query:{changeSide:false} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageVideo' }">视频池</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div v-if="$isPermission(1)">
      <image-search v-if="!isDelete"
                    @deleteItem="getChildDelete"
                    @cancelDelete="getChildCancelDelete"
                    @confirmDelete="getChildConfirmDelete"
                    :isCancelDetele="isCancelDetele"
                    :isDeleteItem="isDeleteItem"
                    @ruleForm="getList"></image-search>
      <div class="video-box">
        <el-row :gutter="36">
          <el-col :xs="24"
                  :sm="12"
                  :md="6"
                  :lg="6"
                  :xl="6"
                  v-for="(item, index) of video"
                  :key="index">
            <el-card shadow="hover"
                     class="border-card"
                     :body-style="{ padding: '0px' }">
              <div class="image-box"
                   @click="openOut(item)"
                   :style="{background: 'url('+ item.videoThumbnail +') no-repeat center', backgroundSize: 'cover',backgroundPosition:'left top'}">
              </div>
              <div class="card-details">
                <p class="card-details-title">
                  <span class="lin-clamp-1"
                        v-text="item.videoTitle"></span>
                </p>
                <div class="details clearfix">
                  <span class="details-span"
                        :id="item.id"
                        v-text="item.createUserName"></span>
                  <time class="time-style"
                        v-text="item.createTime"></time>
                </div>
                <div class="video-href-box">
                  <p class="video-href-box-p"><span id="inviteCode">{{item.videoLink}}</span></p>
                  <el-button id="btnCopy"
                             @click="copyText(item,index)"
                             v-if="isCopy"
                             type="primary"
                             size="small"
                             round>复制链接</el-button>
                </div>
              </div>
            </el-card>
            <div class="handle-checkbox">
              <div class="img-btn-box"
                   v-permission="1">
                <el-checkbox class="search-box-checkbox"
                             :label="item.id"
                             v-model="item.isInUse"
                             @change="getChangeList(item, index)"
                             v-if="!isDeleteItem">采用</el-checkbox>
              </div>
              <div class="img-btn-box"
                   v-if="isDeleteItem">
                <el-checkbox-group v-model="deleteCheckBoxList"
                                   @change="getDeleteCheckbox(item)">
                  <el-checkbox class="search-box-checkbox"
                               :label="item.id">删除</el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
            <div class="delete-btn"
                 v-if="isDelete">
              <el-button type="primary"
                         size="small"
                         icon="el-icon-delete"
                         round
                         @click="videoDelete(item, index)">删除视频</el-button>
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
import { mapState } from 'vuex'
export default {
  name: 'VideoList',
  props: {
    keyWord: String // 定义传值的类型
  },
  data () {
    return {
      routerName: '',
      dataNull: false,
      filterList: [], // 选中删除的列表
      isDeleteItem: false, // 删除按钮
      isCancelDetele: false,
      deleteCheckBoxList: [], // 删除数据存放
      video: [],
      ids: [],
      keyWords: ''
    }
  },
  methods: {
    // 复制
    copyText (item, index) {
      var Url2 = item.videoLink
      var oInput = document.createElement('input')
      oInput.value = Url2
      document.body.appendChild(oInput)
      oInput.select() // 选择对象
      if (document.execCommand('copy')) {
        document.execCommand('copy')
        this.$message.success('复制成功!')
        oInput.className = 'oInput'
        oInput.style.display = 'none'
      } else {
        this.$message.error('您的浏览器暂不支持自动复制，请手动复制!')
      }
    },
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
      this.deleteCheckBoxList.forEach(item => {
        this.video.forEach((val, index) => {
          if (item === val.id) {
            this.video.splice(index, 1)
            this.isDeleteItem = false
            this.isCancelDetele = false
          }
        })
      })
      let obj = { ids: this.deleteCheckBoxList }
      this.$http.post(this.$api.videolistdelete, obj)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
          }
        })
        .catch(() => {
        })
    },
    // 获取选择删除的列表
    getDeleteCheckbox (item, scope) {
      // this.filterList = this.video.filter(item => item.deleteCheckBoxList.length >= 1)
      if (this.deleteCheckBoxList.length >= 1) {
        this.isCancelDetele = true
      } else {
        this.isCancelDetele = false
      }
    },
    // 获取视频列表
    getList (ruleForm) {
      this.video = ruleForm
      this.video.forEach(item => {
        item.isInUse = !!item.isInUse
      })
      this.video.length !== 0 ? this.dataNull = false : this.dataNull = true
    },
    // 采用视频
    getChangeList (item, index) {
      this.$http.get(`${this.$api.videouse}/${item.id}`)
        .then(res => {
          this.$message.success(res.data.message)
        })
        .catch(() => {
        })
    },
    openOut (item) {
      window.open(item.videoLink, '_blank')
    },
    // 点击删除当前
    videoDelete (item, index) {
      this.$http.get(this.$api.videodelete, { params: { id: item.id } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success(res.data.message)
            this.video.forEach((val, index) => {
              if (item.id === val.id) {
                this.video.splice(index, 1)
              }
            })
          }
        })
        .catch(() => {
        })
    }
  },
  created () {
    this.routerName = this.$route.name
  },
  components: {
    ImageSearch
  },
  computed: {
    ...mapState({ deleteVideo: state => state.event.deleteVideo }),
    // copy按钮
    isCopy () {
      if (this.routerName !== 'MessageBox' && this.routerName !== 'videoBox') {
        return true
      } else {
        return false
      }
    },
    // 删除/搜索
    isDelete () {
      if (this.routerName === 'videoBox') {
        return true
      } else {
        return false
      }
    }
  }
}
</script>
<style scoped>
/*视频池*/
.image-box {
  height: 170px;
  overflow: hidden;
  cursor: pointer;
}
.card-details {
  padding: 16px 20px 26px;
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
  color: #333333;
  line-height: 2;
  display: flex;
  justify-content: space-between;
}
.details-span {
  display: inline-block;
  width: 96px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: #1783ff;
}
.time-style {
  color: #b2b2b2;
}
.video-box {
  margin-bottom: 22px;
}

.video-href-box {
  display: flex;
  margin-top: 15px;
  justify-content: space-between;
  box-sizing: border-box;
}
.video-href-box-p {
  flex: 1;
  overflow: hidden;
  border: 1px solid #ccc;
  margin-right: 6px;
  padding: 0 5px;
}
.video-href-box-p span {
  line-height: 32px;
  color: #1d8ee3;
  border-bottom: 1px solid #1d8ee3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.border-card {
  margin-bottom: 15px;
}
.delete-btn {
  text-align: center;
}
.handle-checkbox {
  display: flex;
  justify-content: center;
}
.delete {
  color: #f56c6c;
  cursor: pointer;
}
</style>
