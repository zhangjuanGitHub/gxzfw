<template>
  <div class="micro">
    <div class="micro-seach">
      <el-form :inline="true"
               :model="formInline"
               ref="formInline"
               class="demo-form-inline">
        <el-form-item prop="time"
                      label="上传时间:">
          <el-date-picker v-model="formInline.time"
                          align="right"
                          type="date"
                          placeholder="2019-05-03"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="user"
                      label="上传人:">
          <el-input v-model="formInline.user"
                    placeholder="输入名字"></el-input>
        </el-form-item>
        <el-form-item prop="keyword"
                      label="关键字:">
          <el-input v-model="formInline.keyword"
                    placeholder="输入关键字"></el-input>
        </el-form-item>
        <el-form-item prop="type">
          <el-checkbox-group v-model="formInline.type">
            <el-checkbox label="类别名称"
                         name="type"></el-checkbox>
            <el-checkbox label="音频名称"
                         name="type"></el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="fl-ri">
          <el-button type="primary"
                     @click="submitForm('formInline')">筛选</el-button>
          <el-button @click="resetForm('formInline')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- <div class="operation">
      <el-button type="primary">
        <i class="el-icon-plus"></i>
        新建类别
      </el-button>
      <el-button>
        <i class="el-icon-delete"></i>
        删除类别
      </el-button>
    </div> -->
    <div class="video-box">
      <el-row :gutter="36">
        <el-col :xs="24"
                :sm="12"
                :md="6"
                :lg="6"
                :xl="6"
                v-for="(item, index) of video"
                :key="index"
                class="el-col-box">
          <el-card shadow="hover"
                   :body-style="{ padding: '0px' }">
            <router-link :to="{name: 'audioDetail', params: {id:item}}">
              <div class="audio-box"
                   :style="{background: 'url('+ item.img + ') no-repeat center', backgroundSize: 'cover'}">
              </div>
            </router-link>
            <div class="card-details">
              <div class="card-num-box">
                <p class="card-details-title"
                   v-text="item.title"></p>
                <p class="card-operation">
                  <i class="el-icon-upload2"
                     @click="audioUpload"></i>
                  <i class="el-icon-download"></i>
                  <i class="el-icon-delete"></i>
                </p>
              </div>
              <div class="details clearfix">
                <span class="details-span">来源:{{item.source}}</span>
                <time class="time-style"
                      v-text="item.currentDate"></time>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <div class="micro-foot"
         id="pagin">
      <el-pagination background
                     layout="prev, pager, next"
                     :total="40">
      </el-pagination>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formInline: {
        user: '',
        keyword: '',
        time: '',
        type: []
      },
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [{
          text: '今天',
          onClick (picker) {
            picker.$emit('pick', new Date())
          }
        }, {
          text: '昨天',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24)
            picker.$emit('pick', date)
          }
        }, {
          text: '一周前',
          onClick (picker) {
            const date = new Date()
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', date)
          }
        }]
      },
      video: [
        {
          id: 1,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: '微信',
          currentDate: '21651'
        },
        {
          id: 2,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: '知乎',
          currentDate: ''
        },
        {
          id: 3,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: '微博',
          currentDate: ''
        },
        {
          id: 4,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: 'QQ',
          currentDate: ''
        },
        {
          id: 5,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: '微信',
          currentDate: ''
        },
        {
          id: 6,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: '知乎',
          currentDate: ''
        },
        {
          id: 7,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: '微博',
          currentDate: ''
        },
        {
          id: 8,
          img: 'https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png',
          title: 'XXX 图片集',
          source: 'QQ',
          currentDate: ''
        }
      ]
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    audioUpload () {
      this.$router.push({ name: 'UploadVideo' })
    }
  }
}
</script>
<style>
.micro-seach {
  width: 1075px;
  height: 46px;
  background: rgba(239, 241, 244, 1);
  border-radius: 10px;
  box-sizing: border-box;
  padding: 3px 0 0 10px;
}
.micro .el-input .el-input__inner {
  width: 105px;
  height: 29px;
  border-radius: 0;
  line-height: 29px;
  padding-right: 0px;
}
.micro .el-date-editor.el-input {
  width: 120px;
}
.micro .el-date-editor .el-input__inner {
  padding-left: 25px;
  width: 120px;
}
.micro .el-date-editor .el-input__suffix {
  right: 0px;
}
.micro .el-checkbox {
  margin-right: 5px;
}
.micro .el-button {
  width: 70px;
  height: 29px;
  border-radius: 0;
  padding: 0px;
}
.micro .fl-ri {
  float: right;
}
/* .operation .el-button {
  width: 89px;
  font-size: 12px;
  border-radius: 10px;
  color: #fff;
}
.operation {
  float: right;
  margin-top: -37px;
}
.operation .el-button:last-child {
  background-color: #c86cdf;
} */
.micro-foot {
  margin-top: 14px;
  float: right;
}
#pagin button {
  background-color: transparent;
}
.micro .video-box {
  margin-top: 19px;
}
.micro .audio-box {
  height: 170px;
  overflow: hidden;
}
.micro .video-box .el-col {
  width: 25%;
  height: 100%;
  margin-bottom: 19px;
  overflow: hidden;
}
.micro .details {
  margin-top: 16px;
  display: flex;
  justify-content: space-between;
}
.micro .card-details {
  padding: 16px 16px 26px;
}
.micro .card-num-box {
  display: flex;
  justify-content: space-between;
}
.micro .card-details-title,
.micro .details-span,
.micro .time-style {
  font-size: 16px;
}
.micro .card-details-title {
  color: #333333;
  line-height: 2;
}
.micro .card-operation {
  font-size: 16px;
  line-height: 2;
  cursor: pointer;
}
.micro .card-operation i:first-child {
  color: #1783ff;
  margin-right: 10px;
}
.micro .card-operation i:nth-of-type(2) {
  color: #ccc;
  margin-right: 10px;
}
.micro .card-operation i:nth-of-type(3) {
  color: #c86cdf;
}
.micro .details-span {
  color: #1783ff;
  display: inline-block;
  width: 96px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.micro .time-style {
  color: #b2b2b2;
  width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
