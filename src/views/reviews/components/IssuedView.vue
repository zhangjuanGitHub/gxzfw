<template>
  <div class="view-issued-box">
    <div class="view-issued-detalis">
      <ul>
        <li><span>任务名称:</span><span>{{issuedInfo.taskName}}</span></li>
        <li><span>任务描述:</span><span>{{issuedInfo.taskContent}}</span></li>
        <li><span>任务地址:</span><span>{{issuedInfo.taskSite}}</span></li>
        <li><span>人数:</span><span>{{issuedInfo.peopleSum}}</span></li>
        <li>
          <span>附件:</span>
          <div v-if="issuedInfo.picList && issuedInfo.picList.length > 0">
            <p @click="targetUrl(item.accessoryUrl)" class="color-primary cursor" v-for="(item, index) of issuedInfo.picList" :key="index">{{ item.accessoryName }}</p>
          </div>
        </li>
        <li>
          <span>承办人:</span>
          <div class="organizer-box">
            <div class="margin-r-10" :key="index" v-for="(item, index) of issuedInfo.particularsList">
              <p>{{item.name}}</p>
              <p class="color-success" v-if="item.accomplish === '1'">已办</p>
              <p class="color-danger" v-else>未办</p>
            </div>
          </div>
<!--          <div>123</div>-->
        </li>
        <li><span>开始日期</span><span>{{issuedInfo.startDate}}</span></li>
        <li><span>结束日期</span><span>{{issuedInfo.endDate}}</span></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IssuedView',
  props: ['issuedInfo'],
  computed: {
    getModal: {
      get () {
        return this.issuedInfo
      },
      set () {}
    }
  },
  methods: {
    targetUrl (url) {
      window.open(url, '_blank')
    }
  }
}
</script>

<style scoped>
  .view-issued-box {
    background: #fff;
    padding: 12px 0 30px;
  }
  .view-issued-detalis li {
    border-bottom: 1px solid #ccc;
    line-height: 50px;
    display: flex;
    padding: 3px 0;
  }
  .view-issued-detalis {
    padding: 10px 22px;
    background: #fff;
  }
  .view-issued-detalis li span:first-child {
    display: inline-block;
    margin-right: 15px;
    min-width: 120px;
  }
  .view-issued-detalis img {
    max-width: 178px;
  }
  .organizer-box {
    display: flex;
    margin-right: 10px;
    padding: 5px 4px 0;
    flex-wrap: wrap;
    align-items: center;
  }
  .organizer-box .el-button {
    padding: 4px 10px;
  }
  .organizer-box p {
    line-height: 1;
  }
  .organizer-box:first-child {
    border: none;
  }
  .margin-r-10 {
    margin-right: 20px;
    padding-bottom: 5px;
  }
</style>
