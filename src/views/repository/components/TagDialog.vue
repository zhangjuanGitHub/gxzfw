<template>
  <el-dialog
    @close="closeDialog"
    title="选择标签"
    :append-to-body="false"
    :modal-append-to-body="false"
    :visible="dialogVisible"
    width="30%">
    <div class="margin-b-10">
      <p class="margin-b-10">标签：</p><el-input disabled v-model="getAddInput"></el-input>
    </div>
    <div>
      <el-tag @click="addToInput(item)" class="dialog-tag cursor" v-for="(item) of tagList" :key="item.id">{{item.labelName}}</el-tag>
    </div>
    <div class="is-share">
      <span>是否共享到公共文档素材库</span>
      <el-radio-group v-model="isSync" class="radio-group">
        <el-radio :label="1">是</el-radio>
        <el-radio :label="0">否</el-radio>
      </el-radio-group>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="confirmAddTag">确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'TagDialog',
  props: ['dialogVisible'],
  data () {
    return {
      isSync: 0,
      addTagList: [], // 点击标签
      tagList: [],
      getAddInput: '' // 标签
    }
  },
  methods: {
    // 关闭
    closeDialog () {
      this.getAddInput = ''
      this.$emit('closeModal')
    },
    // 确定
    confirmAddTag () {
      if (this.addTagList.length && this.getAddInput) {
        let filterArr = Array.from(new Set(this.addTagList))
        let tag = {
          isSync: this.isSync,
          filterArr: filterArr
        }
        this.$emit('confirmAddTag', tag)
        this.addTagList = [] // 清空类别
      } else {
        this.addTagList = []
        this.$message.warning('请选择标签！')
      }
    },
    // 添加标签
    addToInput (item) {
      this.addTagList.push(item.id)
      this.addTagList = Array.from(new Set(this.addTagList)) // 去重
      let getSplitArr = this.getAddInput.split('/')
      this.getAddInput += item.labelName + '/'
      if (getSplitArr.includes(item.labelName)) { // 再次点击删除
        for (let i = 0; i < getSplitArr.length; i++) {
          if (item.labelName === getSplitArr[i]) {
            getSplitArr.splice(i, 1)
            this.addTagList.splice(i, 1)
          }
        }
        this.getAddInput = getSplitArr.join('/')
      }
    },
    getTagList () {
      this.$http.get(this.$api.findLabel)
        .then(res => {
          this.tagList = res.data.data
        })
        .catch(() => {})
    }
  },
  created () {
    this.getTagList()
  }
}
</script>

<style scoped>
  .dialog-tag {
    margin: 3px;
  }
  .margin-b-10 {
    margin-bottom: 10px;
  }
  .is-share {
    margin-top: 20px;
  }
  .radio-group {
    margin-left: 10px;
  }
</style>
