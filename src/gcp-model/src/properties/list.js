import PropertyDefinition from './definition'

export default class ListPropertyDefinition extends PropertyDefinition {
  get (target) {
    return this.getArrayPropValue(target)
  }

  set (target, value) {
    const items = this.convertArray(value, target)
    target.$origin[this.propName] = items
  }

  getArrayPropValue (doc) {
    const valueObj = doc.$origin
    const result = valueObj[this.propName]
    return result
  }

  convertArray (items, parent) {
    if (!items) {
      return items
    }
    if (!Array.isArray(items)) {
      throw new Error('数据类型为数组')
    }
    const result = []
    for (let i = 0; i < items.length; i++) {
      const value = this.convertValue(items[i], parent)
      result.push(value)
    }
    return result
  }

  convertValue (item, parent) {
    if (this.converter) {
      return this.converter(item)
    }
  }
}