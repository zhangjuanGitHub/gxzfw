<template>
  <div>
    <el-table :data="gridData" height="500" v-table-load='loadMore'>
      <el-table-column prop="rank"
                       label="排名"
                       >
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column prop="province"
                       label="单位"
                       >
        <template slot-scope="scope">
          <el-link @click="showTeamDialog(scope.row.id)" type="primary">{{scope.row.departmentName}}</el-link>
        </template>
      </el-table-column>
      <el-table-column label="本月稿件投稿情况(篇数)">
        <el-table-column prop="anum"
                         label="A稿篇数"
                         >
        </el-table-column>
        <el-table-column prop="bnum"
                         label="B稿篇数"
                         >
        </el-table-column>
        <el-table-column prop="zfNum"
                         label="自治区公众号转发篇数"
                         >
        </el-table-column>
      </el-table-column>
      <el-table-column prop="viUseNum"
                       label="视频稿件被采用篇数"
                       >
      </el-table-column>
      <el-table-column prop="totalScore"
                       label="最后得分"
                       >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'DialogTable',
  props: ['datas'],
  data () {
    return {
      loadSign: true,
      timer: null,
      gridData: [],
      getDatas: {}
    }
  },
  methods: {
    loadMore () {
      if (this.loadSign) {
        this.loadSign = false
        this.timer = setTimeout(() => {
          this.loadSign = true
        }, 1000)
        this.getDatas.pageNum++
        this.getList()
      }
    },
    getList () {
      this.$http.post(this.$api.showQxAocamList, this.getDatas)
        .then(res => {
          this.gridData.push(...res.data.data)
          if (res.data.data.length < 20) {
            this.loadSign = false
            this.timer && clearTimeout(this.timer)
          }
        })
        .catch(() => {})
    }
  },
  components: {
  },
  mounted () {
    this.getDatas = this.datas
    this.getList()
  },
  watch: {
    datas (newVal, oldVal) {
      if (newVal) this.getList()
    }
  }
}
</script>

<style scoped>

</style>
