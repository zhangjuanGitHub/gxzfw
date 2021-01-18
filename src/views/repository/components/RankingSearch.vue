<template>
  <div class="summary-seach">
    <div class="dis_cen">
      <el-form :inline="true"
                ref="ruleForm"
                :model="ruleForm">
        <el-form-item label="时间"
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
        <el-form-item label="排序" prop="optionSort">
            <el-cascader v-model="ruleForm.optionSort"
                        :options="options"
                        size="small"
                        class="mode-cas">
            </el-cascader>
        </el-form-item>
        <el-form-item label="关键字"
                      prop="keyword">
          <el-input size="small"
                    v-model="ruleForm.keyword"
                    placeholder="请输入关键字"
                    class="mode-wid"></el-input>
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
  </div>
</template>

<script>
export default {
  name: 'Wx',
  data () {
    return {
      options: [],
      wxOptions: [
        {
          value: 'releaseTime',
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
          value: 'releaseTime',
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
          value: 'pinglunNum',
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
          value: 'releaseTime',
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
          value: 'pinglunNum',
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
      functionList: [],
      ruleForm: {
        source: '',
        keyword: '',
        function: '',
        time: [],
        pageNum: 1,
        pageSize: 20,
        sortDirection: 'desc', // 排序 asc
        sortField: 'hotnum',
        optionSort: ['hotnum', 'desc4']
      }
    }
  },
  methods: {
    // 重置
    resetForm (ruleForm) {
      this.$refs[ruleForm].resetFields()
      this.$emit('getSearchList', this.ruleForm)
    },
    // 筛选
    searchList () {
      if (!this.ruleForm.time) {
        this.ruleForm.time = []
      }
      this.ruleForm.sortField = this.ruleForm.optionSort[0]
      this.ruleForm.sortDirection = this.ruleForm.optionSort[1].substring(this.ruleForm.optionSort[1].length - 1, 0)
      this.$emit('getSearchList', this.ruleForm)
    },
    exportExcel () {
      this.$emit('exportExcel')
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
    this.getShowFunction()
  },
  mounted () {
    this.routeName = this.$route.path.split('/')[3]
    if (this.routeName === 'wx') {
      this.options = this.wxOptions
    } else if (this.routeName === 'wb') {
      this.options = this.wbOptions
    } else if (this.routeName === 'tout') {
      this.options = this.ttOptions
    }
    this.searchList()
  },
  components: {
  }
}
</script>
<style lang="scss">
@import "../repository";
</style>
<style scoped>
.summary-seach {
  height: 40px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 0 15px;
  margin-bottom: 20px;
}
.dis_cen {
  display: flex;
  align-items: center;
}
.keyword {
  width: 260px;
}
</style>
