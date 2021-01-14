<template>
  <div class="container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>公共图像资料库</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <v-menu></v-menu>
    <div class="AssessHead"
         v-loading="loading">
      <el-tabs type="border-card"
               v-model="activeName"
               @tab-click="handleClick(activeName)">
        <el-tab-pane name="publicImage">
          <span slot="label">
            <i>
              <img :src="require('@/assets/images/resimg/photo.png')"
                   alt="">
            </i>图片库
          </span>
        </el-tab-pane>
        <el-tab-pane name="publicVideo">
          <span slot="label">
            <i>
              <img :src="require('@/assets/images/resimg/video.png')"
                   alt="">
            </i>视频库
          </span>
        </el-tab-pane>
        <div>
          <div class="plat-seach">
            <el-form :inline="true"
                     :model="formInline"
                     ref="formInline"
                     class="demo-form-inline">
              <el-form-item prop="time"
                            label="上传时间:">
                <el-date-picker v-model="formInline.time"
                                type="daterange"
                                size="small"
                                range-separator="-"
                                format="yyyy 年 MM 月 dd 日"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item prop="searchParam"
                            label="关键字:">
                <el-input v-model="formInline.searchParam"
                          size="small"
                          placeholder="输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="primary"
                           size="small"
                           @click="submitForm">筛选</el-button>
                <el-button size="small"
                           @click="resetForm('formInline')">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="plat-table">
            <el-table :data="tableData"
                      :header-cell-style="getRowClass"
                      :row-class-name="tableRowClassName"
                      style="max-height: 500px"
                      border>
              <el-table-column prop="rank"
                               label="发布历史"
                               width="130">
                <template slot-scope="scope">
                  <el-link @click="showHistory(scope.row, scope.$index)"
                           type="primary">查看发布历史<i class="el-icon-view el-icon--right"></i> </el-link>
                </template>
              </el-table-column>
              <el-table-column prop="updateTime"
                               label="更新时间"
                               width="180">
              </el-table-column>
              <el-table-column prop="articleTitle"
                               label="标题"
                               width="450px">
                <template slot-scope="scope">
                  <el-link type="primary"
                           @click="openOutUrl(scope.row, scope.$index, true)">{{scope.row.articleTitle}}</el-link>
                </template>
              </el-table-column>
              <el-table-column prop="createUserName"
                               label="原作者"
                               width="160px">
              </el-table-column>
              <el-table-column prop="address"
                               width="150px"
                               label="操作">
                <template slot-scope="scope">
                  <div class="disflex">
                    <div class="dis-align edit">
                      <i class="el-icon-connection"></i><span @click="aritelEdit(scope.row.id, scope.$index)">引用</span>
                    </div>
                    <div class="dis-align files">
                      <i class="el-icon-files"></i><span @click="placeArticle(scope.row, scope.$index, true)">归档</span>
                    </div>
                    <div class="popper-box">
                      <el-popover placement="top-start"
                                  width="400"
                                  v-model="scope.row.isShowArticle"
                                  trigger="click">
                        <div class="time-box">
                          <p><span class="time-text">保存期限:</span>
                            <el-select size="small"
                                       v-model="arcircleTime"
                                       placeholder="请选择">
                              <el-option label="一年"
                                         value="365"></el-option>
                              <el-option label="二年"
                                         value="730"></el-option>
                              <el-option label="三年"
                                         value="1095"></el-option>
                            </el-select>
                          </p>
                          <div class="btn-box">
                            <el-button type="primary"
                                       size="small"
                                       @click="confirmArticle(scope.row, scope.$index, false)">确认</el-button>
                            <el-button size="small"
                                       @click="placeArticle(scope.row, scope.$index, false)">取消</el-button>
                          </div>
                        </div>
                      </el-popover>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <!-- <div v-else
             class="text-center no-permission">
          <img :src="require('@/assets/images/error-page/noPermission.png')"
               alt="">
          <p>很抱歉，您没有访问此页面的权限</p>
        </div> -->
      </el-tabs>
    </div>
    <diaing :isDiaingShow="isDiaingShow"
            @emitClose="getEmitClose"
            :historyData="historyData"></diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
