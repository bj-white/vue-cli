class StoreContext {
  constructor (store, { actions, mutations, getters }, initialContext) {
    Object.assign(this, initialContext)
    this.state = store.state
    this.bindStoreActions(store, actions)
    this.bindStoreMutations(store, mutations)
    this.bindStoreGetters(store, getters)
  }

  bindStoreActions (store, names) {
    names.forEach(name => {
      this[name] = async (...args) => {
        return await store.dispatch(name, ...args)
      }
    })
  }

  bindStoreMutations (store, names) {
    names.forEach(name => {
      this[name] = (...args) => {
        store.commit(name, ...args)
      }
    })
  }

  bindStoreGetters (store, names) {
    names.forEach(name => {
      Object.defineProperty(this, name, {
        enumerable: true,
        configurable: true,
        get: function () {
          return store.getters[name]
        }
      })
    })
  }
}

export default function buildStoreContext (store, mapConfig, initialContext) {
  return new StoreContext(store, mapConfig, initialContext)
}
