import MetaDescResolver from './MetaDescResolver'

export default class ComponentResolver extends MetaDescResolver {
  constructor (components, getConfig) {
    super()
    this.components = components
    this.getConfig = getConfig
  }

  resolveDesc (desc) {
    if (!this.components) {
      return
    }
    if (!desc.type) {
      return
    }
    const component = this.components[desc.type]
    if (component) {
      console.log('component==================', component)
    }
  }
}
