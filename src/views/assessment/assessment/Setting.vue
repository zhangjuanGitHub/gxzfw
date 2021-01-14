<template>
  <div class="assess-set">
    <ul>
      <li>
        <h2>微信考核设置</h2>
        <div class="input-box">
          <p>月榜</p>
          <p>文章数x<el-input v-model="wxSettings.artNumWeight"></el-input>%</p>
          <p>发布次数x<el-input v-model="wxSettings.pubNumWeight"></el-input>%</p>
          <p>平均阅读数x<el-input v-model="wxSettings.aveReadNumWeight"></el-input>%</p>
          <p>最高阅读数x<el-input v-model="wxSettings.maxReadNumWeight"></el-input>%</p>
          <p>平均点赞数x<el-input v-model="wxSettings.aveDzWeight"></el-input>%</p>
          <p>最高点赞数x<el-input type="text"
                      v-model="wxSettings.highestDzWeight"></el-input>%</p>
          <el-button type="primary"
                     size="small"
                     @click="saveDatas('wxSettings')">保存</el-button>
        </div>
      </li>
      <li>
        <h2>微博考核设置</h2>
        <div class="input-box">
          <p>月榜</p>
          <p>粉丝数x<el-input v-model.number="wbSettings.fansNumWeight"></el-input>%</p>
          <p>发布次数x<el-input v-model="wbSettings.pubNumWeight"></el-input>%</p>
          <p>原创数x<el-input v-model="wbSettings.originalNumWeight"></el-input>%</p>
          <p>评论数x<el-input v-model="wbSettings.pinglunNumWeight"></el-input>%</p>
          <p>转发数x<el-input v-model.number="wbSettings.zhuanfaNumWeight"></el-input>%</p>
          <p>点赞数x<el-input type="text"
                      v-model.number="wbSettings.dianzanNumWeight"></el-input>%</p>
          <el-button type="primary"
                     size="small"
                     @click="saveDatas('wbSettings')">保存</el-button>
        </div>
      </li>
      <!-- <li>
        <h2>一点资讯考核设置</h2>
        <div class="input-box">
          <p>月榜</p>
          <p>粉丝数<el-input v-model.number="wxSettings.artNumWeight"></el-input>%</p>
          <p>发布次数<el-input v-model="wxSettings.pubNumWeight"></el-input>%</p>
          <p>原创数<el-input v-model="wxSettings.aveReadNumWeight"></el-input>%</p>
          <p>评论数<el-input v-model="wxSettings.maxReadNumWeight"></el-input>%</p>
          <p>转发数<el-input v-model="wxSettings.aveDzWeight"></el-input>%</p>
          <p>点赞数<el-input type="text"
                      v-model="wxSettings.highestDzWeight"></el-input>%</p>
          <el-button type="primary"
                     size="small"
                     @click="saveDatas('updateWxSettings')">保存</el-button>
        </div>
      </li> -->
      <li>
        <h2>今日头条考核设置</h2>
        <div class="input-box">
          <p>月榜</p>
          <p>评论数x<el-input v-model="ttSettings.pinglunNumWeight"></el-input>%</p>
          <p>阅读数x<el-input v-model="ttSettings.readNumWeight"></el-input>%</p>
          <p>粉丝数x<el-input v-model="ttSettings.fansWeight"></el-input>%</p>
          <p>发布数x<el-input v-model="ttSettings.publishWeight"></el-input>%</p>
          <p>点赞数x<el-input v-model="ttSettings.dianzanNumWeight"></el-input>%</p>
          <el-button type="primary"
                     size="small"
                     @click="saveDatas('ttSettings')">保存</el-button>
        </div>
      </li>
    </ul>
    <div class="set-foot">
      <h2> 总榜与投稿贡献统计设置
        <h4>注:信息报送的设置也是投稿贡献统计设置</h4>
      </h2>
      <ul class="settings">
        <li>
          <div class="fl-le">
            <span>信息报送权重</span>
            <el-input type="text"
                      v-model="maaList.basicWeight"
                      placeholder='1~99'></el-input>%
            <img :src="require('@/assets/images/manage/u12355.png')">
          </div>
          <div class="mright">
            <p>基础分:满分
              <el-input type="text"
                        v-model="maaList.basicFullScore"
                        placeholder='1~2'></el-input>分。A稿系数
              <el-input type="text"
                        v-model="maaList.aaCoe"
                        placeholder='1~2'></el-input>, B稿系数
              <el-input type="text"
                        v-model="maaList.bbCoe"
                        placeholder='1~2'></el-input>
            </p>
            <p><span class="justify">加分</span>:满分
              <el-input type="text"
                        v-model="maaList.addFullScore"
                        placeholder='1~2'></el-input>分, 被自治区院公众号转发系数
              <el-input type="text"
                        v-model="maaList.zfCoe"
                        placeholder='1~2'></el-input>
                        <!-- , 视频被采用系数
              <el-input type="text"
                        v-model="maaList.viCoe"
                        placeholder='1~2'></el-input> -->
            </p>

          </div>
        </li>
        <li>
          <div class="fl-le">
            <span>统筹新媒体建设权重</span>
            <el-input type="text"
                      v-model="maaList.xmtjzWeight"
                      placeholder='1~99'></el-input>%
            <img :src="require('@/assets/images/manage/u12376.png')">
          </div>
          <div class="matrix-box">
            <p>微信榜权重
              <el-input type="text"
                        v-model="maaList.wxWeight"
                        placeholder='1~100'></el-input>%</p>
            <p>微博榜权重
              <el-input type="text"
                        v-model="maaList.wbWeight"
                        placeholder='1~100'></el-input>%</p>
            <p>头条榜权重
              <el-input type="text"
                        v-model="maaList.ttWeight"
                        placeholder='1~100'></el-input>%</p>
            <p>采访报道策划权重
              <el-input type="text"
                        v-model="maaList.chWeight"
                        placeholder='1~100'></el-input>%</p>
          </div>
        </li>
      </ul>
      <div class="formula">
        <img src="@/assets/images/formula.png"
             alt="权重公式">
      </div>
    </div>
    <div class="btns">
      <el-button type="primary"
                 @click="maaSave">保存</el-button>
      <!-- <el-button>取消</el-button> -->
    </div>
  </div>
  <!-- <no-permission v-else></no-permission> -->
