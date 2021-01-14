<template>
  <div class="text-center no-permission">
    <img :src="require('@/assets/images/error-page/noPermission.png')"
         alt="">
    <p>很抱歉，您没有访问此页面的权限</p>
  </div>
</template>

<script>
export default {
  name: 'NoPermission'
}
</script>

<style scoped>

</style>
