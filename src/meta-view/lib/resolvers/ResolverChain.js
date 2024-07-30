export default class ResolverChain {
  constructor (resolvers) {
    if (resolvers) {
      this.resolvers = resolvers
    } else {
      this.resolvers = []
    }
  }

  addResolver (resolver) {
    if (Array.isArray(resolver)) {
      this.resolvers = [...this.resolvers, ...resolver]
    } else {
      this.resolvers.push(resolver)
    }
  }

  resolve (desc) {
    this.resolvers.forEach(resolver => {
      resolver.resolve && resolver.resolve(desc)
    })
  }
}
