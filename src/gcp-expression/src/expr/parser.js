import { GCPUtils } from '../../../gcp-utils/lib/index'
const { numAdd, numSub, numMul, numDiv, numGt, numGte, numLt, numLte, isDate } = GCPUtils

const ESCAPE = {
  n: '\n',
  f: '\f',
  r: '\r',
  t: '\t',
  v: '\v'
}

const CONSTANTS = {
  null: data => null,
  true: data => true,
  false: data => false,
  undefined: data => undefined
}

function isNaNString(v) {
  return typeof v === 'string' && (v.trim() === '' || isNaN(v))
}

function add(a, b) {
  if (isNaNString(a) || isNaNString(b)) {
    // 考虑字符串拼接
    return a + b
  } else {
    return numAdd(a, b)
  }
}

function minus(num1, num2) {
  return numSub(num1, num2)
}

function lt(a, b) {
  if (isDate(a) && isDate(b)) {
    return a < b
  } else {
    return numLt(a, b)
  }
}

function gt(a, b) {
  if (isDate(a) && isDate(b)) {
    return a > b
  } else {
    return numGt(a, b)
  }
}

const OPERATORS = {
  '+': (data, a, b) => add(a(data), b(data)),
  '-': (data, a, b) => minus(a(data), b(data)),
  '*': (data, a, b) => numMul(a(data), b(data)),
  '/': (data, a, b) => numDiv(a(data), b(data)),
  '%': (data, a, b) => a(data) % b(data),
  '===': (data, a, b) => a(data) === b(data),
  '!==': (data, a, b) => a(data) !== b(data),
  // eslint-disable-next-line eqeqeq
  '==': (data, a, b) => a(data) == b(data),
  // eslint-disable-next-line eqeqeq
  '!=': (data, a, b) => a(data) != b(data),
  '<': (data, a, b) => lt(a(data), b(data)),
  '<=': (data, a, b) => numLte(a(data), b(data)),
  '>': (data, a, b) => gt(a(data), b(data)),
  '>=': (data, a, b) => numGte(a(data), b(data)),
  '&&': (data, a, b) => a(data) && b(data),
  '||': (data, a, b) => a(data) || b(data),
  '!': (data, a) => !a(data)
}

function isNumber(char) {
  return char >= '0' && char <= '9' && typeof char === 'string'
}

function isExpOperator(char) {
  return char === '-' || char === '+' || isNumber(char)
}

function isIdent(char) {
  return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === '_' || char === '$'
}

class Parser {
  constructor(content) {
    if (!content) throw new Error('invalid expression')

    this.content = content
  }

