import NormalPropertyDefinition from '../properties/normal'
import ListPropertyDefinition from '../properties/list'
import ExpressionPropertyDefinition from '../properties/expression'

class PropertyBuilder {
  constructor (docType) {
    this.docType = docType
    this.propertyDefs = this.buildPropertyDefinitions()
    this.propertyDescs = this.collectPropertyDescs()
  }

  collectPropertyDescs () {
    const result = this.initInternalProperties(this.docType)
    for (const name in this.propertyDefs) {
      result[name] = this.propertyDefs[name].getDescription()
    }
    return result
  }

  initInternalProperties (docType) {
    return {
      docType: {
        value: docType,
        enumerable: false,
        configurable: false,
        writable: false
      }
    }
  }

  buildPropertyDefinitions () {
    const result = {}
    for (const name in this.docType.properties) {
      const property = this.docType.properties[name]
      result[name] = this.buildPropertyDefinition(property, name)
    }
    return result
  }

  buildPropertyDefinition (property, name) {
    if (property.expr) {
      return new ExpressionPropertyDefinition(this.docType, name, property)
    } else {
      if (property.multiple) {
        return new ListPropertyDefinition(this.docType, name, property)
      } else {
        return new NormalPropertyDefinition(this.docType, name, property)
      }
    }
  }
}

PropertyBuilder.of = function (docType) {
  return new PropertyBuilder(docType)
}

export default PropertyBuilder
