import StatefulFormTable from './form/stateful/StatefulFormTable'
import DataContext from './layout/DataContext'
import DataViewHookProvider from './layout/DataViewHookProvider'

const components = [
  DataContext,
  DataViewHookProvider
]

const install = function (Vue) {
  components.forEach(comp => {
    Vue.component(comp.name, comp)
  })
}

if (typeof window !== undefined && window.Vue) {
  install(window.Vue)
}

export {
  StatefulFormTable,
}