import vMenu from '@/views/repository/components/Menu'
import diaing from '@/views/repository/components/IssueDiaing'
import ScrollData from '@/components/ScrollData'
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'Issue',
  data () {
    return {
      dataNull: false,
      dataLess: false,
      arcircleTime: '',
      historyData: [],
      isDiaingShow: false, // 弹出框
      activeName: 'publicIssue',
      formInline: {
        searchParam: '',
        time: ''
      },
      tableData: [],
      page: {
        pageNum: 1,
        pageSize: 32
      }
    }
  },
  methods: {
    getEmitClose (item) {
      this.isDiaingShow = false
    },
    getData () {
      this.page.pageNum++
      this.getList()
    },
    aritelEdit (id) {
      this.$router.push({ name: 'Contribute', query: { id: id, isArchive: '2' } })
    },
    openOutUrl (item) {
      let local = this.$router.resolve({ name: 'ManuscriptDetail', params: { id: item.id } })
      window.open(local.href, '_blank')
    },
    confirmArticle (item, index, isShow) {
      if (!this.arcircleTime) {
        this.$message.error('请选择保存期限！')
        return false
      }
      let row = {
        id: item.id,
        shelfLife: this.arcircleTime
      }
      item.isShowArticle = isShow
      this.$http.post(this.$api.placeArticle, row)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功！')
            this.$set(this.tableData, index, item)
            this.tableData.forEach((val, index) => {
              if (val.id === item.id) {
                this.tableData.splice(index, 1)
              }
            })
          }
        })
        .catch(() => { })
    },
    // 归档
    placeArticle (item, index, isShow) {
      item.isShowArticle = isShow
      this.$set(this.tableData, index, item)
    },
    // 查看发布历史
    showHistory (item) {
      this.isDiaingShow = true
      this.$http.get(this.$api.listPublishHistory, { params: { articleId: item.id } })
        .then(res => {
          this.historyData = res.data.data
        })
        .catch(() => { })
    },
    // tab跳转
    handleClick (item) {
      this.$router.push({ name: item })
    },
    // 获取列表
    getList () {
      this.dataLess = false
      let row = {
        searchParam: this.formInline.searchParam,
        startDate: this.formInline.time[0] || '',
        endDate: this.formInline.time[1] || '',
        page: this.page
      }
      this.$http.post(this.$api.listPublishArticle, row)
        .then(res => {
          if (res.data.data.content.length) {
            this.tableData.push(...res.data.data.content)
            this.tableData.forEach(item => {
              item.isShowHistory = false
              item.isShowArticle = false
            })
            if (res.data.data.content.length < 20) {
              this.dataLess = true // 小于32
            }
          } else {
            this.tableData = []
          }
        })
        .catch(() => { })
    },
    submitForm () {
      if (!this.formInline.time && !this.formInline.searchParam) {
        this.$message.warning('请输入筛选条件！')
      } else {
        this.page.pageNum = 1
        this.tableData = []
        this.getList()
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
      this.page.pageNum = 1
      this.tableData = []
      this.getList()
    },
    // 表头
    getRowClass ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        return 'background:linear-gradient(0deg,rgba(243,242,242,1),rgba(255,255,255,1));'
      }
    },
    // tr各行换色
    tableRowClassName ({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 1) {
        return 'tr-F8'
      }
    }
  },
  created () {
    // this.getList()
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    }),
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    vMenu,
    diaing,
    ScrollData
  }
}
</script>

<style scoped>
.breadcrumb-box {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}
.assessment .el-menu-item.is-active::before {
  content: "";
  margin-left: -20px;
  float: left;
  width: 5px;
  height: 56px;
  background-color: #3875f0;
}
.assessment {
  margin: 0 auto;
  position: relative;
  min-height: calc(120vh - 60px);
  overflow: hidden;
}
.assessment .el-menu-item {
  background-color: #feffff;
  margin-bottom: 2px;
}
.assessment .el-menu-item:last-child {
  margin-top: 15px;
}
.assessment .el-menu-item i {
  margin-right: 13px;
}
.AssessHead {
  width: 1103px;
  min-height: 500px;
  float: right;
}
.AssessHead .el-tabs--border-card .is-top {
  border: none;
  background-color: #f5f5f5;
}
.AssessHead .is-top span i {
  display: inline-flex;
  vertical-align: middle;
  margin-right: 10px;
}
.AssessHead .is-top span img {
  width: 18px;
  height: 15px;
}
.AssessHead .el-tabs--border-card .el-tabs__header .is-active {
  background-color: #f5f5f5;
  border-bottom: 2px solid #3875f0;
}
.AssessHead .el-tabs--border-card .el-tabs__header .el-tabs__item {
  border-top: none;
  border-left: none;
  border-right: none;
}
.AssessHead .el-tabs__item {
  padding: 0 13px;
}
.plat-seach {
  width: 1072px;
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 10px;
}
.plat-seach .el-select i {
  line-height: 39px;
}
.plat-seach .el-input .el-input__inner {
  width: 105px;
  height: 29px;
  border-radius: 0;
  line-height: 29px;
}
.plat-seach .el-date-editor.el-input {
  width: 120px;
}
.plat-seach .el-range-editor.el-input__inner {
  width: 340px;
  border-radius: 0;
  line-height: 22px;
  padding-right: 0px;
}
.plat-seach .el-button {
  width: 70px;
  border-radius: 0;
}
.plat-seach .el-form .el-form-item {
  margin-right: 33px;
  margin-bottom: 0;
}
.plat-seach .el-form .el-form-item:last-child {
  margin-right: 10px;
}
.plat-table {
  margin-top: 18px;
}
.plat-seach .plat-table .el-table .cell {
  padding: 0 20px;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.plat-seach .el-date-editor .el-input__inner {
  padding-left: 25px;
  width: 120px;
}
.plat-seach .el-date-editor .el-input__suffix {
  right: 0px;
}
.plat-seach .el-date-editor .el-range__icon {
  line-height: 20px;
}
.plat-seach .el-date-editor .el-range-separator {
  line-height: 22px;
}
.plat-seach .el-date-editor .el-range__close-icon {
  line-height: 22px;
}
.dis-align {
  display: flex;
  align-items: center;
  margin-right: 15px;
}
.edit,
.files {
  cursor: pointer;
}
.edit {
  color: #70ade4;
}
.edit i,
.files i {
  margin-right: 5px;
}
.files {
  color: #c76bdd;
}
.time-box {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.time-text {
  margin-right: 10px;
  width: 60px;
  display: inline-block;
}
.btn-box {
  margin-top: 20px;
  padding-left: 70px;
}
.popper-box {
  position: absolute;
  width: 400px;
  left: -400px;
  top: -45px;
}
</style>
