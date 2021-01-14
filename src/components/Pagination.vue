<!--
 * @Author: MaiChao
 * @Date: 2020-03-30 14:08:08
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-19 11:29:55
-->
<template>
  <div class="pagination-wrap">
    <span class="demonstration" v-if="$route.name === 'UserList'">每页20条</span>
    <el-pagination @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   background
                   :pager-count="5"
                   layout="total, prev, pager, next, jumper"
                   :page-size="query.size"
                   :current-page.sync="query.page"
                   :total="total">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['total'],
  data () {
    return {
      query: {
        size: 20,
        page: 1
      }
    }
  },
  methods: {
    // 改变页数
    handleCurrentChange (change) {
      this.query.page = change
      this.$emit('pagingChange', this.query)
    },
    // 改变条数
    handleSizeChange (change) {
      if (!change > this.total) {
        this.query.size = change
        this.$emit('pagingChange', this.query)
      } else {
        this.query.size = 20
        return this.$message.error('当前页数小于总条数！')
      }
    }
  },
  created () {
    this.query.page = parseFloat(this.$route.query.page) || 1
  },
  components: {},
  watch: {
    '$route' () {
      this.query.page = parseFloat(this.$route.query.page)
    }
  }
}
</script>

<style scoped>
.pagination-wrap {
  display: flex;
  justify-content: flex-end;
  margin: 15px 0;
}
.demonstration {
  display: inline-block;
  font-size: 13px;
  min-width: 35.5px;
  height: 28px;
  line-height: 30px;
  vertical-align: top;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  margin-right: 10px;
  font-weight: 400;
  color: #606266;
}
</style>
