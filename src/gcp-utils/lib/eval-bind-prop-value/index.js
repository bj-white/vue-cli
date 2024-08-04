import valueByPath from './valueByPath'
import { isObject } from '../assert'

function evalBindPropValue (propValue, scope) {
  if (typeof propValue === 'string' && propValue !== '') {
    return valueByPath(scope, propValue)
  } else {
    return evalPropValue(propValue, scope)
  }
}

function evalPropValue (propValue, scope) {
  if (Array.isArray(propValue)) {
    return evalArrayPropValue(propValue, scope)
  } else if (isObject(propValue)) {
    return evalObjectPropValue(propValue, scope)
  } else if (typeof propValue === 'function') {
    return propValue(scope)
  } else {
    return propValue
  }
}

function evalObjectPropValue (target, scope) {
  const result = {}
  for (const key in target) {
    const propValue = target[key]
    let propName = key
    if (key.startsWith(':')) {
      propName = key.substring(1)
    }
    result[propName] = evalPropValue(propValue, scope)
  }
  return result
}

function evalArrayPropValue (target, scope) {
  return target.map(item => {
    return evalPropValue(item, scope)
  })
}

export { evalBindPropValue }
