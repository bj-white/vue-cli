import Vuex from 'vuex'
import DocService from '../doc/service'
import { applyRequestPlugin } from '../../../gcp-requests/src/index'
import buildStoreContext from '../utils/context'
import DataProvider from '../../../gcp-requests/src/components/DataProvider.vue'
import { GCPUtils } from '../../../gcp-utils/lib/index'
import Router from 'vue-router'
import MetaView from '../../../meta-view/lib/components/MetaView.vue'

export default class Module {
  constructor ({ config, views = [] }) {
    this.initialize(config)
    this.viewDescs = this.buildViewDescs(views)
    this.store = this.createStore()
    this.context = this.createContext()
    this.fns = this.context.fns
    this.router = this.createRouter()
    console.log('module=========================', this)
  }

  buildViewDescs (views) {
    const result = {}
    views.forEach(view => {
      result[view.metadata.name] = view.spec.template
    })
    return result
  }

  createRouter () {
    const routes = this.buildRoutes()
    return new Router({
      routes
    })
  }

  buildRoutes () {
    const pages = this.config.pages
    return pages.map(({ name, path, view, meta }) => {
      const config = this.getViewDesc(view)
      return {
        name,
        path,
        component: MetaView,
        props: {
          config,
          context: this.context,
          scope: {
            fns: this.fns,
          }
        },
        meta
      }
    })
  }

  getViewDesc (name) {
    return this.viewDescs[name]
  }

  initialize (config) {
    this.config = config
    this.state = {}
    this.mutations = [],
    this.actions = [
      'bootstrap',
      'fetchDetailInitData'
    ]
    this.getters = []
    this.functions = []
    this.components = [
      DataProvider
    ]
    this.editors = {}
    this.utils = { ...GCPUtils }
    this.services = new Map()
  }

  createStore () {
    const store = new Vuex.Store({
      state: this.state,
      mutations: this.bindMethods(this.mutations),
      actions: this.bindMethods(this.actions)
    })
    applyRequestPlugin(store)
    return store
  }

  bindMethods (names) {
    const result = {}
    names.forEach(name => {
      result[name] = this[name].bind(this)
    })
    return result
  }

  createContext () {
    return buildStoreContext(
      this.store,
      {
        actions: this.actions,
        mutations: this.mutations,
        getters: this.getters
      },
      {
        fns: this.bindMethods(this.functions),
        components: this.components,
        editors: this.editors,
        handlers: this.handlerMap,
        utils: this.utils,
        services: this.services
      }
    )
  }

  async bootstrap () {
    const requestPromisesAllSettled = []
    requestPromisesAllSettled.push(this.initServices())
    await Promise.allSettled(requestPromisesAllSettled)
    this.defaultService = this.services.get('default')
  }

  async fetchDetailInitData ({ commit }) {
    const bill = await this.defaultService.new()
    commit('request/initData', { name: 'currentBill', data: bill })
  }

  async initServices () {
    const serviceDefs = Object.entries(this.config.serviceDefs)
    for (const [key, def] of serviceDefs) {
      const service = await this.createDocService(def, key)
      this.services.set(key, service)
    }
  }

  async createDocService (serviceDef, key) {
    return await DocService.newService(serviceDef)
  }
}
