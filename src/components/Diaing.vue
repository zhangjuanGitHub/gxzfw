<template>
  <el-dialog title="删除操作"
             :visible="isDiaingShow"
             :modal-append-to-body='false'
             @close="closeDialog"
             width="30%">
    <span>您确定要执行此操作吗?</span>
    <span slot="footer"
          class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary"
                 @click="confirmDialogVisible">确 定</el-button>
    </span>
<!--    // deleteItem-->
  </el-dialog>
</template>

<script>
export default {
  name: 'Diaing',
  props: ['isDiaingShow', 'deleteItem'],
  data () {
    return {
    }
  },
  methods: {
    closeDialog () {
      this.$emit('closeModal')
    },
    confirmDialogVisible () {
      this.$emit('closeModal')
      this.$emit('confirmDelete', this.deleteItem)
    }
  },
  created () {
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
