<template>
  <el-dialog
    title="审结任务"
    :visible.sync="closeTaskDia"
    :modal-append-to-body="false"
    @close="taskDiaClose"
    width="30%"
  >
    <span>该任务将被审结，是否确定？</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="taskDiaClose">取 消</el-button>
    <el-button type="primary" @click="confirmCloseDia">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'CloseTask',
  props: ['closeTaskDia'],
  data () {
    return {}
  },
  methods: {
    taskDiaClose () {
      this.$emit('taskDiaClose')
    },
    confirmCloseDia () {
      this.$emit('confirmCloseDia')
    }
  },
  computed: {
    getModal: {
      get () {
        return this.closeTaskDia
      },
      set () {}
    }
  }
}
</script>

<style scoped>

</style>
