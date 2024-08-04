import MetaDescPropResolver from './MetaDescPropResolver'
import { Expression } from '../../../gcp-expression/src/index'

export default class ExprResolver extends MetaDescPropResolver {
  resolveItem(propValue) {
    if (propValue && typeof propValue === 'string') {
      let expr = this.tryExtractQuote(propValue, '$')
      if (expr) {
        return this.createExprFunction(expr)
      } else {
        expr = this.tryExtractQuote(propValue, '#')
        if (expr) {
          return this.createScriptFunction(expr)
        }
      }
    }
    return propValue
  }

  createExprFunction(expr) {
    let expression
    try {
      expression = Expression.of(expr)
    } catch (error) {
      error.message = `求值表达式编写错误 “${expr}” \n ${error.message}`
      throw error
    }
    return data => {
      return expression.evaluate(data)
    }
  }

  createScriptFunction(expr) {
    let func
    try {
      // eslint-disable-next-line no-new-func
      const funcFactory = new Function(`return ${expr}`)
      func = funcFactory()
    } catch (error) {
      error.message = `函数表达式编写错误 “${expr}”`
      throw error
    }
    return data => {
      const result = func.bind(data)
      return result
    }
  }

  tryExtractQuote(value, prefix) {
    const begin = prefix + '{'
    const end = '}'
    if (value.startsWith(begin) && value.endsWith(end)) {
      const beginLength = begin.length
      return value.substr(beginLength, value.length - beginLength - 1)
    } else {
      return null
    }
  }
}
