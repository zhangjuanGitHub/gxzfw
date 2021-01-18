<template>
  <div class="content-box new-media">
    <div class="data-search">
      <div class="data-center-header data-center-box">
        <el-form ref="ruleForm"
                 :model="ruleForm"
                 inline="inline"
                 label-position="left">
          <el-form-item label="时间"
                        prop="date">
            <el-date-picker v-model="ruleForm.date"
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
          <el-form-item label="职能"
                        prop="function">
            <el-select v-model="ruleForm.function"
                      size="small"
                      placeholder="全部"
                      class="mode-wid">
              <el-option v-for="(item, index) of functionList"
                        :label="item"
                        :value="item"
                        :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="keyword"
                        label="内容关键字">
            <el-input v-model="ruleForm.keyword"
                      size="small"
                      placeholder="请输入内容关键字"></el-input>
          </el-form-item>
          <el-form-item prop="ncKeyword" label="标签类型">
            <el-select v-model="ruleForm.ncKeyword"
                      size="small"
                      class="mode-cas"
                      placeholder="请选择标签类型">
              <el-option v-for="(item, index) of tagList"
                        :label="item.labelName"
                        :value="item.id"
                        :key="index"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="small"
                       type="primary"
                       @click="searchList">筛选</el-button>
            <el-button size="small"
                       @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <ul class="content-ul">
      <li class="content-li"
          v-for="(item, index) of wxList"
          :key="index">
        <div class="cover-box cursor" v-if="item.articleUrl"
             @click="trageUrl(item.articleUrl)">
          <img :src="item.articlePic"
               alt="">
        </div>
        <div class="right-box">
          <div class="department-detail">
            <div class="department-img" v-if="item.numberPic"
                 :style="{ backgroundImage: 'url('+item.numberPic+')' }"></div>
            <!--            <el-link class="department-name" type="primary" href="http://www.baidu.com"></el-link>-->
            <p class="department-name"
               v-text="item.numberName"/>
            <p class="department-time"
               v-text="item.articlePubtime || '暂无'"/>
            <el-tag type="info">分享人：{{item.createName}}</el-tag>
            <p class="department-operation">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <span class="el-icon-edit" @click="editList(item,index)"></span>
              </el-tooltip>
              <!-- <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                 <span class="el-icon-delete" @click="deleteList(item,index)"></span>
              </el-tooltip> -->
            </p>
          </div>
          <div>
            <div class="dep-title-box">
              <p @click="trageUrl(item.articleUrl)" class="content-title lin-clamp-1 cursor" v-html="item.articleTitle || '暂无'"/>
            </div>
            <p @click="trageUrl(item.articleUrl)" class="main-body lin-clamp-3 cursor" v-html="item.originalContent"/>
          </div>
          <div class="content-detail">
            <el-tag class="detail-dialog" v-for="(item, index) of item.ncKeywordList" :key="index">{{item}}</el-tag>
          </div>
          <!-- <div class="content-detail">
            <p>阅读数：<span v-text="item.readnum || '0'"></span></p>
            <p class="hot">点赞数：<span v-text="item.likenum || '0'"></span></p>
          </div> -->
        </div>
      </li>
    </ul>
    <div class="text-center"
         v-if="dataNull">
      <img :src="require('@/assets/images/empty-data.png')"
           alt="">
      <p class="text-click" @click="$router.push({ name: 'NewMediaWx' })">暂无数据，请前往添加</p>
    </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
    <el-dialog
      title="选择标签"
      :append-to-body="false"
      :modal-append-to-body="false"
      :visible.sync="dialogVisible"
      width="30%">
      <div class="margin-b-10">
        <p class="margin-b-10">标签：</p><el-input v-model="getAddInput"></el-input>
      </div>
      <div>
        <el-tag @click="addToInput(item)" class="dialog-tag" v-for="(item, index) of tagList" :key="index">{{item}}</el-tag>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAddTag">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Wb',
  data () {
    return {
      functionList: [],
      getAddInput: '', // 标签
      tagList: [],
      dialogVisible: false, // 下载
      wxList: [],
      rule: {
        ids: []
      }, // 删除数组
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
      dataLess: false,
      dataNull: false,
      ruleForm: {
        date: [], // 时间
        keyword: '', // 搜索关键字
        function: '',
        level: '1', // 微博
        pageNum: 1, // 分页
        pageSize: 20,
        sortDirection: '',
        sortField: '',
        isSync: 1,
        ncKeyword: ''
      }
    }
  },
  methods: {
    // 获取标签
    getTagList () {
      this.$http.get(this.$api.findLabel)
        .then(res => {
          if (res.data.code === 200) {
            this.tagList = res.data.data
          }
        })
        .catch(() => {})
    },
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.ruleForm.pageNum = 1
      this.wxList = []
      this.getWxList()
    },
    // 筛选
    searchList () {
      if (!this.ruleForm.date) {
        this.ruleForm.date = []
      }
      this.ruleForm.pageNum = 1
      this.wxList = []
      this.getWxList()
    },
    // 删除
    deleteList (item, index) {
      this.rule.ids = []
      this.rule.ids.push(item.id)
      this.$http.post(this.$api.delNewscloud, this.rule)
        .then(res => {
          this.$message.success('操作成功！')
          this.wxList = []
          this.getWxList()
        })
        .catch(() => { })
    },
    // 编辑
    editList (item, index) {
      let toEdit = this.$router.resolve({ name: 'Contribute', query: { id: item.id, isArchive: '6', article: 'wx' } })
      window.open(toEdit.href)
    },
    confirmAddTag () {
      this.dialogVisible = false
    },
    // 关闭弹出框
    closeDialog () {
      this.getAddInput = ''
      this.dialogVisible = false
    },
    // 添加标签
    addToInput (item) {
      let getSplitArr = this.getAddInput.split('/')
      this.getAddInput += item + '/'
      if (getSplitArr.includes(item)) {
        for (let i = 0; i < getSplitArr.length; i++) {
          if (item === getSplitArr[i]) {
            getSplitArr.splice(i, 1)
          }
        }
        this.getAddInput = getSplitArr.join('/')
      }
    },
    // 显示弹出框
    downArticle (id) {
      this.dialogVisible = true
    },
    // 跳转外部链接
    trageUrl (url) {
      window.open(url, '_blank')
    },
    getData () {
      this.ruleForm.pageNum++
      this.getWxList()
    },
    getWxList () {
      this.dataNull = false
      this.dataLess = false
      this.$http.post(this.$api.findCityArticles, this.ruleForm)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            if (datas.length < 20) {
              this.dataLess = true
            }
            this.wxList.push(...datas)
            this.wxList.forEach(item => {
              item.articleTitle = item.articleTitle.replace(/&amp;lt;/g, '《').replace(/&amp;gt;/g, '》')
            })
          } else {
            this.dataNull = true
            this.wxList = []
          }
        })
        .catch(() => { })
    },
    // 获取职能
    getShowFunction () {
      this.$http.get(this.$api.showFunction)
        .then(res => {
          this.functionList = res.data.data
        })
        .catch(() => { })
    }
  },
  created () {
    this.getWxList()
    this.getTagList()
    this.getShowFunction()
  }
}
</script>
<style lang="scss" scoped>
@import "../resour";
</style>
<style scoped>
.new-media {
  background: #ffffff;
}
.new-media .data-search .el-input {
  width: 135px;
}
.data-center-header {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
  margin: 15px 0;
  margin: 0 0 15px 0;
  font-size: 14px;
  color: #333;
  line-height: 22px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
}
.new-media .el-form {
  width: 100%;
  padding: 0 8px;
  /* display: flex;
  justify-content: space-around; */
}
.new-media .el-form .el-form-item {
  margin-right: 15px;
  margin-bottom: 0;
  float: left;
}
.new-media .el-form .el-form-item:last-child {
  float: right;
}
  .new-media-title span {
    margin-left: 12px;
  }
  .content-detail p {
    color: #aaaaaa;
  }
  .content-detail span {
    color: #08a0f1;
  }
  .content-li:first-child.content-li {
    padding-top: 0;
  }
  .content-li {
    display: flex;
    padding: 22px 0;
    border-bottom: 1px solid rgba(204, 204, 204, 1);
  }
  .content-title {
    font-size: 16px;
    font-weight: bold;
    color: #000000;
  }
  .main-body {
    font-size: 14px;
    color: #333333;
    margin-bottom: 12px;
    font-weight: 400;
    line-height: 1.5;
  }
  .content-detail {
    width: 100%;
    /* height: 50px; */
    display: flex;
    /* justify-content: flex-end; */
    /* background-color: blanchedalmond; */
  }
  .content-detail .detail-dialog {
    margin: 3px;
  }
  .cover-box img {
    max-width: 100%;
    max-height: 100%;
    display: block;
    margin: auto;
  }
  .department-img {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-top: 0px;
    overflow: hidden;
    background-position: center;
    background-size: 145px;
    /* background-size: 100% 100%; */
  }
  .department-detail {
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    height: 35px;
  }
  .cover-img {
    width: 255px;
    height: 168px;
    display: table-cell;
    vertical-align: middle;
  }
  .department-name {
    margin: 0 20px;
    font-size: 15px;
  }
  .department-time {
    font-size: 15px;
    color: #afafaf;
  }
  .right-box {
    width: 100%;
    flex: 1;
  }
  .dep-title-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 18px;
  }
  .dialog-tag {
    margin: 3px;
  }
  .margin-b-10 {
    margin-bottom: 10px;
  }
  .department-operation{
    margin-left: auto;
    font-size: 20px;
  }
  .department-operation span{
    margin-right: 20px;
    cursor: pointer;

  }
</style>
