<template>
  <div class="article">
    <div class="article-search">
      <el-form ref="form"
               class="search-box"
               :model="form">
        <el-form-item label="时间:"
                      prop="publishTime">
          <el-date-picker v-model="form.publishTime"
                          type="daterange"
                          size="small"
                          value-format="yyyy-MM-dd"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="排序"
                      prop="optionSort">
          <el-cascader v-model="form.optionSort"
                       :options="Options"
                       size="small"></el-cascader>
        </el-form-item>
        <el-form-item label="标题名称:"
                      prop="keyword" class="title-search">
          <el-input v-model="form.keyword"
                    size="small"
                    placeholder="请输入标题名称"></el-input>
        </el-form-item>

        <el-form-item class="retrieval-button">
            <el-button type="primary"
                       size="small"
                       @click="retrieval">筛选</el-button>
            <el-button size="small"
                       @click="rest('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="article-cont"
         v-for="(item,index) in articleList"
         :key="index">
      <h2 class="article-title cursor"
          v-html="item.title"
          @click="openWeb(item)"></h2>
      <p class="article-abs"
         v-html="item.content"
         v-if="item.content"
         @click="openWeb(item)"></p>

      <div class="article-ope">
        <span>发布时间:<i class="blue">{{item.publish_date}}</i></span>
        <span>被转载量:<i class="blue">{{item.simcnt}}</i></span>
        <el-button type="primary"
                   @click="Analysis(item,index)">传播分析</el-button>
      </div>
    </div>
    <div v-if="dataNull"
           class="text-center">
        <img :src="require('@/assets/images/empty-data.png')">
      </div>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import ScrollData from '@/components/ScrollData'
const getSort = new Map()
  .set('timeUp', 'asc')
  .set('timeDo', 'desc')
  .set('zhuanfaUp', 'asc')
  .set('zhuanfaDo', 'desc')
export default {
  data () {
    return {
      dataLess: false,
      dataNull: false,
      form: {
        keyword: '',
        publishTime: [],
        districts: [],
        optionSort: ['publish_time', 'timeDo'],
        pageNum: 1,
        pageSize: 20,
        sortDirection: 'desc', // 正序倒序 asc desc
        sortField: 'publish_time' // 排序的字段，pubtime simcnt
      },
      articleList: [],
      Options: [
        {
          value: 'publish_time',
          label: '时间',
          children: [{
            value: 'timeUp',
            label: '正序'
          }, {
            value: 'timeDo',
            label: '倒序'
          }]
        },
        {
          value: 'simcnt',
          label: '转发数',
          children: [{
            value: 'zhuanfaUp',
            label: '正序'
          }, {
            value: 'zhuanfaDo',
            label: '倒序'
          }]
        }
      ]
    }
  },
  methods: {
    formatDate (now) {
      var year = now.getFullYear() + '-'
      var month = (now.getMonth() + 1 < 10 ? '0' + (now.getMonth() + 1) : now.getMonth() + 1) + '-'
      var d = (now.getDate() < 10 ? '0' + now.getDate() : now.getDate())
      return year + month + d
    },
    Analysis (item, index) {
      this.$router.push({ name: 'Analysis', query: { id: item.id } })
    },
    // 获取文章列表
    getPapersList () {
      this.$http.post(this.$api.papersList, this.form)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.articleList.push(...res.data.data.list)
            if (res.data.data.list.length < 20) {
              this.dataLess = true
            }
            this.articleList.forEach(item => {
              if (item.simcnt <= 0) {
                item.simcnt = 0
              }
            })
            this.articleList.length > 0 ? this.dataNull = false : this.dataNull = true
          }
        })
        .catch(() => {
          this.articleList = []
          this.dataLess = true
        })
    },
    // 下拉加载
    getData () {
      this.form.pageNum++
      this.getPapersList()
    },
    openWeb (item) {
      window.open(item.url, '_blank')
    },
    // 筛选
    retrieval () {
      this.form.sortDirection = getSort.get(this.form.optionSort[1])
      this.form.sortField = this.form.optionSort[0]
      if (!this.form.publishTime) {
        this.form.publishTime = []
      }
      this.articleList = []
      this.dataLess = false
      this.form.pageNum = 1
      this.getPapersList()
    },
    // 重置
    rest (formName) {
      this.articleList = []
      this.$refs[formName].resetFields()
      this.form.pageNum = 1
      this.getPapersList()
    }
  },
  created () {
    const end = new Date()
    const start = new Date()
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
    this.form.publishTime[0] = this.formatDate(start)
    this.form.publishTime[1] = this.formatDate(end)
    this.getPapersList()
  },
  computed: {
    ...mapState({
      loading: state => state.mutations.loading
    })
  },
  components: {
    ScrollData
  }
}
</script>
<style scoped>
.article {
  padding: 15px;
  min-height: 700px;
  background-color: #fff;
}
.article-search {
  height: 40px;
  background-color: #eff1f4;
  border-radius: 10px;
  padding: 5px 10px;
}
.article-search .el-cascader {
  width: 150px;
}
.article-search .title-search .el-input {
  width: 150px;
}
.article .el-form-item .el-date-editor {
  width: 290px;
}
.article-search .el-form {
  display: flex;
}
.article-search .el-form .el-form-item {
  display: flex;
  margin-bottom: 0px;
  margin-right: 10px;
}
.article-sort ul {
  width: 120px;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-around;
}
.article-sort ul li {
  display: flex;
  justify-content: space-around;
}
.article-sort ul li img {
  margin-right: 7px;
  vertical-align: middle;
  cursor: pointer;
}
.article-cont {
  padding: 15px 19px 23px 14px;
  border-bottom: 1px solid #cccccc;
}
.article-cont .article-title {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  line-height: 48px;
}
.article-cont .article-abs {
  height: 44px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
  cursor: pointer;
}
.article-cont .article-ope {
  height: 25px;
  line-height: 25px;
  margin-top: 25px;
}
.article-cont .article-ope span {
  font-size: 14px;
  font-weight: bold;
  color: rgba(51, 51, 51, 1);
  margin-right: 80px;
}
.article-ope span i {
  color: #2999ee;
  font-style: normal;
  margin-left: 5px;
}
.article-ope .el-button {
  width: 80px;
  height: 25px;
  background: rgba(40, 153, 237, 1);
  border-radius: 10px;
  vertical-align: middle;
  padding: 0px;
  float: right;
}
.retrieval-button{
  margin-left: auto;
}
.retrieval-button .el-button {
  border-radius: 2px;
}
</style>
