import scrollData from '@/components/ScrollData'
import noPermission from '@/components/NoPermission'
export default (Vue) => {
  Vue.component('scrollData', scrollData)
  Vue.component('NoPermission', noPermission)
}
