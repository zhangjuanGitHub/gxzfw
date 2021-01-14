<template>
  <div class="data-set">
    <div v-if="!batchDelete">
      <el-button class="deleteButton"
                 @click="removeColum()">删除栏目</el-button>
      <el-button type="primary" class="addButton" :disabled="!btnChangeEnable"
                 @click="addColum()">添加栏目</el-button>
    </div>
    <div v-else>
      <el-button class="deleteButton"
                 @click="cancleDelete()">取消删除</el-button>
      <el-button class="addButton"
      type="primary"
                 @click="confirmRawDelete()">确定删除</el-button>
    </div>
    <div class="colum-set">
      <div v-for="(item, index) in columList"
           :key="index" class="auto-flex">
        <div class="add-colum">
          <img class="add-image" v-if="item.column_cover" :src="item.column_cover" @click="setColum(item)">
          <img v-else :src="coverList[index].img" @click="setColum(item)">
          <h3>
            <span>{{item.column_name}}</span>
            <span class="fl-right"><span class="blue">{{item.total}}</span><span>个账号</span></span>
          </h3>
          <p>
            <span v-if="item.status===1">{{item.column_introduction}}</span>
            <span v-else>暂未启用栏目</span>
            <span v-if="item.isShowDown===0" @click="IsShowDown(item)" class="is-show">向下级展示</span>
            <span v-else @click="IsShowDown(item)" class="is-show">取消展示</span>
          </p>
        </div>
        <div class="delete-checkbox-box"
             v-if="batchDelete">
          <el-checkbox-group v-model="deleteCheckBoxList">
            <el-checkbox class="search-box-checkbox"
                         :label="item.id">删除</el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <v-diaing :isDiaingShow="dialogVisible"
              :deleteItem="deleteItem"
              @confirmDelete="getConfirmDelete"
              @closeModal="getCloseModal"></v-diaing>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import vDiaing from '@/views/system/components/Diaing'
export default {
  data () {
    return {
      btnChangeEnable: true,
      batchDelete: false, // 控制删除样式
      deleteCheckBoxList: [], // 选中删除数组
      dialogVisible: false,
      deleteItem: {},
      activeName: 'first',
      isActive: false,
      type: '4',
      coverList: [
        { img: require('@/assets/images/dataimg/401147252.png') },
        { img: require('@/assets/images/dataimg/500327078.png') },
        { img: require('@/assets/images/dataimg/501002026.png') },
        { img: require('@/assets/images/dataimg/401147252.png') },
        { img: require('@/assets/images/dataimg/500327078.png') },
        { img: require('@/assets/images/dataimg/501002026.png') },
        { img: require('@/assets/images/dataimg/401147252.png') },
        { img: require('@/assets/images/dataimg/500327078.png') },
        { img: require('@/assets/images/dataimg/501002026.png') }
      ],
      columList: []
    }
  },
  methods: {
    setColum (item) {
      this.$router.push({ name: 'ColumnDetail', query: { columDetail: item.id } })
    },
    IsShowDown (item) {
      var show = ''
      if (item.isShowDown === 1) {
        show = 0
      } else {
        show = 1
      }
      this.$http.get(this.$api.updateIsShowDown, { params: { cid: item.id, status: show } })
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('操作成功!')
            this.queryColumn()
          }
        })
        .catch(() => { })
    },
    // 新增栏目
    addColum () {
      this.$router.push({ name: 'ColumnDetail' })
    },
    // 删除栏目
    removeColum () {
      this.deleteCheckBoxList = []
      this.batchDelete = true
    },
    // 取消删除栏目
    cancleDelete () {
      this.batchDelete = false
    },
    confirmRawDelete () {
      this.dialogVisible = true
    },
    // 确认删除
    getConfirmDelete () {
      this.deleteItem.ids = this.deleteCheckBoxList
      this.$http.post(this.$api.delectColumn, this.deleteItem)
        .then(res => {
          if (res.data.code === 200) {
            this.$message.success('删除成功')
            this.batchDelete = false
            this.queryColumn()
          }
        })
        .catch(() => {
        })
    },
    // 关闭模态框
    getCloseModal () {
      this.dialogVisible = false
    },
    // 获取栏目信息
    queryColumn () {
      this.$http.get(this.$api.queryMeColumn)
        .then(res => {
          if (res.data.code === 200) {
            this.columList = res.data.data.overList
            this.columList.forEach(item => {
              item.column_cover = item.column_cover.replace('blob:', '')
            })
            this.btnChangeEnable = res.data.data.status
          }
        })
        .catch(() => { })
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.user.userInfo
    })
  },
  components: {
    // PopoverDialog,
    vDiaing
  },
  created () {
    this.queryColumn()
    // if (this.userInfo && this.userInfo.id) {
    //   ws.initWebSocket()
    // }
  }
}
</script>
<style scoped>
.data-set {
  min-height: 700px;
}
.colum-set {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  width: 100%;
}
.colum-set::after{
  content:"";
  display:block;
  width:340px;
}
.add-colum {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.add-colum .add-image {
  display: block;
  width: 343px;
  height: 214px;
}
.colum-set .add-colum {
  width: 343px;
  height: 355px;
  background: rgba(238, 239, 240, 0.5);
  box-sizing: border-box;
  cursor: pointer;
  margin-bottom: 15px;
}
.colum-set .delete-checkbox-box {
  text-align: center;
  margin: 10px 0;
}
.colum-set .add-colum h3 {
  padding: 15px;
}
.colum-set .add-colum h3 span {
  font-size: 20px;
  font-weight: bold;
  color: rgba(0, 0, 0, 1);
  line-height: 18px;
}
.colum-set .add-colum h3 .fl-right {
  float: right;
}
.colum-set .add-colum h3 .blue {
  color: #009bff;
  cursor: pointer;
  margin-right: 10px;
}
.colum-set .add-colum p {
  padding: 15px;
  font-size: 14px;
  font-weight: 400;
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  word-break: break-all;
}
.data-set .addButton {
  color: #fff;
  margin-right: 10px;
}
.data-set .el-button {
  float: right;
  margin-bottom: 20px;
  font-size: 14px;
  cursor: pointer;
  padding: 7px 10px;
}
.is-show{
  float: right;
  text-decoration: underline;
  color: #009bff;
}
</style>
