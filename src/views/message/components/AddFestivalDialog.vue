<template>
  <el-dialog @close="closeDialog('festivalForm')" title="添加节日" :visible="getModal" :modal-append-to-body='false' width="40%">
    <el-form :model="festivalForm" :rules="rules" label-position="left" ref="festivalForm" label-width="90px">
      <el-form-item label="节日名称:" prop="festivalName">
        <el-input v-model="festivalForm.festivalName" placeholder="请输入节日名称"></el-input>
      </el-form-item>
      <el-form-item label="节日日期:" prop="festivalDate">
        <el-date-picker
          v-model="festivalForm.festivalDate"
          placeholder="请选择节日日期"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="节日简介:" prop="festivalIntroduce">
        <el-input v-model="festivalForm.festivalIntroduce" resize="none" type="textarea" placeholder="请输入节日简介" :autosize="{ minRows: 10}"></el-input>
      </el-form-item>
      <!-- <el-form-item>
        <div class="remarks">* 备注: 多个关键词请用顿号区分</div>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog('festivalForm')">取 消</el-button>
      <el-button type="primary" @click="confirmAdd('festivalForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: ['festivalForm', 'festivalVisible'],
  data () {
    return {
      rules: {
        festivalName: [
          { required: true, message: '请输入节日名称', trigger: 'blur' }
        ],
        festivalIntroduce: [
          { required: true, message: '请输入节日简介', trigger: 'blur' }
        ],
        festivalDate: [
          { required: true, message: '请选择节日日期', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closeDialog (form) {
      this.$refs[form].resetFields()
      this.$emit('closeModal')
    },
    // 确认
    confirmAdd (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.$http.post(this.$api.save_festivals_tagging, this.festivalForm)
            .then(res => {
              this.$message.success('操作成功！')
              this.$refs[form].resetFields()
              this.$emit('confirmDia')
            })
            .catch(() => {})
        }
      })
    }
  },
  mounted () {
  },
  computed: {
    getModal: {
      get () {
        return this.festivalVisible
      },
      set () {}
    }
  },
  watch: {
  }
}
</script>

<style scoped>
  .remarks{
    color: #ff0000;
    font-size: 12px;
  }
</style>
