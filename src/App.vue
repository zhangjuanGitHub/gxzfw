<template>
  <div id="app">
    <v-header></v-header>
    <router-view v-if="isRouterAlive"/>
  </div>
</template>
<script>
import vHeader from './views/block/Header'
export default {
  name: 'App',
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  components: {
    vHeader
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style lang="scss">
  #app {
    //width: 100%;
    min-width: 1440px;
    overflow-y: auto;
    min-height: calc(100vh);
    background: #f5f5f5;
    position: relative;
    z-index: 1;
  }
</style>
