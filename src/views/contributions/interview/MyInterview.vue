<template>
  <div class="myVisit container">
    <div class="nav-head">
      <div class="breadcrumb-box">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'Contributions' }">策划征稿</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'InterviewList' }">约访列表</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ name: 'MyInterview' }">我的约访</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="visit">
      <el-table :data="myList"
                style="width: 100%"
                border>
        <el-table-column prop="interviewTheme"
                         label="约访主题"
                         width="515px">
          <template slot-scope="scope">
            <el-link type="primary"
                     @click="interviewDetails(scope.row.id)">{{scope.row.interviewTheme}}</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="applyTime"
                         label="申请时间"
                         width="180">
        </el-table-column>
        <el-table-column prop="targetDepartmentName"
                         label="约访对象"
                         width="210">
        </el-table-column>
        <el-table-column label="状态"
                         width="220px">
          <template slot-scope="scope">
            <p v-if='scope.row.replyStatus === 1'
               class='activeClass'>已同意</p>
            <p v-else-if='scope.row.replyStatus === 2'
               class='errorClass'>已拒绝</p>
            <p v-else>未回复</p>
          </template>
        </el-table-column>
        <el-table-column label="操作"
                         width="140">
          <template slot-scope="scope">
            <div class="message-home-list unevaluate"
                 v-if='(scope.row.replyStatus === 1 || scope.row.replyStatus === 2) && scope.row.interviewStatus === 0'>
              <p @click="primar(scope.row, scope.$index)"><i><img :src="require('@/assets/images/contributions/evaluate.png')"></i>评价</p>
            </div>
            <div class="message-home-list evaluate"
                 v-else-if='(scope.row.replyStatus === 1 || scope.row.replyStatus === 2) && scope.row.interviewStatus === 1'>
              <p><i><img :src="require('@/assets/images/contributions/evaluate-active.png')"></i>已评价</p>
            </div>
            <div v-else>
              <div class="disflex">
                <div class="edit-click">
                  <i class="el-icon-edit-outline"></i><span @click="editInterview(scope.row.id, scope.$index)">修改</span>
                </div>
                <div class="delete-click">
                  <i class="el-icon-delete"></i><span @click="deleteRow(scope.row, scope.$index)">删除</span>
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- <no-permission v-else></no-permission> -->
    </div>
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal="false"
                 center
                 width="30%">
        <div>
          <el-radio-group v-model="interviewResult">
            <el-radio label="3">非常满意</el-radio>
            <el-radio label="2">满意</el-radio>
            <el-radio label="1">一般</el-radio>
            <el-radio label="0">不满意</el-radio>
          </el-radio-group>
          <div class="interview-evaluation">
            <el-input type="textarea"
                      :rows="5"
                      v-model="evaluationContent"
                      placeholder='请输入评价内容'></el-input>
          </div>
        </div>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="getDialog">取 消</el-button>
          <el-button type="primary"
                     @click="setDialogText">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <v-diaing :isDiaingShow="deleteDialogVisible"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
    <scroll-data @getData="getData"
                 :dataLess="dataLess"></scroll-data>
  </div>
</template>
<script>
import vDiaing from '@/components/Diaing'
import { forEachSingleDelete } from '@/libs/tools'
export default {
  data () {
    return {
      deleteDialogVisible: false, // 删除弹框
      rowId: '',
      deleteId: null, // 删除
      changeEvaluationIndex: null, // 点击评价存储索引，修改列表状态
      myList: [],
      page: {
        pageNum: 1,
        pageSize: 32
      },
      dataLess: false,
      tableVisit: [],
      dialogVisible: false, // 回复弹框
      interviewResult: '', // 评价等级
      evaluationContent: '' // 评价内容
    }
  },
  methods: {
    // 跳转约访详情
    interviewDetails (id) {
      this.$router.push({ name: 'InterviewDetails', query: { id: id } })
    },
    // 取消删除
    getCloseModal () {
      this.deleteDialogVisible = false
    },
    // 确认删除
    getConfirmDelete () {
      this.$http.get(`${this.$api.deleteInterview}?id=${this.deleteId}`)
        .then(res => {
          forEachSingleDelete(this.myList, this.deleteId)
          this.$message.success('删除成功！')
        })
        .catch(() => { })
    },
    getData () {
      this.page.pageNum++
      this.getMyList()
    },
    // 获取我的约访列表
    getMyList () {
      this.$http.post(this.$api.listSelfInterview, this.page)
        .then(res => {
          let datas = res.data.data.content
          this.myList.push(...datas)
          if (datas.length < 20) {
            this.dataLess = true
          }
        })
        .catch(() => { })
    },
    // 修改
    editInterview (id) {
      this.$router.push({ name: 'WriteInterview', query: { id: id } })
    },
    // 删除
    deleteRow (row, index) {
      this.deleteDialogVisible = true
      this.deleteId = row.id
    },
    // 评价
    primar (row, index) {
      this.row = row // 当前数据id
      this.changeEvaluationIndex = index // 当前数据索引
      this.dialogVisible = true
    },
    // 取消弹框
    getDialog () {
      this.dialogVisible = false
    },
    // 确认评价
    setDialogText () {
      let row = {
        id: this.row.id,
        interviewResult: this.interviewResult,
        interviewAppraise: this.evaluationContent
      }
      this.$http.post(this.$api.appraiseInterview, row)
        .then(res => {
          this.$message.success('评价成功！')
          this.row.interviewStatus = 1
          this.$set(this.myList, this.changeEvaluationIndex, this.row)
        })
        .catch(() => { })
      this.dialogVisible = false
    }
  },
  created () {
    this.getMyList()
  },
  components: {
    vDiaing
  }
}
</script>
<style scoped>
.buttons .el-button {
  border-radius: 10px;
  padding: 0px;
  border: none;
}
.buttons .el-button span {
  display: inline-block;
  width: 98px;
  height: 30px;
  font-size: 18px;
  font-family: Adobe Heiti Std R;
  font-weight: bold;
  color: rgba(255, 255, 255, 1);
  line-height: 30px;
  background-color: transparent;
}
.buttons .el-button i img {
  vertical-align: middle;
  margin-right: 7px;
}
.myVisit .visit {
  margin-top: 12px;
}
.myVisit .activeClass {
  color: #2baf0c;
}
.myVisit .errorClass {
  color: #f10909;
}
.myVisit {
  box-sizing: border-box;
}
.myVisit .el-table {
  margin-top: 15px;
}
.myVisit .message-home-list i img {
  width: 14px;
  height: 14px;
  vertical-align: middle;
  margin-right: 7px;
  margin-top: -3px;
}
.unevaluate {
  cursor: pointer;
}
.interview-evaluation {
  margin-top: 20px;
}
</style>
