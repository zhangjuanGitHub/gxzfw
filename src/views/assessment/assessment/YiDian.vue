<template>
  <div class="some">
    <v-search></v-search>
    <div class="some-table">
      <el-table :data="tableData"
                style="width: 100%"
                id="out-some">
        <el-table-column prop="rank"
                         label="排名"
                         width="65">
        </el-table-column>
        <!-- <el-table-column prop="function"
                         label="职能"
                         width="64">
        </el-table-column> -->
        <el-table-column prop="province"
                         label="地区"
                         width="100">
        </el-table-column>
        <el-table-column prop="name"
                         label="账号名称"
                         width="250">
        </el-table-column>
        <el-table-column label="活跃度">
          <el-table-column prop="article"
                           label="一点号发布原创文章数量"
                           width="280">
          </el-table-column>
        </el-table-column>
        <el-table-column label="传播力">
          <el-table-column prop="averageR"
                           label="文章的评论数"
                           width="280">
          </el-table-column>
        </el-table-column>
        <el-table-column prop="total"
                         label="总分"
                         width="90">
        </el-table-column>
      </el-table>
    </div>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
import vSearch from '../components/Search'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
export default {
  data () {
    return {
      tableData: [
        {
          rank: '1',
          function: '全部',
          province: '上海',
          basics: '2',
          name: '平安吉林',
          article: '2',
          release: '2',
          averageR: '2',
          bestR: '2',
          averageF: '2',
          bestF: '2',
          total: ''
        }, {
          rank: '2',
          function: '全部',
          province: '上海',
          basics: '2',
          name: '平安吉林',
          article: '2',
          release: '2',
          averageR: '2',
          bestR: '2',
          averageF: '2',
          bestF: '2',
          total: ''
        }, {
          rank: '3',
          function: '全部',
          province: '上海',
          basics: '2',
          name: '平安吉林',
          article: '2',
          release: '2',
          averageR: '2',
          bestR: '2',
          averageF: '2',
          bestF: '2',
          total: ''
        }]
    }
  },
  methods: {
    // 定义导出Excel表格事件
    exportExcel () {
      /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector('#out-some'))
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
        bookType: 'xlsx',
        bookSST: true,
        type: 'array'
      })
      try {
        FileSaver.saveAs(
          // Blob 对象表示一个不可变、原始数据的类文件对象。
          // Blob 表示的不一定是JavaScript原生格式的数据。
          // File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          // 返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: 'application/octet-stream' }),
          // 设置导出文件名称
          'sheetjs.xlsx'
        )
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    }
  },
  components: {
    vSearch
  }
}
</script>
<style scoped>
.some {
  padding: 20px;
}
.some-table {
  margin-top: 18px;
}
.some .some-table .el-table .cell {
  padding: 0;
  text-align: center;
  font-size: 13px;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 19px;
}
.some-foot {
  margin-top: 14px;
  float: right;
}
#pagin button {
  background-color: transparent;
}
</style>
