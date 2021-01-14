<template>
  <div>
  </div>
</template>

<script>
import { getScrollTop, getScrollHeight, getWindowHeight } from '@/libs/tools'
export default {
  name: 'ScrollData',
  props: ['dataLess'],
  data () {
    return {
    }
  },
  methods: {
    emitData () {
      this.$emit('getData')
    },
    getOnScroll () {
      let scrollTop = getScrollTop()
      let scrollHeight = getScrollHeight()
      let windowHeight = getWindowHeight()
      if (!this.dataLess && scrollTop + windowHeight >= scrollHeight) {
        this.emitData()
      }
    }
  },
  created () {
    let that = this
    setTimeout(() => {
      window.addEventListener('scroll', that.$throttle(that.getOnScroll, 1000, 1000))
    }, 500)
  },
  destroyed () {
    let that = this
    window.removeEventListener('scroll', that.getOnScroll)
  },
  components: {}
}
</script>

<style scoped>

</style>
