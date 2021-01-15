<template>
  <el-dialog
    title="删除任务"
    :visible.sync="deleteTaskDia"
    :modal-append-to-body="false"
    @close="deleteTaskDiaClose"
    width="30%"
    >
    <span>您确定要删除此任务吗？</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="deleteTaskDiaClose">取 消</el-button>
    <el-button type="primary" @click="confirmDeleteDia">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeleteTask',
  props: ['deleteTaskDia'],
  data () {
    return {}
  },
  methods: {
    deleteTaskDiaClose () {
      this.$emit('deleteTaskDiaClose')
    },
    confirmDeleteDia () {
      this.$emit('confirmDeleteDia')
    }
  },
  computed: {
    getModal: {
      get () {
        return this.deleteTaskDia
      },
      set () {}
    }
  }
}
</script>

<style scoped>

</style>
