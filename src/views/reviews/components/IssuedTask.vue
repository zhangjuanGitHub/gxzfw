<template>
  <el-dialog
    title="下发任务"
    :visible.sync="getModal"
    :modal-append-to-body="false"
    @close="issuedTaskDiaClose"
    width="30%"
    >
    <span>该任务将被下发，是否确定？</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="issuedTaskDiaClose">取 消</el-button>
    <el-button type="primary" @click="confirmIssuedDia">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'IssuedTask',
  props: ['IssuedTaskDia'],
  data () {
    return {}
  },
  methods: {
    issuedTaskDiaClose () {
      this.$emit('issuedTaskDiaClose')
    },
    confirmIssuedDia () {
      this.$emit('confirmIssuedDia')
    }
  },
  computed: {
    getModal: {
      get () {
        return this.IssuedTaskDia
      },
      set () {}
    }
  }
}
</script>

<style scoped>

</style>
