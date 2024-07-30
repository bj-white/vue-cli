import requestModule from './module'

export default function applyRequestPlugin (store) {
  store.registerModule('request', requestModule)
}
