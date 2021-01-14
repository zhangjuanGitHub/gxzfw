<!--
 * @Author: MaiChao
 * @Date: 2020-11-19 14:04:33
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-12-04 10:46:04
-->

<template>
  <div class="wf-container">
    <div class="wf-column" v-for="(item,index) in columnNum" :key="'column-'+index" :name="index">
      <slot :columnNum="columnNum" :columnIndex="index"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WFColumn',
  props: ['itemW'],
  data () {
    return {
      columnNum: 0
    }
  },
  created () {
    this.columnNum = Math.floor(document.body.clientWidth / this.itemW) - 1
    window.onresize = () => {
      this.columnNum = Math.floor(document.body.clientWidth / this.itemW) - 1
    }
  }
}
</script>

<style scoped lang="scss">
.wf-container{
  width: 100%;
  display: flex;
  .wf-column{
    flex: 1;
  }
}
</style>
