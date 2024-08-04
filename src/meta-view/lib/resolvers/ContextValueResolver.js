import MetaDescPropResolver from './MetaDescPropResolver'

export default class ContextValueResolver extends MetaDescPropResolver {
  constructor (context) {
    super()
    this.context = context
  }
  
  resolveItem (value) {
    if (this.context) {
      return this.convertPropValue(value)
    } else {
      return value
    }
  }

  convertPropValue (propValue) {
    if (typeof propValue !== 'string') {
      return propValue
    }
    const [type, name] = propValue.split(':', 2)
    if (type === '' || !name) {
      return propValue
    }
    const contextMap = this.context[type]
    if (contextMap) {
      const value = contextMap[name]
      if (!value) {
        throw new Error(`not found in context: ${propValue}`)
      }
      return value
    } else {
      return propValue
    }
  }
}
