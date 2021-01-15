<template>
  <el-dialog title="上传附件"
             @close="closeImport"
             :modal-append-to-body="false"
             :visible.sync="getModal">
    <el-upload
      class="upload-demo"
      drag
      ref="upload"
      :headers="token"
      :action="this.$api[getApi]"
      accept=".xlsx,.xls"
      :on-success="getSuccess"
      :on-error="getError"
      >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传Excel文件，且只能上传一个</div>
    </el-upload>
<!--    <div slot="footer" class="dialog-footer">-->
<!--      <el-button @click="closeImport">取 消</el-button>-->
<!--      <el-button type="primary" @click="confirmImport">确 定</el-button>-->
<!--    </div>-->
  </el-dialog>
</template>

<script>
export default {
  name: 'DownTemp',
  props: ['downTempDia', 'importApi'],
  data () {
    return {
      fileList: [],
      token: { Authorization: this.$store.state.user.token }
    }
  },
  methods: {
    getSuccess (event, file, fileList) {
      console.log(event)
      this.$message.success(event.data.message)
      this.$emit('confirmImport')
      this.$refs['upload'].clearFiles()
    },
    getError (event) {
      console.log(event)
      this.$emit('closeImport')
      this.$message.error('上传失败！请稍后再试！')
    },
    // 取消导入
    closeImport () {
      this.$emit('closeImport')
    }
  },
  computed: {
    getModal: {
      get () {
        return this.downTempDia
      },
      set () {}
    },
    getApi: {
      get () {
        return this.importApi
      },
      set () {}
    }
  }
}
</script>

<style scoped>

</style>