  lex() {
    const content = this.content
    const length = content.length
    let index = 0
    const tokens = []

    while (index < length) {
      const char = content.charAt(index)

      if (char === '"' || char === "'") {
        // 字符串
        const start = ++index
        let escape = false
        let value = ''
        let token

        while (index < length) {
          const c = content.charAt(index)

          if (escape) {
            if (c === 'u') {
              const hex = content.substring(index + 1, index + 5)
              if (!hex.match(/[\da-f]{4}/i)) {
                throw new Error(`invalid expression: ${content}, invalid unicode escape [\\u${hex}]`)
              }
              index += 4
              value += String.fromCharCode(parseInt(hex, 16))
            } else {
              const rep = ESCAPE[c]
              value = value + (rep || c)
            }
            escape = false
          } else if (c === '\\') {
            escape = true
          } else if (c === char) {
            index++
            token = {
              index: start,
              constant: true,
              text: char + value + char,
              value
            }
            break
          } else {
            value += c
          }

          index++
        }

        if (!token) {
          throw new Error(`invalid expression: ${content}`)
        } else {
          tokens.push(token)
        }
      } else if (isNumber(char) || (char === '.' && isNumber(content.charAt(index + 1)))) {
        // 数字
        const start = index
        let value = ''

        while (index < length) {
          const c = content.charAt(index).toLowerCase()
          if (c === '.' || isNumber(c)) {
            value += c
          } else {
            const c2 = content.charAt(index + 1)
            if (c === 'e' && isExpOperator(c2)) {
              value += c
            } else if (isExpOperator(c) && c2 && isNumber(c2) && value.charAt(value.length - 1) === 'e') {
              value += c
            } else if (isExpOperator(c) && (!c2 || !isNumber(c2)) && value.charAt(value.length - 1) === 'e') {
              throw new Error(`invalid expression: ${content}`)
            } else {
              break
            }
          }
          index++
        }

        tokens.push({
          index: start,
          constant: true,
          text: value,
          value: Number(value)
        })
      } else if (isIdent(char)) {
        // 标识符
        const start = index
        while (index < length) {
          const c = content.charAt(index)
          if (!(isIdent(c) || isNumber(c))) {
            break
          }
          index++
        }

        tokens.push({
          index: start,
          text: content.slice(start, index),
          identifier: true
        })
      } else if ('(){}[].,;:?'.indexOf(char) >= 0) {
        // 边界
        tokens.push({
          index,
          text: char
        })

        index++
      } else if (
        char === ' ' ||
        char === '\r' ||
        char === '\t' ||
        char === '\n' ||
        char === '\v' ||
        char === '\u00A0'
      ) {
        // 空格
        index++
      } else {
        // 操作符
        const char2 = char + content.charAt(index + 1)
        const char3 = char2 + content.charAt(index + 2)
        const op1 = OPERATORS[char]
        const op2 = OPERATORS[char2]
        const op3 = OPERATORS[char3]
        if (op1 || op2 || op3) {
          const text = op3 ? char3 : op2 ? char2 : char

          tokens.push({
            index: index,
            text,
            operator: true
          })

          index += text.length
        } else {
          throw new Error(`invalid expression: ${content}`)
        }
      }
    }

    this.tokens = tokens
    return tokens
  }

  parse() {
    const tokens = this.lex()

    let func
    const token = tokens[0]
    const text = token.text

    if (tokens.length > 0 && text !== '}' && text !== ')' && text !== ']') {
      func = this.expression()
    }

    return data => func && func(data)
  }

  expect(text) {
    const tokens = this.tokens
    const token = tokens[0]

    if (!text || text === (token && token.text)) {
      return tokens.shift()
    }
  }

  consume(text) {
    if (!this.tokens.length) throw new Error(`parse expression error: ${this.content}`)

    const token = this.expect(text)
    if (!token) throw new Error(`parse expression error: ${this.content}`)

    return token
  }

  expression() {
    return this.ternary()
  }

  ternary() {
    const left = this.logicalOR()
    let token

    if ((token = this.expect('?'))) {
      const middle = this.expression()

      this.consume(':')
      const right = this.expression()

      return data => (left(data) ? middle(data) : right(data))
    }

    return left
  }

  binary(left, op, right) {
    const fn = OPERATORS[op]

    return data => fn(data, left, right)
  }

  unary() {
    let token

    if (this.expect('+')) {
      return this.primary()
    } else if ((token = this.expect('-'))) {
      return this.binary(data => 0, token.text, this.unary())
    } else if ((token = this.expect('!'))) {
      const fn = OPERATORS[token.text]
      const right = this.unary()

      return data => fn(data, right)
    } else {
      return this.primary()
    }
  }

  logicalOR() {
    let left = this.logicalAND()
    let token

    while ((token = this.expect('||'))) {
      left = this.binary(left, token.text, this.logicalAND())
    }

    return left
  }

  logicalAND() {
    let left = this.equality()
    let token

    while ((token = this.expect('&&'))) {
      left = this.binary(left, token.text, this.equality())
    }

    return left
  }

  equality() {
    let left = this.relational()
    let token

    while ((token = this.expect('==') || this.expect('!=') || this.expect('===') || this.expect('!=='))) {
      left = this.binary(left, token.text, this.relational())
    }

    return left
  }

