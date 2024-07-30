import PropertyBuilder from './properties'
import Document from './document'

export default class DocumentType {
  constructor (name, properties) {
    this.kind = 'doc'
    this.name = name
    this.properties = properties
    const builder = PropertyBuilder.of(this)
    this.propertyDefs = builder.propertyDefs
    this.propertyDescs = builder.propertyDescs
  }

  of (propValues = {}, context = {}, options = {}) {
    return new Document(this, propValues, context, options)
  }
}
