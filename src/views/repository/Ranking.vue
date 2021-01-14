<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Inspect' }">媒体资源库</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Inspect' }">热点新闻</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'Ranking' }">热点排行</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <el-row :gutter="10">
      <el-col
        :xs="3"
        :sm="3"
        :md="3"
        :lg="4"
        :xl="4">
        <v-menu></v-menu>
      </el-col>
      <el-col
        :xs="21"
        :sm="21"
        :md="21"
        :lg="20"
        :xl="20">
        <div class="ranking-box">
          <div class="summary-seach">
            <el-form :inline="true"
                     ref="ruleForm"
                     :model="ruleForm">
              <el-form-item label="渠道"
              class="form-source"
                            prop="company">
                <el-select v-model="ruleForm.source"
                           size="small"
                           @change="getSource"
                           placeholder="请选择渠道">
                  <el-option :label="item.label"
                             :value="item.id"
                             v-for="(item, index) of listType"
                             :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="排序" class="form-sort" prop="optionSort">
                  <el-cascader v-model="ruleForm.optionSort"
                         :options="options"
                         size="small">
                  </el-cascader>
              </el-form-item>
              <!-- <el-form-item label="发布日期"
                            class="form-time"
                            prop="time">
                <el-date-picker v-model="ruleForm.time"
                                size="small"
                                type="daterange"
                                format="yyyy-MM-dd"
                                value-format="yyyy-MM-dd"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期">
                </el-date-picker>
              </el-form-item> -->
              <el-form-item label="关键字"
                            class="form-keyword"
                            prop="keyword">
                <el-input size="small"
                          v-model="ruleForm.keyword"
                          placeholder="请输入关键字"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button size="small"
                           @click="searchList"
                           type="primary">筛选</el-button>
                <el-button size="small"
                           @click="resetForm('ruleForm')">重置</el-button>
                <el-button size="small"
                           type="info"
                           @click="exportExcel">导出</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="summary-table">
<!--            微信-->
            <el-table :data="tableData"
                      style="width: 100%"
                      border
                      v-if="ruleForm.source === 1"
                      class="out-summary">
              <el-table-column prop="uploadDate"
                               label="排名"
                               width="50">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column label="标题"
                               prop="title"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <!-- <p v-html="scope.row.title" @click="targetUrl(scope.row.url)"></p> -->
                  <el-link type="primary" v-html="scope.row.title" :href="scope.row.url" target="_blank"></el-link>
                </template>
              </el-table-column>
              <el-table-column prop="screenName"
                               label="来源"
                               width="90">
              </el-table-column>
              <el-table-column prop="releasetime"
                               label="上传日期"
                               width="140">
              </el-table-column>
              <el-table-column prop="readnum"
                               label="阅读数"
                               width="80">
              </el-table-column>
              <el-table-column prop="dianzannum"
                               label="点赞数"
                               width="80">
              </el-table-column>
              <el-table-column prop="attentionnum"
                               label="关注度"
                               width="80">
              </el-table-column>
              <el-table-column prop="hotnum"
                               label="传播指数"
                               width="90">
              </el-table-column>
            </el-table>
<!--            微博-->
            <el-table :data="tableData"
                      style="width: 100%"
                      border
                      v-if="ruleForm.source === 2"
                      class="out-summary">
              <el-table-column prop="uploadDate"
                               label="排名"
                               width="50">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column label="标题"
                               prop="title"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-link type="primary" v-html="scope.row.title" :href="scope.row.url" target="_blank"></el-link>
                </template>
              </el-table-column>
              <el-table-column prop="screenName"
                               label="来源"
                               width="90">
              </el-table-column>
              <el-table-column prop="releasetime"
                               label="发布日期"
                               width="140">
              </el-table-column>
              <el-table-column prop="pinglunnum"
                               label="评论数"
                               width="80">
              </el-table-column>
              <el-table-column prop="zhuanfanum"
                               label="点赞数"
                               width="80">
              </el-table-column>
              <el-table-column prop="dianzannum"
                               label="转发数"
                               width="80">
              </el-table-column>
              <el-table-column prop="attentionnum"
                               label="关注度"
                               width="80">
              </el-table-column>
              <el-table-column prop="hotnum"
                               label="传播指数"
                               width="90">
              </el-table-column>
            </el-table>
<!--            今日头条-->
            <el-table :data="tableData"
                      style="width: 100%"
                      border
                      v-if="ruleForm.source === 4"
                      class="out-summary">
              <el-table-column prop="uploadDate"
                               label="排名"
                               width="50">
                <template slot-scope="scope">
                  {{scope.$index + 1}}
                </template>
              </el-table-column>
              <el-table-column label="标题"
                               prop="title"
                               show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-link type="primary" v-html="scope.row.title" :href="scope.row.url" target="_blank"></el-link>
                </template>
              </el-table-column>
              <el-table-column prop="screenName"
                               label="来源"
                               width="90">
              </el-table-column>
              <el-table-column prop="releasetime"
                               label="发布日期"
                               width="140">
              </el-table-column>
              <el-table-column prop="readnum"
                               label="阅读数"
                               width="80">
              </el-table-column>
              <el-table-column prop="pinglunnum"
                               label="评论数"
                               width="80">
              </el-table-column>
              <el-table-column prop="attentionnum"
                               label="关注度"
                               width="80">
              </el-table-column>
              <el-table-column prop="hotnum"
                               label="传播指数"
                               width="90">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-col>
    </el-row>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"/>
  </div>
