<template>
  <div>
    <el-table v-if="isMediaUser"
              ref="multipleTable"
              :data="tableData"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="30">
      </el-table-column>
      <el-table-column label="申请对象"
                       width="220">
        <template slot-scope="scope">{{ scope.row.date }}</template>
      </el-table-column>
      <el-table-column prop="interviewTheme"
                       label="申请主题"
                       width="305"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address"
                       label="状态"
                       width="120"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address"
                       label="发送时间"
                       width="270"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作"
                       width="140">
        <template slot-scope="scope">
          <!-- <div class="admin-btn border-radius">
            <el-button type="primary"
                       @click="showModal(scope.$index, scope.row)"
                       size="medium">评价</el-button>
          </div> -->
          <div class="disflex">
            <div class="edit-click">
              <i class="el-icon-edit-outline"></i><span @click="showModal(scope.$index, scope.row)">评价</span>
            </div>
            <div class="delete-click">
              <i class="el-icon-delete"></i><span @click="deleteRow(scope.$index, scope.row)">删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else
              ref="multipleTable"
              :data="tableData"
              border
              style="width: 100%"
              @selection-change="handleSelectionChange">
      <el-table-column type="selection"
                       width="30">
      </el-table-column>
      <el-table-column label="申请人"
                       width="140">
        <template slot-scope="scope">{{ scope.row.applyUserName }}</template>
      </el-table-column>
      <el-table-column prop="applyDepartmentName"
                       label="申请人单位"
                       width="200"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="interviewTheme"
                       label="申请主题"
                       width="255"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column prop="address"
                       label="状态"
                       width="100"
                       show-overflow-tooltip>
        <template slot-scope="scope">
          <p v-if='scope.row.replyStatus === 1'
             class='activeClass'>已同意</p>
          <p v-else-if='scope.row.replyStatus === 2'
             class='errorClass'>已拒绝</p>
          <p v-else>未回复</p>
        </template>
      </el-table-column>
      <el-table-column prop="applyTime"
                       label="接收时间"
                       width="220"
                       show-overflow-tooltip>
      </el-table-column>
      <el-table-column label="操作"
                       width="140">
        <template slot-scope="scope">
          <!-- <div class="admin-btn border-radius">
            <el-button type="primary"
                       @click="deleteRow(scope.$index, scope.row)"
                       size="medium">评价</el-button>
          </div> -->
          <div class="disflex">
<!--            <div class="edit-click">-->
<!--              <i class="el-icon-edit-outline"></i><span @click="deleteRow(scope.$index, scope.row)">评价</span>-->
<!--            </div>-->
            <div class="delete-click">
              <i class="el-icon-delete"></i><span @click="deleteRow(scope.$index, scope.row)">删除</span>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="user-dialog">
      <el-dialog :visible.sync="dialogVisible"
                 :modal-append-to-body='false'
                 @close="getDialog()"
                 center
                 width="50%">
        <p class="modal-title"
           v-if="getRouterNameTable === 'Interview'"><span class="modal-span">评论主题：</span><span v-text="title"
                class="modal-main"></span></p>
        <p class="modal-title"
           v-if="getRouterNameTable === 'SystemIssue'"><span class="modal-span">回复主题：</span><span v-text="title"
                class="modal-main"></span></p>
        <el-input type="textarea"
                  v-model="evaluation"
                  :rows="7"></el-input>
        <span slot="footer"
              class="dialog-footer">
          <el-button type="primary"
                     @click="confirm()">发 表</el-button>
          <el-button @click="getDialog()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'TableBox',
  data () {
    return {
      page: {
        pageNum: 1,
        pageSize: 32
      },
      title: '', // 回复title
      evaluation: '', // 回复
      modalAppend: false,
      dialogVisible: false,
      tableData: [],
      deleteSelection: []
    }
  },
  methods: {
    getDialog () {
      this.dialogVisible = false
      this.evaluation = ''
    },
    confirm () {
      this.getDialog()
    },
    showModal (index, row) {
      this.title = row.address
      this.dialogVisible = true
    },
    handleSelectionChange (change) {
      this.deleteSelection = change
    },
    // 弹出模态框
    deleteRow (index, row) {
      this.dialogVisible = true
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    }
  },
  created () {
    this.$http.post(this.$api.listInterviewMessage, this.page)
      .then(res => {
        this.tableData = res.data.data.content
      })
      .catch(() => {})
  },
  computed: {
    ...mapState({
      isMediaUser: state => state.user.userInfo.isMediaUser // 是否是媒体用户
    }),
    getRouterNameTable () {
      if (this.$route.name === 'IssueDetail') {
        return 'Issue'
      } else {
        return this.$route.name
      }
    }
  }
}
</script>

<style scoped>
.admin-btn {
  margin-bottom: 10px;
}
.admin-btn:last-child {
  margin-bottom: 0;
}
.modal-title {
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
}
.modal-title::before {
  content: "";
  width: 4px;
  height: 16px;
  background: #2c8ae5;
  position: absolute;
}
.modal-span {
  margin-left: 12px;
  width: 85px;
}
.modal-main {
  flex: 1;
  line-height: 1.2;
}
.activeClass {
  color: #2baf0c;
}
.errorClass {
  color: #f10909;
}
</style>
