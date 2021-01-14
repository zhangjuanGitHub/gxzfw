<template>
  <el-dialog @close="closeDialog('trackForm')" title="添加追踪" :visible="getModal" :modal-append-to-body='false' width="30%">
    <el-form :model="trackForm" :rules="rules" label-position="left" ref="trackForm" label-width="90px">
      <el-form-item label="专题名称:" prop="specialName">
        <el-input v-model="trackForm.specialName"></el-input>
      </el-form-item>
      <el-form-item label="关键词:" prop="specialKeyword">
        <el-input v-model="trackForm.specialKeyword" resize="none" type="textarea" :autosize="{ minRows: 5}"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="remarks">* 备注: 多个关键词请用顿号区分</div>
      </el-form-item>
      <el-form-item label="起止时间:" prop="time">
        <el-date-picker
          v-model="trackForm.time"
          type="daterange"
          range-separator="至"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog('trackForm')">取 消</el-button>
      <el-button type="primary" @click="confirmAdd('trackForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'Dialog',
  props: ['trackForm', 'trackVisible'],
  data () {
    return {
      rules: {
        specialName: [
          { required: true, message: '请输入专题名称', trigger: 'blur' }
        ],
        specialKeyword: [
          { required: true, message: '请填写关键词', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择起止时间', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    closeDialog (form) {
      this.$refs[form].resetFields()
      this.$emit('closeModal')
    },
    confirmAdd (form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.trackForm.specialStart = this.trackForm.time[0]
          this.trackForm.specialEnd = this.trackForm.time[1]
          let specialApi = this.trackForm.id ? 'upSpecial' : 'addSpecial'
          this.$http.post(this.$api[specialApi], this.trackForm)
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
        return this.trackVisible
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