</template>
<script>
import vMenu from '@/views/repository/components/Menu'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import { exportTable } from '@/libs/tools'
export default {
  data () {
    return {
      dataLess: false,
      options: [],
      wxOptions: [
        {
          value: 'releasetime',
          label: '时间',
          children: [{
            value: 'asc1',
            label: '正序'
          }, {
            value: 'desc1',
            label: '倒序'
          }]
        },
        {
          value: 'readnum',
          label: '阅读数',
          children: [{
            value: 'asc2',
            label: '正序'
          }, {
            value: 'desc2',
            label: '倒序'
          }]
        },
        {
          value: 'dianzannum',
          label: '点赞数',
          children: [{
            value: 'asc3',
            label: '正序'
          }, {
            value: 'desc3',
            label: '倒序'
          }]
        },
        {
          value: 'hotnum',
          label: '传播指数',
          children: [{
            value: 'asc4',
            label: '正序'
          }, {
            value: 'desc4',
            label: '倒序'
          }]
        }
      ],
      wbOptions: [
        {
          value: 'releasetime',
          label: '时间',
          children: [{
            value: 'asc1',
            label: '正序'
          }, {
            value: 'desc1',
            label: '倒序'
          }]
        },
        {
          value: 'pinglunnum',
          label: '评论数',
          children: [{
            value: 'asc2',
            label: '正序'
          }, {
            value: 'desc2',
            label: '倒序'
          }]
        },
        {
          value: 'zhuanfanum',
          label: '转发数',
          children: [{
            value: 'asc3',
            label: '正序'
          }, {
            value: 'desc3',
            label: '倒序'
          }]
        },
        {
          value: 'hotnum',
          label: '传播指数',
          children: [{
            value: 'asc4',
            label: '正序'
          }, {
            value: 'desc4',
            label: '倒序'
          }]
        },
        {
          value: 'dianzannum',
          label: '点赞数',
          children: [{
            value: 'asc5',
            label: '正序'
          }, {
            value: 'desc5',
            label: '倒序'
          }]
        }
      ],
      ttOptions: [
        {
          value: 'releasetime',
          label: '时间',
          children: [{
            value: 'asc1',
            label: '正序'
          }, {
            value: 'desc1',
            label: '倒序'
          }]
        },
        {
          value: 'pinglunnum',
          label: '评论数',
          children: [{
            value: 'asc2',
            label: '正序'
          }, {
            value: 'desc2',
            label: '倒序'
          }]
        },
        {
          value: 'readnum',
          label: '阅读数',
          children: [{
            value: 'asc3',
            label: '正序'
          }, {
            value: 'desc3',
            label: '倒序'
          }]
        },
        {
          value: 'hotnum',
          label: '传播指数',
          children: [{
            value: 'asc4',
            label: '正序'
          }, {
            value: 'desc4',
            label: '倒序'
          }]
        }
      ],
      tableData: [],
      listType: [
        {
          id: 1,
          label: '微信'
        },
        {
          id: 2,
          label: '微博'
        },
        {
          id: 4,
          label: '今日头条'
        }
      ],
      ruleForm: {
        source: 1,
        keyword: '',
        startDate: '',
        time: [],
        endDate: '',
        pageNum: 1,
        pageSize: 32,
        sortDirection: 'desc', // 排序 asc
        sortField: 'releasetime',
        optionSort: ['hotnum', 'desc4']
      }
    }
  },
  methods: {
    // 跳转
    targetUrl (url) {
      window.open(url, '_blank')
    },
    // 切换来源
    getSource (value) {
      if (value === 1) {
        this.options = this.wxOptions
      } else if (value === 2) {
        this.options = this.wbOptions
      } else if (value === 4) {
        this.options = this.ttOptions
      }
      this.ruleForm.source = value
      this.ruleForm.optionSort = ['hotnum', 'desc4']
      this.ruleForm.keyword = ''
      this.searchList()
    },
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.searchList()
    },
    // 获取列表
    getList () {
      this.ruleForm.sortField = this.ruleForm.optionSort[0]
      this.ruleForm.sortDirection = this.ruleForm.optionSort[1].substring(this.ruleForm.optionSort[1].length - 1, 0)
      this.ruleForm.startDate = this.ruleForm.time[0]
      this.ruleForm.endDate = this.ruleForm.time[1]
      this.$http.post(this.$api.findHotRanking, this.ruleForm)
        .then(res => {
          let datas = res.data.data
          if (datas.length <= 20) {
            this.dataLess = true
          }
          this.tableData.push(...datas)
        })
    },
    // 分页
    getData () {
      this.ruleForm.pageNum++
      this.getList()
    },
    // 筛选
    searchList () {
      this.ruleForm.pageNum = 1
      this.dataLess = false
      this.tableData = []
      this.getList()
    },
    exportExcel () {
      let getFilter = this.listType.filter(value => value.id === this.ruleForm.source)
      var wb = XLSX.utils.table_to_book(document.querySelector('.out-summary'))
      exportTable(XLSX, FileSaver, wb, `${getFilter[0].label}榜单`)
    }
  },
  created () {
    this.options = this.wxOptions
    this.getList()
  },
  components: {
    vMenu
  }
}
</script>
<style lang="scss">
  @import "repository";
</style>
<style scoped>
  .ranking-box {
    background: #fff;
    padding: 12px 15px 30px;
  }
  .summary-seach {
    background: rgba(239, 241, 244, 1);
    border-radius: 10px;
    box-sizing: border-box;
    padding: 0 15px;
  }
  .summary-table {
    margin-top: 16px;
  }
</style>
