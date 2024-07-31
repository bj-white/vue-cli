import MetaDescResolver from './MetaDescResolver'

export default class ComponentResolver extends MetaDescResolver {
  constructor (components, getConfig) {
    super()
    this.components = components
    this.getConfig = getConfig
    this.cachedComponentsOptionsMap = {}
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
      if (component.kind === 'view') {
        console.log('todo================')
      } else {
        const config = this.getConfig()
        if (config.id === desc.id) {
          const componentName = desc.id || component.name
          if (!this.cachedComponentsOptionsMap[componentName]) {
            this.cachedComponentsOptionsMap[componentName] = { ...component, name: componentName }
          }
          desc.type = this.cachedComponentsOptionsMap[componentName]
        } else {
          desc.type = component
        }
      }
    }
  }
}
