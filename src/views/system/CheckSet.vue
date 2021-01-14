<template>
  <div class="admin-check-box container"
       v-if="$isPermission(704)">
    <div class="breadcrumb-box">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'SystemDepartment' }">系统管理</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'CheckSet' }">审核人设置</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="admin-box">
      <el-row :gutter="10">
        <el-col :xs="3"
                :sm="3"
                :md="3"
                :lg="4"
                :xl="4">
          <v-menu></v-menu>
        </el-col>
        <el-col :xs="21"
                :sm="21"
                :md="21"
                :lg="20"
                :xl="20">
          <div class="admin-set-check">
            <div class="admin-checkset">
              <div class="admin-checkset-wrap">
                <div class="check-cont admin-checkset-left">
                  <p class="admin-checkout-title">默认排序</p>
                  <ul id="all" @dragover="dragedOver($event)" @drop="dropped($event, 'all')">
                    <li v-for="(item, index) in checkList"
                        :key="index"
                        draggable="true"
                        class="all-name"
                        :id="item.id">{{item.userName}}</li>
                  </ul>
                </div>
                <div class="admin-checkset-right">
                  <p class="admin-checkout-title">选择排序结果：高 « 中 « 低</p>
                  <div class="admin-ul-wrap">
                    <ul id="boxOne" @dragover="dragedOver($event)" @drop="dropped($event, 'boxOne')"></ul>
                    <ul id="boxTwo" @dragover="dragedOver($event)" @drop="dropped($event, 'boxTwo')"></ul>
                    <ul id="boxThree" @dragover="dragedOver($event)" @drop="dropped($event, 'boxThree')"></ul>
                  </div>
                </div>
              </div>
              <div class="admin-checkout-but">
                <el-button size="small" type="primary" @click="toSubmit">确认</el-button>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
  <no-permission v-else></no-permission>
</template>

<script>
import vMenu from '@/views/system/components/Menu'
import { mapGetters } from 'vuex'
export default {
  name: 'CheckSet',
  data () {
    return {
      checkedData: [],
      defaultProps: {
        key: 'id',
        label: 'userName'
      },
      checkList: [],
      sortLists: {
        high: [],
        middle: [],
        low: []
      },
      allItemLength: ''
    }
  },
  methods: {
    submit () {
      this.$http.post(this.$api.saveSort, this.checkedData)
        .then(res => {
          this.checkdData = []
          this.$message.success('设置审核人成功！')
        })
        .catch(() => { })
    },
    getCheckList () {
      this.$http.get(this.$api.listCheckUser)
        .then(res => {
          this.checkList = res.data.data
        })
        .catch(() => { })
    },
    toSubmit () {
      this.sortLists.high = []
      this.sortLists.middle = []
      this.sortLists.low = []
      let getListOne = document.querySelectorAll('#boxOne li')
      let getListTwo = document.querySelectorAll('#boxTwo li')
      let getListThree = document.querySelectorAll('#boxThree li')
      for (let i = 0; i < getListOne.length; i++) {
        this.sortLists.high.push(getListOne[i].getAttribute('id'))
      }
      for (let i = 0; i < getListTwo.length; i++) {
        this.sortLists.middle.push(getListTwo[i].getAttribute('id'))
      }
      for (let i = 0; i < getListThree.length; i++) {
        this.sortLists.low.push(getListThree[i].getAttribute('id'))
      }
      this.$http.post(this.$api.saveSort, this.sortLists)
        .then(res => {
          this.sortLists.high = []
          this.sortLists.middle = []
          this.sortLists.low = []
          this.$message.success('设置审核人成功！')
        })
        .catch(() => { })
    },
    dragedOver (ev) {
      ev.preventDefault() // 阻止向上冒泡
    },
    dropped (ev, dom) {
      ev.preventDefault()
      let boxEle = document.getElementById(dom)
      var id = ev.dataTransfer.getData('Text')
      var elem = document.getElementById(id) // 当前拖动的元素
      var toElem = ev.toElement.id // 放置位置
      if (toElem === dom) {
        // 如果为容器,元素放置在末尾
        boxEle.appendChild(elem)
      } else {
        // 如果为容器里的元素，则插入该元素之前
        boxEle.insertBefore(elem, document.getElementById(toElem))
      }
    }
  },
  created () {
    this.getCheckList()
  },
  updated () {
    var moveItem = document.getElementsByClassName('all-name')
    this.allItemLength = moveItem.length
    for (let i = 0; i < moveItem.length; i++) {
      moveItem[i].ondragstart = function (ev) {
        // dataTransfer.setData() 方法设置被拖数据的数据类型和值
        ev.dataTransfer.setData('Text', this.id)
      }
    }
  },
  computed: {
    ...mapGetters('mutations', {
      getPermission: 'getPermission'
    })
  },
  components: {
    vMenu
  }
}
</script>

<style scoped>
.margin-p {
  margin-top: 30px;
}
.admin-set-check {
  padding: 0 12px;
  min-height: 400px;
}
.admin-checkset {
  background-color: #fff;
  padding: 20px;
  width: 100%;
  height: 800px;
}
.admin-checkset-wrap {
  width: 100%;
  height: 750px;
  display: flex;
  justify-content: space-between;
}
.admin-checkout-title {
  width: 100%;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  text-align: center;
  background: #DCDFE6;
  margin-bottom: 2px;
}
.admin-checkout-but {
  display: flex;
  justify-content: center;
}
.check_btn {
  float: left;
  margin-left: 20px;
}
.admin-checkset-left, .admin-checkset-right {
  height: 700px;
  border: 1px solid rgb(175, 177, 184);
}
.admin-checkset-left {
  width: 250px;
}
.admin-checkset-right {
  width: calc(100% - 300px);
}
.check-cont ul, .admin-ul-wrap ul {
  height: calc(100% - 45px);
  overflow-x: hidden;
  overflow-y: scroll;
}
.admin-ul-wrap {
  width: calc(100% - 4px);
  height: 100%;
  padding: 0 2px;
  display: flex;
  justify-content: space-between;
}
.admin-ul-wrap ul {
  width: 248px;
  border: 1px dashed #007cdc;
}
.check-cont li, .admin-ul-wrap li {
  width: 248px;
  height: 30px;
  line-height: 30px;
  color: #303133;
  border-radius: 5px;
  background: rgb(192, 216, 252);
  border: 1px solid #EBEEF5;
}
</style>
