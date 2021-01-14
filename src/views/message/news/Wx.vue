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
                            size="small"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="keyword"
                        label="内容关键字">
            <el-input v-model="ruleForm.keyword"
                      size="small"
                      placeholder="请输入内容关键字"></el-input>
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
            <p class="department-name"
               v-text="item.numberName"/>
            <p class="department-time"
               v-text="item.articlePubtime || '暂无'"/>
            <p class="department-operation">
              <el-tooltip class="item" effect="dark" content="编辑" placement="bottom">
                <span class="el-icon-edit" @click="editList(item,index)"></span>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="bottom">
                 <span class="el-icon-delete" @click="deleteList(item,index)"></span>
              </el-tooltip>
            </p>
          </div>
          <div>
            <div class="dep-title-box">
              <p @click="trageUrl(item.articleUrl)" class="content-title lin-clamp-1 cursor" v-html="item.articleTitle || '暂无'"/>
            </div>
            <p @click="trageUrl(item.articleUrl)" class="main-body lin-clamp-3 cursor" v-html="item.originalContent || '暂无'"/>
          </div>
        </div>
      </li>
    </ul>
    <div class="text-center"
         v-if="dataNull">
      <img :src="require('@/assets/images/empty-data.png')"
           alt="">
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
      getAddInput: '', // 标签
      tagList: ['公益诉讼', '刑事', '民事', '行政', '职务犯罪', '队伍建设', '检察文化', '党建', '未成年人', '征文', '控申', '其他'],
      dialogVisible: false, // 下载
      wxList: [],
      rule: {
        ids: []
      }, // 删除数组
      dataLess: false,
      dataNull: false,
      ruleForm: {
        date: '', // 时间
        keyword: '', // 搜索关键字
        level: '1', // 微信
        pageNum: 1, // 分页
        pageSize: 32,
        sortDirection: '',
        sortField: ''
      }
    }
  },
  methods: {
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.ruleForm.pageNum = 1
      this.wxList = []
      this.getWxList()
    },
    // 筛选
    searchList () {
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
      this.$router.push({ name: 'Contribute', query: { id: item.id, isArchive: '1' } })
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
      this.$http.post(this.$api.findCityArticles, this.ruleForm)
        .then(res => {
          if (res.data.data.length) {
            let datas = res.data.data
            if (datas.length < 20) {
              this.dataLess = true
            }
            this.wxList.push(...datas)
          } else {
            this.dataNull = true
            this.wxList = []
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getWxList()
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
  width: 150px;
}
.new-media .data-search .el-select .el-input {
  width: 150px;
}
.new-media .data-search .el-date-editor {
  width: 215px;
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
  margin-right: 20px;
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
    margin-bottom: 28px;
    font-weight: 400;
    line-height: 1.5;
  }
  .content-detail {
    display: flex;
    justify-content: flex-end;
  }
  .content-detail .hot {
    margin-left: 15px;
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
