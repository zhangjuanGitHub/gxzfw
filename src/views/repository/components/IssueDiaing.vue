<template>
  <el-dialog title="发布历史"
             @close="emitClose"
             :visible="isDiaingShow"
             :modal-append-to-body='false'
  >
    <el-table :data="historyData">
      <el-table-column width="150" label="发布类型">
        <template slot-scope="scope">
          <p v-if="scope.row.accountType === 'wb'">微信</p>
          <p v-if="scope.row.accountType === 'wx'">微博</p>
        </template>
      </el-table-column>
      <el-table-column width="150"
                       property="accountName"
                       label="账号名称"></el-table-column>
      <el-table-column width="100"
                       label="是否成功">
        <template slot-scope="scope">
          <p v-if="scope.row.publishSuccess === 1">成功</p>
          <p v-if="scope.row.publishSuccess === 0">失败</p>
        </template>
      </el-table-column>
      <el-table-column width="300"
                       label="查看">
        <template slot-scope="scope">
          <el-link @click="openUrl(scope.row.publishUrl)" type="primary">{{scope.row.publishUrl}}</el-link>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  name: 'IssueDiaing',
  props: ['historyData', 'isDiaingShow'],
  data () {
    return {
    }
  },
  created () {
  },
  components: {},
  methods: {
    // 查看发布历史跳转
    openUrl (url) {
      window.open(url, '_blank')
    },
    emitClose () {
      this.$emit('emitClose')
    }
  }
}
</script>

<style scoped>

</style>
