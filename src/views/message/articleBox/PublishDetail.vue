<template>
  <div class="container">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'MessageArticleBox',query:{changeSide:this.changeSide} }">中央信息厨房</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'PublishDetail' }">发布情况</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div>
      <!-- <div class="search-box">
        <el-form size="small"
                 :model="fromData"
                 :inline="true"
                 label-position="left"
                 ref="froms">
          <el-form-item class="region-style"
                        label="发布渠道"
                        prop="accountType">
            <el-select v-model="fromData.accountType"
                       placeholder="全部">
              <el-option label="微信"
                         value='wx'></el-option>
              <el-option label="微博"
                         value="wb"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="status-style"
                        label="发布状态"
                        prop="publishSuccess">
            <el-select v-model="fromData.publishSuccess"
                       placeholder="全部">
              <el-option label="发布失败"
                         value="0"></el-option>
              <el-option label="发布成功"
                         value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="keywords-style"
                        label="发布账号"
                        prop="accountName">
            <el-input placeholder="请输入账号"
                      v-model="fromData.accountName"></el-input>
          </el-form-item>
          <div class="public-btn btn-box-style image-search-box">
            <el-button size="small"
                       class="new"
                       type="primary"
                       @click="screen">筛选</el-button>
            <el-button size="small"
                       class="delete"
                       @click="resetForm('froms')">重置</el-button>
          </div>
        </el-form>
      </div> -->
      <el-table border
                :data="tableData"
                style="width: 100%"
                class="message-list">
        <el-table-column prop="accountType"
                         label="发布渠道"
                         width="130">
          <template slot-scope='scope'>
              <span v-if="scope.row.publishChannel==='platform'">
                平台
              </span>
              <span v-if="scope.row.publishChannel==='weixin'">
                微信
              </span>
              <span v-if="scope.row.publishChannel==='weibo'">
                微博文章
              </span>
              <span v-if="scope.row.publishChannel==='weiboText'">
                微博
              </span>
              <span v-if="scope.row.publishChannel==='WEIXIN_MATERIAL'">
                微信素材
              </span>
              <span v-if="scope.row.publishChannel==='WEIXIN_XIUMI'">
                秀米
              </span>
              <span v-if="scope.row.publishChannel==='toutiao'">
                头条图文
              </span>
            </template>
        </el-table-column>
        <el-table-column prop="publishTime"
                         label="发布时间">
        </el-table-column>
        <!-- <el-table-column prop="articleTitle"
                         label="标题"
                         width="280">
          <template slot-scope='scope'>
            <router-link :to="{name: 'ManuscriptDetail', params: {id: scope.row.id}}"><u class="lin-clamp-1 title-u"
                 v-text="scope.row.articleTitle"></u></router-link>
          </template>
        </el-table-column> -->
        <el-table-column prop="publishUserName"
                         label="发布用户">
        </el-table-column>
        <!-- <el-table-column prop="createUserName"
                         label="投稿用户"
                         width="122">
        </el-table-column> -->
        <el-table-column prop="accountName"
                         label="发布账号">
        </el-table-column>
        <el-table-column prop="publishSuccess"
                         label="发布状态">
          <template slot-scope="scope">
            <p v-if="scope.row.publishSuccess ===true"
               class="checkStatus activeClass">发布成功</p>
            <el-tooltip v-else
                        class="item"
                        effect="dark"
                        :content="scope.row.errorMessage"
                        placement="top-start">
              <p class="checkStatus errorClass">发布失败</p>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="publishUrl"
                         label="文章链接">
          <template slot-scope="scope">
            <el-link :href='scope.row.publishUrl'
                     target="_blank"
                     type="primary">
              查看原文
            </el-link>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address"
                         label="操作"
                         v-if="this.$route.query.type!==1">
          <template slot-scope="scope">
            <div class="disflex">
              <div class="edit-click">
                <i class="el-icon-refresh"></i><span @click="aritelEdit(scope.row, scope.$index)">重新发布</span>
              </div>
              <div class="delete-click">
                <i class="el-icon-delete"></i><span @click="deleteRow(scope.row, scope.$index)">删除</span>
              </div>
            </div>
          </template>
        </el-table-column> -->
      </el-table>
    </div>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>

