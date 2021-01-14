<template>
  <div class="container">
    <div class="development">
      <el-image :src="require('@/assets/images/java.png')"
                style="vertical-align: middle;">
      </el-image>
      <p>功能模块正在开发中，敬请期待~</p>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.development {
  padding: 190px 0;
  text-align: center;
}
.development p {
  font-size: 16px;
  font-weight: 600;
  margin-top: 15px;
}
</style>
