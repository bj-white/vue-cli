/**
 * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
 *
 * @param num1加数1 | num2加数2
 */
const numAdd = function(num1, num2) {
  let baseNum1, baseNum2
  try {
    baseNum1 = num1.toString().split('.')[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length
  } catch (e) {
    baseNum2 = 0
  }
  const baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
  return (num1 * baseNum + num2 * baseNum) / baseNum
}
/**
 * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
 *
 * @param num1被减数 | num2减数
 */
const numMinus = function(num1, num2) {
  let baseNum1, baseNum2
  try {
    baseNum1 = num1.toString().split('.')[1].length
  } catch (e) {
    baseNum1 = 0
  }
  try {
    baseNum2 = num2.toString().split('.')[1].length
  } catch (e) {
    baseNum2 = 0
  }
  const baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
  // 动态控制精度长度
  const n = baseNum1 >= baseNum2 ? baseNum1 : baseNum2
  return Number(((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(n))
}
/**
 * 乘法运算，避免数据相乘小数点后产生多位数和计算精度损失。
 *
 * @param num1被乘数 | num2乘数
 */
function numMultiply(num1, num2) {
  if (isNaN(num1) || isNaN(num2)) {
    return NaN
  }
  let baseNum = 0
  const baseNum1 = num1 || 0
  const baseNum2 = num2 || 0
  try {
    baseNum += baseNum1.toString().split('.')[1].length
  } catch (e) {}
  try {
    baseNum += baseNum2.toString().split('.')[1].length
  } catch (e) {}

  return (
    (Number(baseNum1.toString().replace('.', '')) * Number(baseNum2.toString().replace('.', ''))) /
    Math.pow(10, baseNum)
  )
}
/**
 * 除法运算，避免数据相除小数点后产生多位数和计算精度损失。
 *
 * @param num1被除数 | num2除数
 */
const numDivision = function(num1, num2) {
  if (isNaN(num1) || isNaN(num2)) {
    return NaN
  }
  const baseNum1 = num1 || 0
  const baseNum2 = num2 || 0
  let baseNum3 = 0
  let baseNum4 = 0
  try {
    baseNum3 = baseNum1.toString().split('.')[1].length
  } catch (e) {
    baseNum3 = 0
  }
  try {
    baseNum4 = baseNum2.toString().split('.')[1].length
  } catch (e) {
    baseNum4 = 0
  }
  const baseNum5 = Number(baseNum1.toString().replace('.', ''))
  const baseNum6 = Number(baseNum2.toString().replace('.', ''))
  return (baseNum5 / baseNum6) * Math.pow(10, baseNum4 - baseNum3)
}
export { numAdd, numMinus, numMultiply, numDivision }
