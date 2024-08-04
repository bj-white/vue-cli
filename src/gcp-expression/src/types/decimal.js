import { GCPUtils } from '../../../gcp-utils/lib/index'
const decimal = {
  of: function(num, digit = 0) {
    if (num === '') {
      num = undefined
    }
    if (!num) {
      return num === undefined ? null : num
    }
    const numValue = num
    if (digit <= 0) {
      return numValue
    } else {
      return GCPUtils.numToFixed(numValue, digit)
    }
  }
}
/* function round(number, precision) {
  // 处理四舍五入数值不精确问题
  const value = Math.round(+Math.abs(number) + 'e' + precision) / Math.pow(10, precision)
  return number < 0 ? -value : value
} */
export default decimal
