/* eslint-disable camelcase */
import dayjs from 'dayjs'
import Big from 'big.js'
import { GCPUtils } from '../../../gcp-utils/lib/index'
import { isNaturalNumber, isEmpty } from '../../../gcp-utils/lib/assert'
const { numGte, numSub, numMul, numDiv, stringToDate, today, now, dateToString, objectAssign, arrayAssign } = GCPUtils

function date_to_string(date, format) {
  if (!date) {
    return null
  }
  const convertedFormat = format.toUpperCase()
  return dayjs(date).format(convertedFormat)
}

function month(date) {
  if (!date) {
    return null
  }
  return date.getMonth() + 1
}

function year(date) {
  if (!date) {
    return null
  }
  return date.getYear() + 1900
}

function currency_to_chn(money) {
  // 汉字的数字
  const cnNums = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  // 基本单位
  const cnIntRadice = ['', '拾', '佰', '仟']
  // 对应整数部分扩展单位
  const cnIntUnits = ['', '万', '亿', '兆']
  // 对应小数部分单位
  const cnDecUnits = ['角', '分', '毫', '厘']
  // 整数金额时后面跟的字符
  const cnInteger = '整'
  // 整型完以后的单位
  const cnIntLast = '元'
  // 如果为负数
  const cnIntMinus = '负'
  // 最大处理的数字
  const maxNum = 999999999999999.9999
  // 金额整数部分
  let integerNum
  // 金额小数部分
  let decimalNum
  // 输出的中文金额字符串
  let chineseStr = ''
  // 分离金额后用的数组，预定义
  let parts
  if (money === '' || money === undefined || money === null) {
    return ''
  }
  money = Big(money).toString()
  // 判断为负
  if (money.charAt(0) === '-') {
    chineseStr += cnIntMinus
    money = money.slice(1)
  }
  if (numGte(money, maxNum)) {
    // 超出最大处理数字
    return ''
  }
  if (money === '0') {
    chineseStr = cnNums[0] + cnIntLast + cnInteger
    return chineseStr
  }
  if (money.indexOf('.') === -1) {
    integerNum = money
    decimalNum = ''
  } else {
    parts = money.split('.')
    integerNum = parts[0]
    decimalNum = parts[1].substr(0, 4)
  }
  // 获取整型部分转换
  if (parseInt(integerNum, 10) > 0) {
    let zeroCount = 0
    const IntLen = integerNum.length
    for (let i = 0; i < IntLen; i++) {
      const n = integerNum.substr(i, 1)
      const p = IntLen - i - 1
      const q = p / 4
      const m = p % 4
      if (n === '0') {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          chineseStr += cnNums[0]
        }
        // 归零
        zeroCount = 0
        chineseStr += cnNums[parseInt(n)] + cnIntRadice[m]
      }
      if (m === 0 && zeroCount < 4) {
        chineseStr += cnIntUnits[q]
      }
    }
    chineseStr += cnIntLast
  }
  // 小数部分
  if (decimalNum !== '') {
    const decLen = decimalNum.length
    for (let i = 0; i < decLen; i++) {
      const n = decimalNum.substr(i, 1)
      if (n !== '0') {
        chineseStr += cnNums[Number(n)] + cnDecUnits[i]
      }
    }
  }
  if (chineseStr === '') {
    chineseStr += cnNums[0] + cnIntLast + cnInteger
  } else if (decimalNum === '') {
    chineseStr += cnInteger
  }
  return chineseStr
}
function days_between(startingDate, completionDate) {
  if (!startingDate || !completionDate) {
    return null
  }
  return numDiv(new Date(completionDate) - new Date(startingDate), 1 * 24 * 60 * 60 * 1000)
}
function months_between(startingDate, completionDate) {
  if (!startingDate || !completionDate) {
    return null
  }
  let endDate = new Date(completionDate)
  let startDate = new Date(startingDate)
  let flag = 1
  if (startDate.getTime() - endDate.getTime() > 0) {
    flag = -1
    ;[startDate, endDate] = [endDate, startDate]
  }
  let month = endDate.getMonth() - startDate.getMonth()
  if (endDate.getDate() < startDate.getDate()) {
    month -= 1
  }
  return numMul((endDate.getYear() - startDate.getYear()) * 12 + month, flag)
}
function days_remained(startingDate, completionDate) {
  if (!startingDate || !completionDate) {
    return null
  }
  const endDate = new Date(completionDate)
  const startDate = new Date(startingDate)

  if (startDate.getDate() > endDate.getDate()) {
    startDate.setFullYear(endDate.getFullYear())
    startDate.setMonth(endDate.getMonth() - 1)
    if (startDate.getMonth() !== endDate.getMonth() - 1) {
      startDate.setDate(startDate.getDate() - 1)
    }
  } else {
    startDate.setFullYear(endDate.getFullYear())
    startDate.setMonth(endDate.getMonth())
  }
  return Math.floor((endDate - startDate) / (24 * 60 * 60 * 1000))
}
// 合并字符串
function collectorsJoining(list, key, separator = ',') {
  if (isEmpty(list) || isEmpty(key)) return ''
  const valueList = []
  list.forEach(item => {
    const value = item[key]
    valueList.push(value)
  })
  return valueList.join(separator)
}
// 拆分字符串
function split(str, separator, index) {
  if (isEmpty(str) || isEmpty(separator)) return ''
  const str_ = String(str)
  const separator_ = String(separator)
  const list = str_.split(separator_)
  if (isNaturalNumber(index)) {
    if (index < 0 || index > list.length - 1) {
      return ''
    } else {
      return list[index] // 按照索引进行取值
    }
  } else {
    return list.length ? list[0] : '' // 没有传指定索引，将取集合第一位数据返回
  }
}

/**
 * 字符串转数字、日期格式
 * @param {string} str
 * @param {string} type
 * @returns {number | Date}
 */
function stringConvert(str, type) {
  switch (type) {
    case 'long':
    case 'double':
    case 'decimal':
      return parseFloat(str)
    case 'date':
      return stringToDate(str)
    default:
      return str
  }
}

function dateDelta(currentDate, number, unit) {
  let targetDate = new Date(currentDate)
  number = number * 1
  if (!currentDate) {
    return null
  }
  if (!Number.isInteger(number)) {
    throw new Error('todo=================')
  }
  switch (unit) {
    case 'D': {
      targetDate.setDate(targetDate.getDate() + number)
      break
    }
    case 'M': {
      const newMonth = targetDate.getMonth() + number
      targetDate.setMonth(newMonth)
      break
    }
    case 'Y': {
      const newYear = targetDate.getFullYear() + number
      targetDate.setFullYear(newYear)
      break
    }
    case 'H': {
      targetDate = new Date(targetDate.getTime() + number * 3600 * 1000)
      break
    }
    case 'MIN': {
      targetDate = new Date(targetDate.getTime() + number * 60 * 1000)
      break
    }
  }
  return targetDate
}
const functions = {
  date_to_string,
  month,
  year,
  currency_to_chn,
  days_between,
  months_between,
  days_remained,
  today,
  now,
  dateToString,
  objectAssign,
  arrayAssign,
  collectorsJoining,
  split,
  stringConvert,
  dateDelta
}

export default functions
