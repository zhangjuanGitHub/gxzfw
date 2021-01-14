// 全局注册表格滚动加载指令
import store from '../store/index'
export default (Vue) => {
  Vue.directive('tableLoad', {
    bind (el, binding) {
      const selectWrap = el.querySelector('.el-table__body-wrapper')
      selectWrap.addEventListener('scroll', function () {
        let sign = 100
        const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
        if (scrollDistance <= sign) {
          binding.value()
        }
      })
    }
  })
  // 权限控制
  Vue.directive('permission', {
    inserted (el, binding) {
      let permissionList = store.state.mutations.permissionList
      if (!permissionList.includes(binding.value)) {
        el.parentNode.removeChild(el)
      }
    }
  })
}
// export default (Vue) => {
//   Vue.directive('permission', {})
// }
