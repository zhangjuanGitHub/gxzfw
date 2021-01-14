<template>
  <div class="pagination-wrap">
    <el-pagination @current-change="handleCurrentChange"
                   @size-change="handleSizeChange"
                   background
                   :pager-count="5"
                   layout="total, sizes, prev, pager, next"
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
        size: 10,
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
        this.query.size = 10
        return this.$message.warning('当前页数小于总条数！')
      }
    }
  },
  created () {
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
  text-align: right;
  margin: 15px 0;
}
</style>
