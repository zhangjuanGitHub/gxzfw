<template>
  <div></div>
</template>

<script>
export default {
  name: 'emptyView',
  data () {
    return {}
  },
  created () {
    this.$router.replace({
      name: 'ManageAddAccount',
      path: '/message/manage/account'
    })
  }
}
</script>

<style scoped>

</style>
