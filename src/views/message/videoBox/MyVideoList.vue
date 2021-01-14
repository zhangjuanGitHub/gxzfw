<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageHome' }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MessageVideo' }">视频池</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'MyVideoList' }">我的视频</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="search-box">
      <span>关键字</span>
      <el-input size="small"
                v-model="keyWords"
                placeholder="请输入关键字"
                suffix-icon="el-icon-search"></el-input>
      <div class="public-btn image-search-box">
        <el-button size="small"
                   class="screen"
                   @click="screen"
                   type="primary">筛选</el-button>
        <el-button size="small"
                   class="reset my-list"
                   @click="resetForm('ruleForm')">重置</el-button>
      </div>
    </div>
    <div>
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
                     :body-style="{ padding: '0px' }">
              <router-link :to="{name: ''}">
                <div class="image-box"
                     @click="openOut(item)"
                     :style="{background: 'url('+ item.videoThumbnail +') no-repeat center', backgroundSize: 'cover',backgroundPosition:'left top'}">
                </div>
              </router-link>
              <div class="card-details">
                <p class="card-details-title lin-clamp-1"
                   v-text="item.videoTitle"></p>
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
                             type="primary"
                             size="small"
                             round>复制链接</el-button>
                </div>
              </div>
            </el-card>
            <div class="delete-btn">
              <el-button type="primary"
                         size="small"
                         icon="el-icon-delete"
                         round
                         @click="deleteRow(item, index)">删除视频</el-button>
            </div>
          </el-col>
          <div v-if="dataNull"
               class="text-center">
            <img :src="require('@/assets/images/empty-data.png')">
          </div>
        </el-row>
      </div>
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
  name: 'MyVideoList',
  data () {
    return {
      routerName: '',
      dataNull: false,
      dialogVisible: false,
      deleteItem: {},
      filterList: [], // 选中删除的列表
      isDeleteItem: false, // 删除按钮
      isCancelDetele: false,
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
    openOut (item) {
      window.open(item.videoLink, '_blank')
    },
    // 获取我的视频列表
    seachVideo () {
      let searchParam = { searchParam: this.keyWords }
      this.$http.post(this.$api.videolistSelf, searchParam)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.video = res.data.data.content
            if (this.video.length < 1) {
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
      this.$http.get(this.$api.videodelete, { params: { id: item.id } })
        .then(res => {
          this.$message.success(res.data.message)
          this.video.forEach((val, index) => {
            if (item.id === val.id) {
              this.video.splice(index, 1)
            }
          })
          this.seachVideo()
        })
        .catch(() => {
        })
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    screen () {
      this.seachVideo()
    },
    resetForm () {
      this.keyWords = ''
      this.seachVideo()
    }
  },
  created () {
    this.seachVideo()
    this.routerName = this.$route.name
  },
  components: {
    vDiaing
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  padding: 5px 10px;
  align-items: center;
  border-radius: 4px;
  margin-bottom: 20px;
}
.search-box span {
  font-size: 14px;
  width: 70px;
}
/*视频池*/
.image-box {
  height: 170px;
  overflow: hidden;
  cursor: pointer;
}
.card-details {
  padding: 16px 20px 26px;
}

.card-details-title,
.details-span,
.time-style {
  font-size: 16px;
}
.card-details-title {
  color: #333333;
  line-height: 2;
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
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  line-height: 32px;
  color: #1d8ee3;
  border-bottom: 1px solid #1d8ee3;
}
.delete-btn {
  margin-top: 18px;
  text-align: center;
}

.image-search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-box .el-input {
  width: 280px;
}
.screen {
  margin-left: 10px;
}
</style>
