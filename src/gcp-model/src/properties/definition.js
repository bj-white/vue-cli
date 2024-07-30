import { getPropertyConverter } from '../converters'

export default class PropertyDefinition {
  constructor (docType, propName, propDesc) {
    this.docType = docType
    this.propName = propName
    this.propDesc = propDesc
    this.converter = getPropertyConverter(propDesc)
  }

  get (target) {
    return target.$origin[this.propName]
  }

  set (target, value) {
    target.$origin[this.propName] = value
  }

  getDescription () {
    const definition = this
    return {
      enumerable: true,
      configurable: true,
      get: function () {
        return definition.get(this)
      },
      set: function (value) {
        definition.set(this, value)
      }
    }
  }
}