  relational() {
    let left = this.additive()
    let token

    while ((token = this.expect('<') || this.expect('>') || this.expect('<=') || this.expect('>='))) {
      left = this.binary(left, token.text, this.additive())
    }

    return left
  }

  additive() {
    let left = this.multiplicative()
    let token

    while ((token = this.expect('+') || this.expect('-'))) {
      left = this.binary(left, token.text, this.multiplicative())
    }

    return left
  }

  multiplicative() {
    let left = this.unary()
    let token

    while ((token = this.expect('*') || this.expect('/') || this.expect('%'))) {
      left = this.binary(left, token.text, this.unary())
    }

    return left
  }

  primary() {
    const token = this.tokens[0]
    let primary

    if (this.expect('(')) {
      primary = this.expression()
      this.consume(')')
    } else if (this.expect('[')) {
      primary = this.array()
    } else if (this.expect('{')) {
      primary = this.object()
    } else if (token.identifier && token.text in CONSTANTS) {
      primary = CONSTANTS[this.consume().text]
    } else if (token.identifier) {
      primary = this.identifier()
    } else if (token.constant) {
      primary = this.constant()
    } else {
      throw new Error(`parse expression error: ${this.content}`)
    }

    let next
    let context
    while ((next = this.expect('(') || this.expect('[') || this.expect('.'))) {
      if (next.text === '(') {
        primary = this.functionCall(primary, context)
        context = null
      } else if (next.text === '[') {
        context = primary
        primary = this.objectIndex(primary)
      } else {
        context = primary
        primary = this.fieldAccess(primary)
      }
    }
    return primary
  }

  fieldAccess(object) {
    const getter = this.identifier()

    return data => {
      const o = object(data)
      return o && getter(o)
    }
  }

  objectIndex(object) {
    const indexFn = this.expression()

    this.consume(']')

    return data => {
      const o = object(data)
      const key = indexFn(data) + ''

      return o && o[key]
    }
  }

  functionCall(func, context) {
    const args = []

    if (this.tokens[0].text !== ')') {
      do {
        args.push(this.expression())
      } while (this.expect(','))
    }

    this.consume(')')

    return data => {
      const callContext = context && context(data)
      const fn = func(data, callContext)

      return fn && fn.apply(callContext, args.length ? args.map(arg => arg(data)) : null)
    }
  }

  array() {
    const elements = []
    const token = this.tokens[0]

    if (token.text !== ']') {
      do {
        if (this.tokens[0].text === ']') break

        elements.push(this.expression())
      } while (this.expect(','))
    }

    this.consume(']')

    return data => elements.map(element => element(data))
  }

  object() {
    const keys = []
    const values = []
    let token = this.tokens[0]

    if (token.text !== '}') {
      do {
        token = this.tokens[0]
        if (token.text === '}') break

        token = this.consume()
        if (token.constant) {
          keys.push(token.value)
        } else if (token.identifier) {
          keys.push(token.text)
        } else {
          throw new Error(`parse expression error: ${this.content}`)
        }

        this.consume(':')
        values.push(this.expression())
      } while (this.expect(','))
    }

    this.consume('}')

    return data => {
      const object = {}
      for (let i = 0, length = values.length; i < length; i++) {
        object[keys[i]] = values[i](data)
      }
      return object
    }
  }

  identifier() {
    let id = this.consume().text

    let token = this.tokens[0]
    let token2 = this.tokens[1]
    let token3 = this.tokens[2]

    // 连续读取 . 操作符后的非函数调用标识符
    while (token && token.text === '.' && token2 && token2.identifier && token3 && token3.text !== '(') {
      id += this.consume().text + this.consume().text

      token = this.tokens[0]
      token2 = this.tokens[1]
      token3 = this.tokens[2]
    }

    return data => {
      const elements = id.split('.')
      let key

      for (let i = 0; elements.length > 1; i++) {
        key = elements.shift()
        data = data[key]

        if (!data) break
      }

      key = elements.shift()

      return data && data[key]
    }
  }

  constant() {
    const value = this.consume().value

    return data => value
  }
}

export default Parser
