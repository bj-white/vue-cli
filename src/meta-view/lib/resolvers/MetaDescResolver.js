export default class MetaDescResolver {
  resolve (desc) {
    if (!desc) {
      return desc
    }
    this.resolveDesc(desc)
  }
}
