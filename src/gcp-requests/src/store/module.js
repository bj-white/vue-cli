import Vue from 'vue'

export default {
  namespaced: true,
  state () {
    return {
      data: {},
      queries: {}
    }
  },
  getters: {
    dataByName: state => name => {
      return state.data[name]
    }
  },
  mutations: {
    initData (state, { name, data }) {
      if (name) {
        Vue.set(state.data, name, data)
      }
    },
    saveQuery (state, { name, query }) {
      if (name) {
        Vue.set(state.queries, name, query)
      }
    }
  },
  actions: {}
}
