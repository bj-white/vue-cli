import schema from '../../../assets/schema.json'
import DocumentSchemaBulider from '../../../gcp-model/src/schema/schema-builder'

class DocService {
  constructor () {}

  async init () {
    this.schema = DocumentSchemaBulider.of(schema)
  }

  async new () {
    const data = {
      _id: '1',
      name: 'white',
      ejxb: [
        {
          zj: 2,
          dj: 1,
          sl: 2,
        }
      ]
    }
    return this.schema.documentType.of(data)
  }
}

DocService.newService = async function (def) {
  const service = new DocService(def)
  await service.init()
  return service
}

export default DocService
