<template>
  <div class="right-conten">
    <div class="sperad-conten article-conten">
      <div class="tab-head dis-flex pad020">
        <div class="page-title">
          稿件发布
        </div>
        <div class="tab-right dis-flex">
          <span>当前所在位置:</span>
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{name:'LocalArticleWx'}">稿件发布</el-breadcrumb-item>
            <el-breadcrumb-item>抖音发布</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>
      <div class="articlepublic-data pad20">
        <div class="tabs-card">
          <div class="card-name"
               :class="{ 'is-active': activeName==='LocalArticleDy'}"
               @click="getData('LocalArticleDy')">
            <span>本地稿件</span>
          </div>
          <div class="card-name"
               :class="{ 'is-active': activeName==='MaterialDy'}"
               @click="getData('MaterialDy')">
            <span>素材库</span>
          </div>
          <div class="card-name"
               :class="{ 'is-active': activeName==='PublicRecordDy'}"
               @click="getData('PublicRecordDy')">
            <span>发布记录</span>
          </div>
        </div>
        <div class="account-box warrant">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Account',
  data () {
    return {
      activeName: 'LocalArticleDy'
    }
  },
  methods: {
    getData (url) {
      this.activeName = url
      this.$router.push({ name: url })
    }
  },
  components: {
  }
}
</script>
<style scoped>
.account-box {
  background: #fff;
}
.account-list {
  display: flex;
  border-radius: 10px;
  background-color: #f5f5f5;
  padding: 20px 0 0 30px;
}
.list-type {
  line-height: 50px;
  margin-right: 30px;
}
.list-type .el-image {
  margin-right: 10px;
  vertical-align: middle;
}
.list-type i {
  font-size: 20px;
  color: #309ade;
  cursor: pointer;
  vertical-align: middle;
}
.list-type .toutiao {
  text-indent: 0px;
}
.account-content h3 {
  line-height: 16px;
  font-style: normal;
  font-weight: 400;
  font-size: 16px;
  border-left: 3px solid #2f9ff3;
  padding-left: 8px;
  margin: 15px 0px;
}
.content-search {
  display: flex;
  justify-content: space-between;
}

.content-search .el-form {
  width: 50%;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 10px;
  padding: 5px 20px;
}
/* .table-export {
  height: 40px;
  padding: 10px 20px;
}
.table-export .el-button {
  padding: 10px 15px;
  border-radius: 0;
}
.table-export .el-button i {
  margin-right: 7px;
  font-size: 16px;
} */
.account-table {
  margin-top: 15px;
}
.card-title {
  display: flex;
  line-height: 25px;
}
.card-title .card-tips {
  margin-left: 10px;
}
.card-form .el-form-item {
  margin: 0px;
}
.card-form .el-form-item .el-button {
  padding: 10px 15px;
  margin-top: 10px;
}
.card-form .el-form {
  width: 80%;
}
.card-list {
  margin-top: 15px;
}
.card-list li {
  width: 100%;
  height: 25px;
  line-height: 25px;
  padding-left: 50px;
  box-sizing: border-box;
}
.add-box {
  padding: 20px;
}
.add-box .img-box {
  cursor: pointer;
}
.account-table .error {
  color: #f56c6c;
}
.checkbox-list{
  width: 20%;
}
.email-input{
  display: flex;
  align-items: center;
}
.el-autocomplete{
  width: 70%;
  margin-left: 10px;
}
.be-careful{
  padding-left:75px;
  line-height: 30px;
  margin-top: 10px;
}
.be-careful ul span{
  font-weight: 700;
}
.be-careful ul li{
  font-size: 14px;
  margin-left: 5px;
}
</style>
