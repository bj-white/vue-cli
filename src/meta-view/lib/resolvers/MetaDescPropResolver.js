import MetaDescResolver from './MetaDescResolver'
import { isObject } from '../utils'

export default class MetaDescPropResolver extends MetaDescResolver {
  resolveDesc (desc) {
    if (desc.props) {
      desc.props = this.resolveProps(desc.props, desc)
    }
    if (desc.events) {
      desc.events = this.resolveEvents(desc.events, desc)
    }
  }

  resolveEvents (target, desc) {
    const result = {}
    for (const prop in target) {
      const propValue = target[prop]
      result[prop] = this.resolveItem(propValue, prop, desc)
    }
    return result
  }

  resolveProps (props, desc) {
    const result = {}
    for (const prop in props) {
      const propValue = props[prop]
      result[prop] = this.resolveValue(propValue, prop, desc)
    }
    return result
  }

  resolveValue (target, propName, desc) {
    if (Array.isArray(target)) {
      return this.resolveArrayValue(target, propName, desc)
    } else if (this.needNestResolveObject(target, propName)) {
      return this.resolveObjectValue(target, propName, desc)
    } else {
      return this.resolveItem(target, propName, desc)
    }
  }

  resolveArrayValue (target, propName, desc) {
    return target.map(item => {
      return this.resolveValue(item, propName, desc)
    })
  }

  resolveObjectValue (target, propName, desc) {
    const result = {}
    for (const prop in target) {
      const propValue = target[prop]
      result[prop] = this.resolveValue(propValue, propName, desc)
    }
    return result
  }

  needNestResolveObject (target, propName) {
    return isObject(target)
  }
}
