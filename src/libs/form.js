/*
 * @Author: MaiChao
 * @Date: 2020-03-30 14:08:08
 * @LastEditors: MaiChao
 * @LastEditTime: 2020-09-25 14:34:00
 */
// 验证手机号
export const validatePhone = (rule, value, callback) => {
  if (value) {
    var reg = /^1(3[0-9]|4[579]|5[0-35-9]|6[567]|7[0135678]|8[0-9]|9[0126789])\d{8}$/
    if (!reg.test(value)) {
      callback(new Error('手机号码格式不正确!'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入手机号!'))
  }
}
export const checkfirstPass = (rule, value, callback) => {
  let reg = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,15}$/
  if (reg.test(value)) {
    callback()
  } else {
    callback(new Error('请输入8-15位包含字母、数字、特殊字符的登录密码!'))
  }
}
export const validEmail = (rule, value, callback) => {
  if (value) {
    // var reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/
    var reg = /^\w+@[0-9a-z]+\.[a-z]+$/i
    if (!reg.test(value)) {
      callback(new Error('邮箱格式不正确'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入邮箱'))
  }
}
export const validateIdCard = (rule, value, callback) => {
  if (value) {
    var reg = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/
    if (!reg.test(value)) {
      callback(new Error('身份证号码格式不正确'))
    } else {
      callback()
    }
  } else {
    callback(new Error('请输入身份证号码'))
  }
}
// 再次输入密码
export var checkPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== this.ruleForm.loginPass) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}
/**
 * @desc 只能输入数字
 * @author weipeng
 * @date 2019-07-04 13:38:47
 */
export const isNum = (rule, value, callback) => {
  if (value) {
    var reg = /^[1-9][0-9]*$/
    if (!reg.test(value)) {
      callback(new Error('请输入数字!'))
    } else {
      callback()
    }
  } else {
    callback(new Error('不能为空！请输入'))
  }
}
