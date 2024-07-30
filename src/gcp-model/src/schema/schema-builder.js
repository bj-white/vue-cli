import DocumentType from '../document/document-type'
import DocumentSchema from './schema'

class DocumentSchemaBulider {
  constructor (config) {
    this.config = config
    this.isNewSchema = !!config.kind
    if (this.isNewSchema) {
      this.config = this.listToMap(config).spec
    }
    this.types = {}
    console.log('DocumentSchemaBulider=====================', this)
  }

  listToMap (config) {
    const newTypes = {}
    config.spec.types.forEach(type => {
      if (type.spec.properties) {
        const newProperties = {}
        type.spec.properties.forEach(property => {
          newProperties[property.name] = property
        })
        type.spec.properties = newProperties
      }
      newTypes[type.metadata.fname] = type.spec
      newTypes[type.metadata.fname].kind = type.kind
    })
    config.spec.types = newTypes
    return config
  }

  getSchema () {
    const mainType = this.getType(this.config.mainType)
    return new DocumentSchema(this.config.name, mainType)
  }

  getType (typeName) {
    if (this.types[typeName]) {
      return this.types[typeName]
    }
    const typeConfig = this.config.types[typeName]
    if (!typeConfig) {
      return
    }
    let type
    let isEnum
    if (this.isNewSchema) {
      isEnum = typeConfig.kind === 'EnumType'
    }
    if (isEnum) {
      console.log(11111111111)
    } else {
      type = this.getDocType(typeName, typeConfig)
    }
    this.types[typeName] = type
    return type
  }

  getDocType (typeName, typeConfig) {
    const properties = {}
    for (const name in typeConfig.properties) {
      const propertyConfig = typeConfig.properties[name]
      if (propertyConfig.type === 'doc') {
        properties[name] = Object.assign({}, propertyConfig, { docType: this.getType(propertyConfig.docType) })
      } else {
        properties[name] = Object.assign({}, propertyConfig)
      }
    }
    return new DocumentType(typeName, properties)
  }
}

DocumentSchemaBulider.of = function (config) {
  const builder = new DocumentSchemaBulider(config)
  return builder.getSchema()
}

export default DocumentSchemaBulider
