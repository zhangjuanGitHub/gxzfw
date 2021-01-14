<template>
  <el-dialog :title="dataTitle"
             :visible.sync="getModal"
             :modal-append-to-body='false'
             @close="getDialog"
             width="30%">
    <span>您确定要执行此操作吗?</span>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="getDialog">取 消</el-button>
      <el-button type="primary"
                 @click="confirmDialogVisible">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'Diaing',
  props: ['isDiaingShow', 'deleteItem'],
  data () {
    return {
      dataTitle: ''
    }
  },
  methods: {
    getDialog () {
      this.$emit('closeModal')
    },
    cancelDialogVisible () { },
    confirmDialogVisible () {
      this.$emit('closeModal')
      this.$emit('confirmDelete', this.deleteItem)
    }
  },
  created () {
    if (this.$route.name === 'AuditList') {
      this.dataTitle = '结束操作'
    } else {
      this.dataTitle = '删除操作'
    }
  },
  components: {},
  computed: {
    getModal: {
      get () {
        return this.isDiaingShow
      },
      set () {}
    }
  }
}
</script>

<style scoped>
</style>
