<template>
  <el-dialog
    title="删除操作"
    :visible.sync="deleteAdminDia"
    :modal-append-to-body="false"
    @close="deleteAdminDiaClose"
    width="30%"
  >
    <span>您确定要执行删除操作吗？</span>
    <span slot="footer" class="dialog-footer">
    <el-button @click="deleteAdminDiaClose">取 消</el-button>
    <el-button type="primary" @click="confirmDeleteDia">确 定</el-button>
  </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'DeleteAdmin',
  props: ['deleteAdminDia'],
  data () {
    return {}
  },
  methods: {
    deleteAdminDiaClose () {
      this.$emit('deleteAdminsDiaClose')
    },
    confirmDeleteDia () {
      this.$emit('confirmDeleteDia')
    }
  },
  computed: {
    getModal: {
      get () {
        return this.deleteAdminDia
      },
      set () {}
    }
  }
}
</script>

<style scoped>

</style>