</template>
<script>
export default {
  data () {
    return {
      wxSettings: {
        artNumWeight: 0, // 文章数权重
        pubNumWeight: 0, // 发布次数权重
        aveReadNumWeight: 0, // 平均阅读数权重
        maxReadNumWeight: 0, // 最高阅读数权重
        aveDzWeight: 0, // 平均点赞数权重
        highestDzWeight: 0, // 最高点赞数权重
        version: 0
      },
      wbSettings: {
        fansNumWeight: 0,
        pubNumWeight: 0,
        originalNumWeight: 0,
        pinglunNumWeight: 0,
        zhuanfaNumWeight: 0,
        dianzanNumWeight: 0,
        version: 0
      },
      ttSettings: {
        pinglunNumWeight: 0,
        readNumWeight: 0,
        version: 0
      },
      maaList: {
        id: '',
        basicFullScore: '', // 基础满分
        aaCoe: '', // A稿系数
        bbCoe: '', // B稿系数
        addFullScore: '', // 加分满分
        zfCoe: '', // 转发系数
        viCoe: 0, // 视频被采用系数
        wxWeight: '', // 微信权重
        wbWeight: '', // 微博权重
        ttWeight: '', // 头条权重
        chWeight: '', // 策划权重
        basicWeight: '', // 信息报送权重
        xmtjzWeight: '',
        version: 1
      },
      setting: {}
    }
  },
  methods: {
    active (wxWeight) {
      console.log(wxWeight)
    },
    // 保存矩阵
    maaSave () {
      var reg = /^[1-9][0-9]*$/
      delete this.maaList.id
      delete this.maaList.viCoe
      for (let key in this.maaList) {
        if (!reg.test(this.maaList[key])) {
          this.$message.warning('请输入数字！')
          return false
        }
      }
      this.maaList.viCoe = 0
      if (parseInt(this.maaList.basicWeight) + parseInt(this.maaList.xmtjzWeight) !== 100) {
        this.$message.warning('统筹新媒体建设权重与信息报送权重之和应等于100')
        return false
      }
      if (parseInt(this.maaList.basicFullScore) + parseInt(this.maaList.addFullScore) > 100) {
        this.$message.warning('基础分满分与加分满分之和应小于等于100')
        return false
      }
      if (parseInt(this.maaList.wxWeight) + parseInt(this.maaList.wbWeight) + parseInt(this.maaList.ttWeight) + parseInt(this.maaList.chWeight) !== 100) {
        this.$message.warning('微信权重、微博权重、头条权重、策划权重之和应等于100')
        return false
      }
      let a = this.maaList.aaCoe > 2 || this.maaList.aaCoe < 1
      let b = this.maaList.bbCoe > 2 || this.maaList.bbCoe < 1
      let z = this.maaList.zfCoe > 2 || this.maaList.zfCoe < 1
      // let v = this.maaList.viCoe > 2 || this.maaList.viCoe < 1
      if (a || b || z) {
        this.$message.warning('系数不能小于1且不能大于2')
        return false
      }
      this.$http.post(this.$api.updateMaaGenSettings, this.maaList)
        .then(res => {
          this.$message.success('操作成功！')
        })
        .catch(() => { })
    },
    // 保存
    saveDatas (api) {
      var reg = /^[1-9][0-9]*$/
      delete this[api].updateTime
      for (let key in this[api]) {
        if (!reg.test(this[api][key])) {
          this.$message.warning('请输入数字！')
          return false
        }
      }
      this.$http.post(this.$api[api], this[api])
        .then(res => {
          this.$message.success('操作成功！')
        })
        .catch(() => { })
    },
    // 获取微信值
    getShowWxSettings () {
      this.$http.get(this.$api.showWxSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.wxSettings = res.data.data
          }
        })
        .catch(() => { })
    },
    // 获取微博值
    getShowWbSettings () {
      this.$http.get(this.$api.showWbSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.wbSettings = res.data.data
          }
        })
        .catch(() => { })
    },
    // 获取头条值
    getshowJrttSettings () {
      this.$http.get(this.$api.showJrttSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.ttSettings = res.data.data
          }
        })
        .catch(() => { })
    },
    // 查看总榜与贡献考核设置
    getShowMaaGenSettings () {
      this.$http.get(this.$api.showMaaGenSettings)
        .then(res => {
          if (res.data.code === 200 && res.data.data) {
            this.setting = res.data.data
            this.maaList.id = this.setting.id
            this.maaList.basicWeight = this.setting.basicWeight
            this.maaList.chWeight = this.setting.chWeight
            this.maaList.ttWeight = this.setting.ttWeight
            this.maaList.wbWeight = this.setting.wbWeight
            this.maaList.wxWeight = this.setting.wxWeight
            this.maaList.xmtjzWeight = this.setting.xmtjzWeight
            this.maaList.basicFullScore = this.setting.basicFullScore
            this.maaList.aaCoe = this.setting.aaCoe
            this.maaList.bbCoe = this.setting.bbCoe
            this.maaList.addFullScore = this.setting.addFullScore
            this.maaList.zfCoe = this.setting.zfCoe
            this.maaList.viCoe = this.setting.viCoe
          }
        })
        .catch(() => { })
    }
  },
  created () {
    this.getShowWxSettings() // 获取微信值
    this.getShowWbSettings() // 获取微博值
    this.getshowJrttSettings() // 获取头条值
    this.getShowMaaGenSettings() // 查看总榜与贡献考核设置
  }
}
</script>
<style scoped>
.assess-set {
  padding: 20px;
}
.assess-set .input-box {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
}
.assess-set .input-box p {
  float: left;
  margin-right: 16px;
}
.assess-set .input-box p:first-of-type {
  margin-left: 5px;
}
.assess-set .el-input {
  width: 35px;
  margin-left: 5px;
  margin-right: 5px;
}
.assess-set .el-input input {
  height: 27px;
  background: rgba(255, 255, 255, 1);
  border: 1px solid rgb(159, 181, 194);
  box-shadow: 0px 0px 1px 0px rgb(159, 181, 194);
  outline: none;
  padding: 0;
  border-radius: 0;
}
.assess-set ul li {
  background: rgb(237, 242, 245);
  border-radius: 5px;
  box-sizing: border-box;
  padding: 15px;
  margin-bottom: 14px;
  overflow: hidden;
}
.assess-set .input-box p:first-of-type {
  width: 67px;
  height: 32px;
  background: rgba(52, 164, 247, 1);
  color: rgba(255, 255, 255, 1);
  line-height: 32px;
  text-align: center;
}
.assess-set h2 {
  color: rgba(51, 51, 51, 1);
  line-height: 22px;
  margin-bottom: 10px;
  font-size: 14px;
}
.set-foot {
  background: rgba(237, 242, 245, 1);
  border-radius: 5px;
  margin: 0 auto;
  box-sizing: border-box;
  padding: 13px 0px 0px 15px;
  font-size: 14px;
  font-weight: 500;
  color: rgba(51, 51, 51, 1);
  line-height: 21px;
  position: relative;
  padding-bottom: 20px;
}
.set-foot h2 {
  width: 50%;
}
.set-foot h4 {
  font-size: 13px;
  font-family: SimSun;
  font-weight: 400;
  color: rgba(26, 178, 248, 1);
  float: right;
}
.set-foot li {
  overflow: hidden;
  margin-top: 10px;
  margin-bottom: 20px;
}
.set-foot .fl-le img {
  width: 14px;
  margin-right: 10px;
}
.set-foot li:nth-of-type(1) img {
  height: 85px;
}
.set-foot li:nth-of-type(2) img {
  height: 170px;
}
/* .set-foot li:nth-of-type(3) img {
  height: 170px;
  margin-left: 20px;
} */
.set-foot .fl-le {
  float: left;
}
.set-foot .mright {
  float: left;
}
.set-foot .mright-a div {
  display: inline-block;
  vertical-align: middle;
}
.set-foot .mright p,
.set-foot .mright-a p {
  font-size: 14px;
  margin-bottom: 7px;
}
.set-foot .fl-le span {
  display: inline-block;
  font-size: 14px;
  font-weight: 500;
  vertical-align: middle;
}
.set-foot .fl-le img {
  display: inline-block;
  vertical-align: middle;
}
.btns {
  text-align: center;
  margin-top: 20px;
}
.matrix-box p {
  margin-bottom: 5px;
}
.settings .el-input {
  width: 60px;
  text-align: center;
}
.formula {
  position: absolute;
  left: 50%;
  bottom: 38px;
}
</style>