<script>
import vDiaing from '@/views/system/components/Diaing'
export default {
  name: 'AuditList',
  data () {
    return {
      fromData: {
        accountType: '',
        publishSuccess: '',
        accountName: '',
        id: '',
        pageNum: 1,
        pageSize: 10
      },
      loading: true,
      dataLess: false,
      dialogVisible: false,
      deleteItem: {},
      rules: {},
      tableData: []
    }
  },
  methods: {
    // 跳转原文链接
    routerWeb (row, index) {
      let local = this.$router.resolve({ name: 'ManuscriptDetail', params: { id: row.id } })
      window.open(local.href, '_blank')
    },
    // 删除当前行数据
    deleteRow (row, index) {
      this.dialogVisible = true
      this.deleteItem.index = index
      this.deleteItem.id = row.id
    },
    // 确认删除
    getConfirmDelete (item) {
      if (!Array.isArray(item)) {
        this.$http.get(this.$api.deletePublish, { params: { publishId: item.id } })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('删除成功！')
              this.tableData.splice(item.index, 1)
            } else {
              this.$message.error(res.data.message)
            }
          })
          .catch(() => {
          })
      }
    },
    getCloseModal () {
      this.dialogVisible = false
    },
    // 重新发布
    aritelEdit (row, index) {
      this.loading = true
      this.$http.get(this.$api.republish, { params: { publishId: row.id } })
        .then(res => {
          if (res.data.code === 200 && res.data) {
            this.getExamine()
            this.$message.success('发布成功')
            this.loading = false
          }
        })
        .catch(() => {
          this.$message.warning('发布失败')
        })
    },
    // 筛选
    screen () {
      this.tableData = []
      this.fromData.pageNum = 1
      this.getExamine()
    },
    // 获取发布情况
    getExamine () {
      this.fromData.id = parseInt(this.$route.query.id)
      this.$http.post(this.$api.isPublish, this.fromData)
        .then(res => {
          if (res.data.code === 200 && res.data.data.content) {
            this.tableData.push(...res.data.data.content)
            this.loading = false
            if (this.tableData.content < 10) {
              this.dataLess = true
            }
          }
        })
        .catch(() => {
          this.tableData = []
          this.dataLess = true
        })
    },
    // 下拉加载
    getData () {
      this.fromData.pageNum++
      this.loading = true
      this.getExamine()
    },
    // 重置
    resetForm (vas) {
      this.$refs[vas].resetFields()
      this.tableData = []
      this.fromData.pageNum = 1
      this.getExamine()
    }
  },
  created () {
    this.changeSide = this.$route.query.changeSide
    this.getExamine()
  },
  components: {
    vDiaing
  },
  computed: {
  }
}
</script>

<style scoped>
.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f10909;
  cursor: pointer;
}
.search-box {
  padding: 9px 15px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form-item {
  margin-bottom: 0;
  display: flex;
}
.defaultclass {
  color: #309ade;
}
.title-u {
  color: #60b4f4;
  cursor: pointer;
}
.search-box {
  padding: 9px 15px;
  background: #ffffff;
  margin-bottom: 20px;
}
.search-box .el-form {
  display: flex;
  justify-content: space-between;
}
.search-box .el-form-item--small.el-form-item {
  margin-bottom: 0;
}
.search-box .el-form .el-form-item {
  margin-right: 5px;
}
.search-box .public-btn {
  margin-top: 2px;
}
.hidden {
  visibility: hidden;
}
.message-list {
  background-color: #f5f5f5;
  border: none;
}
</style>
