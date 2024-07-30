import Vue from 'vue'
import App from '../app.vue'
import router from '../router'

export default class LocalApp {
  constructor (options) {
    const { store, module } = options
    this.store = store
    this.router = module.router
    this.instance = null
    this.render(module.context)
  }

  render (context) {
    this.createRouter()
    this.instance = new Vue({
      store: this.store,
      router: this.router,
      render: h => h(App, { props: { context }})
    }).$mount('#app')
  }

  createRouter () {
    this.router = router({
      Router: this.router
    })
  }
}