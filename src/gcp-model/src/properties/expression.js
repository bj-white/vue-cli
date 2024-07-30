import PropertyDefinition from './definition'

export default class ExpressionPropertyDefinition extends PropertyDefinition {
  get (target) {
    return target.__computedVM[this.propName]
  }

  computedGetter ({ _doc: target }) {
    const originValue = target.$origin[this.propName]
    if (!target.$options.readonly) {
      console.log('1111111111111')
      return target.dj * target.sl
    }
    return originValue
  }
}