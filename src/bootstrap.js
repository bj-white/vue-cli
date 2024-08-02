import startPage from './web-framework/lib/app/startPage'
import { loadPage, initFetchRemoteLibs } from './loadResourceLibs'

async function startApp () {
  const Page = await loadPage()
  startPage(Page)
}

initFetchRemoteLibs()
startApp()
