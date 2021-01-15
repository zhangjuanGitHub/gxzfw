// import { Message } from 'element-ui'
// const tip = msg => {
//   Message.warning({
//     message: msg,
//     duration: 1000,
//     forbidClick: true
//   })
// }
import store from '../store/index'
/**
 * @desc 已滚动高度
 * @author weipeng
 * @date 2019-06-18 16:03:29
 */
export const getScrollTop = () => {
  let scrollTop = 0
  let bodyScrollTop = 0
  let documentScrollTop = 0
  if (document.body) {
    bodyScrollTop = document.body.scrollTop
  }
  if (document.documentElement) {
    documentScrollTop = document.documentElement.scrollTop
  }
  scrollTop =
    bodyScrollTop - documentScrollTop > 0 ? bodyScrollTop : documentScrollTop
  return scrollTop
}
/**
 * @desc 文档总高度，可理解为可滚动高度
 * @author weipeng
 * @date 2019-06-18 16:04:49
 */
export const getScrollHeight = () => {
  let scrollHeight = 0
  let bodyScrollHeight = 0
  let documentScrollHeight = 0
  if (document.body) {
    bodyScrollHeight = document.body.scrollHeight
  }
  if (document.documentElement) {
    documentScrollHeight = document.documentElement.scrollHeight
  }
  scrollHeight =
    bodyScrollHeight - documentScrollHeight > 0
      ? bodyScrollHeight
      : documentScrollHeight
  return scrollHeight
}
/**
 * @desc 浏览器视口高度，可理解为可视高度
 * document.compatMode是用来判断当前浏览器采用的渲染方式
 * BackCompat（标准兼容模式关闭）浏览器客户区宽度为document.body.clientWidth
 * /CSS1Compat（标准兼容模式开启）浏览器客户区宽度为document.documentElement.clientWidth
 * @author weipeng
 * @date 2019-06-18 16:08:09
 */
export const getWindowHeight = () => {
  var windowHeight = 0
  if (document.compatMode === 'CSS1Compat') {
    windowHeight = document.documentElement.clientHeight
  } else {
    windowHeight = document.body.clientHeight
  }
  return windowHeight
}
/**
 * @desc 媒资库视频操作转换时间格式 12:00:00
 * @author weipeng
 * @date 2019-06-24 20:09:14
 */
export const realFormatSecond = second => {
  var secondType = typeof second

  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)

    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60

    return (
      hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    )
  } else {
    return '0:00:00'
  }
}
/**
 * @desc 单个删除操作
 * @author weipeng
 * params (原数组， 数据id， 索引)
 * @date 2019-06-26 17:12:16
 */
export const forEachSingleDelete = (data, id) => {
  data.forEach((item, index) => {
    if (item.id === id) {
      data.splice(index, 1)
    }
  })
  return data
}
/**
 * @desc 批量删除
 * @author weipeng
 * params (需要删除数据数组，原数组)
 * @date 2019-07-01 15:26:42
 */
export const forEachMoreDelete = (seleceData, rawData) => {
  seleceData.forEach(item => {
    rawData.forEach((val, index) => {
      if (item === val.id) {
        rawData.splice(index, 1)
      }
    })
  })
  return rawData
}
/**
 * @desc 考核设置求和
 * @author weipeng
 * params: { a: 1 }
 * @date 2019-07-10 18:52:23
 */
export const NumberSum = item => {
  let result = null
  for (let x in item) {
    if (parseInt(item[x])) {
      result += parseInt(item[x])
    }
  }
  return result
}
/**
 * @desc 导出表格
 * @type
 * @params 插件名，插件名，html,文件名
 * @author weipeng
 * @date 2019-07-11 16:30:54
 */
export const exportTable = (XLSX, FileSaver, item, fileName, itemLength) => {
  // if (!itemLength) {
  //   tip('表格行数为0！')
  //   return false
  // }
  /* 从表生成工作簿对象 */
  /* 获取二进制字符串作为输出 */
  var wbout = XLSX.write(item, {
    bookType: 'xlsx',
    bookSST: true,
    type: 'array'
  })
  try {
    FileSaver.saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      // 设置导出文件名称
      `${fileName}.xlsx`
    )
  } catch (e) {
    if (typeof console !== 'undefined') console.log(e, wbout)
  }
  return wbout
}
/**
 * @desc 权限（禁用）
 * @author weipeng
 * @date 2019-07-11 16:27:24
 */
export const setPermission = (permissionList, refs) => {
  let arr = []
  let json = {}
  var reg = /^[1-9][0-9]*$/ // 验证数字
  for (let key in refs) {
    if (refs[key].$el) {
      json[key] = refs[key].$el
      refs[key] = json[key]
    }
    if (reg.test(key)) {
      arr.push(parseInt(key))
    }
  }
  let test = arr.filter(item => permissionList.indexOf(item) === -1)
  test.map(_ => {
    refs[_].remove()
  })
  // let filterList = arr.filter(item => permissionList.indexOf(item) === -1).map(_ => { refs[_].remove() })
  console.log(refs)
  return refs
}
/**
 * @desc 权限
 * @author weipeng
 * @date 2019-09-09 15:33:27
 */
export const isPermission = (id) => {
  return store.state.mutations.permissionList.includes(id)
}
/**
 * @desc 获取上月时间
 * @author weipeng
 * @date 2019-11-23 15:33:27
 */
export const getMonth = () => {
  let getMonth = new Date().getMonth() >= 10 ? new Date().getMonth() : '0' + new Date().getMonth()
  return new Date().getFullYear() + '-' + getMonth
}
/**
 * @desc 节流
 * @author weipeng
 * @date 2019-06-28 15:33:27
 */
// throttle (fun, delay, time) {
//   console.log(1)
//   var timeout
//   var startTime = new Date()
//   return function () {
//     var context = this
//     var args = arguments
//     var curTime = new Date()
//     clearTimeout(timeout)
//     // 如果达到了规定的触发时间间隔，触发 handler
//     if (curTime - startTime >= time) {
//       fun.apply(context, args)
//       startTime = curTime
//       // 没达到触发间隔，重新设定定时器
//     } else {
//       timeout = setTimeout(function () {
//         fun.apply(context, args)
//       }, delay)
//     }
//   }
// }
// 随机色
export const getRandomColor = () => {
  let r = Math.floor(Math.random() * 255)
  let g = Math.floor(Math.random() * 255)
  let b = Math.floor(Math.random() * 255)
  return 'rgba(' + r + ',' + g + ',' + b + ',0.8)'
}
