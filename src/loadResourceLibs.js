import { loadPage, fetchRemoteLibsFactory } from './gcp-utils/lib/resource-libs/loadResourceLibs'

function initFetchRemoteLibs () {
  const params = {
    clientType: 'web'
  }
  fetchRemoteLibsFactory(params)()
}

export { loadPage, initFetchRemoteLibs }
