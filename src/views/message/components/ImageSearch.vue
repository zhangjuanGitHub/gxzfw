<template>
  <div class="search-box">
    <el-form :model="ruleForm"
             size="small"
             :inline="true"
             label-position="left"
             ref="ruleForm"
             class="image-search-box">
      <el-form-item class="img-region-style"
                    prop="areaId"
                    label="地区">
        <el-select v-model="ruleForm.areaId"
                   placeholder="全部">
          <el-option v-for="item in screenData"
                     :key="item.id"
                     :label="item.areaName"
                     :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="img-status-style"
                    prop="organizationType"
                    label="职能">
        <el-select size="small"
                   placeholder="全部"
                   v-model="ruleForm.organizationType">
          <el-option label="全部"
                     value=""></el-option>
          <el-option label="政法委"
                     value="1"></el-option>
          <el-option label="公安"
                     value="2"></el-option>
          <el-option label="检察院"
                     value="3"></el-option>
          <el-option label="法院"
                     value="4"></el-option>
          <el-option label="司法"
                     value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="img-date-style"
                    label="时间"
                    prop="date">
        <el-date-picker v-model="ruleForm.date"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item :class="[isVideo ? 'img-keywords-style2' : 'img-keywords-style']"
                    prop="searchParam"
                    class="keywords"
                    label="关键字">
        <el-input v-model="ruleForm.searchParam"
                  placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-checkbox v-if="isVideo"
                   class="search-box-checkbox"
                   v-model="checked">采用</el-checkbox>
      <div class="public-btn image-search-box">
        <el-button size="small"
                   class="screen"
                   @click="screen"
                   type="primary">筛选</el-button>
        <el-button size="small"
                   class="reset my-list"
                   @click="resetForm('ruleForm')">重置</el-button>
      </div>
      <div v-if="isVideo"
           class="public-btn btn-box-style image-search-box">
        <router-link :to="{name: 'MyVideoList'}">
          <el-button size="small"
                     class="my-list video"
                     type="primary">我的视频</el-button>
        </router-link>
        <router-link :to="{name: 'UploadVideo'}"
                     v-permission="1">
          <el-button size="small"
                     class="my-list">新建视频</el-button>
        </router-link>
        <div class="delete">
          <el-button v-if="!isDeleteItem"
                     @click="deleteItem"
                     size="small"
                     class="delete"
                     type="danger"
                     v-permission="1">删除视频</el-button>
          <el-button v-if="isDeleteItem && !isCancelDetele"
                     @click="cancelDelete"
                     size="small"
                     class="cancel"
                     v-permission="1">取消删除</el-button>
          <el-button v-if="isCancelDetele"
                     @click="confirmDelete"
                     size="small"
                     class="confirm"
                     type="danger"
                     v-permission="1">确认删除</el-button>
        </div>
      </div>
      <div v-else
           class="public-btn btn-box-style image-search-box">
        <router-link :to="{name: 'MyImageList'}">
          <el-button size="small"
                     class="my-list picture"
                     type="primary">我的相册</el-button>
        </router-link>
        <router-link :to="{name: 'CreateImage'}"
                     v-permission="1">
          <el-button size="small"
                     class="my-list">新建相册</el-button>
        </router-link>
        <div class="delete">
          <el-button v-if="!isDeleteItem"
                     @click="deleteItem"
                     size="small"
                     class="delete"
                     type="danger"
                     v-permission="1">删除相册</el-button>
          <el-button v-if="isDeleteItem && !isCancelDetele"
                     @click="cancelDelete"
                     size="small"
                     class="cancel"
                     v-permission="1">取消删除</el-button>
          <el-button v-if="isCancelDetele"
                     @click="confirmDelete"
                     size="small"
                     class="confirm"
                     type="danger"
                     v-permission="1">确认删除</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>
<script>
// import {mapMutations, mapState} from 'vuex'
export default {
  name: 'ImageSearch',
  props: ['isDeleteItem', 'isCancelDetele'],
  data () {
    return {
      isRegionSearch: '',
      isCheckedShow: false,
      checked: false, // 采用
      isVideo: false, // 按钮显示/是否视频按钮
      imgList: {},
      videoList: {},
      screenData: [], // 地区列表
      ruleForm: {
        areaId: '', // 地区ID
        organizationType: '', // 职能
        status: '', // 审核
        departmentId: '', // 单位
        date: [], // 时间
        searchParam: '', // 关键词
        inUse: '', // 采用
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    // 重置
    resetForm (ruleForm) {
      this.checked = false
      this.ruleForm.inUse = ''
      this.$refs[ruleForm].resetFields()
      this.ruleForm.pageNum = 1
      this.getList()
    },
    // 筛选
    screen () {
      this.ruleForm.inUse = this.checked
      this.ruleForm.pageNum = 1
      this.getList()
    },
    // 点击删除按钮
    deleteItem () {
      this.$emit('deleteItem')
    },
    // 取消删除
    cancelDelete () {
      this.$emit('cancelDelete')
    },
    // 确认删除
    confirmDelete () {
      this.$emit('confirmDelete')
    },
    getList () {
      this.ruleForm.startDate = this.ruleForm.date[0] || '' // 开始时间
      this.ruleForm.endDate = this.ruleForm.date[1] || '' // 结束日期
      if (this.isVideo) {
        this.$http.post(this.$api.videoList, this.ruleForm)
          .then(res => {
            if (res.data.code === 200 && res.data.data.content) {
              this.videoList = res.data.data.content
              this.videoList.forEach(item => {
                item.deleteCheckBoxList = []
              })
              this.$emit('ruleForm', this.videoList)
            }
          })
          .catch(() => {
          })
      } else {
        this.$http.post(this.$api.PhotoList, this.ruleForm)
          .then(res => {
            this.image = res.data.data.content
            this.image.forEach(item => {
              item.deleteCheckBoxList = []
            })
            this.$emit('ruleForm', this.image)
          })
          .catch(() => {
          })
      }
    },
    // 获取地区列表
    getScreenlist () {
      this.$http.get(this.$api.listForSelect)
        .then(res => {
          if (res.data.data && res.data.code === 200) {
            this.screenData.push(...res.data.data)
            let splice = {
              areaName: '全部',
              id: ''
            }
            this.screenData.splice(0, 0, splice)
          }
        })
        .catch(() => {
          this.loading = false
        })
    }
  },
  created () {
    let getRouterName = this.$route.name
    if (getRouterName !== 'MessageImage') {
      this.isVideo = true
    }
    this.getList()
    this.getScreenlist()
  }
}
</script>
<style lang="scss" scoped>
@import "../message";
</style>
<style scoped>
.search-box {
  padding: 9px 20px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form-item {
  margin-bottom: 0;
  display: flex;
}
.search-box-checkbox {
  margin-right: 10px;
}
.image-search-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn-box-style {
  width: 240px;
}
.rule-lable {
  display: block;
  width: 115px;
  margin-right: 5px;
}
.search-box .times {
  width: 40px;
}
.search-box .region {
  width: 35px;
}
.search-box .keyword {
  width: 70px;
}
.search-box .el-date-editor {
  width: 235px;
}
.my-list {
  margin-right: 5px;
}
.search-box .el-select {
  width: 130px;
}
.search-box .keywords .el-input {
  width: 130px;
}
.delete {
  width: 80px;
}
</style>
