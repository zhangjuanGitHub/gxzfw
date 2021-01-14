<template>
    <div
      ref="node"
      :style="nodeContainerStyle"
      :class="nodeContainerClass"
    >
    <!-- 最左侧的那条竖线 -->
    <div class="ef-node-left"></div>
    <!-- 节点类型的图标 -->
    <div class="ef-node-left-ico">
      <i :class="nodeIcoClass"></i>
    </div>
    <!-- 节点名称 -->
    <div class="ef-node-text" :show-overflow-tooltip="true">
      {{node.name}}
    </div>
    <!-- 节点状态图标 -->
    <!-- <div class="ef-node-right-ico">
      <i class="el-icon-circle-check el-node-state-success" v-show="node.state === 'success'"></i>
      <i class="el-icon-circle-close el-node-state-error" v-show="node.state === 'error'"></i>
      <i class="el-icon-warning-outline el-node-state-warning" v-show="node.state === 'warning'"></i>
      <i class="el-icon-loading el-node-state-running" v-show="node.state === 'running'"></i>
    </div> -->
</div>
</template>

<script>
export default {
  props: {
    node: Object
  },
  data () {
    return {}
  },
  computed: {
    nodeContainerClass () {
      return {
        'ef-node-container': true
      }
    },
    // 节点容器样式
    nodeContainerStyle () {
      return {
        top: this.node.top,
        left: this.node.left
      }
    },
    nodeIcoClass () {
      var nodeIcoClass = {}
      nodeIcoClass[this.node.ico] = true
      return nodeIcoClass
    }
  },
  methods: {}
}
</script>
